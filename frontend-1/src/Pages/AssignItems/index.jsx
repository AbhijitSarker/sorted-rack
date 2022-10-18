import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Table, Toast } from "react-bootstrap";
import { axiosSecure } from "../../api/axios";
import { BiCheckCircle } from "react-icons/bi";

const AssignItem = () => {
  const [assignedDeviceUserList, setAssignedDeviceUserList] = useState([]);
  const [showToaster, setShowToaster] = useState(false);


  const getAssignedDeviceDetails = async () => {
    const response = await axiosSecure.get("/assignedProduct", {
      headers: {
        Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
      },
    });

    setAssignedDeviceUserList(response?.data?.assignedDevices);
  };

  const getDate = (date) => {
    const newDate = new Date(date);
    const dt = newDate.getUTCDate();
    const month = newDate.getUTCMonth() + 1 === 13 ? 12 : newDate.getUTCMonth() + 1;
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
            Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
          },
        }
      );
      if (response?.status === 200) {
        setShowToaster(true);
        getAssignedDeviceDetails();
      }
    } catch (err) {
      alert(err)
    }

  };

  useEffect(() => {
    getAssignedDeviceDetails();
  }, []);

  return (
    <Container>
      <h2 className="py-3">Assigned Devices</h2>
      <Toast className="toaster-position" onClose={() => setShowToaster(!showToaster)} show={showToaster} delay={2000} autohide>
        <Toast.Header>
          <div className="info-container">
            <BiCheckCircle className="info-icon" />&nbsp;
          </div>
          <div className="toaster-title">
            <strong className="me-auto">Unassignment Successfull</strong>
          </div>
        </Toast.Header>
      </Toast>
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
          {assignedDeviceUserList.length > 0 &&
            assignedDeviceUserList.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.userFname}</td>
                  <td>{item.userLname}</td>
                  <td>{item.userEmail}</td>
                  <td>{item.productType}</td>
                  <td>{item.assignBy}</td>
                  <td>{getDate(item.assignDate)}</td>
                  <td className="text-center">
                    <i className="bi bi-person-dash-fill px-1" title="Un Assign" onClick={() => handleUnassignment(item._id)}></i>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container >
  );
};

export default AssignItem;
