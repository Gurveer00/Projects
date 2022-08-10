const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productid',shopController.getproduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postcart);

router.post('/delete-cart-item',shopController.postdeletecartitem);

router.post('/create-order',shopController.postorder);

router.get('/orders', shopController.getOrders);

//router.get('/checkout', shopController.getCheckout);

module.exports = router;
