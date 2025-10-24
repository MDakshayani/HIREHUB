import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Tag, Button, Input, Select, Dropdown, Menu } from 'antd';
import { SearchOutlined, EditOutlined, CloseOutlined, DeleteOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

// NOTE: This component receives the employer's ID to fetch only their jobs
const JobManagementTable = ({ employerId, onNewJobClick, jobPostedStatus }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Fetch data filtered by employerId
    const fetchEmployerJobs = async () => {
        setLoading(true);
        try {
            // CRITICAL: Filter jobs by the employer's ID
            const response = await axios.get(`http://localhost:5000/api/jobs?employerId=${employerId}`); 
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch employer jobs:", error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (employerId) {
            fetchEmployerJobs();
        }
    }, [employerId, jobPostedStatus]); // Refresh when component mounts or a job is posted

    // Dummy logic for status dropdown (Active/Closed)
    const statusMenu = (
        <Menu>
            <Menu.Item key="all">All Status</Menu.Item>
            <Menu.Item key="active">Active</Menu.Item>
            <Menu.Item key="closed">Closed</Menu.Item>
        </Menu>
    );

    // Ant Design Table Columns
    const columns = [
        { title: 'JOB TITLE', dataIndex: 'title', key: 'title', sorter: true, 
          render: (text, record) => (
            <div>
              <h4 style={{ margin: 0 }}>{text}</h4>
              <p style={{ fontSize: '0.8em', color: '#666' }}>{record.employerName || 'John Davis'}</p>
            </div>
          )
        },
        { title: 'STATUS', dataIndex: 'status', key: 'status', align: 'center', render: status => (
            <Tag color={status === 'Active' ? 'success' : 'default'} style={{ borderRadius: '12px', fontWeight: 'bold' }}>
                {status.toUpperCase()}
            </Tag>
        )},
        { title: 'APPLICANTS', dataIndex: 'applicants', key: 'applicants', align: 'center', 
          render: count => (
            <div style={{ cursor: 'pointer', color: '#4F46E5', fontWeight: 'bold' }}>
                <UserOutlined style={{ marginRight: '5px' }} />{count}
            </div>
          )
        },
        { title: 'ACTIONS', key: 'actions', render: (_, record) => (
            <span style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Button type="link" icon={<EditOutlined />} />
                <Button type="link" style={{ color: '#E53E3E' }} icon={<DeleteOutlined />} />
            </span>
        )},
    ];

    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading jobs...</p>;

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Job Management</h3>
                <Button type="primary" className="app-gradient-btn" icon={<PlusOutlined />} onClick={onNewJobClick}>
                    Add New Job
                </Button>
            </div>

            {/* Search and Filter Bar */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                <Input placeholder="Search jobs..." prefix={<SearchOutlined />} style={{ width: 300, borderRadius: 8 }} />
                
                <Dropdown overlay={statusMenu} trigger={['click']}>
                    <Button style={{ borderRadius: 8 }}>
                        All Status <DownOutlined />
                    </Button>
                </Dropdown>
                <span style={{ color: '#666' }}>Showing {jobs.length} of {jobs.length} jobs</span>
            </div>

            <Table 
                columns={columns} 
                dataSource={jobs.map(job => ({ ...job, key: job._id, status: 'Active', applicants: Math.floor(Math.random() * 5) + 1 }))} // Add dummy data for table
                pagination={{ pageSize: 5 }}
                scroll={{ x: 600 }}
            />
        </div>
    );
};

export default JobManagementTable;