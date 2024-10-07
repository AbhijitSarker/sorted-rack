import React, { useEffect, useState, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { axiosSecure } from "../../api/axios";
import PaginationComponent from "../../component/Pagination/Pagination";
import useAxios from "../../Hooks/useAxios";

const AllTickets = () => {
  const [response, error, loading, axiosFetch] = useAxios();
  const [search, setSearch] = useState("");
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
    setTotalItems(filteredResult?.length);

    if (search) {
      filteredResult = filteredResult.filter((currentItem) =>
        currentItem.title.toLowerCase().includes(search.toLowerCase()) || 
        currentItem.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filteredResult?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, response, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Container className="flex-grow-1">
      <div className="d-flex align-items-center justify-content-between">
        <div className="col-8">
          <h2 className="py-3">Ticket Listing</h2>
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
        <div style={{ width: "100px" }} className="col-1">
          <Link to="/tickets/create" replace className="btn btn-primary">
            Create Ticket
          </Link>
        </div>
      </div>
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && error && <p className="error-msg">{error}</p>}

      {totalItems && (
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
                  <td>hello</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <OverlayTrigger
                      key={item._id}
                      placement="bottom"
                      overlay={
                        <Tooltip id={`tooltip-${item._id}`}>Edit Ticket</Tooltip>
                      }
                    >
                      <Link to={`/tickets/edit/${item._id}`} replace>
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <div className="d-flex justify-content-end relative bottom-20 me-3">
        <PaginationComponent
          total={response?.tickets?.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Container>
  );
};

export default AllTickets;