import React, { useState } from 'react';
import HomePage from './components/HomePage';
import DashboardLayout from './components/DashboardLayout';
import AuthModal from './components/AuthModal'; 
import './App.css'; 
import { Button, Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, RocketOutlined } from '@ant-design/icons';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [jobPosted, setJobPosted] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [userName, setUserName] = useState(null); 
  const [userEmail, setUserEmail] = useState(null); 
  // 💡 CRITICAL FIX: NEW STATE for MongoDB User ID
  const [userId, setUserId] = useState(null); 

  const handleRefresh = () => {
    setJobPosted(prev => !prev);
  };
  
  // FIX 1: Handler accepts and stores the userId
  const handleLoginSuccess = (role, fullName, email, userId) => { // ADD userId HERE
    setUserRole(role);
    setUserName(fullName); 
    setUserEmail(email); 
    setUserId(userId); // <--- Store the user's MongoDB ID
    setCurrentPage('dashboard');
    setShowRoleModal(false); 
  };
  
  const handleLogout = () => {
    setUserRole(null);
    setUserName(null);
    setUserEmail(null); 
    setUserId(null); // Clear userId on logout
    setCurrentPage('home');
  };


  // --- Header/Navigation Component (Fixed Height) ---
  const Header = () => {
    const userMenu = (
      <Menu>
        <Menu.Item key="profile" icon={<UserOutlined />}>
          <a onClick={() => { setCurrentPage('dashboard'); }}>Profile</a>
        </Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="app-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '10px 40px', 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RocketOutlined className="app-header-logo" /> 
          <h3 onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer', color: '#1a202c', margin: 0 }}>
            HireHub
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Button className="ant-btn-link" type="link" onClick={() => setCurrentPage('dashboard')}>
            Find Jobs
          </Button>
          
          <Button className="ant-btn-link" type="link" onClick={() => setShowRoleModal(true)}>
            For Employers
          </Button>
          
          {userRole ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{userName || userRole}</span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="link" onClick={() => setShowRoleModal(true)} style={{ color: '#555' }}>Login</Button>
              <Button 
                className="app-gradient-btn"
                onClick={() => setShowRoleModal(true)} 
                style={{ padding: '0 20px', borderRadius: '8px', height: '35px' }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };


  // --- Render Logic ---
  const renderPage = () => {
    if (currentPage === 'home') {
      return <HomePage onLoginClick={() => setShowRoleModal(true)} setCurrentPage={setCurrentPage} />;
    }
    
    if (currentPage === 'dashboard') {
      if (!userRole) { 
        return (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Access Denied</h2>
            <p>Please log in to view the Dashboard and manage jobs.</p>
            <Button 
                onClick={() => setShowRoleModal(true)} 
                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
                Log In Now
            </Button>
          </div>
        );
      }
      
      // FIX 2: Passing the userId prop down to DashboardLayout
      return <DashboardLayout jobPostedStatus={jobPosted} onRefresh={handleRefresh} userRole={userRole} userName={userName} userEmail={userEmail} userId={userId} />; 
    }
    return <h1>404 Page Not Found</h1>;
  };

  // --- Final Render ---
  return (
    <div className="App">
      <Header />
      <div style={{ minHeight: 'calc(100vh - 70px)' }}>
        {renderPage()}
      </div>
      {/* AuthModal is now correctly set up to pass fullName and email */}
      {showRoleModal && <AuthModal onClose={() => setShowRoleModal(false)} onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default App;