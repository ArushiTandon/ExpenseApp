const { DataTypes } = require('sequelize');
const sequelize = require('../util/db');

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: DataTypes.STRING,
    orderid: DataTypes.STRING,
    status: DataTypes.STRING
},
{
    timestamps: false
});

module.exports = Order;