const Product = require("../models/product");

exports.getAddProduct = (_, res, __) => {
  res.render("admin/edit-product", {
    path: "/admin/add-product",
    pageTitle: "Add Product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, _) => {
  req.user
    .createProduct({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    })
    .then(() => res.redirect(".."))
    .catch((e) => console.log(e));
};

exports.getProducts = (req, res, __) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, _) => {
  const urlPaths = req.url.split("/");
  const editMode = urlPaths[urlPaths.length - 1] === "edit";

  req.user
    .getProducts({ where: { id: req.params.productId } })
    .then((products) => {
      if (products.length == 0) res.redirect("..");

      const product = products[0];
      res.render("admin/edit-product", {
        path: "/admin/productId/edit",
        pageTitle: "Edit Product",
        editing: editMode,
        product,
      });
    })
    .catch((e) => console.log(e));
};

exports.putEditProduct = (req, res, _) => {
  Product.findByPk(req.params.productId)
    .then((product) => {
      if (product) {
        product.update({
          title: req.body.title,
          price: req.body.price,
          imageUrl: req.body.imageUrl,
          description: req.body.description,
        });

        res.redirect("/admin/products");
      }
    })
    .catch((e) => console.log(e));
};

exports.deleteProduct = (req, res, _) => {
  Product.deleteById(req.params.productId);

  res.redirect("/admin/products");
};
