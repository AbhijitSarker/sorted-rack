import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Spinner, Image, Badge } from "react-bootstrap";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import { HeaderContext } from "../../../contexts/HeaderContext";
import { Divider, Modal } from "antd";
import "./TicketDetails.scss";

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
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [showArchiveConfirmation, setShowArchiveConfirmation] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [assignedAdmin, setAssignedAdmin] = useState(null);

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userRole = userDetails ? userDetails.role : null;

    const handleArchiveConfirmation = () => {
        setShowArchiveConfirmation(true);
    };

    const handleArchiveCancel = () => {
        setShowArchiveConfirmation(false);
    };

    const handleArchiveConfirm = async () => {
        setShowArchiveConfirmation(false);
        await handleStatusChange("Archived");
    };




    const handleImagePreview = (image, index) => {
        setPreviewImage(image);
        setPreviewTitle(`Image ${index + 1}`);
        setPreviewVisible(true);
    };

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

    const fetchAdmins = async () => {
        try {
          const response = await axiosSecure.get('/user/admins', {
            headers: {
              Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
            },
          });
          const adminMap = {};
          response.data.admins.forEach(admin => {
            adminMap[admin._id] = admin;
          });
          setAdmins(adminMap);
        } catch (error) {
          console.error("Error fetching admins:", error);
        }
      };

      useEffect(() => {
        fetchTicketDetails();
        fetchComments();
        if (userRole === 'superadmin') {
          fetchAdmins();
        }
      }, [id, userRole]);

      useEffect(() => {
        if (response?.ticket) {
          setTicket(response.ticket);
          const assignedAdminId = response.ticket.assignedTo;
          if (assignedAdminId && admins[assignedAdminId]) {
            setAssignedAdmin({
              id: assignedAdminId,
              name: `${admins[assignedAdminId].fname} ${admins[assignedAdminId].lname}`
            });
          } else {
            setAssignedAdmin(null);
          }
        }
      }, [response, admins]);

      const handleAssign = async (adminId) => {
        try {
          await axiosSecure.patch(`/ticket/${id}/assign`, { adminId }, {
            headers: {
              Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
            },
          });
          if (admins[adminId]) {
            setAssignedAdmin({
              id: adminId,
              name: `${admins[adminId].fname} ${admins[adminId].lname}`
            });
          }
          fetchTicketDetails();
        } catch (error) {
          console.error("Error assigning ticket:", error);
        }
      };

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

    if (error) {
        return <p className="text-danger">Error: {error}</p>;
    }

    if (!ticket) {
        return <p>No ticket found.</p>;
    }


    return (
        <Container className="ticket-details">
            <Row>
                <Col md={8}>
                    <Card className="ticket-card mb-4">
                        <Card.Body style={{minHeight: '500px'}}>
                            <h4 className="ticket-title">{ticket.title}</h4>
                            <p className="ticket-description">{ticket.description}</p>

                            {ticket.photoUrls && ticket.photoUrls.length > 0 && (
                                <div className="attached-images">
                                    <h5>Attached Images</h5>
                                    <Row>
                                        {ticket.photoUrls.map((photoUrl, index) => (
                                            <Col key={index} xs={6} md={4} className="mb-3">
                                                <Image
                                                    src={photoUrl}
                                                    alt={`Ticket Image ${index + 1}`}
                                                    fluid
                                                    className="rounded shadow-sm"
                                                    onClick={() => handleImagePreview(photoUrl, index)}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="ticket-meta-card mb-4">
                        <Card.Body>
                            <Badge bg={ticket.priority === "Urgent" ? "danger" : "primary"} className="me-2">
                                {ticket.priority}
                            </Badge>
                            <Badge bg="secondary">{ticket.category}</Badge>
                            <p className="ticket-meta mt-2"><strong>Created By:</strong> {`${ticket.createdBy?.fname} ${ticket.createdBy?.lname}` || "Unknown"}</p>
                            <p className="ticket-meta"><strong>Created At:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "Unknown"}</p>
                            <p className="ticket-meta">
                                <strong>Assigned To:</strong> {assignedAdmin ? assignedAdmin.name : "Not Assigned"}
                            </p>
                            <h3 className="ticket-status">Status: {ticket.status || ""}</h3>

                            {userRole !== "user" && ticket.status !== 'Archived' && (
                                <div className="status-actions">
                                    <Button variant="outline-danger" onClick={handleArchiveConfirmation} className="w-100 mb-4">
                                        Archive
                                    </Button>
                                    <Form.Label>Update Status</Form.Label>
                                    <Form.Select value={ticket.status} onChange={(e) => handleStatusChange(e.target.value)} className="w-100 mt-0">
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </Form.Select>

                                </div>
                            )}
                            
                            {userRole === 'superadmin' && ticket.status !== 'Archived' && (
                                <div className="assign-admin mt-4">
                                    <Form.Label>Assign to Admin</Form.Label>
                                    <Form.Select
                                        value={assignedAdmin?.id || ''}
                                        onChange={(e) => handleAssign(e.target.value)}
                                        className="mt-0"
                                    >
                                        <option value="">Select an admin</option>
                                        {Object.values(admins).map((admin) => (
                                            <option key={admin._id} value={admin._id}>
                                                {admin.fname} {admin.lname}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="comments-section">
                <Col>
                    <h3>Comments</h3>
                    {comments.map((comment) => (
                        <Card key={comment._id} className="comment-card mb-3">
                            <Card.Body>
                                <p className="comment-content">{comment.content}</p>
                                <small className="comment-meta">By: {comment.createdBy.fname} {comment.createdBy.lname} at {new Date(comment.createdAt).toLocaleString()}</small>
                                <div className="comment-actions">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleCommentEdit(comment._id, prompt("Edit comment:", comment.content))}
                                        disabled={editingCommentId === comment._id}
                                    >
                                        {editingCommentId === comment._id ? <Spinner as="span" animation="border" size="sm" /> : "Edit"}
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleCommentDelete(comment._id)}
                                        disabled={deletingCommentId === comment._id}
                                    >
                                        {deletingCommentId === comment._id ? <Spinner as="span" animation="border" size="sm" /> : "Delete"}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}

                    <Form onSubmit={handleCommentSubmit}>
                        <Form.Group controlId="comment">
                            <Form.Label>Add Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-3" disabled={addingComment}>
                            {addingComment ? <Spinner as="span" animation="border" size="sm" /> : "Submit"}
                        </Button>
                    </Form>
                </Col>
            </Row>

            {/* Image Preview Modal */}
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt={previewTitle} style={{ width: "100%" }} src={previewImage} />
            </Modal>

            {/* Archive Confirmation Modal */}
            <Modal
                visible={showArchiveConfirmation}
                title="Confirm Archive"
                onOk={handleArchiveConfirm}
                onCancel={handleArchiveCancel}
                okText="Yes, Archive"
                cancelText="Cancel"
            >
                <p>Are you sure you want to archive this ticket?</p>
            </Modal>
        </Container>
    );
};

export default TicketDetails;
