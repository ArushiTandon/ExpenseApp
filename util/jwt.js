const jwt = require('jsonwebtoken');
require('dotenv').config();


const jwtAuthMiddleware = (req, res, next) => {
    
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error: 'Token not found'});

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'});

    try {

        const decode = jwt.verify(token, '000');
        req.user = decode;
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Unauthorized'});
        
    }
}

const generateToken = (user) => {
    return jwt.sign(user,'000');
}
module.exports = { jwtAuthMiddleware, generateToken};