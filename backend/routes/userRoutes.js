const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt'); 

// --- 1. SIGNUP Route (Handles POST /api/users/register) ---
router.post('/register', async (req, res) => {
    const { fullName, email, password, role } = req.body; 

    try {
        const newUser = await User.create({ fullName, email, password, role });
        
        res.status(201).json({ 
            message: "Registration successful!", 
            role: newUser.role, 
            fullName: newUser.fullName, 
            email: newUser.email,
            userId: newUser._id 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already registered. Please login." });
        }
        console.error("Registration failed on server:", error);
        return res.status(500).json({ error: "Registration failed due to server configuration or missing data." });
    }
});


// --- 2. LOGIN Route ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) { 
            return res.status(401).json({ error: "Invalid email or password." });
        }
        
        res.status(200).json({ 
            message: "Login successful!", 
            role: user.role, 
            fullName: user.fullName, 
            email: user.email, 
            userId: user._id 
        });

    } catch (error) {
        res.status(500).json({ error: "Server error during login." });
    }
});


// --- 3. UPDATE User Profile (PUT) ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, email } = req.body; 

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { fullName, email }, 
            { new: true, runValidators: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Profile updated successfully!", user: updatedUser });

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;