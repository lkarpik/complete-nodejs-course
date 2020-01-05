const path = require('path');

const express = require('express');
const {
    body
} = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth,
    [
        body('title', 'Text with min 5 and max 30 characters')
        .isString()
        .isLength({
            min: 5,
            max: 30
        })
        .trim()
        .escape(),

        // body('imageUrl', 'Invalid url adress')
        // .isURL()
        // .notEmpty(),

        body('price', 'Invalid currency value')
        .isCurrency()
        .notEmpty(),

        body('description', 'Text with max 100 characters')
        .trim()
        .escape()
        .isLength({
            min: 5,
            max: 100
        }),
    ], adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, [
    body('title', 'Text with min 5 and max 30 characters')
    .isString()
    .isLength({
        min: 5,
        max: 30
    })
    .trim()
    .escape(),

    // body('imageUrl', 'Invalid url adress')
    // .isURL()
    // .notEmpty(),

    body('price', 'Invalid currency value')
    .isCurrency()
    .notEmpty(),

    body('description', 'Text with max 100 characters')
    .trim()
    .escape()
    .isLength({
        min: 5,
        max: 100
    }),

    body('productId', 'Cant edit this product - contact administrator')
    .escape()
    .isString()
], adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;