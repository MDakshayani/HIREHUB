// models/applicationModel.js

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    jobSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    
    // ⭐ The simplified text field. Must be required to force submission.
    coverLetter: {
        type: String,
        required: true, 
    },
    
    // NOTE: All file/skill fields are excluded for stability.

    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Interview', 'Rejected', 'Selected'],
        default: 'Pending',
    },
    appliedDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Application', applicationSchema);