const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {

            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(id = null, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });
    }

    static delete(id) {
        getProductsFromFile(products => {
            const existingProductIndex = products.findIndex(prod => prod.id === id);
            console.log(existingProductIndex);
            if (existingProductIndex !== -1) {
                const updatedProducts = [...products];
                const removedProd = updatedProducts.splice(existingProductIndex, 1)[0];
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    if (!err) {

                        Cart.removeProduct(id, removedProd.price);
                    }
                    console.log(err);
                });
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static fetchProductById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => {
                return p.id === id;
            });
            cb(product);
        });
    }
};