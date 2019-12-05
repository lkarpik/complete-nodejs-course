module.exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        title: '🚧Page not found',
        path: false
    });
}