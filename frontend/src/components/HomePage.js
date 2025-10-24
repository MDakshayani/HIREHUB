import React, { useState } from 'react';
import { Button } from 'antd';
import { 
    SearchOutlined, ArrowRightOutlined, UserOutlined, RiseOutlined, 
    SolutionOutlined, ProfileOutlined, TeamOutlined, CloudUploadOutlined,
    BarChartOutlined, DollarOutlined 
} from '@ant-design/icons';
// Note: FaCommentAlt is used instead of FaMessage for compatibility
import { FaSearch, FaRegFileAlt, FaCommentAlt, FaChartBar, FaCheckCircle, FaUserTie } from 'react-icons/fa'; 

const HomePage = ({ onLoginClick, setCurrentPage }) => {
    // State to control which feature set is currently visible
    const [activeFeatureTab, setActiveFeatureTab] = useState('seeker');

    // Styling for the outer container that holds the feature cards (matches the App.css .feature-grid styling)
    const featureGridContainerStyle = {
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '30px', 
        backgroundColor: '#f8fbfd',
        borderRadius: '16px',
        border: '1px solid #e0e6eb',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.05)',
        position: 'relative'
    };

    // --- Dynamic Statistics (Adjusted for a Project Scale) ---
    const statData = [
        { icon: <UserOutlined />, count: "250+", label: "Active Recruiters" },
        { icon: <SolutionOutlined />, count: "80+", label: "Companies Onboard" },
        { icon: <ProfileOutlined />, count: "1.2K+", label: "Job Listings" },
    ];

    // --- Feature Data ---
    const featureDataJobSeeker = [
        { icon: <FaSearch />, title: "Smart Job Matching", description: "AI-powered algorithm matches you with relevant opportunities based on your skills and preferences." },
        { icon: <FaRegFileAlt />, title: "Resume Builder", description: "Create professional resumes with our intuitive builder and templates designed by experts." },
        { icon: <FaCommentAlt />, title: "Direct Communication", description: "Connect directly with hiring managers and recruiters through our secure messaging platform." }, 
    ];

    const featureDataEmployer = [
        { icon: <FaUserTie />, title: "Talent Pool Access", description: "Access our vast database of pre-screened candidates and find the perfect fit for your team." },
        { icon: <FaChartBar />, title: "Analytics Dashboard", description: "Track your hiring performance with detailed analytics and insights on candidate engagement." },
        { icon: <FaCheckCircle />, title: "Verified Candidates", description: "All candidates undergo background verification to ensure you’re hiring trustworthy professionals." },
    ];

    const analyticsStats = [
        { count: "250K+", label: "Platform Visits", change: "+15%" },
        { count: "5K+", label: "Applications Sent", change: "+22%" },
        { count: "500+", label: "Successful Hires", change: "+18%" },
        { count: "90%", label: "User Satisfaction", change: "+8%" },
    ];

    const handleButtonClick = (target) => {
        if (target === 'find') {
            setCurrentPage('dashboard');
        } else {
            onLoginClick(); 
        }
    };
    
    // Styling for the CTA buttons
    const ctaButtonStyle = { 
        height: '55px', 
        padding: '0 30px', 
        borderRadius: '10px', 
        boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)' 
    };

    return (
        <div style={{ overflowX: 'hidden' }}>
            {/* --- Hero Section --- */}
            <div className="homepage-hero">
                <div style={{ maxWidth: '900px', margin: '0 auto' }}> 
                    <h1 style={{ fontSize: '4.5em', marginBottom: '20px', lineHeight: '1.1', color: 'white' }}>
                        Find Your Dream Job or <br/><span>Perfect Hire</span>
                    </h1>
                    <p style={{ fontSize: '1.4em', maxWidth: '800px', margin: '0 auto 50px', fontWeight: '500' }}>
                        Connecting top talent with innovative companies. Your next opportunity starts now.
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <Button 
                            className="app-gradient-btn" 
                            size="large" 
                            icon={<SearchOutlined />} 
                            onClick={() => handleButtonClick('find')} 
                            style={ctaButtonStyle}
                        >
                            Find Jobs <ArrowRightOutlined style={{marginLeft: '8px'}}/>
                        </Button>
                        
                        <Button 
                            className="app-secondary-btn" 
                            size="large" 
                            icon={<CloudUploadOutlined />}
                            onClick={() => handleButtonClick('post')} 
                            style={{ ...ctaButtonStyle, color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.4)' }}
                        >
                            Post a Job
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- Stats Bar (Underneath the Hero) --- */}
            <div className="stats-bar app-card-shadow" >
                {statData.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <div style={{ fontSize: '3em', color: '#4F46E5', marginBottom: '10px' }}>{stat.icon}</div>
                        <div className="count">{stat.count}</div>
                        <div className="label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* --- Everything You Need to Succeed (Feature Blocks) --- */}
            <div className="feature-section">
                <h2 style={{ fontSize: '2.8em', fontWeight: '800', marginBottom: '15px' }}>
                    Everything You Need to <span style={{ background: 'linear-gradient(90deg, #4F46E5 0%, #9333EA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Succeed</span>
                </h2>
                <p style={{ fontSize: '1.1em', color: '#666', maxWidth: '900px', margin: '0 auto 50px' }}>
                    Whether you're looking for your next opportunity or the perfect candidate, we have the tools and features to make it happen.
                </p>

                {/* --- Clickable Tabs for Feature Switching --- */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                    <h3 
                        onClick={() => setActiveFeatureTab('seeker')}
                        style={{ fontSize: '1.8em', fontWeight: '700', paddingBottom: '10px', cursor: 'pointer', color: activeFeatureTab === 'seeker' ? '#4F46E5' : '#9da3af', borderBottom: activeFeatureTab === 'seeker' ? '3px solid #4F46E5' : '3px solid transparent', transition: 'all 0.3s' }}
                    >
                        For Job Seekers
                    </h3>
                    <h3 
                        onClick={() => setActiveFeatureTab('employer')}
                        style={{ fontSize: '1.8em', fontWeight: '700', paddingBottom: '10px', cursor: 'pointer', color: activeFeatureTab === 'employer' ? '#9333EA' : '#9da3af', borderBottom: activeFeatureTab === 'employer' ? '3px solid #9333EA' : '3px solid transparent', transition: 'all 0.3s' }}
                    >
                        For Employers
                    </h3>
                </div>

                {/* --- Feature Grid: The final, clean structure --- */}
                <div style={featureGridContainerStyle}>
                    
                    {/* Render Job Seeker Features */}
                    {activeFeatureTab === 'seeker' && (
                        // FIX: Directly apply the grid to the map wrapper
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '30px',
                            width: '100%',
                            // Added padding to ensure content is not touching the edges
                            padding: '10px 0', 
                        }}>
                            {featureDataJobSeeker.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    {feature.icon}
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Render Employer Features */}
                    {activeFeatureTab === 'employer' && (
                        // FIX: Directly apply the grid to the map wrapper
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '30px',
                            width: '100%',
                            padding: '10px 0', 
                        }}>
                            {featureDataEmployer.map((feature, index) => (
                                <div key={index} className="feature-item" style={{backgroundColor: '#fff7ff', borderColor: '#ffe0ff'}}>
                                    {feature.icon}
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* The conflicting divider line is now structurally removed */}
                </div>
            </div>

            {/* --- Platform Analytics Section --- */}
            <div className="feature-section" style={{backgroundColor: '#f0f2f5', marginBottom: '0'}}>
                <h2 style={{ fontSize: '2.8em', fontWeight: '800', marginBottom: '15px' }}>
                    Platform Analytics
                </h2>
                <p style={{ fontSize: '1.1em', color: '#666', maxWidth: '900px', margin: '0 auto 50px' }}>
                    Real-time insights and data-driven results that showcase the power of our platform.
                </p>

                <div className="feature-grid">
                    {analyticsStats.map((stat, index) => (
                        <div key={index} className="app-card-shadow" style={{ padding: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                {/* Icons for the stats (Placeholder) */}
                                {index === 0 && <UserOutlined style={{ fontSize: '2.2em', color: '#4F46E5' }} />}
                                {index === 1 && <CloudUploadOutlined style={{ fontSize: '2.2em', color: '#10B981' }} />}
                                {index === 2 && <RiseOutlined style={{ fontSize: '2.2em', color: '#9333EA' }} />}
                                {index === 3 && <BarChartOutlined style={{ fontSize: '2.2em', color: '#F59E0B' }} />}
                                <span style={{ color: index % 2 === 0 ? '#10B981' : '#F59E0B', fontWeight: 'bold' }}>{stat.change}</span>
                            </div>
                            <h3 style={{ fontSize: '2em', fontWeight: '800', margin: '0' }}>{stat.count}</h3>
                            <p style={{ color: '#666', fontSize: '1.1em', margin: '5px 0 0 0' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- Footer --- */}
            <div className className="app-footer">
                <h3 style={{ fontSize: '1.8em', marginBottom: '15px' }}>HireHub</h3>
                <p>Connecting talented professionals with innovative companies worldwide. Your career success is our mission.</p>
                <small>© 2025 HireHub. All rights reserved.</small>
            </div>
        </div>
    );
};

export default HomePage;