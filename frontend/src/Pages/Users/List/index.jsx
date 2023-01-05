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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [userList, setUserList] = useState(null);
  const [totalUserCount, setTotalUserCount] = useState(0);

  const fetchUserDetails = async (page) => {
    const response = await axiosSecure.get(`/user?page=${page}`);
    setUserList(response?.data?.user);
    setTotalUserCount(response?.data?.nbhits);
    setLoading(false);
  };

  const handleStatusToggle = async (user) => {
    const updatedStatus = { ...user, status: user.status === "active" ? "inactive" : "active" };
    await axiosSecure.patch(`/user/updateuser/${user._id}`, updatedStatus);
    fetchUserDetails(currentPage);
  };

  const handlePagination = (page) => {
    fetchUserDetails(page);
    setCurrentPage(page);
  };

  const handleSearch = (evt) => {
    const username = evt.target.value.toString();
    const url = username ? `/user?username=${username}` : `/user?page=1`;
    (async () => {
          const response = await axiosSecure.get(url);
          setUserList(response?.data?.user);
          setTotalUserCount(response?.data?.nbhits);
        })();
  };

  useEffect(() => {
    fetchUserDetails(currentPage);
  }, []);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Container className="flex-grow-1">
          <div className="d-flex align-items-center justify-content-between">
            <div className="col-8">
              <h2 className="py-3">User Listing</h2>
            </div>
            <Form.Group as={Col} md="3" className="pe-3" controlId="validationCustom01">
              <Form.Control onChange={handleSearch} type="text" placeholder="Search with username" />
            </Form.Group>
            <div style={{ width: "100px" }} className="col-1">
              <Link to="/user/add" replace className="btn btn-primary">
                Add User
              </Link>
            </div>
          </div>
          {userList?.length > 0 && (
            <div className="user-table">
              <Table striped hover responsive>
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
                  {!loading &&
                    userList.map((item, index) => (
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
                            overlay={<Tooltip id={`tooltip-${item._id}`}>Edit User</Tooltip>}
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
          <div className="d-flex justify-content-end relative bottom-20 me-3 mt-3 ">
            <PaginationComponent
              total={totalUserCount}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={(page) => handlePagination(page)}
            />
          </div>
        </Container>
      )}
    </>
  );

};

export default ListUser;
