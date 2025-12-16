// File: server/middleware/auth.js

import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js'; 

// 1. JWT Token se User ko Protect karna (LoggedIn check)
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Agar token nahi hai
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        next();

    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});


// 2. User Role ke hisaab se Access authorize karna (Admin check)
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403 // Forbidden
                )
            );
        }
        next();
    };
};