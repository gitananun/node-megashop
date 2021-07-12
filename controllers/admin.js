const Product = require('../models/product');

exports.getAddProduct = (req, res, __) => {
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

exports.getProducts = (req, res, __) => {
  Product.find()
    .populate('userId', 'username email')
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
  Product.findById(req.params.productId)
    .then((product) => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;

      return product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch((e) => console.log(e));
};

exports.deleteProduct = (req, res, _) => {
  Product.findByIdAndRemove(req.params.productId).then(() =>
    res.redirect('/admin/products').catch((e) => console.log(e))
  );
};
