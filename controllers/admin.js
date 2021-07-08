const Product = require('../models/product');

exports.getAddProduct = (_, res, __) => {
  res.render('admin/edit-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, _) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    userId: req.user._id,
  });

  product
    .save()
    .then(() => res.redirect('..'))
    .catch((e) => console.log(e));
};

exports.getProducts = (_, res, __) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, _) => {
  const urlPaths = req.url.split('/');
  const editMode = urlPaths[urlPaths.length - 1] === 'edit';

  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) res.redirect('..');

      res.render('admin/edit-product', {
        path: '/admin/productId/edit',
        pageTitle: 'Edit Product',
        editing: editMode,
        product,
      });
    })
    .catch((e) => console.log(e));
};

exports.putEditProduct = (req, res, _) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    id: req.params.productId,
    userId: req.user._id,
  });

  product
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch((e) => console.log(e));
};

exports.deleteProduct = (req, res, _) => {
  Product.deleteById(req.params.productId).then(() =>
    res.redirect('/admin/products').catch((e) => console.log(e))
  );
};
