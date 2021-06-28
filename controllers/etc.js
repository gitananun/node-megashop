exports.get404 = (_, res, __) => {
  res.status(404).render("404", {
    path: "/404",
    pageTitle: "404 Not found",
  });
};
