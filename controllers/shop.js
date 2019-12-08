const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'All Products',
			path: '/products'
		});
	});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.id;
	Product.fetchProductById(prodId, product => {
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: `/products`
		});
	});
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
	Product.fetchAll(products => {
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/'
		});
	});
};

exports.getCart = (req, res, next) => {
	Cart.getCart(cart => {
		Product.fetchAll(products => {
			const cartProdcuts = [];
			products.forEach(product => {
				const cartProd = cart.products.find(prod => prod.id === product.id)
				if (cartProd) {

					cartProdcuts.push({
						productData: product,
						qty: cartProd.qty
					});
				}
			});
			res.render('shop/cart', {
				path: '/cart',
				pageTitle: 'Your Cart',
				products: cartProdcuts
			});

		});
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.id;
	Product.fetchProductById(prodId, product => {
		Cart.addProduct(prodId, product.price);
	});
	res.redirect('back');
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