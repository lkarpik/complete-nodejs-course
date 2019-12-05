const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('Shop.js:', adminData.products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render('shop', {
    products: adminData.products,
    title: 'Shop',
    hasProducts: adminData.products.length > 0,
    path: '/',
    activeShop: true,
    productsCSS: true
  });
});

module.exports = router;