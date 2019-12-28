const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.headers.cookie.split(';').map(el => el.trim().split('='))[0][1] === 'true';
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    // res.cookie('isLoggedIn', 'true');
    User.find().then(users => {
        req.session.isLoggedIn = true;
        req.session.user = users[0];
        req.session.save(err => {
            console.log(err);
            res.redirect('/');
        })
    }).catch(err => {
        console.log(err);
    })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}