import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaBuilding, FaMapMarkerAlt, FaDollarSign, FaPen } from 'react-icons/fa';
// Removed Ant Design Button dependency to fix submission conflict
// import { Button } from 'antd'; 

const API_URL = 'http://localhost:5000/api/jobs';

const JobForm = ({ onJobPosted, userId }) => { 
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        salary: 0,
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        // 💡 CRITICAL FIX: PREVENTS DEFAULT BROWSER SUBMISSION
        e.preventDefault(); 
        
        setMessage('Posting job...');
        setLoading(true);
        
        // 1. Basic validation check 
        if (!formData.title || !formData.company || !formData.location || !formData.description) {
            setMessage('Error: Please fill all text fields.');
            setLoading(false);
            return;
        }

        // 2. CRITICAL VALIDATION CHECK: Ensure we have the user ID
        if (!userId) {
            setMessage('Error: User ID is missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            // 3. Send POST request with the employerId attached
            await axios.post(API_URL, {
                ...formData,
                employerId: userId, // FINAL FIX: Attach the employer's ID here
            });
            
            // Success
            setFormData({ title: '', company: '', location: '', description: '', salary: 0 });
            setMessage(`Success! Job posted.`);
            onJobPosted(); // Trigger list refresh in Dashboard
        } catch (error) {
            const errMessage = error.response?.data?.error || 'Server error occurred.';
            setMessage(`Error posting job: ${errMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const formStyle = { 
        border: '1px solid #e0e0e0', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
    };
    
    return (
        // The form onSubmit links directly to the handler
        <form onSubmit={handleSubmit} style={formStyle}> 
            <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Job Title *" 
                required 
                className="app-input" 
            />
            {/* ... other input fields ... */}
            <input 
                type="text" 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                placeholder="Company *" 
                required 
                className="app-input"
            />
            <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                placeholder="Location *" 
                required 
                className="app-input"
            />
            <input 
                type="number" 
                name="salary" 
                value={formData.salary} 
                onChange={handleChange} 
                placeholder="Salary (e.g., 65000)" 
                className="app-input"
            />
            <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Job Description *" 
                required 
                className="app-input" 
                style={{ height: '120px' }}
            />
            
            {/* 💡 CRITICAL FIX: Use a simple HTML button with styles */}
            <button 
                type="submit" 
                disabled={loading} 
                className="post-button" 
                style={{ width: '100%', border: 'none', padding: '10px 15px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}
            >
                <FaPen style={{marginRight: '8px'}} /> {loading ? 'Posting...' : 'Post Job'}
            </button>
            {message && <p style={{ marginTop: '10px', color: message.startsWith('Error') ? 'red' : 'green', fontSize: '0.9em' }}>{message}</p>}
        </form>
    );
};

export default JobForm;