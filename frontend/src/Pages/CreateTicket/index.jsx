import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { axiosSecure } from '../../api/axios';

const CreateTicket = () => {
    const [ticket, setTicket] = useState({
        title: '',
        description: '',
        priority: 'Low',
        category: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTicket(prevTicket => ({
            ...prevTicket,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axiosSecure.post('/ticket', ticket, {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails &&
                        JSON.parse(localStorage.userDetails).token
                    }`,
                },
            });
            console.log('Ticket created:', response.data);
            setSuccess(true);
            setTicket({ title: '', description: '', priority: 'Normal', category: '' });
        } catch (error) {
            console.error("Error creating ticket:", error);
            setError("Failed to create ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container>
            <h2 className="my-4">Create New Ticket</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Ticket created successfully!</Alert>}
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={ticket.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                name="category"
                                value={ticket.category}
                                onChange={handleChange}
                                required
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
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={ticket.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Priority</Form.Label>
                    <Form.Control
                        as="select"
                        name="priority"
                        value={ticket.priority}
                        onChange={handleChange}
                    >
                        <option>Normal</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Ticket'}
                </Button>
            </Form>
        </Container>
    );
};

export default CreateTicket;