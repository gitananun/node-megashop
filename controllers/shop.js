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

exports.getProduct = (req, res, __) => {
  const productId = req.params.productId;

  Product.findById(productId, (product) => {
    if (!product) {
      res.status(404).render("404", {
        pageTitle: "Product not found",
        path: "/",
      });
    } else {
      res.render("shop/product-details", {
        product,
        pageTitle: product.title,
        path: "/",
      });
    }
  });
};

exports.getCart = (_, res, __) => {
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
  });
};

exports.postCart = (req, res, __) => {
  const productId = req.body.productId;

  console.log(productId);
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
