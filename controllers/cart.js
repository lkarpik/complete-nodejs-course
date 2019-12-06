module.exports = {
    getCart: (req, res, next) => {
        res.render('shop/cart', {
            title: '🛒Cart',
            path: '/cart',
        })
    }
}