const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {

    fs.readFile(p, (err, data) => {
        if (err) {
            return callback([]);
        } else {
            return callback(data.length > 0 ? JSON.parse(data) : []);
        }
    });
}


module.exports = class Product {
    constructor(title, imageURL, description, price) {
        this.title = title;
        this.imageURL = imageURL;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
                console.log("Saved");
            });
        });
    }

    // Callback solution
    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
}