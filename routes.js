const fs = require('fs');
const url = require('url');

const requestHandler = (req, res) => {

    const localURL = url.parse(req.url);
    const pathname = localURL.pathname;


    if (pathname === '/') {

        res.setHeader('Content-Type', 'text/html');

        res.write('<form action="/message" method="POST"><input type="text" name="message" placeholder="Type text for send"><button type="submit">sumbit</button></form>');
        res.end();

    } else if (pathname === '/hell') {
        res.setHeader('Content-Type', 'text/html');

        res.write('Hell page');
        res.end();

    } else if (pathname === '/message' && req.method === 'POST') {

        const body = [];

        req.on('data', chunk => {
            body.push(chunk);
        });

        req.on('end', () => {

            const parsedBody = Buffer.concat(body).toString();

            const msg = parsedBody.split('=');

            fs.writeFile('message.txt', msg[1].replace(/\+/g, ' '), err => {
                console.log('file saved');
                res.writeHead(302, {
                    'Location': '/'
                });
                res.end();
            });
        });



    } else {
        res.setHeader('Content-Type', 'text/html');

        res.write('No page');

    }
};

module.exports = requestHandler;