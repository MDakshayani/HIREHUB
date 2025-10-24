import React, { useState } from 'react';
import { Modal, Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';

// Ensure this URL is correct
const APPLICATION_URL = 'http://localhost:5000/api/applications'; 

const ApplicationModal = ({ visible, onCancel, onSuccess, jobTitle, jobId, userName, userEmail, userId }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Function to get fileList from Upload event
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onFinish = async (values) => {
        setLoading(true);
        
        // CRITICAL: Final check that required IDs are present
        if (!userId || !jobId) {
            message.error('Submission failed: User or Job ID is missing. Please log in or refresh.');
            setLoading(false);
            return;
        }

        try {
            // FIX: Manually inject disabled fields (fullName, email) into the payload
            const payload = {
                jobId: jobId,
                jobSeekerId: userId,
                // These come from props because the AntD Form disables them:
                fullName: userName,
                email: userEmail,
                coverLetter: values.coverLetter,
                
                // Get the name of the uploaded file
                resumeName: values.resume && values.resume[0] ? values.resume[0].name : 'resume_file_missing.pdf',
            };
            
            console.log("Submitting Payload:", payload); // Debugging line

            await axios.post(APPLICATION_URL, payload);

            message.success(`Application for ${jobTitle} submitted successfully!`);
            onSuccess();
            form.resetFields();
        } catch (error) {
            console.error('Application submission failed:', error.response?.data?.error || error.message);
            // This displays the specific validation error message from your backend
            message.error(error.response?.data?.error || 'Failed to submit application. Check server logs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<div style={{ fontWeight: 'bold' }}>Apply for: {jobTitle}</div>}
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ name: userName, email: userEmail }} 
            >
                <Form.Item label="Full Name" name="name" rules={[{ required: true }]} hasFeedback>
                    {/* Keep disabled to prevent modification, but we manually send the data */}
                    <Input prefix={<UserOutlined />} disabled={true} /> 
                </Form.Item>

                <Form.Item label="Email Address" name="email" rules={[{ required: true, type: 'email' }]} hasFeedback>
                    <Input prefix={<MailOutlined />} disabled={true} />
                </Form.Item>

                <Form.Item label="Cover Letter (Optional)" name="coverLetter">
                    <Input.TextArea rows={4} placeholder="Tell us why you're a good fit..." />
                </Form.Item>

                <Form.Item 
                    label="Upload Resume (PDF)" 
                    name="resume" 
                    valuePropName="fileList" 
                    getValueFromEvent={normFile} 
                    rules={[{ required: true, message: 'Please upload your resume.' }]}
                >
                    <Upload
                        // Setting beforeUpload to false prevents AntD from trying to upload immediately
                        beforeUpload={() => false} 
                        maxCount={1}
                        accept=".pdf"
                    >
                        <Button icon={<UploadOutlined />} style={{ borderRadius: '8px' }}>Select File</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        className="app-gradient-btn"
                        style={{ width: '100%', marginTop: '15px' }}
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ApplicationModal;

