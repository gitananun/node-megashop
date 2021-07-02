const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/add-product", adminController.getAddProduct);

router.post("/product", adminController.postAddProduct);

router.get("/products/:productId/edit", adminController.getEditProduct);

router.post("/products/:productId/delete", adminController.deleteProduct);

router.post("/products/:productId", adminController.putEditProduct);

router.get("/products", adminController.getProducts);

module.exports = router;
