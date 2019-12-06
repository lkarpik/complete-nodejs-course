const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart');

router.get('/cart', cartController.getCart);

module.exports = router;