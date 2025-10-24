
import React, { useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaDollarSign, FaTrashAlt, FaEdit, FaSave, FaCheck, FaExclamationCircle, FaTimes, FaUser } from 'react-icons/fa'; 
import { Button } from 'antd'; 
import ApplicationModal from './ApplicationModal'; 

const JobCard = ({ job, onJobDeleted, userRole, userName, userEmail, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(job); 
  const [isApplied, setIsApplied] = useState(false); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const API_URL_ID = `http://localhost:5000/api/jobs/${job._id}`;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the job: ${job.title}?`)) {
      try {
        await axios.delete(API_URL_ID);
        onJobDeleted(); 
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job. Check console.');
      }
    }
  };

  const handleSave = async () => {
    try {
        await axios.put(API_URL_ID, editData); 
        setIsEditing(false);
        onJobDeleted(); 
    } catch (error) {
        console.error('Error updating job:', error);
        alert('Failed to update job. Check console.');
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  
  // --- APPLICATION LOGIC ---
  const handleApply = () => {
      setIsModalVisible(true); 
  };
  
  const onApplicationSubmit = () => {
      setIsApplied(true);
      setIsModalVisible(false);
  };

  // --- RENDERING ---
  const cardStyle = { 
    padding: '20px', 
    marginBottom: '15px', 
    borderRadius: '12px', 
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    border: userRole === 'Employer' && isEditing ? '2px solid #007bff' : '1px solid #eee'
  };
  const inputStyle = { width: '100%', padding: '8px', margin: '5px 0', boxSizing: 'border-box' };


  // 1. RENDER EDIT FORM
  if (isEditing) {
    return (
        <div style={cardStyle}>
            <h4>Editing: {job.title}</h4>
            <input type="text" name="title" value={editData.title} onChange={handleEditChange} placeholder="Title" style={inputStyle} />
            <input type="text" name="company" value={editData.company} onChange={handleEditChange} placeholder="Company" style={inputStyle} />
            <textarea name="description" value={editData.description} onChange={handleEditChange} placeholder="Description" style={{...inputStyle, height: '60px'}}></textarea>
            
            <button onClick={handleSave} className="post-button"> <FaSave /> Save</button>
            <button onClick={() => setIsEditing(false)} className="delete-button"> <FaTimes /> Cancel</button>
        </div>
    );
  }

  // 2. RENDER DEFAULT CARD
  return (
    <>
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: '#333' }}>{job.title} at {job.company}</h4>
              
              {/* ACTIONS: Conditional Buttons based on User Role */}
              <div style={{ display: 'flex', gap: '10px' }}>
                  
                  {/* EMPLOYER ACTIONS: Edit/Delete */}
                  {userRole === 'Employer' && (
                      <>
                          <button onClick={() => setIsEditing(true)} className="edit-button">
                              <FaEdit /> Edit
                          </button>
                          <button onClick={handleDelete} className="delete-button">
                              <FaTrashAlt /> Delete
                          </button>
                      </>
                  )}

                  {/* JOB SEEKER ACTION: Apply Button */}
                  {userRole === 'Job Seeker' && (
                      <Button 
                          onClick={handleApply} // Opens the modal
                          type="primary" 
                          disabled={isApplied}
                          icon={isApplied ? <FaCheck /> : <FaExclamationCircle />}
                          className={isApplied ? 'app-secondary-btn' : 'app-gradient-btn'}
                          style={{ fontWeight: 'bold' }}
                      >
                          {isApplied ? 'Applied' : 'Apply Now'}
                      </Button>
                  )}
              </div>
          </div>
          
          {/* Job Details */}
          <div style={{ fontSize: '0.95em', color: '#555' }}>
              <p style={{ margin: '5px 0' }}><FaMapMarkerAlt style={{ marginRight: '5px', color: '#007bff' }} /> {job.location || 'Location not specified'}</p>
              <p style={{ margin: '5px 0' }}><FaDollarSign style={{ marginRight: '5px', color: '#28a745' }} /> Salary: ${job.salary ? job.salary.toLocaleString() : 'Negotiable'}</p>
              <p style={{ margin: '15px 0 0', fontStyle: 'italic' }}>{job.description ? job.description.substring(0, 150) + '...' : 'No description available.'}</p>
          </div>
        </div>
        
        {/* CRITICAL: The Modal Component */}
        {isModalVisible && (
            <ApplicationModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSuccess={onApplicationSubmit} 
                jobTitle={job.title}
                jobId={job._id} // CRITICAL: Passes the job ID
                userName={userName}
                userEmail={userEmail} 
                userId={userId} // CRITICAL: Passes the user ID for submission
            />
        )}
    </>
  );
};

export default JobCard;
