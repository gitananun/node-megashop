const Product = require("../models/product");

exports.getProducts = (_, res, __) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/products", {
        products,
        pageTitle: "MegaShop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, __) => {
  Product.findByPk(req.params.productId)
    .then((product) => {
      res.render("shop/product-details", {
        product,
        pageTitle: product.title,
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).render("404", {
        pageTitle: "Product not found",
        path: "/",
      });
    });
};

exports.getCart = (req, res, __) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) =>
      res.render("shop/cart", {
        products,
        pageTitle: "Cart",
        path: "/cart",
      })
    )
    .catch((e) => console.log(e));
};

exports.postCart = (req, res, __) => {
  const productId = req.body.productId;
  let newQuantity = 1;
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) product = products[0];

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }

      return Product.findByPk(productId);
    })
    .then((product) =>
      fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      })
    )
    .catch((e) => console.log(e));
  res.redirect("..");
};

exports.postDeleteCart = (req, res, __) => {
  const productId = req.params.productId;

  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: productId } }))
    .then((products) => {
      if (products.length == 0) res.redirect("..");

      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch((e) => console.log(e));
};

exports.postOrders = (req, res, __) => {
  let fetchedProducts;
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      fetchedProducts = products;
      if (products.length == 0) res.redirect("..");
      return req.user.createOrder();
    })
    .then((order) =>
      order.addProducts(
        fetchedProducts.map((product) => {
          product.orderItem = { quantity: product.cartItem.quantity };
          return product;
        })
      )
    )
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect("/orders"))
    .catch((e) => console.log(e));
};

exports.getOrders = (req, res, _) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) =>
      res.render("shop/orders", {
        orders,
        pageTitle: "Orders",
        path: "/orders",
      })
    )
    .catch((e) => console.log(e));
};

exports.getCheckout = (_, res, __) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
