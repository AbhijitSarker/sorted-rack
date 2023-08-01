import React, { useEffect, useState, useContext, useRef } from "react";
import { Container, Dropdown, Table, Form, OverlayTrigger, Tooltip, Row, Col, Button, FloatingLabel  } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
// import useAxios from "../../../Hooks/useAxios";
import "./listUser.scss";
import PaginationComponent from "../../../component/Pagination/Pagination";
import locations from "../../../constants/Locations.json";
import BranchContext  from "../../../contexts/BranchContext";


const ListUser = () => {
  const { branch, setBranch } = useContext(BranchContext);
  const currentPage = useRef(1);
  const selectedLocation = useRef('All');
  const [users, setUsers] = useState([]);
  const totalCount = useRef(0);

  useEffect(() => {
    setUsers([]);
    currentPage.current = 1;
    getUser();
  }, [branch]);



  async function getUser() {
    console.log(branch)
    const url = branch === "All" ? `user?page=${currentPage.current}` : `user?page=${currentPage.current}&branch=${branch}`;
    const { data } = await axiosSecure.get(url, {
      headers: {
        Authorization: `Bearer ${
          localStorage.userDetails && JSON.parse(localStorage.userDetails).token
        }`,
      },
    });
    setUsers(data.user);
    totalCount.current = data.totalCount;
  }

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
  };

  function handlePagination(page) {
    currentPage.current = page;
    getUser();
  }


  return(
    <Container>
      <Row>
        <Col sm={12} md={12} lg={12} xl={12}>
          <Container>
            <Row className="my-3">
              <Col sm={12} md={4} xl={4} className="d-flex align-items-center">
                <h3>USERS:</h3>
              </Col>
              <Col sm={12} md={4} xl={4} className="d-flex align-items-center">
                  <input type="text" placeholder="Enter username" className="w-100"/>
              </Col>
              <Col sm={12} md={2} xl={2} className="d-flex justify-content-center align-items-center">
                <Button variant="primary">ADD USER</Button>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12} xl={12}>
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
                  {
                    users.length > 0 && (
                    <tbody className="table-group-divider">
                      {
                        users.map((item, index) => (<tr key={index}>
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
                        </tr>))
                      }
                    </tbody>
                    )
                  }

                  {
                    users.length === 0 && (<tbody style={{backgroundColor: "#dddddd"}}><tr><td></td><td></td><td></td><td>No Data Available</td><td></td><td></td><td></td></tr></tbody>)
                  }
            </Table>
          </div>
        </Col>
        {
          users.length > 0 && (<Col className="d-flex justify-content-end w-100 my-2">
          <PaginationComponent
            total={totalCount.current}
            itemsPerPage={10}
            currentPage={currentPage.current}
            onPageChange={(page) => handlePagination(page)}
          />
        </Col>)
        }
      </Row>
    </Container>
  );

};

export default ListUser;
