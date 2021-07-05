const Product = require("../models/product");

exports.getAddProduct = (_, res, __) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, _) => {
  const product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description,
  });

  product
    .save()
    .then((_) => res.redirect(".."))
    .catch((err) => console.log(err));
};

exports.getProducts = (_, res, __) => {
  Product.fetchAll()
    .then(([rows, _]) => {
      res.render("admin/products", {
        products: rows,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, _) => {
  const urlPaths = req.url.split("/");
  const editMode = urlPaths[urlPaths.length - 1] === "edit";

  const product = Product.findById(req.params.productId, (product) => {
    if (!product) {
      res.status(404).redirect("/");
    }

    res.render("admin/edit-product", {
      path: "/admin/productId/edit",
      pageTitle: "Edit Product",
      editing: editMode,
      product: product,
    });
  });
};

exports.putEditProduct = (req, res, _) => {
  const prodId = req.params.productId;

  const updatedProduct = new Product({
    id: prodId,
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    description: req.body.description,
  });

  updatedProduct.save();

  res.redirect("/admin/products");
};

exports.deleteProduct = (req, res, _) => {
  Product.deleteById(req.params.productId);

  res.redirect("/admin/products");
};
