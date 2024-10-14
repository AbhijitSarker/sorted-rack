import React, { useEffect, useState, useMemo, useContext } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import PaginationComponent from "../../../component/Pagination/Pagination";
import { axiosSecure } from "../../../api/axios";
import { Button, Row, Spinner } from "react-bootstrap";
import { HeaderContext } from "../../../contexts/HeaderContext";

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const { setHeaderText } = useContext(HeaderContext);

    useEffect(() => {
        setHeaderText('My Tickets');
    }, [setHeaderText]);

    const fetchMyTickets = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get('/ticket/myTickets', {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails &&
                        JSON.parse(localStorage.userDetails).token
                        }`,
                },
            });
            setTickets(response.data.tickets);
            setTotalItems(response.data.tickets.length);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            setError("Failed to fetch tickets. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const filtered = useMemo(() => {
        let filteredResult = tickets.sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        if (search) {
            filteredResult = filteredResult.filter((currentItem) =>
                currentItem.title.toLowerCase().includes(search.toLowerCase()) ||
                currentItem.category.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter) {
            filteredResult = filteredResult.filter(item => item.status === statusFilter);
        }

        if (priorityFilter) {
            filteredResult = filteredResult.filter(item => item.priority === priorityFilter);
        }

        setTotalItems(filteredResult.length);

        return filteredResult.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [currentPage, tickets, search, statusFilter, priorityFilter]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <Container className="all-tickets flex-grow-1">
            <Row className="filters d-flex py-4 align-items-center justify-content-between w-max">
                <Form.Group as={Col} md="3" controlId="searchFilter">
                    <Form.Control
                        onChange={handleSearch}
                        type="text"
                        placeholder="Search by title or category"
                    />
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="statusFilter">
                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Filter by Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="priorityFilter">
                    <Form.Select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                    >
                        <option value="">Filter by Priority</option>
                        <option value="Normal">Normal</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="createTicket">
                    <Link to="/createTicket" className="btn btn-primary w-100">
                        Create Ticket
                    </Link>
                </Form.Group>
            </Row>

            {loading && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

            {!loading && error && <p className="error-msg">{error}</p>}

            {totalItems > 0 && (
                <div className="ticket-table">
                    <Table hover bordered responsive>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item, index) => (
                                <tr key={index}>
                                    <td className="productName">{item.title}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <span className={`priority-badge ${item.priority.toLowerCase()}`}>
                                            {item.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                                    <td className="text-center">
                                        <Link to={`/ticket/${item._id}`} replace>
                                            <Button size="sm" variant="outline-primary">View Details</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
            {totalItems === 0 && !loading && (
                <p className="stock">You haven't created any tickets yet.</p>
            )}
            <div className="d-flex justify-content-end relative bottom-20 me-3">
                <PaginationComponent
                    total={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </Container>
    );
};

export default MyTickets;