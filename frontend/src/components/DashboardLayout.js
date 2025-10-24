import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaPlusSquare, FaBriefcase, FaBuilding, FaSearch, FaRegUserCircle } from 'react-icons/fa';
import { UserOutlined } from '@ant-design/icons';
import { Table, Tag, Button, Card, List, Avatar } from 'antd'; 
import axios from 'axios';

// Import local components (Ensure these files exist in src/components)
import JobForm from './JobForm';
import JobList from './JobList';
import ProfilePage from './ProfilePage'; 
import AppliedJobsList from './AppliedJobsList'; 
import ApplicationsOverview from './ApplicationsOverview'; 


// --- DUMMY DATA FOR EMPLOYER DASHBOARD WIDGETS ---
const jobManagementData = [
    { key: '1', title: 'DevOps Engineer', location: 'Amsterdam, NL', status: 'Active', applicants: 4, date: '5th 07 2025' },
    { key: '2', title: 'Financial Analyst', location: 'Mumbai, India', status: 'Active', applicants: 3, date: '5th 07 2025' },
    { key: '3', title: 'Sales Manager', location: 'Toronto, Canada', status: 'Active', applicants: 4, date: '5th 07 2025' },
];

const applicantData = [
    { name: 'David Jackson', title: 'Financial Analyst', time: '3 days ago' },
    { name: 'Michael Wilson', title: 'DevOps Engineer', time: '3 days ago' },
    { name: 'Jennifer Miller', title: 'Sales Manager', time: '3 days ago' },
];


// --- Application Fetching Component for the Employer Dashboard Card ---
const RecentApplicationsCard = ({ jobPostedStatus, employerId }) => {
    const [recentApplications, setRecentApplications] = useState(applicantData); // Use static data as stable default
    const [loading, setLoading] = useState(false);

    const fetchRecentApplications = async () => {
        setLoading(true);
        try {
            // NOTE: Replace the PLACEHOLDER_ID below with a real employer ID for a final test
            const PLACEHOLDER_EMPLOYER_ID_FOR_FETCH = employerId || "65b5d123456789abcde01234"; 

            const response = await axios.get(`http://localhost:5000/api/applications/employer/${PLACEHOLDER_EMPLOYER_ID_FOR_FETCH}`); 
            
            // Map the complex backend response to the simple frontend display format
            const dynamicList = response.data.map(app => ({
                name: app.jobSeeker ? app.jobSeeker.fullName : 'Applicant Name Missing',
                title: app.job.title, 
                time: new Date(app.appliedDate).toLocaleDateString(),
            }));
            
            setRecentApplications(dynamicList.slice(0, 3)); 
        } catch (error) {
            console.error("Failed to fetch real applications (Employer Dashboard):", error);
            // Fallback to the original static array if the API call fails
            setRecentApplications(applicantData); 
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (employerId) {
            fetchRecentApplications();
        }
    }, [jobPostedStatus, employerId]);


    return (
        <Card title="Recent Applications" extra={<a href="#">View all</a>} className="app-card-shadow" style={{ flex: 1, minWidth: '350px' }}>
            <List
                loading={loading}
                dataSource={recentApplications} 
                renderItem={applicant => (
                    <List.Item style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                        <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#4F46E5' }} />}
                            title={applicant.name}
                            description={<span style={{ color: '#666' }}>{applicant.title}</span>}
                        />
                        <span style={{ fontSize: '0.7em', color: '#888' }}>{applicant.time}</span>
                    </List.Item>
                )}
            />
         </Card>
    );
};


