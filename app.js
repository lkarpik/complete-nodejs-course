const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const handlebars = require('express-handlebars');

const app = express();

// app.engine('hbs', handlebars({
//     layoutsDir: 'views/layouts',
//     defaultLayout: 'main',
//     extname: 'hbs'
// }));

// app.set('view engine', 'hbs');
// app.set('view engine', 'pug');

app.set('view engine', 'ejs');
app.set('views', './views'); // default option is: ./views

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', {
        title: 'Page not found',
        path: false
    });
});

app.listen(3000);