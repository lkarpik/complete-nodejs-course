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
		.then(products => {
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products
			});
		})
		.catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.id;

	Product
		.findById(prodId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			console.log('cart updated');
			res.redirect('/cart');
		})
		.catch(err => console.log(err));
};

exports.postCartDeleteItem = (req, res, next) => {
	const prodId = req.body.id;
	req.user
		.deleteCartItem(prodId)
		.then(result => {
			res.redirect('/cart');
		})
		.catch(err => console.log(err));

};

exports.postOrder = (req, res, next) => {

	req.user
		.addOrder()
		.then(result => {
			res.redirect('/orders');
		})
		.catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
	req.user.getOrders()
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