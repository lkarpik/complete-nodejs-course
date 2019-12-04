const express = require('express')
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/', (req, res, next) => {
    console.log(`Made through always enable middleware`);
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use((req, res, next) => {

    console.log('404');
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));

});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App listening on port: ${port} `);
});