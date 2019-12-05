const express = require('express');
const router = express.Router();

const productsControllerr = require('../controllers/products');

router.get('/', productsControllerr.getProducts)

module.exports = router;