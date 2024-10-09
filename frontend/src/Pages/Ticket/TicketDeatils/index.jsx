import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [response, error, loading, axiosFetch] = useAxios();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [addingComment, setAddingComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);

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

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const response = await axiosSecure.get(`/comments/ticket/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails &&
                        JSON.parse(localStorage.userDetails).token
                        }`,
                },
            });
            setComments(response.data.comments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setCommentsLoading(false);
        }
    };

    useEffect(() => {
        fetchTicketDetails();
        fetchComments();
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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setAddingComment(true);
        try {
            await axiosSecure.post(
                '/comments',
                { content: newComment, ticketId: id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token
                            }`,
                    },
                }
            );
            setNewComment("");
            fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setAddingComment(false);
        }
    };

    const handleCommentEdit = async (commentId, newContent) => {
        setEditingCommentId(commentId);
        try {
            await axiosSecure.patch(
                `/comments/${commentId}`,
                { content: newContent },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token
                            }`,
                    },
                }
            );
            fetchComments();
        } catch (error) {
            console.error("Error editing comment:", error);
        } finally {
            setEditingCommentId(null);
        }
    };

    const handleCommentDelete = async (commentId) => {
        setDeletingCommentId(commentId);
        try {
            await axiosSecure.delete(
                `/comments/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token
                            }`,
                    },
                }
            );
            fetchComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
        } finally {
            setDeletingCommentId(null);
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
                            <p><strong>Created By:</strong> {`${ticket.createdBy.fname} ${ticket.createdBy.lname}` || 'Unknown'}</p>
                            <p><strong>Created At:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'Unknown'}</p>
                        </Col>
                        <Col md={6}>
                            <h3>Status: {ticket.status || ''}</h3>
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

            <h3 className="mt-4">Comments</h3>
            {
                comments.map((comment) => (
                    <Card key={comment._id} className="mb-3">
                        <Card.Body>
                            <p>{comment.content}</p>
                            <small>By: {comment.createdBy.fname} {comment.createdBy.lname} at {new Date(comment.createdAt).toLocaleString()}</small>
                            <div className="mt-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleCommentEdit(comment._id, prompt("Edit comment:", comment.content))}
                                    disabled={editingCommentId === comment._id}
                                >
                                    {editingCommentId === comment._id ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    ) : (
                                        'Edit'
                                    )}
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleCommentDelete(comment._id)}
                                    disabled={deletingCommentId === comment._id}
                                >
                                    {deletingCommentId === comment._id ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    ) : (
                                        'Delete'
                                    )}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            }

            <Form onSubmit={handleCommentSubmit} className="mt-4">
                <Form.Group controlId="newComment">
                    <Form.Label>Add a comment</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit" className="mt-2" disabled={addingComment}>
                    {addingComment ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="ms-2">Adding Comment...</span>
                        </>
                    ) : (
                        'Add Comment'
                    )}
                </Button>
            </Form>
        </Container>
    );
};

export default TicketDetails;