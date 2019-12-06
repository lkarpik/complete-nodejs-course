const express = require('express');
const router = express.Router();

const productsControllerr = require('../controllers/products');

router.get('/', productsControllerr.getIndex);
router.get('/products', productsControllerr.getProducts)

module.exports = router;