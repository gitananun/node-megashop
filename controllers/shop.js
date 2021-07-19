const Product = require('../models/product');
const Order = require('../models/order');
const errorHandler = require('../utils/error');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/products', {
        products,
        pageTitle: 'MegaShop',
        path: '/',
      });
    })
    .catch((e) => errorHandler(e, next));
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render('shop/product-details', {
        product,
        pageTitle: product.title,
        path: '/',
      });
    })
    .catch((e) => {
      errorHandler(e, next);
      res.status(404).render('404', {
        pageTitle: 'Product not found',
        path: '/',
      });
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        products,
        pageTitle: 'Cart',
        path: '/cart',
      });
    })
    .catch((e) => errorHandler(e, next));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      req.user.addToCart(product);
      res.redirect('..');
    })
    .catch((e) => errorHandler(e, next));
};

exports.postDeleteCart = (req, res, next) => {
  const productId = req.params.productId;

  req.user
    .removeFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch((e) => errorHandler(e, next));
};

exports.postOrders = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });

      const order = new Order({
        products: products,
        user: {
          username: req.user.username,
          userId: req.user._id,
        },
      });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect('/orders'))
    .catch((e) => errorHandler(e, next));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        orders,
        pageTitle: 'Orders',
        path: '/orders',
      });
    })
    .catch((e) => errorHandler(e, next));
};

exports.getCheckout = (_, res, __) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
