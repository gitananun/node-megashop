exports.get404 = (req, res, __) => {
  res.status(404).render('404', {
    path: '/404',
    pageTitle: '404 Not found',
    authenticated: req.session.authenticated,
  });
};
