const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const expense = sequelize.define('Expense', {
    amount: {
        type: DataTypes.FLOAT,
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

    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
});


module.exports = expense;