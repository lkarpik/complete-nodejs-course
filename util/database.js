const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
});

module.exports = sequelize;