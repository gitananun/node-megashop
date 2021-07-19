const User = require('../models/user');

exports.get404 = (req, res, __) => {
  res.status(404).render('404', {
    path: '/404',
    pageTitle: '404 Not found',
  });
};

exports.get500 = (req, res, __) => {
  res.status(500).render('500', {
    path: '/500',
    pageTitle: '500 Internal Error',
  });
};

exports.saveUserSession = (req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((e) => {
      throw new Error(e);
    });
};

exports.prepareResponseLocals = (req, res, next) => {
  res.locals.authenticated = req.session.authenticated;
  res.locals.csrfToken = req.csrfToken();
  res.locals.error = req.flash('error')[0];
  res.locals.success = req.flash('success')[0];
  next();
};
