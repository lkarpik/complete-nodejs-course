const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err))
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Constrains
Product.belongsTo(User, {
    constrains: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, {
    through: CartItem
});
Product.belongsToMany(Cart, {
    through: CartItem
});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
    through: OrderItem
});
// OR:
// Product.belongsToMany(Order, {
//     through: OrderItem
// });


sequelize.sync({
        force: false
    }).then(result => {
        return User.findByPk(1);
    }).then(user => {
        if (!user) {
            return User.create({
                name: 'UKI',
                email: 'uki@uki'
            });
        }
        return user;
    })
    .then(user => {
        user.getCart().then(cart => {
            if (!cart) {
                return user.createCart();
            } else {
                return cart;
            }
        })
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })