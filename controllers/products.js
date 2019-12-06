const Product = require('../models/product');

module.exports = {
    getAddProduct: (req, res, next) => {
        res.render('admin/add-product', {
            title: '🚀Add Product',
            path: '/admin/add-product',
        });
    },
    postAddProduct: (req, res, next) => {
        const product = new Product(req.body.title);
        product.save();
        res.redirect('/')
    },
    getAdminProducts: (req, res, next) => {

        res.render('admin/products', {
            title: 'Admin Products',
            path: '/admin/products'
        })
    },
    getIndex: (req, res, next) => {

        res.render('shop/index', {
            title: '🛒Shop',
            path: '/'
        })
    },

    getProducts: async (req, res, next) => {
        // Callback solution
        Product.fetchAll(products => {
            res.render('shop/product-list', {
                products: products,
                title: 'Porducts',
                path: '/products'
            });
        });
    }
}