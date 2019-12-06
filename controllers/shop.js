const Product = require('../models/product');

module.exports = {
    getIndex: (req, res, next) => {

        res.render('shop/index', {
            title: 'Shop',
            path: '/'
        })
    },

    getProducts: (req, res, next) => {
        // Callback solution
        Product.fetchAll(products => {
            res.render('shop/product-list', {
                products: products,
                title: 'All Porducts',
                path: '/products'
            });
        });
    },

    getCart: (req, res, next) => {
        res.render('shop/cart', {
            title: '🛒Cart',
            path: '/cart',
        })
    },

    getOrders: (req, res, next) => {
        res.render('shop/orders', {
            title: 'Your Orders',
            path: '/orders',
        })
    },

    getCheckout: (req, res, next) => {
        res.render('shop/checkout', {
            title: '💵Checkout',
            path: '/checkout',
        });
    }
}