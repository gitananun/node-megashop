const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
const errorHandler = require('../utils/error');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return false;
  }
  return true;
};

exports.getLogin = (req, res, __) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!validateRequest(req, res)) return res.status(422).redirect('back');

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid credentials!');
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.authenticated = true;
            req.session.user = user;
            return req.session.save((e) => {
              if (e) errorHandler(e, next);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid credentials!');
          res.redirect('/login');
        })
        .catch((e) => {
          errorHandler(e, next);
          return res.redirect('/login');
        });
    })
    .catch((e) => errorHandler(e, next));
};

exports.getSignup = (_, res, __) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!validateRequest(req, res)) return res.status(422).redirect('back');

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash('error', 'User already exists!');
        return res.redirect('/signup');
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(() => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: process.env.MAIL_FROM,
            subject: 'Signup Succeeded!',
            html: '<h1>Megashop: You successfully signed up!</h1>',
          });
        })
        .catch((e) => errorHandler(e, next));
    })
    .catch((e) => errorHandler(e, next));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((e) => {
    if (e) errorHandler(e, next);
    res.redirect('/');
  });
};

exports.getReset = (req, res, _) => {
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (e, buffer) => {
    if (e) {
      errorHandler(e, next);
      req.flash('error', 'Something went wrong!');
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with the email found!');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;

        return user.save().then(() => {
          res.redirect('/login');
          return transporter
            .sendMail({
              to: req.body.email,
              from: process.env.MAIL_FROM,
              subject: 'Password reset',
              html: `
              <p>You requested password reset</p>
              <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
            `,
            })
            .catch((e) => errorHandler(e, next));
        });
      })
      .catch((e) => errorHandler(e, next));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'No user found!');
        return res.redirect('/reset');
      }

      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((e) => errorHandler(e, next));
};

exports.postNewPasssword = (req, res, next) => {
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  let resetUser;

  if (password !== confirmPassword) {
    req.flash('error', "Confirm password doesn't match to password");
    return res.redirect('back');
  }

  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'User not found!');
        return res.redirect('back');
      }
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(() => {
      req.flash('success', 'Password changed successfully!');
      res.redirect('/login');
    })
    .catch((e) => errorHandler(e, next));
};
