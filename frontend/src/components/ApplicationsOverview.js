// src/components/ApplicationsOverview.js

import React, { useState } from 'react';
import { Table, Tag, Button, Card, Spin, message, Avatar, Dropdown, Menu, Modal } from 'antd'; 
import { UserOutlined, FileTextOutlined, EyeOutlined, CheckCircleOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaInfoCircle } from 'react-icons/fa'; // Added Fa icons for profile review

// STATIC APPLICANT DATA (FOR PRESENTATION)
const STATIC_APPLICANTS = [
    {
        key: 'app1', 
        jobSeekerName: 'David Jackson', 
        jobSeekerEmail: 'david.j@example.com', 
        appliedDate: new Date('2025-10-15'),
        status: 'Interview',
        coverLetter: "Highly motivated DevOps engineer with 5 years experience.",
        keySkills: "AWS, Kubernetes, CI/CD, Terraform",
    },
    {
        key: 'app2', 
        jobSeekerName: 'Michael Wilson', 
        jobSeekerEmail: 'm.wilson@example.com', 
        appliedDate: new Date('2025-10-10'),
        status: 'Reviewed',
        coverLetter: "Financial expert specializing in risk analysis and forecasting.",
        keySkills: "Excel, Financial Modeling, SQL",
    },
    {
        key: 'app3', 
        jobSeekerName: 'Jennifer Miller', 
        jobSeekerEmail: 'jenny.m@example.com', 
        appliedDate: new Date('2025-10-05'),
        status: 'Pending',
        coverLetter: "Entry-level professional eager to learn Sales Management techniques.",
        keySkills: "Communication, CRM, Public Speaking",
    },
    {
        key: 'app4', 
        jobSeekerName: 'Sarah Connor', 
        jobSeekerEmail: 'sarah.c@example.com', 
        appliedDate: new Date('2025-10-01'),
        status: 'Rejected',
        coverLetter: "Looking for part-time administrative work.",
        keySkills: "Filing, Word, Data Entry",
    },
];

const ApplicationsOverview = ({ jobId, jobTitle = "Job Title" }) => {
    
    const [applications, setApplications] = useState(STATIC_APPLICANTS);
    const [loading, setLoading] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Interview': return 'purple';
            case 'Reviewed': return 'blue';
            case 'Rejected': return 'red';
            case 'Selected': return 'green';
            default: return 'processing';
        }
    };
    
    // ⭐ FEATURE 1: Handle status change (simulated)
    const handleStatusChange = (key, newStatus) => {
        setApplications(prev => prev.map(app => 
            app.key === key ? { ...app, status: newStatus } : app
        ));
        message.success(`Status updated to ${newStatus}.`);
        // We simulate the API call success here
    };

    // ⭐ FEATURE 2: Handle Profile Review (simulated)
    const handleProfileReview = (applicant) => {
        setSelectedApplicant(applicant);
        setIsProfileModalVisible(true);
    };


    const columns = [
        { 
            title: 'APPLICANT', 
            dataIndex: 'jobSeekerName', 
            key: 'name', 
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#4F46E5' }} />
                    <div>
                        <h4 style={{ margin: 0 }}>{text}</h4>
                        <p style={{ margin: 0, fontSize: '0.8em', color: '#666' }}>{record.jobSeekerEmail}</p>
                        <p style={{ margin: 0, fontSize: '0.7em', color: '#888' }}>Applied {new Date(record.appliedDate).toLocaleDateString()}</p>
                    </div>
                </div>
            )
        },
        { 
            title: 'STATUS', 
            dataIndex: 'status', 
            key: 'status', 
            align: 'center', 
            render: status => (
                <Tag color={getStatusColor(status)} style={{ borderRadius: '12px', fontWeight: 'bold' }}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        { 
            title: 'ACTIONS', 
            key: 'actions', 
            render: (_, record) => (
                <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    
                    {/* BUTTON TO REVIEW PROFILE (Simulated) */}
                    <Button 
                        type="default" 
                        size="small" 
                        icon={<EyeOutlined />}
                        onClick={() => handleProfileReview(record)}
                    >
                        Review Profile
                    </Button>
                    
                    {/* DROPDOWN FOR STATUS CHANGE */}
                    <Dropdown 
                        overlay={
                            <Menu onClick={({ key }) => handleStatusChange(record.key, key)}>
                                <Menu.Item key="Reviewed" icon={<FileTextOutlined />}>Mark Reviewed</Menu.Item>
                                <Menu.Item key="Interview" icon={<CheckCircleOutlined />}>Invite to Interview</Menu.Item>
                                <Menu.Item key="Selected" icon={<CheckCircleOutlined />} style={{ color: 'green' }}>Select/Hire</Menu.Item>
                                <Menu.Item key="Rejected" icon={<CloseOutlined />} style={{ color: 'red' }}>Reject</Menu.Item>
                            </Menu>
                        } 
                        trigger={['click']}
                    >
                         <Button type="primary" size="small" style={{ backgroundColor: '#9333EA', border: 'none' }}>Change Status <DownOutlined /></Button>
                    </Dropdown>
                </span>
            )
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            {/* Header Box */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, #4F46E5, #007bff)', color: 'white', padding: '15px 25px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: 'white' }}>Applications for: {jobTitle}</h3>
                <Tag color="purple" style={{ fontSize: '1em' }}>{applications.length} Applicants</Tag>
            </div>
            
            <Card className="app-card-shadow" style={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={applications}
                    loading={loading}
                    pagination={{ pageSize: 5 }}
                    size="large"
                    scroll={{ x: 700 }}
                />
            </Card>

            {/* Modal for Applicant Profile Review (Simulated) */}
            <Modal
                title={`Reviewing: ${selectedApplicant?.jobSeekerName}`}
                visible={isProfileModalVisible}
                onCancel={() => setIsProfileModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsProfileModalVisible(false)}>Close</Button>
                ]}
            >
                {selectedApplicant ? (
                    <div>
                        <p><strong>Email:</strong> {selectedApplicant.jobSeekerEmail}</p>
                        <p><strong>Applied:</strong> {new Date(selectedApplicant.appliedDate).toLocaleDateString()}</p>
                        <hr/>
                        <p><strong>Cover Letter:</strong> {selectedApplicant.coverLetter}</p>
                        <p><strong>Key Skills:</strong> {selectedApplicant.keySkills}</p>
                        <p style={{marginTop: '15px', color: '#007bff'}}>*In a real application, a Resume PDF would be viewable here.</p>
                    </div>
                ) : (
                    <p>Loading profile details...</p>
                )}
            </Modal>
        </div>
    );
};

export default ApplicationsOverview;