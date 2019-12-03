const fs = require('fs');
const http = require('http');

const routes = require('./routes');

const server = http.createServer(routes);

// const server = http.createServer((req, res) => {

// let obj = {
//     url: url.parse(req.url, true),
//     method: req.method,
//     headers: req.headers
// }
// res.setHeader('Content-Type', 'text/html');
// res.write(JSON.stringify(obj));

// res.end(JSON.stringify(obj));
// process.exit();
// });

server.listen(8080, () => {
    console.log('Started');
});