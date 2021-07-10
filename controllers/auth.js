const User = require('../models/user');

exports.getLogin = (req, res, __) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
  });
};

exports.postLogin = (req, res, __) => {
  User.findById('60e7deeb1d185204bf1ff19a')
    .then((user) => {
      req.session.authenticated = true;
      req.session.user = user;
      res.redirect('/');
    })
    .catch((e) => console.log(e));
};
