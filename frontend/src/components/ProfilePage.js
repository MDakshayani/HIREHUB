import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserEdit, FaEnvelope, FaBuilding, FaLock, FaSave, FaTimes, FaUser } from 'react-icons/fa';
import { Avatar, Input, Button as AntButton, Form, message } from 'antd'; 
import { UserOutlined } from '@ant-design/icons';

// NOTE: In a real app, the user ID would be retrieved from global state (context/redux)
const PLACEHOLDER_USER_ID = "65b5d123456789abcde01234";
const API_URL_BASE = 'http://localhost:5000/api/users/';

const ProfilePage = ({ userRole, userName, userEmail }) => { 
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm(); // Ant Design Form instance hook

    // State to hold the data currently being edited, initialized with props
    const [editData, setEditData] = useState({ 
        fullName: userName, 
        email: userEmail,
        company: userRole === 'Employer' ? 'Placeholder Company Name' : '' 
    });
    
    const initial = userName ? userName[0].toUpperCase() : userRole[0].toUpperCase();

    // 💡 CRITICAL FIX: Synchronize local state and form fields when props change
    // This is required because AntD Form is rigid and needs explicit updates.
    useEffect(() => {
        const newEditData = {
            fullName: userName,
            email: userEmail,
            company: userRole === 'Employer' ? 'Placeholder Company Name' : ''
        };
        
        // 1. Update component state (for view mode)
        setEditData(newEditData);
        
        // 2. Update AntD Form instance (CRITICAL for pre-filling Edit Mode)
        form.setFieldsValue(newEditData);
        
    }, [userName, userEmail, userRole, form]);


    const detailStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #eee'
    };
    const iconStyle = {
        marginRight: '15px',
        color: '#4F46E5'
    };


    const handleUpdateSubmit = async (values) => { 
        setLoading(true);
        try {
            await axios.put(`${API_URL_BASE}${PLACEHOLDER_USER_ID}`, {
                fullName: values.fullName,
                email: values.email, 
            });

            message.success("Profile updated successfully!");
            
            // Update the component's internal state to reflect the saved changes
            setEditData(prev => ({ ...prev, fullName: values.fullName, email: values.email, company: values.company || prev.company }));
            
            setIsEditing(false); // Switch back to view mode
        } catch (error) {
            console.error('Profile update failed:', error.response?.data?.error);
            message.error(error.response?.data?.error || "Update failed. Server or email conflict.");
        } finally {
            setLoading(false);
        }
    };
    
    // --- RENDER LOGIC ---

    // 1. Render Edit Mode Form
    if (isEditing) {
        return (
            <div className="app-card-shadow" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '30px' }}>
                    <FaUserEdit style={{ marginRight: '10px' }} /> Edit Profile
                </h2>
                
                {/* Ant Design Form component */}
                <Form
                    form={form} // Pass the form instance here
                    layout="vertical"
                    onFinish={handleUpdateSubmit} 
                    initialValues={editData} // Used as initial data source
                >
                    
                    <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Please enter your name.' }]}>
                        <Input prefix={<FaUser />} className="app-input" />
                    </Form.Item>

                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email.' }]}>
                        <Input prefix={<FaEnvelope />} className="app-input" disabled /> 
                    </Form.Item>

                    {userRole === 'Employer' && (
                        <Form.Item label="Company Name" name="company">
                            <Input prefix={<FaBuilding />} className="app-input" />
                        </Form.Item>
                    )}
                    
                    <Form.Item label="Change Password" name="newPassword">
                        <Input.Password prefix={<FaLock />} className="app-input" placeholder="Leave blank to keep current password" />
                    </Form.Item>

                    <Form.Item style={{ marginTop: '30px', marginBottom: 0 }}>
                        <AntButton 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading} 
                            className="post-button" 
                            style={{ marginRight: '10px' }}
                        >
                            <FaSave /> Save Changes
                        </AntButton>
                        <AntButton onClick={() => setIsEditing(false)} className="app-secondary-btn">
                            <FaTimes /> Cancel
                        </AntButton>
                    </Form.Item>
                </Form>
            </div>
        );
    }
    
    // 2. Render View Mode (Default)
    return (
        <div className="app-card-shadow" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '30px' }}>
                <FaUserEdit style={{ marginRight: '10px' }} /> Account Profile
            </h2>
            
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                {/* Large Profile Initial */}
                <Avatar size={80} style={{ backgroundColor: '#4F46E5', fontSize: '3em', margin: '0 auto 15px' }}>{initial}</Avatar>
                <h3>{editData.fullName}</h3> 
                <span style={{ color: '#10B981', fontWeight: '600' }}>Role: {userRole}</span>
            </div>
            
            {/* Account Details Section */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                
                {/* Full Name Display */}
                <div style={detailStyle}>
                    <FaUserEdit style={iconStyle} />
                    <strong>Full Name:</strong> <span style={{ marginLeft: '10px', fontWeight: '500' }}>{editData.fullName}</span>
                </div>

                {/* Email Display (FIXED: Uses the prop) */}
                <div style={detailStyle}>
                    <FaEnvelope style={iconStyle} />
                    <strong>Email:</strong> <span style={{ marginLeft: '10px', fontWeight: '500' }}>{userEmail}</span>
                </div>
                
                {/* Password Placeholder */}
                <div style={detailStyle}>
                    <FaLock style={iconStyle} />
                    <strong>Password:</strong> <span style={{ marginLeft: '10px', fontWeight: '500' }}>***********</span>
                </div>
                
                {userRole === 'Employer' && (
                    <div style={{...detailStyle, borderBottom: 'none'}}>
                        <FaBuilding style={iconStyle} />
                        <strong>Company:</strong> <span style={{ marginLeft: '10px', fontWeight: '500' }}>{editData.company}</span>
                    </div>
                )}
            </div>

            <AntButton onClick={() => setIsEditing(true)} type="primary" className="edit-button" style={{ marginTop: '30px' }}>
                <FaUserEdit style={{marginRight: '5px'}}/> Update Profile
            </AntButton>
        </div>
    );
};

export default ProfilePage;