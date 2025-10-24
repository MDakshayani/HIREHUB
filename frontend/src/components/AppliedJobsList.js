// src/components/AppliedJobsList.js

import React, { useState } from 'react'; // Removed useEffect and axios
import { Card, List, Tag, Button, Spin, Modal } from 'antd'; 
import { FaCalendarAlt, FaMapMarkerAlt, FaHourglassHalf, FaInfoCircle } from 'react-icons/fa'; 
import ApplicationDetailModal from './ApplicationDetailModal'; 

// ⭐ DUMMY DATA FOR PRESENTATION (Job titles and statuses)
const DUMMY_APPLICATIONS = [
    {
        _id: 'app1', 
        jobSeeker: 'user1',
        status: 'Selected',
        appliedDate: new Date('2025-10-10'),
        job: { 
            _id: 'jobA', 
            title: 'Quality Assurance Engineer', 
            location: 'Chennai, India', 
            company: 'Tech Solutions' 
        }
    },
    {
        _id: 'app2', 
        jobSeeker: 'user1',
        status: 'Interview',
        appliedDate: new Date('2025-10-15'),
        job: { 
            _id: 'jobB', 
            title: 'Mobile App Developer', 
            location: 'Remote', 
            company: 'Global Code' 
        }
    },
    {
        _id: 'app3', 
        jobSeeker: 'user1',
        status: 'Reviewed',
        appliedDate: new Date('2025-10-20'),
        job: { 
            _id: 'jobC', 
            title: 'Frontend Developer (React)', 
            location: 'New York, USA', 
            company: 'Web Innovations' 
        }
    },
];

const AppliedJobsList = ({ userName, userId }) => {
    
    // ⭐ FIX: Initialize state directly with DUMMY data and set loading to false
    const [applications, setApplications] = useState(DUMMY_APPLICATIONS);
    const [loading, setLoading] = useState(false); // FORCING loading off
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Reviewed': return 'blue';
            case 'Interview': return 'purple';
            case 'Rejected': return 'red';
            case 'Selected': return 'success';
            case 'Pending': return 'processing';
            default: return 'default';
        }
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setIsModalVisible(true);
    };

    // --- RENDER LIST ---
    return (
        <>
           
            
            {/* Displaying actual list of jobs */}
            <List
                dataSource={applications}
                renderItem={(app) => (
                    <List.Item 
                        className="app-card-shadow"
                        style={{ padding: '20px', marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}
                    >
                        <List.Item.Meta
                            avatar={<FaHourglassHalf style={{ fontSize: '24px', color: getStatusColor(app.status) }} />}
                            title={<h4 style={{ margin: 0 }}>{app.job ? app.job.title : 'Job Title Not Found'}</h4>} 
                            description={
                                <>
                                    <p style={{ margin: '5px 0', color: '#555' }}><FaMapMarkerAlt style={{ marginRight: '5px' }}/> {app.job ? app.job.location : 'N/A'}</p>
                                    <p style={{ margin: 0, fontSize: '0.85em', color: '#888' }}><FaCalendarAlt style={{ marginRight: '5px' }}/> Applied on: {new Date(app.appliedDate).toLocaleDateString()}</p>
                                </>
                            }
                        />
                        <div style={{ textAlign: 'right' }}>
                            <Tag color={getStatusColor(app.status)} style={{ fontSize: '0.9em', padding: '5px 10px', marginBottom: '5px' }}>
                                {app.status.toUpperCase()}
                            </Tag>
                            <Button 
                                type="default" 
                                size="small" 
                                style={{ display: 'block' }}
                                onClick={() => handleViewDetails(app)} 
                            >
                                View Details
                            </Button>
                        </div>
                    </List.Item>
                )}
            />
            
            {/* The Modal Component Rendering */}
            <ApplicationDetailModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                application={selectedApplication} 
            />
        </>
    );
};

export default AppliedJobsList;