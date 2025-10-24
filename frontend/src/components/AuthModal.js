import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUser, FaRegUserCircle, FaBriefcase } from 'react-icons/fa'; 
import { CheckCircleOutlined, LoadingOutlined, MailOutlined } from '@ant-design/icons'; // Added MailOutlined
import { Button, Form, Input, Upload, message } from 'antd'; // Ant Design Components

const API_URL = 'http://localhost:5000/api/users';

const AuthModal = ({ onClose, onLoginSuccess }) => {
    const [isRegister, setIsRegister] = useState(false);
    // Setting role to null initially forces the user to make a selection
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: null }); 
    const [status, setStatus] = useState('form'); 
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        
        // 1. Primary Client-Side Validation
        if (!formData.email || !formData.password || (isRegister && (!formData.fullName || !formData.role))) {
            setMessage('Error: Please fill in all required fields and select a Role.');
            return; 
        }

        setMessage('');
        setStatus('loading'); 
        
        const endpoint = isRegister ? `${API_URL}/register` : `${API_URL}/login`;
        
       try {
            const res = await axios.post(endpoint, formData);
            
            // 💡 CRITICAL FIX: Destructure userId from the response data
            const { fullName, role, email, userId } = res.data; 

            // SUCCESS FLOW: Show success screen
            setStatus('success');
            
            // Wait 1.5 seconds, then perform the final redirect
            setTimeout(() => {
                // PASS ALL CRITICAL VALUES: role, fullName, email, AND userId
                onLoginSuccess(role, fullName, email, userId); 
            }, 1500);
            
        }catch (error) {
            const errMessage = error.response?.data?.error || 'Server is offline or database connection failed.';
            setMessage(`Error: ${errMessage}`);
            setStatus('form'); 
        }
    };

    // Styling helpers
    const inputWrapperStyle = { position: 'relative', margin: '15px 0' };
    const iconStyle = { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-55%)', color: '#999' };
    const buttonStyle = { width: '100%', padding: '15px', background: 'linear-gradient(45deg, #4F46E5, #9333EA)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1em', cursor: 'pointer' };

    // --- RENDER FUNCTIONS ---
    
    // Renders the Success Screen (Matches screenshot)
    const RenderSuccessScreen = () => (
        <div style={{ padding: '30px', textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: '60px', color: '#10B981', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.8em', marginBottom: '10px', fontWeight: '800' }}>Welcome Back!</h3>
            <p style={{ color: '#666', fontSize: '1.1em' }}>You have been successfully logged in.</p>
            <LoadingOutlined style={{ fontSize: '30px', color: '#007bff', marginTop: '20px' }} />
            <p style={{ color: '#666', marginTop: '10px' }}>Redirecting to your dashboard...</p>
        </div>
    );

    const RenderForm = () => (
        <>
            <h3 style={{ fontSize: '1.7em', marginBottom: '5px', fontWeight: '800' }}>{isRegister ? "Create Account" : "Welcome Back"}</h3>
            <p style={{ color: '#666', marginBottom: '30px', fontSize: '1em' }}>{isRegister ? "Join thousands of professionals finding their dream jobs" : "Sign in to your JobPortal account"}</p>
            
            <form onSubmit={handleAuth}>
                {isRegister && (
                    <div style={inputWrapperStyle}>
                        <FaUser style={iconStyle} />
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name *" className="app-input" style={{ paddingLeft: '45px' }} />
                    </div>
                )}
                <div style={inputWrapperStyle}>
                    <FaEnvelope style={iconStyle} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address *" className="app-input" style={{ paddingLeft: '45px' }} />
                </div>
                <div style={inputWrapperStyle}>
                    <FaLock style={iconStyle} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password *" className="app-input" style={{ paddingLeft: '45px' }} />
                </div>
                
                {/* Optional Profile Picture Field */}
                {isRegister && (
                    <div style={{ textAlign: 'left', marginBottom: '15px', color: '#666' }}>
                        <p style={{ margin: 0, fontSize: '0.9em' }}>Profile Picture (Optional)</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <FaRegUserCircle style={{ fontSize: '30px', color: '#999' }} />
                           <Button style={{ border: '1px solid #ccc', borderRadius: '8px', fontWeight: '500' }}>Upload Photo</Button>
                           <span style={{ fontSize: '0.8em', color: '#999' }}>JPG, PNG up to 5MB</span>
                        </div>
                    </div>
                )}


                {isRegister && (
                    <div style={{ marginBottom: '20px', marginTop: '10px' }}>
                        <h4 style={{textAlign: 'left', margin: '0 0 10px 0'}}>I am a *</h4>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <RoleButton role="Job Seeker" currentRole={formData.role} setRole={(role) => setFormData(f => ({ ...f, role }))} />
                            <RoleButton role="Employer" currentRole={formData.role} setRole={(role) => setFormData(f => ({ ...f, role }))} />
                        </div>
                    </div>
                )}
                
                <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>
                <button type="submit" style={buttonStyle}>
                    {isRegister ? "Create Account" : "Sign In"}
                </button>

                {/* Link to switch between forms */}
                <p 
                    onClick={() => { setIsRegister(p => !p); setStatus('form'); setMessage(''); }} 
                    style={{ cursor: 'pointer', color: '#007bff', marginTop: '20px', fontSize: '0.9em' }}
                >
                    {isRegister ? "Already have an account? Sign in here" : "Don't have an account? Create one here"}
                </p>
            </form>
        </>
    );

    // --- MAIN RENDER ---
    const contentMap = {
        'form': RenderForm(),
        'loading': <LoadingOutlined style={{ fontSize: '60px', color: '#4F46E5', padding: '50px' }} />,
        'success': RenderSuccessScreen()
    };

    return (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', 
            alignItems: 'center', zIndex: 1000 
        }}>
          <div className="app-card-shadow" style={{ 
              padding: status === 'loading' ? '30px' : '40px', 
              borderRadius: '15px', 
              textAlign: 'center', 
              maxWidth: '450px', 
              width: '90%',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              position: 'relative'
          }}>
            {status !== 'loading' && (
                <button 
                    onClick={onClose} 
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.8em', cursor: 'pointer', color: '#999' }}
                >
                    &times;
                </button>
            )}
            
            {contentMap[status]}
            
          </div>
        </div>
    );
};

// Helper component for role selection buttons
const RoleButton = ({ role, currentRole, setRole }) => {
    const isActive = currentRole === role;
    const icon = role === 'Job Seeker' ? <FaRegUserCircle style={{ fontSize: '24px', marginBottom: '5px' }}/> : <FaBriefcase style={{ fontSize: '24px', marginBottom: '5px' }}/>;
    
    return (
        <button 
            type="button" 
            onClick={() => setRole(role)} 
            style={{ 
                padding: '15px 25px', 
                backgroundColor: isActive ? '#e6f7ff' : 'white', 
                border: isActive ? '2px solid #4F46E5' : '1px solid #ccc', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                flex: 1, // Makes buttons equal width
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
            }}
        >
            {icon}
            {role}
            <span style={{ fontWeight: 'normal', fontSize: '0.8em', color: '#999' }}>
                {role === 'Job Seeker' ? "Looking for opportunities" : "Hiring talent"}
            </span>
        </button>
    );
};

export default AuthModal;