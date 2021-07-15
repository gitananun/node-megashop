const User = require('../models/user');

exports.get404 = (req, res, __) => {
  res.status(404).render('404', {
    path: '/404',
    pageTitle: '404 Not found',
  });
};

exports.saveUserSession = (req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((e) => console.log(e));
};

exports.prepareResponseLocals = (req, res, next) => {
  res.locals.authenticated = req.session.authenticated;
  res.locals.csrfToken = req.csrfToken();
  res.locals.error = req.flash('error')[0];
  res.locals.success = req.flash('success')[0];
  next();
};
