const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, id) {
        this.name = username;
        this.email = email;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb()
        let dbOp;
        if (this._id) {
            dbOp = db.collection('users').updateOne({
                _id: this._id
            }, {
                $set: this
            });
        } else {
            dbOp = db.collection('users').insertOne(this);
        }
        return dbOp
            .then(result => {
                console.log(result);
                return result;
            }).catch(err => console.log(err))
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users')
            .findOne({
                _id: new mongodb.ObjectID(id)
            })
            .then(result => {
                console.log(result);
                return result
            })
            .catch(err => console.log(err))
    }
}

module.exports = User;