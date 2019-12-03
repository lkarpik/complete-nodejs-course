const express = require('express')
const app = express();

const port = process.env.PORT || 8080;

app.use('/', (req, res, next) => {
    console.log(`Made through always enable middleware`);
    next();
})

app.use('/prod', (req, res, next) => {

    console.log('From middleware');
    res.send('<h1>Hello from middleware</h1>')
    next();

});

app.get('/', (req, res) => {

    console.log('From get');
    res.send('<h1>Hello from get</h1>')

});

app.listen(port, () => {
    console.log(`App listening on port: ${port} `);
});