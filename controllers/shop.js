const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
	Product.fetchAll()
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
	Product.findById(prodId)
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
	Product.fetchAll()
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
	let newQuantity = 1;
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
		.then(products => {
			let product;
			if (products.length > 0) {
				product = products[0];
			}
			if (product) {
				// Increase QTY
				const oldQty = product.cartItem.quantity;
				newQuantity = oldQty + 1;
				return product;
			}
			return Product.findByPk(prodId);
		})
		.then(product => {
			return fetchedCart.addProduct(product, {
				through: {
					quantity: newQuantity
				}
			});
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err))
	// res.redirect('back');
};

exports.postCartDeleteItem = (req, res, next) => {
	const prodId = req.body.id;
	req.user
		.getCart()
		.then(cart => {
			return cart.getProducts({
				where: {
					id: prodId
				}
			});
		}).then(products => {
			const product = products[0];
			product.cartItem.destroy();
		}).then(result => {
			res.redirect('/cart')
		})
		.catch(err => console.log(err))

};

exports.postOrder = (req, res, next) => {
	let fetchedProducts;
	let fetchedCart;
	req.user
		.getCart()
		.then(cart => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then(products => {
			fetchedProducts = products;
			return req.user.createOrder()
		})
		.then(order => {
			return order.addProducts(fetchedProducts.map(p => {
				p.orderItem = {
					quantity: p.cartItem.quantity
				};
				return p;
			}));
		}).then(result => {
			fetchedCart.setProducts(null)
		})
		.then(result => {
			res.redirect('/orders');
		})
		.catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
	req.user.getOrders({
			include: [`products`]
		})
		.then(orders => {
			console.log(orders);
			res.render('shop/orders', {
				path: '/orders',
				pageTitle: 'Your Orders',
				orders
			});
		})
		.catch(err => console.log(err));

};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
};