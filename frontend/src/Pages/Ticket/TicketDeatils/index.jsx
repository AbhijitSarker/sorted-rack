import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Spinner, Image, Badge } from "react-bootstrap";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import { HeaderContext } from "../../../contexts/HeaderContext";

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
    const { setHeaderText } = useContext(HeaderContext);

    useEffect(() => {
        setHeaderText('Ticket Details');
    }, [setHeaderText]);
    const fetchTicketDetails = async () => {
        axiosFetch({
            axiosInstance: axiosSecure,
            method: "GET",
            url: `/ticket/${id}`,
            requestConfig: [
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token}`,
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
                        JSON.parse(localStorage.userDetails).token}`,
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
                            JSON.parse(localStorage.userDetails).token}`,
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
                "/comments",
                { content: newComment, ticketId: id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.userDetails &&
                            JSON.parse(localStorage.userDetails).token}`,
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
                            JSON.parse(localStorage.userDetails).token}`,
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
            await axiosSecure.delete(`/comments/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails &&
                        JSON.parse(localStorage.userDetails).token}`,
                },
            });
            fetchComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
        } finally {
            setDeletingCommentId(null);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    if (error) {
        return <p className="text-danger">Error: {error}</p>;
    }

    if (!ticket) {
        return <p>No ticket found.</p>;
    }

    return (
        <Container className="py-4">
            <Row className="mb-4 justify-content-between align-items-center">
                <Col xs="auto">
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm">
                <Card.Body>
                    <Row className="mb-4">
                        
                        <Col md={9} className="">
                            <h4>{ticket.title}</h4>
                            <p>{ticket.description}</p>
                        </Col>

                        <Col md={3}>
                            
                            <Badge bg={ticket.priority === "Urgent" ? "danger" : "primary"} className="me-2">
                                {ticket.priority}
                            </Badge>
                            <Badge bg="secondary">{ticket.category}</Badge>
                            <p className="mt-2">
                                <strong>Created By:</strong> {`${ticket.createdBy?.fname} ${ticket.createdBy?.lname}` || "Unknown"}
                            </p>
                            <p><strong>Created At:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "Unknown"}</p>
                            <h3>Status: {ticket.status || ""}</h3>
                            <div></div>
                            <Button
                                variant="outline-danger"
                                onClick={() => handleStatusChange("Archived")}
                                className="mt-2 w-50 float-end"
                            >
                                Add to Archive
                            </Button>
                            <Form.Select
                                className="w-50 mt-2"
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </Form.Select>
                        </Col>
                    </Row>

                    {ticket.photoUrl && (
                        <Row className="mb-4">
                            <Col>
                                <h5>Attached Image</h5>
                                <Image src={ticket.photoUrl} alt="Ticket" fluid style={{ maxWidth: "400px" }} className="rounded shadow-sm" />
                            </Col>
                        </Row>
                    )}

                    
                </Card.Body>
            </Card>

            <h3 className="mt-5">Comments</h3>
            {comments.map((comment) => (
                <Card key={comment._id} className="mb-3 shadow-sm">
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
                                    "Edit"
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
                                    "Delete"
                                )}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}

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
                <Button type="submit" className="mt-3" disabled={addingComment}>
                    {addingComment ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="ms-2">Adding Comment...</span>
                        </>
                    ) : (
                        "Add Comment"
                    )}
                </Button>
            </Form>
        </Container>
    );
};

export default TicketDetails;
