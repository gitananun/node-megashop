const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

// router.get("/cart", shopController.getCart);
// router.post("/cart", shopController.postCart);
// router.post("/cart/:productId", shopController.postDeleteCart);

// router.get("/checkout", shopController.getCheckout);

// router.get("/orders", shopController.getOrders);
// router.post("/orders", shopController.postOrders);

module.exports = router;
