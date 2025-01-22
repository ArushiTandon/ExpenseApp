const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

(async () => {
    try {
      await sequelize.sync();
      console.log('Database synced!');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  });

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;