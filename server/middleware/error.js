// File: server/middleware/error.js 

import ErrorResponse from '../utils/errorResponse.js';

const errorHandler = (err, req, res, next) => {
    let error = { ...err }; 
    error.message = err.message; 

    // FIX: .red property hata di gayi hai taki server crash na ho
    // Ab yeh line surakshit roop se error stack ko terminal par print karegi
    console.log(err.stack); 
    
    // Mongoose Bad ObjectId (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Validation Error 
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = messages.join(', ');
        error = new ErrorResponse(message, 400); 
    }

    // Mongoose Duplicate Key Error (E11000)
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // JWT Error Handling (Token signing/verification fail hone par)
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        error = new ErrorResponse('Not authorized, token failed (Check JWT_SECRET)', 401);
    }
    
    // Final response client ko bhej dein
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

export default errorHandler;