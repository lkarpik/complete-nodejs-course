const Product = require('../models/product');

module.exports = {
    getAddProduct: (req, res, next) => {
        res.render('add-product', {
            title: '🚀Add Product',
            path: '/admin/add-product',
        });
    },
    postAddProduct: (req, res, next) => {
        const product = new Product(req.body.title);
        product.save();
        res.redirect('/')
    },
    getProducts: (req, res, next) => {
        Product.fetchAll(products => {
            res.render('shop', {
                products: products,
                title: '🛒Shop',
                path: '/'
            });
        });
    }
}