const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const sgMail = require('@sendgrid/mail');
const {
  validationResult
} = require('express-validator');



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: req.flash('error')[0],
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: req.flash('error')[0],
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const loginEmail = req.body.email
  const loginPassword = req.body.password

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: loginEmail,
        password: loginPassword
      },
      validationErrors: errors.array()
    });
  }

  User
    .findOne({
      email: loginEmail
    })
    .then(user => {
      if (!user) {

        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          isAuthenticated: false,
          errorMessage: 'Wrong email or password',
          oldInput: {
            email: loginEmail,
            password: loginPassword
          },
          validationErrors: []
        });
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
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isAuthenticated: false,
            errorMessage: 'Wrong email or password',
            oldInput: {
              email: loginEmail,
              password: loginPassword
            },
            validationErrors: []
          });
        }).catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
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
      return res.redirect('/login');
    }).then(result => {
      const msg = {
        to: email,
        from: 'nodejsapp@example.com',
        subject: 'Sending with SendGrid',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<strong>${email} registered</strong>`,
      };
      // return sgMail.send(msg);
    }).then(result => {
      console.log('Email sent');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset password',
    errorMessage: req.flash('error')[0]
  })
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
    const token = buffer.toString('hex');
    User
      .findOne({
        email: req.body.email
      })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No user with that email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user
          .save()
          .then(result => {
            req.flash('sucess', 'Email sent!')
            res.redirect('/')
            const msg = {
              to: req.body.email,
              from: 'nodejsapp@example.com',
              subject: 'Reset password',
              html: `
              <p>Password reset link:</p>
              <p><a href="http://localhost:3000/reset/${token}">link</a></p>
              `,
            };
            console.log(msg);
            return sgMail.send(msg);
          });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  })
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  })
    .then((user) => {
      if (!user) {
        return next();
      }
      res.render('auth/new-password', {
        path: '/reset',
        pageTitle: 'New password',
        errorMessage: req.flash('error')[0],
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User
    .findOne({
      resetToken: passwordToken,
      resetTokenExpiration: {
        $gt: Date.now()
      },
      _id: userId
    })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      req.flash('success', 'Password changed');
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}