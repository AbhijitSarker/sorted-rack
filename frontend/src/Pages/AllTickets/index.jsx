import React, { useEffect, useState, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { axiosSecure } from "../../api/axios";
import PaginationComponent from "../../component/Pagination/Pagination";
import useAxios from "../../Hooks/useAxios";
import { Button, Row } from "react-bootstrap";

const AllTickets = () => {
  const [response, error, loading, axiosFetch] = useAxios();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchTicketDetails = async () => {
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: "/ticket",
      requestConfig: [
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token
            }`,
          },
        },
      ],
    });
  };

  useEffect(() => {
    fetchTicketDetails();
  }, []);

  const handleStatusChange = async (ticket, newStatus) => {
    await axiosSecure.patch(
      `/ticket/${ticket._id}`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.userDetails &&
            JSON.parse(localStorage.userDetails).token
          }`,
        },
      }
    );
    fetchTicketDetails();
  };

  const filtered = useMemo(() => {
    let filteredResult = response?.tickets?.sort((a, b) =>
      a.title.localeCompare(b.title)
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

    setTotalItems(filteredResult?.length);

    return filteredResult?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, response, search, statusFilter, priorityFilter]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Container className="flex-grow-1">
      <div className="d-flex align-items-center justify-content-between">
        <div className="col-8">
          <h2 className="py-3">Ticket Listing</h2>
        </div>
        <div style={{ width: "100px" }} className="col-1">
          <Link to="/createTicket" replace className="btn btn-primary">
            Create Ticket
          </Link>
        </div>
      </div>
      <Row className="mb-3">
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
          </Form.Select>
        </Form.Group>
      </Row>
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
                <th>Created By</th>
                <th>Created At</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filtered?.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.priority}</td>
                  <td>
                    <Form.Select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item, e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </Form.Select>
                  </td>
                  <td>{`${item.createdBy.fname} ${item.createdBy.lname}`}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <Link to={`/ticket/${item._id}`} replace>
                      <Button variant="primary">View Details </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
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

export default AllTickets;