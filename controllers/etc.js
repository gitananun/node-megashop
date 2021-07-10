const User = require('../models/user');

exports.get404 = (req, res, __) => {
  res.status(404).render('404', {
    path: '/404',
    pageTitle: '404 Not found',
    authenticated: req.session.authenticated,
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
