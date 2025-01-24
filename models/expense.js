const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const expense = sequelize.define('Expense', {
    username: {
        amount: DataTypes.INTEGER,
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
});


module.exports = expense;