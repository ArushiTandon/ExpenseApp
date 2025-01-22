const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expenseapp' , 'root', 'arushi@mysql', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;