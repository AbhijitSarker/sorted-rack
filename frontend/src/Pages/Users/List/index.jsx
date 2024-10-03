import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import { Container, Dropdown, Table, Form, OverlayTrigger, Tooltip, Row, Col, Button, FloatingLabel } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import "./listUser.scss";
import PaginationComponent from "../../../component/Pagination/Pagination";
import locations from "../../../constants/Locations.json";
import BranchContext from "../../../contexts/BranchContext";

const ITEMS_PER_PAGE = 10; // Define this constant

const ListUser = () => {
  const { branch, setBranch } = useContext(BranchContext);
  const currentPage = useRef(1);
  
  const selectedLocation = useRef('All');
  const [users, setUsers] = useState([]);
  const totalCount = useRef(0);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // setUsers([]);
    currentPage.current = 1;
    getUser();
  }, [branch]);

  async function getUser() {
    setLoading(true);
    setError(null);
    try {
      console.log(branch);
      const url = branch === "All" ? `user?page=${currentPage.current}` : `user?page=${currentPage.current}&branch=${branch}`;
      const { data } = await axiosSecure.get(url, {
        headers: {
          Authorization: `Bearer ${
            localStorage.userDetails && JSON.parse(localStorage.userDetails).token
          }`,
        },
      });
      setResponse(data);
      setUsers(data?.users);
      totalCount.current = data?.totalCount;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const handleStatusToggle = async (user) => {
    try {
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
      getUser();
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = useMemo(() => {
    let filteredResult = response?.users?.sort((a, b) =>
      a.fname.localeCompare(b.fname)
    );
    setTotalItems(filteredResult?.length);

    if (search) {
      filteredResult = filteredResult?.filter((currentItem) =>
        currentItem.fname.toLowerCase().includes(search.toLowerCase()) || currentItem.username.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filteredResult?.slice(
      (currentPage.current - 1) * ITEMS_PER_PAGE,
      (currentPage.current - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage.current, response, search]);

  console.log("filtered data:", filtered);

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
                  <td>{item?.fname}</td>
                  <td>{item?.lname}</td>
                  <td>{item?.email}</td>
                  <td>{item?.branch}</td>
                  <td>{item?.role}</td>
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
          onPageChange={currentPage.current = 1}
        />
      </div>
    </Container>
  );

};

export default ListUser;
