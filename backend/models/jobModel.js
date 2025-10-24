const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    // Standard Job Details
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: false,
    },
    
    // CRITICAL: Link the job to the Employer/User who posted it
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);