// File: server/controllers/auth.js

import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import crypto from 'crypto'; // ✅ NEW IMPORT
import sendEmail from '../utils/sendEmail.js'; // ✅ NEW IMPORT

// Helper function (Apka existing function hona chahiye)
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
};

// ===================================================================
// Existing Controllers (Register aur Login - Same Rakhein)
// ===================================================================

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    
    // Default role 'student' set karna hai
    const userRole = role || 'student';

    const user = await User.create({
        name,
        email,
        password,
        role: userRole
    });

    sendTokenResponse(user, 201, res);
});


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user (password field select kiya hai)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});


// ===================================================================
// ✅ UPDATED CONTROLLER: Forgot Password (with Debugging Log)
// ===================================================================

// @desc    Forgot Password (Send reset link to email)
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        // Security reasons ke liye humesha "Success" message hi bhejte hain, 
        // bhale hi email na mila ho.
        return res.status(200).json({ 
            success: true, 
            message: 'If the email is registered, a password reset link has been sent.' 
        });
    }

    // User model se token generate karein
    const resetToken = user.getResetPasswordToken();

    // Reset fields ko save karein (middleware 'pre-save' ko skip karne ke liye)
    await user.save({ validateBeforeSave: false });

    // Client side reset URL
    // Yeh URL client/src/App.jsx mein defined hai: /resetpassword/:resetToken
    const resetUrl = `${req.protocol}://localhost:5173/resetpassword/${resetToken}`;

    // *********************************************************************************
    // ✅ NEW ADDITION FOR LOCAL TESTING / DEBUGGING
    // Jab aap forgot password request bhejenge, yeh link aapke server terminal par print hoga.
    console.log(`\n\n==================================================================`);
    console.log(`🔑 PASSWORD RESET URL FOR LOCAL TESTING: ${resetUrl}`);
    console.log(`==================================================================\n`);
    // *********************************************************************************

    const message = `
        <h1>Password Reset Request</h1>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the link below to reset your password. This link will expire in 10 minutes.</p>
        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    try {
        await sendEmail({
            to: user.email,
            subject: 'CampusBuzz Password Reset Token',
            text: message
        });

        res.status(200).json({
            success: true,
            message: 'Password reset email sent successfully'
        });
    } catch (err) {
        console.error("Email send error:", err);
        // Agar email bhejte waqt error aaye, toh token fields ko database se hata dein
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent. Please contact administration.', 500));
    }
});


// ===================================================================
// ✅ NEW CONTROLLER: Reset Password (Same Rakhein)
// ===================================================================

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
    // 1. URL se aaye hue token ko hash karein
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    // 2. User ko find karein (hashed token aur unexpired time ke basis par)
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() } // $gt means Greater Than (Expiry time se bada ho)
    }).select('+password'); // password field ko select karna zaroori hai

    if (!user) {
        return next(new ErrorResponse('Invalid or expired reset token', 400));
    }

    // 3. Password update karein
    user.password = req.body.password;
    
    // 4. Reset fields clear karein
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // 5. User ko save karein (is se pre('save') hook chalega aur naya password hash ho jayega)
    await user.save(); 

    // 6. User ko login karein (optional, seedhe login page par bhi bhej sakte hain)
    sendTokenResponse(user, 200, res); 
});