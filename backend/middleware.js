const jwt = require('jsonwebtoken');

// Middleware to authenticate requests using JWT
const auth = (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    const token = bearerHeader?.split(" ")[1]; 

    if (!bearerHeader || !bearerHeader.startsWith('Bearer ') || !token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_TOKEN , (err, decoded) => {
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