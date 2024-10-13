import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Image, Spinner } from 'react-bootstrap';
import { axiosSecure } from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Toaster } from '../../../component/Toaster/Toaster';
import axios from 'axios';

const CreateTicket = () => {
    const [ticket, setTicket] = useState({
        title: '',
        description: '',
        priority: 'Low',
        category: '',
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [toasterMessage, setToasterMessage] = useState('');
    const [toasterBg, setToasterBg] = useState('success');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket(prevTicket => ({
            ...prevTicket,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const uploadPhoto = async () => {
        if (!photo) return null;

        const formData = new FormData();
        formData.append('image', photo);

        try {
            const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
                params: {
                    key: '4022bfc13f63c06160e674a6c8ee976a', 
                },
            });
            console.log(response.data.data.url);
            return response.data.data.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const photoUrl = await uploadPhoto();
            console.log('photo url:', photoUrl);
            const ticketData = { ...ticket, photoUrl };

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
            setPhoto(null);
            setPhotoPreview(null);
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
        <Container className="p-4" style={{ maxWidth: '900px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
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
                    <Form.Label style={{ fontWeight: '500' }}>Attach Photo</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handlePhotoChange}
                        accept="image/*"
                        style={{ padding: '10px', fontSize: '1rem' }}
                    />
                </Form.Group>

                {photoPreview && (
                    <div className="text-center">
                        <Image src={photoPreview} alt="Preview" thumbnail className="mt-2" style={{ maxWidth: '200px', borderRadius: '8px', border: '2px solid #007bff' }} />
                    </div>
                )}

                <div className="text-center mt-4">
                    <Button variant="primary" type="submit" disabled={loading} style={{ padding: '10px 20px', fontSize: '1.2rem' }}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Create Ticket'}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default CreateTicket;
