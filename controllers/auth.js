const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const loginEmail = req.body.email
  const loginPassword = req.body.password
  User.findOne({
      email: loginEmail
    })
    .then(user => {
      if (!user || user.password !== loginPassword) {
        req.session.isLoggedIn = false;
        req.session.user = null;
        req.session.save(err => {
          console.log(err);
          console.log('Wrong email or password');
          res.redirect('/login');
        });

      } else {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
          console.log(err);
          res.redirect('/');
        });
      }

    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // console.log(req.body);
  if (confirmPassword !== password) {
    console.log('Passwords dont\'t match!');
    return res.redirect('/signup');
  }

  User
    .findOne({
      email: email
    })
    .then(userDoc => {
      if (userDoc) {
        console.log('User already exist!');
        return res.redirect('/signup');
      } else {
        const user = new User({
          email,
          password
        });
        return user.save();

      }
    }).then(result => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};