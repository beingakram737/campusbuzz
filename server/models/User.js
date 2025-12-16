// File: server/models/User.js 

import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import crypto from 'crypto'; // Required for token generation

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true, 
      match: [
            /^[a-z]+[0-9]*(\.[0-9]+)?@(gmail\.com|ymail\.com|hotmail\.com)$/,
            'Invalid email format. Check structure and use only @gmail.com, @ymail.com, or @hotmail.com.'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Jab bhi query karein toh password na mile
    },
    role: {
        type: String,
        enum: ['student', 'admin'], 
        default: 'student' 
    },

    // =============================================================
    // NEW FIELDS FOR PASSWORD RESET
    // =============================================================
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // =============================================================

}, {
    timestamps: true 
});

// 1. Password Hashing (Pre-Save Middleware)
UserSchema.pre('save', async function(next) {
    // Agar password field modify nahi hua hai, to skip karein
    if (!this.isModified('password')) { 
        // Lekin agar reset token fields set hue hain, tab bhi skip karein, kyunki woh save ke time modify nahi ho rahe.
        // Agar sirf password modify hua hai, ya naya user hai, tab hi hash karein.
        if (!this.isNew) {
            next();
            return;
        }
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Agar hum password reset kar rahe hain, to in fields ko clear kar do save hone ke baad
    // Ye tabhi chalega jab user.save() call kiya gaya ho resetPassword logic mein aur password modify hua ho.
    if (this.isModified('password')) {
        this.resetPasswordToken = undefined;
        this.resetPasswordExpire = undefined;
    }

    next();
});

// 2. JWT (Token) Generation Method
UserSchema.methods.getSignedJwtToken = function() {
    // User role ko token mein shamil kiya taki middleware use kar sake
    return jwt.sign(
        { id: this._id, role: this.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// 3. Password Comparison Method
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ===================================================================
// NEW METHOD: Reset Password Token Generate Karna
// ===================================================================
UserSchema.methods.getResetPasswordToken = function() {
    // 1. 20 bytes ka random token generate karein (unhashed token, jo email mein jayega)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Token ko hash karke schema field (resetPasswordToken) mein save karein
    // Kyunki database mein plain token save karna secure nahi hai
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // 3. Token expiry time set karein (e.g., 10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes (milliseconds)

    // 4. Client/Email ko bhejane ke liye unhashed token return karein
    return resetToken; 
};
// ===================================================================


const User = mongoose.model('User', UserSchema);

export default User;