// --- 1. Employer Dashboard Content ---
const EmployerDashboardContent = ({ jobPostedStatus, onRefresh, userName, userEmail, userRole, setActiveTab, setSelectedJobId, setSelectedJobTitle, userId }) => {
    
    const EMPLOYER_ID_FOR_FETCH = userId; 


    return (
        <div className="main-content-body">
            {/* WIDGETS */}
            <div className="widgets-container">
                <div className="widget widget-active-jobs app-card-shadow">Active Jobs<br/>3</div>
                <div className="widget widget-total-applicants app-card-shadow">Total Applicants<br/>11</div>
                <div className="widget widget-hired app-card-shadow">Hired<br/>3</div>
            </div>
            
            {/* RECENT POSTS AND APPLICATIONS */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                 <Card title="Recent Job Posts" extra={<a onClick={() => setActiveTab('manage-jobs')}>View all</a>} className="app-card-shadow" style={{ flex: 1, minWidth: '350px' }}>
                    <List
                        dataSource={jobManagementData} 
                        renderItem={job => (
                            <div key={job.key} style={{ marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }} 
                                onClick={() => { setSelectedJobId(job.key); setSelectedJobTitle(job.title); setActiveTab('applications-overview'); }}>
                                <h4 style={{margin: 0}}>{job.title}</h4>
                                <span style={{ fontSize: '0.8em', color: '#666' }}>{job.location} - {job.date}</span>
                                <Tag color="green" style={{ float: 'right' }}>Active</Tag>
                            </div>
                        )}
                    />
                 </Card>
                 
                 {/* CRITICAL FIX: Recent Applications Card - Using the dynamic component */}
                 <RecentApplicationsCard jobPostedStatus={jobPostedStatus} employerId={EMPLOYER_ID_FOR_FETCH} />
            </div>
        </div>
    );
};


// --- 2. Job Seeker Dashboard Content (Simpler view) ---
const JobSeekerDashboardContent = ({ jobPostedStatus, onRefresh, userName, userEmail, userRole }) => (
    <div className="main-content-body">
        <div className="widgets-container">
            <div className="widget widget-active-jobs app-card-shadow">Jobs Applied<br/>3</div>
            <div className="widget widget-total-applicants app-card-shadow">Interviews<br/>2</div>
            <div className="widget widget-hired app-card-shadow">Saved Jobs<br/>8</div>
        </div>
        
         <Card title="Suggested Job Matches" className="app-card-shadow" style={{ minWidth: '350px' }}>
            <p>This section will dynamically list job matches based on the user's profile.</p>
            {/* JobList component renders the actual jobs - CRITICAL FIX PROPS */}
            <JobList jobPostedStatus={jobPostedStatus} onJobDeleted={onRefresh} userName={userName} userEmail={userEmail} userRole={userRole} /> 
         </Card>
    </div>
);


// Helper component for navigation links
const LinkTab = ({ icon: Icon, label, tab, activeTab, setActiveTab }) => (
    <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); setActiveTab(tab); }} 
        className={activeTab === tab ? 'active' : ''}
    >
        <Icon /><span>{label}</span>
    </a>
);


