const Product = require("../models/product");

exports.getAddProduct = (_, res, __) => {
  res.render("add-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
  });
};

exports.postAddProduct = (req, res, _) => {
  const product = new Product({ title: req.body.title });
  product.save();

  res.redirect("/");
};

exports.getProducts = (_, res, __) => {
  products = Product.fetchAll((products) =>
    res.render("shop", {
      products,
      pageTitle: "MegaShop",
      path: "/",
    })
  );
};
