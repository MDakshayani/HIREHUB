import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Spin } from 'antd'; // Using AntD components
import JobCard from './JobCard';

const API_URL = 'http://localhost:5000/api/jobs';

// CRITICAL: Ensure props are received here
const JobList = ({ jobPostedStatus, onJobDeleted, userName, userRole, userEmail, userId }) => { 
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(API_URL);
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobPostedStatus]); // Refreshes when a new job is posted

  const handleJobDeleted = () => {
    fetchJobs(); 
    if (onJobDeleted) onJobDeleted(); // Also notify parent layout
  };

  if (loading) return <div style={{textAlign: 'center', padding: '40px'}}><Spin size="large" /></div>;
  if (jobs.length === 0) return <p style={{color: '#007bff', padding: '20px'}}>No jobs found. Try posting one from the Employer dashboard!</p>;

  return (
    <div style={{ flex: 1, paddingLeft: '20px' }}>
      {jobs.map((job) => (
        // CRITICAL FIX: Pass ALL user props down to JobCard
        <JobCard 
          key={job._id} 
          job={job} 
          onJobDeleted={handleJobDeleted} 
          userName={userName} 
          userRole={userRole} 
          userEmail={userEmail} 
          userId={userId} // Passing the current user's ID
        />
      ))}
    </div>
  );
};

export default JobList;