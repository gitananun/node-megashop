const Product = require("../models/product");

exports.getAddProduct = (_, res, __) => {
  res.render("admin/add-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
  });
};

exports.postAddProduct = (req, res, _) => {
  const product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description,
  });
  product.save();

  res.redirect("/");
};

exports.getProducts = (_, res, __) => {
  products = Product.fetchAll((products) =>
    res.render("admin/products", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    })
  );
};
