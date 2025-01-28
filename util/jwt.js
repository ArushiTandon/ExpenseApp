const jwt = require('jsonwebtoken');
require('dotenv').config();


const jwtAuthMiddleware = (req, res, next) => {
        
    const authorization = req.headers['x-auth-token'];
    console.log("1");
    
    if(!authorization) return res.status(401).json({error: 'Token not found'});
console.log("2");

    const token = req.headers['x-auth-token'].split(' ')[1];
    console.log("3");
    
    if(!token) return res.status(401).json({error: 'Unauthorized'});
    console.log("4");
    

    try {
        console.log("5");
        
        const decode = jwt.verify(token, '000');
        console.log("6");
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