// The main component managing the sidebar and content views
const DashboardLayout = ({ jobPostedStatus, onRefresh, userRole, userName, userEmail, userId }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedJobTitle, setSelectedJobTitle] = useState(null);


    // --- Conditional Content Rendering Function ---
    const renderContent = () => {
        if (activeTab === 'applications-overview') {
            return (
                <ApplicationsOverview
                    jobId={selectedJobId}
                    jobTitle={selectedJobTitle}
                    setActiveTab={setActiveTab} // Allows back button functionality
                />
            );
        } else if (activeTab === 'dashboard') {
            // Passing setters to EmployerDashboardContent for navigation
            return userRole === 'Employer' ? (
                <EmployerDashboardContent 
                    jobPostedStatus={jobPostedStatus} 
                    onRefresh={onRefresh} 
                    setActiveTab={setActiveTab} 
                    setSelectedJobId={setSelectedJobId} 
                    setSelectedJobTitle={setSelectedJobTitle}
                    userId={userId} // Passing the current user's MongoDB ID
                />
            ) : (
                <JobSeekerDashboardContent jobPostedStatus={jobPostedStatus} onRefresh={onRefresh} userName={userName} userEmail={userEmail} userRole={userRole} />
            );
        } else if (activeTab === 'post-job' && userRole === 'Employer') {
            return (
                <div className="app-card-shadow" style={{ padding: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Post a New Job</h3>
                    <JobForm onJobPosted={onRefresh} userId={userId} />
                </div>
            );
        } else if (activeTab === 'manage-jobs' && userRole === 'Employer') {
            return (
                <div className="app-card-shadow" style={{ padding: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Job Management Table</h3>
                    <JobList jobPostedStatus={jobPostedStatus} onJobDeleted={onRefresh} userName={userName} userEmail={userEmail} userRole={userRole} />
                </div>
            );
        } else if (activeTab === 'profile' || activeTab === 'my-profile') {
            return <ProfilePage userRole={userRole} userName={userName} userEmail={userEmail} />;
        } else if (activeTab === 'find-jobs' && userRole === 'Job Seeker') {
             return (
                 <div className="app-card-shadow" style={{ padding: '20px' }}>
                     <h3>Find Available Jobs</h3>
                     <p>All current job listings suitable for your profile.</p>
                     <JobList jobPostedStatus={jobPostedStatus} onJobDeleted={onRefresh} userName={userName} userEmail={userEmail} userRole={userRole} />
                 </div>
             );
        } else if (activeTab === 'applied-jobs' && userRole === 'Job Seeker') {
             return (
                 <div className="app-card-shadow" style={{ padding: '20px' }}>
                     <h3>Jobs You Have Applied For</h3>
                     <p>This list shows the status of all your applications.</p>
                     <AppliedJobsList userName={userName} userEmail={userEmail} userRole={userRole} /> 
                 </div>
             );
        }
        return <div style={{padding: '50px', textAlign: 'center'}}><h3>Access Denied or Page Not Found.</h3><p>Please use the links in the sidebar.</p></div>;
    };
    
    // User Profile Stub (Now uses dynamic data)
    const UserProfile = () => (
        <div style={{ padding: '0 30px 20px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
             <div style={{ margin: '10px auto', backgroundColor: '#007bff', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.5em' }}>
                {/* Displays the first initial of the user's name */}
                {userName ? userName[0].toUpperCase() : userRole[0].toUpperCase()}
            </div>
            {/* Displays the actual user name */}
            <p style={{ margin: 0, fontWeight: 'bold' }}>{userName || 'User'}</p> 
            <span style={{ color: '#888', fontSize: '0.9em' }}>{userRole} Role</span>
        </div>
    );

    // Dynamic links based on user role
    const links = [
        { icon: FaTachometerAlt, label: "Dashboard", tab: "dashboard" },
    ];
    
    if (userRole === 'Employer') {
        links.push(
            { icon: FaPlusSquare, label: "Post Job", tab: "post-job" },
            { icon: FaBriefcase, label: "Manage Jobs", tab: "manage-jobs" },
            { icon: FaBuilding, label: "Company Profile", tab: "profile" }
        );
    } else if (userRole === 'Job Seeker') {
         links.push(
            { icon: FaSearch, label: "Find Jobs", tab: "find-jobs" },
            { icon: FaBriefcase, label: "Applied Jobs", tab: "applied-jobs" },
            { icon: FaRegUserCircle, label: "My Profile", tab: "profile" }
        );
    }


    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <h3 style={{ padding: '0 20px', marginBottom: '20px' }}>HireHub</h3>
                <UserProfile />

                <div className="sidebar-nav">
                    {links.map(link => (
                        <LinkTab 
                            key={link.tab} 
                            icon={link.icon} 
                            label={link.label} 
                            tab={link.tab} 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                        />
                    ))}
                </div>
            </div>

            <div className="main-content">
                <div className="welcome-header">
                    <h2>Welcome back, {userName || userRole}!</h2>
                    <p>Here's what's happening with your jobs today.</p>
                </div>
                
                {renderContent()}
            </div>
        </div>
    );
};

export default DashboardLayout;