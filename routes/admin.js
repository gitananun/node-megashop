const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../utils/path");
const products = require("../data/products");

router.get("/add-product", (_, res, __) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/product", (req, res, _) => {
  products.push({ title: req.body.title });

  res.redirect("/");
});

module.exports = router;
