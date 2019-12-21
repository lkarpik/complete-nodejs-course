const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');


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
    User.findById('5dfbdb50843d5c07d8efa5ae')
        .then(user => {
            console.log(user);
            req.user = new User(user.name, user.email, user._id, user.cart);
            next();
        }).catch(err => console.log(err))

});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    const testUser = new User('Lucky', 'luck@luck.com', '5dfbdb50843d5c07d8efa5ae');
    testUser.save();

    app.listen(3000);
});