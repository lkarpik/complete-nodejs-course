const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = require('../helpers/path');

router.get('/product', (req, res, next) => {

    console.log('From middleware');
    res.sendFile(path.join(rootDir, 'views', 'addProduct.html'));
});

router.post('/add', (req, res, next) => {
    console.log(`Added an object`);
    console.log(req.body);
    res.redirect('/');
});


module.exports = router