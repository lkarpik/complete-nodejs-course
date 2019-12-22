const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // User.findById('5baa2528563f16379fc8a610')
  //   .then(user => {
  //     req.user = new User(user.name, user.email, user.cart, user._id);
  //     next();
  //   })
  //   .catch(err => console.log(err));
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://lkarpik:At0fLuVKgPddwPlr@sandbox-0erkh.mongodb.net/nodejsComplete?retryWrites=true&w=majority', {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  )
  .then(result => {
    app.listen(3000);
    console.log('App started with connection to mongodb');
  })
  .catch(err => {
    console.log(err);
  });