const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, __) => {
  Product.find()
    .then((products) => {
      res.render('shop/products', {
        products,
        pageTitle: 'MegaShop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, __) => {
  Product.findById(req.params.productId)
    .then((product) => {
      res.render('shop/product-details', {
        product,
        pageTitle: product.title,
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render('404', {
        pageTitle: 'Product not found',
        path: '/',
      });
    });
};

exports.getCart = (req, res, __) => {
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
    .catch((e) => console.log(e));
};

exports.postCart = (req, res, __) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      req.user.addToCart(product);
      res.redirect('..');
    })
    .catch((e) => console.log(e));
};

exports.postDeleteCart = (req, res, __) => {
  const productId = req.params.productId;

  req.user
    .removeFromCart(productId)
    .then(() => res.redirect('/cart'))
    .catch((e) => console.log(e));
};

exports.postOrders = (req, res, __) => {
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
    .catch((e) => console.log(e));
};

exports.getOrders = (req, res, _) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        orders,
        pageTitle: 'Orders',
        path: '/orders',
      });
    })
    .catch((e) => console.log(e));
};

exports.getCheckout = (req, res, __) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
