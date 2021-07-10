const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart/:productId', isAuth, shopController.postDeleteCart);

// router.get('/checkout', shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);
router.post('/orders', isAuth, shopController.postOrders);

module.exports = router;
