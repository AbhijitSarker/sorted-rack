import React, { useEffect, useState, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import PaginationComponent from "../../../component/Pagination/Pagination";
import { axiosSecure } from "../../../api/axios";

const Archive = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const fetchArchivedTickets = async () => {
        try {
            setLoading(true);
            const response = await axiosSecure.get('/ticket/archive', {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails &&
                        JSON.parse(localStorage.userDetails).token
                        }`,
                },
            });
            setTickets(response?.data);
            setTotalItems(response.data.length);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching archived tickets:", error);
            setError("Failed to fetch archived tickets. Please try again.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchivedTickets();
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
        return filteredResult.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [currentPage, tickets, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    return (
        <Container className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between">
                <div className="col-8">
                    <h2 className="py-3">Archived Tickets</h2>
                </div>
                <Form.Group
                    as={Col}
                    md="3"
                    className="pe-3"
                    controlId="validationCustom01"
                >
                    <Form.Control
                        onChange={handleSearch}
                        type="text"
                        placeholder="Search by title or category"
                    />
                </Form.Group>
            </div>
            {loading && (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {!loading && error && <p className="error-msg">{error}</p>}

            {totalItems > 0 && (
                <div className="ticket-table">
                    <Table striped hover bordered responsive>
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
                        <tbody className="table-group-divider">
                            {filtered.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.title}</td>
                                    <td>{item.category}</td>
                                    <td>{item.priority}</td>
                                    <td>{item.status}</td>
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
                <p>There are no archived tickets.</p>
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

export default Archive;