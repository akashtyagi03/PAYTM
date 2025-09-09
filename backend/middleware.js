const {JWT_SECRET} = require('./config');
const jwt = require('jsonwebtoken');

// Middleware to authenticate requests using JWT
const auth = (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader?.split(" ")[1]; 

    if (!bearerHeader || !bearerHeader.startsWith('Bearer ') || !token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    console.log("JWT_SECRET:", JWT_SECRET);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                message: 'Failed to authenticate token',
                error: err.message  // ✅ Show exact JWT error
            });
        }   
        req.userId = decoded.userId; // Store user ID in request for use in routes
        next();
    });
}

module.exports = {auth};