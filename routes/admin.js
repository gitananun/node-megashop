const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.use(isAuth);

router.get('/add-product', adminController.getAddProduct);

router.post('/product', isAuth, adminController.postAddProduct);

router.get('/products/:productId/edit', adminController.getEditProduct);
router.post('/products/:productId', adminController.putEditProduct);

router.post('/products/:productId/delete', adminController.deleteProduct);

router.get('/products', adminController.getProducts);

module.exports = router;
