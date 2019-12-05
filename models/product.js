const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        const p = path.join(rootDir, 'data', 'products.json');
        fs.readFile(p, (err, data) => {
            let products = [];
            if (!err) {
                products = JSON.parse(data)
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        const p = path.join(rootDir, 'data', 'products.json');

        fs.readFile(p, (err, data) => {
            if (err) {
                callback([]);
            } else {
                callback(JSON.parse(data));
            }
        });
    }
}