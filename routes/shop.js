const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../utils/path");
const products = require("../data/products");

router.get("/", (_, res, __) => {
  console.log(products);

  res.render("shop", {
    products,
    pageTitle: "MegaShop",
    path: "/",
  });
});

module.exports = router;
