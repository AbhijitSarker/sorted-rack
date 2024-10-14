import React, { useEffect, useState, useMemo, useContext } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import "./listUser.scss";
import PaginationComponent from "../../../component/Pagination/Pagination";
import { HeaderContext } from "../../../contexts/HeaderContext";
import { Row, Spinner } from "react-bootstrap";
import { Button } from "antd";

const ListUser = () => {
  const [response, error, loading, axiosFetch] = useAxios();
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { setHeaderText } = useContext(HeaderContext);

  useEffect(() => {
    setHeaderText('User Listing');
  }, [setHeaderText]);

  const fetchUserDetails = async () => {
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: "/user",
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
     fetchUserDetails();
  }, []);

  const handleStatusToggle = async (user) => {
    await axiosSecure.patch(
      `/user/updateuser/${user._id}`,
      {
        ...user,
        status: user.status === "active" ? "inactive" : "active",
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
    fetchUserDetails();
  };
  const filtered = useMemo(() => {
    let filteredResult = response?.user?.sort((a, b) =>
      a.fname.localeCompare(b.fname)
    );
    setTotalItems(filteredResult?.length);

    if (search) {
      filteredResult = filteredResult.filter((currentItem) =>
        currentItem.fname.toLowerCase().includes(search.toLowerCase()) || currentItem.username.toLowerCase().includes(search.toLowerCase())
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
    <Container className="user-management">
      <Row className="user-filters">
        <Form.Group as={Col} md="3" controlId="userSearchFilter">
          <Form.Control
            onChange={handleSearch}
            type="text"
            placeholder="Search with name"
          />
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="createUser">
          <Link to="/user/add" className="btn btn-primary w-100">
            Add User
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
        <div className="user-table-container">
          <Table hover bordered responsive>
            <thead>
              <tr>
                <th>Status</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Role</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center user-status-switch">
                    <Form.Check
                      type="switch"
                      id={`user-status-switch-${item._id}`}
                      defaultChecked={item.status === "active"}
                      onChange={() => handleStatusToggle(item)}
                    />
                  </td>
                  <td className="user-name">{item.fname}</td>
                  <td className="user-name">{item.lname}</td>
                  <td >{item.email}</td>
                  <td>{item.branch}</td>
                  <td>
                    <span className={`role-badge ${item.role.toLowerCase()}`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="text-center">
                    <Link to={`/user/edit/${item._id}`} replace>
                      <Button size="sm" variant="outline-primary">Edit User</Button>
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

export default ListUser;
