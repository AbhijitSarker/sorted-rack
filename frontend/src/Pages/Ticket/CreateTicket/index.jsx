import React, { useContext, useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { axiosSecure } from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Toaster } from '../../../component/Toaster/Toaster';
import axios from 'axios';
import { HeaderContext } from '../../../contexts/HeaderContext';
import { Upload, Modal, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CreateTicket = () => {
    const [ticket, setTicket] = useState({
        title: '',
        description: '',
        priority: 'Low',
        category: '',
    });
    const [loading, setLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterBg, setToasterBg] = useState('success');
    const navigate = useNavigate();
    const { setHeaderText } = useContext(HeaderContext);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        setHeaderText('Create Ticket');
    }, [setHeaderText]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket(prevTicket => ({
            ...prevTicket,
            [name]: value
        }));
    };

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const handleFileChange = ({ fileList }) => setFileList(fileList);

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const uploadPhotos = async () => {
        if (fileList.length === 0) return [];

        const uploadedUrls = [];
        for (const file of fileList) {
            const formData = new FormData();
            formData.append('image', file.originFileObj);

            try {
                const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
                    params: {
                        key: '4022bfc13f63c06160e674a6c8ee976a',
                    },
                });
                uploadedUrls.push(response.data.data.url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const photoUrls = await uploadPhotos();
            const ticketData = { ...ticket, photoUrls };

            const response = await axiosSecure.post('/ticket', ticketData, {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails &&
                        JSON.parse(localStorage.userDetails).token
                        }`,
                },
            });
            setToasterMessage('Ticket created successfully!');
            setToasterBg('success');
            setShowToaster(true);
            setTicket({ title: '', description: '', priority: 'Normal', category: '' });
            setFileList([]);
        } catch (error) {
            console.error("Error creating ticket:", error);
            setToasterMessage("Failed to create ticket. Please try again.");
            setToasterBg('danger');
            setShowToaster(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="p-4 mt-5" style={{ maxWidth: '900px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Toaster
                title={toasterMessage}
                bg={toasterBg}
                showToaster={showToaster}
                setShowToaster={setShowToaster}
                to="myTickets"
            />
            <h2 className="my-4 text-center" style={{ fontWeight: 'bold', color: '#007bff' }}>Create New Ticket</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: '500' }}>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={ticket.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter ticket title"
                                style={{ borderColor: '#ced4da', padding: '10px', fontSize: '1rem' }}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: '500' }}>Category</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={ticket.category}
                                onChange={handleChange}
                                required
                                style={{ padding: '10px', fontSize: '1rem' }}
                            >
                                <option value="">Select a category</option>
                                <option value="Technical">Technical</option>
                                <option value="Billing">Billing</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Other">Other</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '500' }}>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={ticket.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe the issue or request"
                        style={{ padding: '10px', fontSize: '1rem', borderColor: '#ced4da' }}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '500' }}>Priority</Form.Label>
                    <Form.Control
                        as="select"
                        name="priority"
                        value={ticket.priority}
                        onChange={handleChange}
                        style={{ padding: '10px', fontSize: '1rem' }}
                    >
                        <option>Normal</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={{ fontWeight: '500' }}>Attach Photos</Form.Label>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleFileChange}
                            beforeUpload={() => false}
                        >
                            {fileList.length >= 8 ? null : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Space>
                </Form.Group>

                <div className="text-center mt-4">
                    <Button variant="primary" type="submit" disabled={loading} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Create Ticket'}
                    </Button>
                </div>
            </Form>

            <Modal width={800} visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Container>
    );
};

export default CreateTicket;