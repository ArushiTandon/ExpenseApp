const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../util/jwt');


exports.signUp = async (req, res) => {
    // console.log('signup Request Body(LoginController):', req.body);
    const {username, email, password} = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        console.log('Found User:', user)
        if(user) {
            console.log('Username already exists');
            return res.status(200).json({ message: 'Username already exists'});
        }

        const newUser = await User.create({username, email, password});
        console.log('Signup - Password:', password);
        res.status(201).json({newUser})
    } catch (error) {
        console.error('ERROR:', error);
        res.status(400).json({error: 'Error creating user'});
    }
};

exports.login = async(req, res) => {
    console.log('Login Request Body(LoginController):', req.body);
    const {username, password} = req.body;
    
    try {
        const user = await User.findOne({ where: { username } });
        console.log('Found User:', user);
        console.log('Login - Stored Hash:', user.password);
        console.log('Login - Password Match:', await bcrypt.compare(password, user.password));

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password Valid:', isPasswordValid);

        if(!user || !(isPasswordValid)) {
            console.log('Invalid username or password');
            return res.status(401).json({error: 'Invalid username or password'});
        }

        const payload = {
            id: user.id,
            username: user.username,
        };

        const token = generateToken(payload);

        return res.status(200).json({message: 'Login successful!'});

    } catch (error) {
        console.error('error:', error);
        res.status(400).json({error: 'Error logging in'});
    }

}