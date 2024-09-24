const jwt = require('jsonwebtoken');
 
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
 
const roleMiddleware = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};
 
module.exports = { authMiddleware, roleMiddleware };