const express = require("express");
const path = require("path");
const router = express.Router();

const rootDir = require("../utils/path");
const products = require("../data/products");

router.get("/", (_, res, __) => {
  console.log(products);

  res.sendFile(path.join(rootDir, "views", "shop.html"), {
    prods: products,
    docTitle: "Shop",
    path: "/",
  });
});

module.exports = router;
