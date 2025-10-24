const express = require('express');
const router = express.Router();
const Application = require('../models/applicationModel'); 
const Job = require('../models/jobModel'); 

// --- POST /api/applications (1. Apply for a Job) ---
router.post('/', async (req, res) => {
    // CRITICAL: Destructure ALL fields sent from the frontend modal
    const { jobId, jobSeekerId, fullName, email, resumeName, coverLetter } = req.body; 

    // Server-side check for mandatory fields (must match your Mongoose model)
    if (!jobId || !jobSeekerId || !fullName || !email || !resumeName) {
        // If this fails, the frontend will display this specific error
        return res.status(400).json({ error: "Validation Error: Job ID, User ID, Full Name, Email, and Resume are required." });
    }

    // Validation: Check if user has already applied
    const existingApplication = await Application.findOne({ 
        job: jobId, 
        jobSeeker: jobSeekerId 
    });

    if (existingApplication) {
        return res.status(400).json({ error: "You have already applied for this job." });
    }
    
    try {
        const newApplication = await Application.create({
            job: jobId,
            jobSeeker: jobSeekerId,
            fullName: fullName, // Mongoose field population
            email: email,       // Mongoose field population
            resumeName: resumeName,
            coverLetter: coverLetter,
            // Note: Do NOT pass the 'status' field here; let the Mongoose default take effect
        });
        res.status(201).json({ message: "Application submitted successfully!", application: newApplication });
    } catch (error) {
        console.error('Failed to save application:', error);
        
        // Use a generic 400 error if it's a Mongoose validation issue
        // (e.g., if a field in the model is required but was still somehow missed)
        res.status(400).json({ error: "Failed to submit application due to database validation or server error." });
    }
});

// ... (rest of the router code for GET/PUT remains the same)

module.exports = router;
