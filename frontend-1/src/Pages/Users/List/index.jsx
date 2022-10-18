import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import { BiEdit } from "react-icons/bi";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import "./listUser.scss";
const ListUser = () => {
  const [response, error, loading, axiosFetch] = useAxios();
  const [searchedUsers, setSearchedUsers] = useState([]);

  const fetchUserDetails = async () => {
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: "/user",
      requestConfig: [
        {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
          },
        },
      ],
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    setSearchedUsers(response?.user);
  }, [response]);

  const handleStatusToggle = async (user) => {
    await axiosSecure.patch(
      `/user/updateuser/${user._id}`,
      {
        ...user,
        status: user.status === "active" ? "inactive" : "active",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
        },
      }
    );
    fetchUserDetails();
  };

  const handleSearch = (e) => {
    const result = response.user.filter((user) => user.fname.toLowerCase().includes(e.target.value));
    setSearchedUsers(result);
  };

  return (
    <Container className="flex-grow-1">
      <div className="d-flex align-items-center justify-content-between">
        <div className="col-9">
          <h2 className="py-3">User Listing</h2>
        </div>
        <Form.Group as={Col} md="2" className="pe-3" controlId="validationCustom01">
          <Form.Control onChange={handleSearch} type="text" placeholder="Search User" />
        </Form.Group>
        <div className="col-1">
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
      {searchedUsers?.length > 0 && (
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
            {searchedUsers?.map((item, index) => (
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
                        <Tooltip id={`tooltip-${item._id}`}>
                          Edit User
                        </Tooltip>
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
      )}
    </Container>
  );
};

export default ListUser;
