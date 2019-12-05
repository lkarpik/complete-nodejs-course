const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  // console.log(req.params);
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render('add-product', {
    title: 'Add Product',
    path: '/admin/add-product',
    formCSS: true,
    acitveProducts: true
  });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  // console.log(req.body);
  products.push({
    title: req.body.title
  });
  res.redirect('/');
});

module.exports.routes = router;
module.exports.products = products;