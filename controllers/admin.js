const Product = require('../models/product');
const { validationResult } = require('express-validator');
const errorHandler = require('../utils/error');

const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return false;
  }
  return true;
};

exports.getAddProduct = (req, res, __) => {
  res.render('admin/edit-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  if (!validateRequest(req, res)) return res.status(422).redirect('back');

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
    .catch((e) => errorHandler(e, next));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .populate('userId', 'username email')
    .then((products) => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((e) => errorHandler(e, next));
};

exports.getEditProduct = (req, res, next) => {
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
    .catch((e) => errorHandler(e, next));
};

exports.putEditProduct = (req, res, next) => {
  if (!validateRequest(req, res)) return res.status(422).redirect('back');

  Product.findById(req.params.productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;

      return product.save().then(() => res.redirect('/admin/products'));
    })
    .catch((e) => errorHandler(e, next));
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.productId, userId: req.user._id })
    .then(() => res.redirect('/admin/products'))
    .catch((e) => errorHandler(e, next));
};
