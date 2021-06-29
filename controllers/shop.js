const Product = require("../models/product");

exports.getProducts = (_, res, __) => {
  products = Product.fetchAll((products) =>
    res.render("shop/products", {
      products,
      pageTitle: "MegaShop",
      path: "/",
    })
  );
};

exports.getCart = (_, res, __) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
  });
};

exports.getCheckout = (_, res, __) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
