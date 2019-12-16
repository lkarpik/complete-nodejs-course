const mongodb = require('mongodb');
const conf = require('../config');
const MongoClient = mongodb.MongoClient;


const mongoConnect = (callback) => {
    MongoClient.connect(conf.mongoDB).then(client => {
        console.log('Connected to mongoDB');
        callback(client);
    }).catch(err => console.log(err));
};

module.exports = mongoConnect;