const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: req.flash('error')[0]
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: req.flash('error')[0]
  });
};

exports.postLogin = (req, res, next) => {
  const loginEmail = req.body.email
  const loginPassword = req.body.password

  User
    .findOne({
      email: loginEmail
    })
    .then(user => {
      if (!user) {
        req.flash('error', 'Wrong email or password');
        return res.redirect('/login');
      }
      bcrypt
        .compare(loginPassword, user.password)
        .then((result) => {
          if (result) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session
              .save(err => {
                if (err) console.log(err);
                res.redirect('/');
              });
          }
          req.flash('error', 'Wrong email or password');
          return res.redirect('/login');
        }).catch((err) => {
          console.log(err);
          res.redirect('/login');
        });


    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (confirmPassword !== password || password.length < 1) {
    req.flash('error', 'Enter correct password');
    return res.redirect('/signup');
  }

  User
    .findOne({
      email: email
    })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'User already exists');
        return res.redirect('/signup');
      } else {
        return bcrypt
          .hash(password, 12)
          .then(bcPassword => {
            const user = new User({
              email,
              password: bcPassword
            });
            return user.save();
          })
          .then(result => {
            req.flash('success', 'User signed up');
            res.redirect('/login');
          })
          .catch(err => console.log(err));;
      }
    })
    .catch(err => console.log(err));

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};