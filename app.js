const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('./config');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const store = new MongoDBStore({
  uri: config.MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'My cat is meathead',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use((req, res, next) => {
  if (req.session.user) {
    console.log('sessionUser');
    User.findById(req.session.user._id)
      .then(user => {
        console.log(user);
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  } else {
    next();
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(config.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Luck',
          email: 'lucky@luck.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log('App started');
  })
  .catch(err => {
    console.log(err);
  });