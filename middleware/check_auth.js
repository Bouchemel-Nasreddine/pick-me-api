const jwt = require('jsonwebtoken');

const HttpErrors = require('../models/http-error');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        

        if (!token) {
            return next(new HttpErrors('Not authenticated', 401));
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.userData = { userId: decodedToken.userId };

        next();
    

    } catch (error) {
        return next(new HttpErrors('Something went wrong, try again', 500));
    }
        

}