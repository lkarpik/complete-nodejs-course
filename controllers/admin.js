const Product = require('../models/product');

module.exports = {
    getAddProduct: (req, res, next) => {
        res.render('admin/add-product', {
            title: '🚀Add Product',
            path: '/admin/add-product',
        });
    },
    postAddProduct: (req, res, next) => {
        let {
            title,
            imageURL,
            description,
            price
        } = req.body;
        const product = new Product(title, imageURL, description, parseFloat(price));
        product.save();
        res.redirect('/')
    },
    getAdminProducts: (req, res, next) => {

        Product.fetchAll(products => {
            res.render('admin/products', {
                products: products,
                title: 'Admin All Porducts',
                path: '/admin/products'
            });
        });
    },
    editProduct: (req, res, next) => {
        res.render('admin/edit-product', {

            title: 'Edit product',
            path: '/admin/edit-product'
        });
    },
}