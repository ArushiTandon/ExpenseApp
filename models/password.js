const { DataTypes} = require('sequelize');
const sequelize = require('../util/db');
const User = require('./User');


const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },

    active: DataTypes.BOOLEAN,
})

module.exports = Forgotpassword;