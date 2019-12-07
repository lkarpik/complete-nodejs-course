const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch previous
        fs.readFile(p, (err, data) => {
            let cart = {
                products: [],
                totalPrice: 0
            };
            if (!err) {
                cart = JSON.parse(data);
            }
            // Analyze the cart if prod already exist
            const existingProdIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProd = cart.products[existingProdIndex];
            let updatedProduct;
            if (existingProd) {
                updatedProduct = {
                    ...existingProd
                };
                updatedProduct.qty += 1;
                // cart.products = [...cart.products]
                cart.products[existingProdIndex] = updatedProduct;

            } else {
                updatedProduct = {
                    id,
                    qty: 1
                };
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice += parseFloat(productPrice);
            cart.totalPrice = Math.round(cart.totalPrice * 100) / 100;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);

            });
        });
    }
    // add new product
}