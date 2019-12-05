const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

// App
const app = express();

app.set('view engine', 'ejs');

// Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);
app.use(errorController.get404);

// Server
app.listen(3000);