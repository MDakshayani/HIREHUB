const express = require('express');
const router = express.Router();
const Job = require('../models/jobModel');

// --- 1. POST a New Job (Create Logic) ---
router.post('/', async (req, res) => {
    const { title, company, location, description, salary, employerId } = req.body; 

    // Validation must include employerId
    if (!title || !company || !location || !description || !employerId) {
        return res.status(400).json({ error: "Please fill all required fields and provide employer ID." });
    }

    try {
        // Save the job, linking it to the employer
        const job = await Job.create({ 
            title, 
            company, 
            location, 
            description, 
            salary, 
            employer: employerId 
        });
        
        res.status(201).json({ message: "Job posted successfully!", job });

    } catch (error) {
        console.error("Job posting failed:", error);
        res.status(500).json({ error: 'Failed to create job due to server error.' });
    }
});


// --- 2. GET All Jobs (Read Logic - with Filter) ---
router.get('/', async (req, res) => {
    // Check for employerId query parameter (used by the 'Manage Jobs' tab)
    const filter = req.query.employerId ? { employer: req.query.employerId } : {};
    
    // If no employerId is provided, it returns ALL jobs (for the 'Find Jobs' tab)

    try {
        // Apply the filter if it exists
        const jobs = await Job.find(filter).sort({ createdAt: -1 }); 
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs with filters.' });
    }
});

// --- 3. UPDATE Job Listing (Handles PUT /api/jobs/:id) ---
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body; 

    try {
        const updatedJob = await Job.findByIdAndUpdate(
            id, 
            updateFields, 
            { new: true, runValidators: true } // Returns the new doc and runs schema checks
        );

        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found." });
        }

        res.status(200).json({ message: "Job updated successfully!", job: updatedJob });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- 4. DELETE Job Listing (Handles DELETE /api/jobs/:id) ---
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedJob = await Job.findByIdAndDelete(id); 

        if (!deletedJob) {
            return res.status(404).json({ error: "Job not found." });
        }

        res.status(200).json({ message: "Job successfully deleted" });

    } catch (error) {
        res.status(500).json({ error: "Server error during deletion." });
    }
});

module.exports = router;