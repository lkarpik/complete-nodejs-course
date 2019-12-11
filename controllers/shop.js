const Product = require("../models/product");
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.getProducts = (req, res, next) => {
	Product.findAll()
		.then(results => {

			res.render('shop/product-list', {
				prods: results,
				pageTitle: 'All Products',
				path: '/products'
			});
		})
		.catch(err => console.log(err))

};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.id;
	Product.findByPk(prodId)
		.then((product) => {
			res.render('shop/product-detail', {
				product: product,
				pageTitle: product.title,
				path: `/products`
			});
		})
		.catch(err => console.log(err));
};

// Product.fetchAll(products => {

//   const product = products.find(product => {
//     return product.id === prodId;
//   });

//   res.render('shop/product-detail', {
//     prod: product,
//     pageTitle: 'Product Details',
//     path: `/products/${product.id}`
//   });
// });


exports.getIndex = (req, res, next) => {
	Product.findAll()
		.then(results => {
			res.render('shop/index', {
				prods: results,
				pageTitle: 'Shop',
				path: '/'
			});
		})
		.catch(err => console.log(err))

};

exports.getCart = (req, res, next) => {
	req.user
		.getCart()
		.then(cart => {
			return cart
				.getProducts()
				.then(products => {
					res.render('shop/cart', {
						path: '/cart',
						pageTitle: 'Your Cart',
						products
					});
				})
				.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.id;
	let fetchedCart;
	req.user
		.getCart()
		.then(cart => {
			fetchedCart = cart;
			return cart.getProducts({
				where: {
					id: prodId
				}
			});
		})
		.then(prodcuts => {
			let product;
			if (prodcuts.lenght > 0) {
				product = prodcuts[0];
			}
			let newQuantity = 1;
			if (product) {
				// Increase QTY
				const oldQty = prodcuts.CartItem.quantity;
				newQty = oldQty + 1;
				return fetchedCart.addProduct(product, {
					through: {
						quantity: newQuantity
					}
				});
			}
			return Product.findByPk(prodId)
				.then(product => {
					return fetchedCart.addProduct(product, {
						through: {
							quantity: newQuantity
						}
					});
				})
				.catch(err => console.log(err));
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err))
	// res.redirect('back');
};

exports.postCartDeleteItem = (req, res, next) => {
	const prodId = req.body.id;
	Product.fetchProductById(prodId, product => {
		Cart.removeProduct(prodId, product.price);
		res.redirect('back');
	});
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		pageTitle: 'Your Orders'
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};