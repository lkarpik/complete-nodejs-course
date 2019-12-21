const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, id, cart) {
        this.name = username;
        this.email = email;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.cart = cart;
    }

    save() {
        const db = getDb()
        let dbOp;
        if (this._id) {
            dbOp = db.collection('users').updateOne({
                _id: this._id
            }, {
                $set: {
                    name: this.name,
                    email: this.email
                }
            });
        } else {
            dbOp = db.collection('users').insertOne(this);
        }
        return dbOp
            .then(result => {
                return result;
            }).catch(err => console.log(err))
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items]

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updatedCart = {
            items: updatedCartItems
        };

        const db = getDb();

        return db
            .collection('users')
            .updateOne({
                _id: this._id
            }, {
                $set: {
                    cart: updatedCart
                }
            });
    }

    getCart() {
        const db = getDb();
        const productsIds = this.cart.items.map(el => {
            return el.productId;
        });

        return db.collection('products').find({
                _id: {
                    $in: productsIds
                }
            })
            .toArray()
            .then(products => {
                const deletedProductsIds = productsIds.filter(prodId => {
                    return !products.map(el => el._id.toString()).includes(prodId.toString());
                })
                deletedProductsIds.forEach(prodId => {
                    this.deleteCartItem(prodId);
                })
                console.log(deletedProductsIds);
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(el => {
                            return el.productId.toString() === product._id.toString()
                        }).quantity
                    }
                });
            })
            .catch(err => console.log(err));
    }

    deleteCartItem(productId) {
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        })

        return db
            .collection('users')
            .updateOne({
                _id: this._id
            }, {
                $set: {
                    cart: {
                        items: updatedCartItems
                    }
                }
            });
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        userId: new mongodb.ObjectId(this._id),
                        name: this.name,
                        email: this.email
                    }
                };
                return db
                    .collection('orders')
                    .insertOne(order)
            })
            .then(result => {
                this.cart = {
                    items: []
                };
                return db
                    .collection('users')
                    .updateOne({
                        _id: this._id
                    }, {
                        $set: {
                            cart: {
                                items: []
                            }
                        }
                    });
            }).catch(err => console.log(err))
    }

    getOrders() {
        const db = getDb();
        return db
            .collection('orders').find({
                'user.userId': this._id
            }).toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({
                _id: new mongodb.ObjectId(id)
            })
            .then(result => {
                return result
            })
            .catch(err => console.log(err))
    }
}

module.exports = User;