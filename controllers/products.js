const products = [];

module.exports = {
    getAddProduct: (req, res, next) => {
        res.render('add-product', {
            title: '🚀Add Product',
            path: '/admin/add-product',
        });
    },
    postAddProduct: (req, res, next) => {
        products.push({
            title: req.body.title
        });
        res.redirect('/')
    },
    getProducts: (req, res, next) => {
        res.render('shop', {
            products,
            title: '🛒Shop',
            path: '/'
        });
    }
}