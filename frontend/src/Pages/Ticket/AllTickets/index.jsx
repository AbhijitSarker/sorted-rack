import React, { useEffect, useState, useMemo, useContext } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { axiosSecure } from "../../../api/axios";
import PaginationComponent from "../../../component/Pagination/Pagination";
import useAxios from "../../../Hooks/useAxios";
import { Button, Row, Spinner } from "react-bootstrap";
import { HeaderContext } from "../../../contexts/HeaderContext";
import '../allTickets.scss';


const AllTickets = () => {
  const [response, error, loading, axiosFetch] = useAxios();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { setHeaderText } = useContext(HeaderContext);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    setHeaderText('All Tickets');
  }, [setHeaderText]);

  useEffect(() => {
    // Fetch list of admins
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

    fetchAdmins();
  }, []);

  const handleAssign = async (ticketId, adminId) => {
    try {
      await axiosSecure.patch(`/ticket/${ticketId}/assign`, { adminId }, {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
        },
      });
      fetchTicketDetails(); // Refresh the ticket list
    } catch (error) {
      console.error("Error assigning ticket:", error);
    }
  };

  const fetchTicketDetails = async () => {
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: "/ticket",
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
  }, []);

  const handleStatusChange = async (ticket, newStatus) => {
    await axiosSecure.patch(
      `/ticket/${ticket._id}`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails &&
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

  const getStatusBadgeClass = (status) => {
    return `status-badge ${status.toLowerCase().replace(' ', '-')}`;
  };

  const getPriorityBadgeClass = (priority) => {
    return `priority-badge ${priority.toLowerCase()}`;
  };

  return (
    <Container className="all-tickets">
      <Row className="filters">
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
                <th>Created By</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Assign To</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((item, index) => (
                <tr key={index}>
                  <td className="productName">{item.title}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={getPriorityBadgeClass(item.priority)}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{`${item.createdBy?.fname} ${item.createdBy?.lname}`}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
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
                  <td>
                    <Form.Select
                      value={item.assignedTo || ''}
                      onChange={(e) => handleAssign(item._id, e.target.value)}
                    >
                      <option value="">Assign to...</option>
                      {Object.values(admins).map((admin) => (
                        <option key={admin._id} value={admin._id}>
                          {admin.fname} {admin.lname}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
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
      <PaginationComponent
        total={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Container>
  );
};

export default AllTickets;