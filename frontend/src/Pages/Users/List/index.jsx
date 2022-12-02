import React, { useEffect, useState, useMemo } from "react";
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
const ListUser = () => {
  const [response, error, loading, axiosFetch] = useAxios();
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
    <Container className="flex-grow-1">
      <div className="d-flex align-items-center justify-content-between">
        <div className="col-8">
          <h2 className="py-3">User Listing</h2>
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
            placeholder="Search with first name"
          />
        </Form.Group>
        <div style={{ width: "100px" }} className="col-1">
          <Link to="/user/add" replace className="btn btn-primary">
            Add User
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
      {!loading && error && <p classname="error-msg">{error}</p>}

      {totalItems && (
        <div className="user-table">
          <Table striped hover>
            <thead>
              <tr>
                <th>Status</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Type</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filtered?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      defaultChecked={item.status === "active" ? true : false}
                      onClick={() => handleStatusToggle(item)}
                    />
                  </td>
                  <td>{item.fname}</td>
                  <td>{item.lname}</td>
                  <td>{item.email}</td>
                  <td>{item.branch}</td>
                  <td>{item.role}</td>
                  <td className="text-center">
                    <OverlayTrigger
                      key={item._id}
                      placement="bottom"
                      overlay={
                        <Tooltip id={`tooltip-${item._id}`}>Edit User</Tooltip>
                      }
                    >
                      <Link to={`/user/edit/${item._id}`} replace>
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
          total={response?.user?.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </Container>
  );
};

export default ListUser;
