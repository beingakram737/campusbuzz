// File: server/middleware/asyncHandler.js

const asyncHandler = fn => (req, res, next) =>
    // Promise ko resolve karta hai, agar koi error aati hai toh next() ko bhej deta hai
    Promise.resolve(fn(req, res, next)).catch(next); 

export default asyncHandler;