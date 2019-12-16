const mongodb = require('mongodb');
const conf = require('../config');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(conf.mongoDB, {
        useUnifiedTopology: true
    }).then(client => {
        console.log('Connected to mongoDB');
        _db = client.db();
        callback();
    }).catch(err => {
        console.log(err);
        throw err;
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!'
}

module.exports = {
    mongoConnect,
    getDb
}