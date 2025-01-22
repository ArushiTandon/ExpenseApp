const db = require('../util/db');
const { QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../util/jwt');


exports.signUp = async (req, res) => {

    const {username, email, password} = req.body;

    try {
        const newUser = await User.create({username, email, password});
        res.status(201).json({newUser})
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'Error creating user'});
    }
};

exports.login = async(req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({where: {username}});
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({error: 'Invalid username or password'});
        }

        const payload = {
            id: user.id,
            username: user.username,
        };

        const token = generateToken(payload);

        res.json({token: token});

    } catch (error) {
        console.error('error:', error);
        res.status(400).json({error: 'Error logging in'});
    }

}