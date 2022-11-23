import React, { useState, useEffect, useMemo } from "react";
import Container from "react-bootstrap/Container";
import { Form, Table, Toast } from "react-bootstrap";
import { axiosSecure } from "../../api/axios";
import { BiCheckCircle } from "react-icons/bi";
import Col from "react-bootstrap/Col";
import PaginationComponent from "../../component/Pagination/Pagination";
const AssignItem = () => {
  const [assignedDeviceUserList, setAssignedDeviceUserList] = useState([]);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [showToaster, setShowToaster] = useState(false);

  const getAssignedDeviceDetails = async () => {
    const response = await axiosSecure.get("/assignedProduct", {
      headers: {
        Authorization: `Bearer ${
          localStorage.userDetails && JSON.parse(localStorage.userDetails).token
        }`,
      },
    });

    setAssignedDeviceUserList(response?.data?.assignedDevices);
  };

  const getDate = (date) => {
    const newDate = new Date(date);
    const dt = newDate.getUTCDate();
    const month =
      newDate.getUTCMonth() + 1 === 13 ? 12 : newDate.getUTCMonth() + 1;
    const year = newDate.getUTCFullYear();
    return `${dt}-${month}-${year}`;
  };

  const handleUnassignment = async (assignedDeviceDocId) => {
    try {
      const response = await axiosSecure.patch(
        `assignedProduct/${assignedDeviceDocId}`,
        {
          product: assignedDeviceDocId,
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
      if (response?.status === 200) {
        setShowToaster(true);
        getAssignedDeviceDetails();
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    getAssignedDeviceDetails();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filtered = useMemo(() => {
    let filteredResult = assignedDeviceUserList;
    setTotalItems(filteredResult?.length);

    if (search) {
      filteredResult = filteredResult.filter((result) =>
        result.userFname.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filteredResult?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, assignedDeviceUserList, search]);

  return (
    <Container>
      <div className="d-flex align-items-center justify-content-between">
        <div className="col-9">
          <h2 className="py-3">Assigned Devices</h2>
        </div>
        <Form.Group
          as={Col}
          md="2"
          className="pe-3"
          controlId="validationCustom01"
        >
          <Form.Control
            onChange={handleSearch}
            type="text"
            placeholder="Search devices"
          />
        </Form.Group>
      </div>
      <Toast
        className="toaster-position"
        onClose={() => setShowToaster(!showToaster)}
        show={showToaster}
        delay={2000}
        autohide
      >
        <Toast.Header>
          <div className="info-container">
            <BiCheckCircle className="info-icon" />
            &nbsp;
          </div>
          <div className="toaster-title">
            <strong className="me-auto">Unassignment Successfull</strong>
          </div>
        </Toast.Header>
      </Toast>
      {filtered?.length > 0 ? (
        <Table striped hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Product Type</th>
              <th>Assigned By</th>
              <th>Date of Assignment</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {filtered.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.userFname}</td>
                  <td>{item.userLname}</td>
                  <td>{item.userEmail}</td>
                  <td>{item.productType}</td>
                  <td>{item.assignBy}</td>
                  <td>{getDate(item.assignDate)}</td>
                  <td className="text-center">
                    <i
                      className="bi bi-person-dash-fill px-1"
                      title="Un Assign"
                      onClick={() => handleUnassignment(item._id)}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <h4 className="ms-3 mt-3">no devices found....</h4>
      )}
      <div className="d-flex justify-content-end me-3">
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

export default AssignItem;
