import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [response, error, loading, axiosFetch] = useAxios();
    const [ticket, setTicket] = useState(null);

    const fetchTicketDetails = async () => {
        axiosFetch({
            axiosInstance: axiosSecure,
            method: "GET",
            url: `/ticket/${id}`,
            requestConfig: [
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token
                            }`,
                    },
                },
            ],
        });
    };

    useEffect(() => {
        fetchTicketDetails();
    }, [id]);


    useEffect(() => {
        if (response?.ticket) {
            setTicket(response?.ticket);
        }
    }, [response]);

    const handleStatusChange = async (newStatus) => {
        try {
            await axiosSecure.patch(
                `/ticket/${id}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token
                            }`,
                    },
                }
            );
            fetchTicketDetails();
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="error-msg">{error}</p>;
    }

    if (!ticket) {
        return <p>No ticket found.</p>;
    }

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col>
                    <h2>Ticket Details</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Col>
            </Row>
            <Card>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>
                            <h4>{ticket.title}</h4>
                            <p><strong>Category:</strong> {ticket.category}</p>
                            <p><strong>Priority:</strong> {ticket.priority}</p>
                            <p><strong>Created By:</strong> {ticket.createdBy?.email || 'Unknown'}</p>
                            <p><strong>Created At:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown'}</p>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Status</strong></Form.Label>
                                <Form.Select
                                    value={ticket.status || ''}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h5>Description</h5>
                            <p>{ticket.description}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TicketDetails;