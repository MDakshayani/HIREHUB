const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
        type: String,
        enum: ['Job Seeker', 'Employer'], 
        required: true,
    },
}, { timestamps: true });

// CRITICAL FIX: Hash the password before saving the user
userSchema.pre('save', async function (next) {
    // Only hash the password if it is new or has been modified
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err); 
    }
});

module.exports = mongoose.model('User', userSchema);