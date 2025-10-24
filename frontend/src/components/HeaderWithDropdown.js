// src/components/HeaderWithDropdown.js

// src/components/HeaderWithDropdown.js

import React from 'react';
// ⭐ FIX 1: Add Button to the Ant Design import list
import { Dropdown, Menu, Avatar, Button } from 'antd'; 
import { UserOutlined } from '@ant-design/icons';

// ... rest of the file ...

// This component receives the function to change the main layout's tab
const HeaderWithDropdown = ({ userName, userRole, setActiveTab, handleLogout }) => {
    
    // 1. Define the menu that appears when clicked
    const menu = (
        <Menu onClick={({ key }) => {
            if (key === 'profile') {
                // This changes the main content of the DashboardLayout
                setActiveTab('profile'); 
            } else if (key === 'logout') {
                handleLogout(); 
            }
        }}>
            {/* Displaying user name at the top of the menu is a nice touch */}
            <Menu.Item key="user-info" disabled style={{ fontWeight: 'bold' }}>
                {userName} ({userRole})
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="profile">
                Profile
            </Menu.Item>
            <Menu.Item key="logout">
                Logout
            </Menu.Item>
        </Menu>
    );

    // 2. Define the visible element that acts as the CLICKABLE TRIGGER
    const dropdownTrigger = (
        // ⭐ CRITICAL FIX: The trigger must be a single, interactive element
        <div 
            style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px' 
            }}
            // You can optionally add a button-like class here
            className="user-profile-trigger" 
        >
            <Avatar 
                size="large" 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#4F46E5' }} 
            />
            <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                {userName}
            </span>
        </div>
    );


   return (
        <div className="welcome-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', borderBottom: '1px solid #eee' }}>
            {/* Left side content */}
            <div>
                <h2>Welcome back, {userName || userRole}!</h2>
                <p>Here's what's happening with your jobs today.</p>
            </div>
            
            {/* ⭐ FINAL FIX: Use a simple Ant Button as the Dropdown Trigger */}
            <Dropdown overlay={menu} trigger={['click']}>
                <Button 
                    type="text" // Make it look non-button-like
                    style={{ height: 'auto', padding: 0, display: 'flex', alignItems: 'center', gap: '10px' }}
                    // This div must wrap everything you want to be clickable
                    onClick={(e) => e.preventDefault()} // Prevent default button action
                >
                    <Avatar 
                        size="large" 
                        icon={<UserOutlined />} 
                        style={{ backgroundColor: '#4F46E5' }} 
                    />
                    <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                        {userName}
                    </span>
                </Button>
            </Dropdown>
            {/* ------------------------------------------------------------------- */}
        </div>
    );
};

export default HeaderWithDropdown;