// src/components/ApplicationDetailModal.js

import React from 'react';
import { Modal, Descriptions, Tag ,Button} from 'antd';
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const ApplicationDetailModal = ({ visible, onCancel, application }) => {
    
    // ⭐ CRITICAL DEFENSE 1: Check if the application object itself is valid.
    if (!application || !application.job) {
        // If data is missing, show a simple error message instead of crashing.
        return (
            <Modal
                title="Error Loading Details"
                visible={visible}
                onCancel={onCancel}
                footer={[<Button key="close" onClick={onCancel}>Close</Button>]}
            >
                <p>Application details are incomplete. Please check the data source.</p>
            </Modal>
        );
    }
    
    // Assign job details safely using optional chaining or default values
    const job = application.job || {}; // Default to empty object if job is null
    const jobTitle = job.title || 'N/A';
    const jobLocation = job.location || 'Unknown Location';
    const jobSalary = job.salary ? job.salary.toLocaleString() : 'Negotiable';
    const jobDescription = job.description || 'No description provided.';

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

    return (
        <Modal
            title={<div style={{ fontWeight: 'bold' }}>Application Details: {jobTitle}</div>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Tag 
                color={getStatusColor(application.status)} 
                style={{ fontSize: '1em', padding: '5px 10px', marginBottom: '15px' }}
            >
                Current Status: {application.status.toUpperCase()}
            </Tag>

            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Job Title">{jobTitle}</Descriptions.Item>
                <Descriptions.Item label="Company">{job.company || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Location">
                    <FaMapMarkerAlt style={{ marginRight: '5px' }} /> {jobLocation}
                </Descriptions.Item>
                <Descriptions.Item label="Salary">
                    <FaDollarSign style={{ marginRight: '5px' }} /> ${jobSalary}
                </Descriptions.Item>
                <Descriptions.Item label="Applied On">
                    <FaCalendarAlt style={{ marginRight: '5px' }} /> {new Date(application.appliedDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Job Description">
                    {jobDescription}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default ApplicationDetailModal;