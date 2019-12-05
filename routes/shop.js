const express = require('express');

const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, res, next) => {

  res.render('shop', {
    products: adminData.products,
    title: 'Shop',
    path: '/'
  });
});

module.exports = router;