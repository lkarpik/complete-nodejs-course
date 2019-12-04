const express = require('express')
const app = express();

app.use(express.json());
app.use(express.urlencoded());


app.use('/', (req, res, next) => {
    console.log(`Made through always enable middleware`);
    next();
})

app.use('/product', (req, res, next) => {

    console.log('From middleware');
    res.send(`
    <h1>Hello from middleware</h1>
    <form action="/add" method="POST">
        <input type="text" name="product[name]">
        <input type="text" name="product[type]">
        <button type="submit">Submit</button>
    </form>
    
    `);
});

app.post('/add', (req, res, next) => {
    console.log(`Added an object`);
    console.log(req.body);
    next();
})

app.use('/', (req, res) => {

    console.log('From get');
    res.send('<h1>Hello from use /</h1>')

});


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App listening on port: ${port} `);
});