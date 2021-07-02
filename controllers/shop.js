const Product = require("../models/product");
const Cart = require("../models/cart");

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
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id == product.id
        );
        if (cartProductData) {
          cartProducts.push({ product, qty: cartProductData.qty });
        }
      }

      res.render("shop/cart", {
        products: cartProducts,
        pageTitle: "Cart",
        path: "/cart",
      });
    });
  });
};

exports.postCart = (req, res, __) => {
  const productId = req.body.productId;

  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });

  res.redirect("..");
};

exports.postDeleteCart = (req, res, __) => {
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
  });

  res.redirect("..");
};

exports.getCheckout = (_, res, __) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
