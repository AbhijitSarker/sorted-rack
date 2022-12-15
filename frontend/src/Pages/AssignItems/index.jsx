import React, { useRef, useState, useEffect, useMemo } from "react";
import { BsGear } from 'react-icons/bs';
import { BiCheckCircle } from "react-icons/bi";
import { Form, Table, Toast, Container, Dropdown, Col } from "react-bootstrap";
import { axiosSecure } from "../../api/axios";
import PaginationComponent from "../../component/Pagination/Pagination";
import Columns from "../../constants/AssigmentColumns.json";

const AssignItem = () => {
  const [columns, setColumns] = useState(Columns);
  const [assignedDeviceUserList, setAssignedDeviceUserList] = useState([]);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
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
      filteredResult = filteredResult.filter((result) => result.userFname.toLowerCase().includes(search.toLowerCase()));
    }
    return filteredResult?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, assignedDeviceUserList, search]);

  const handlerCheckbox = (e) => {
    const checkboxStatus = e.target.checked;
    const name = e.target.name;
    const updatedColumns = columns.length > 0  && columns.map((column) => {
      if (column.name === name) {
        column.show = !column.show;
      }
      return column;
    });
    setColumns(updatedColumns);
    setTimeout(() => (document.querySelectorAll(`input[name=${name}]`)[0].checked = checkboxStatus), 500);
  };

  return (
    <Container>
      <div className="d-flex align-items-center justify-content-between">
        <div className="col-9">
          <h2 className="py-3">Assigned Devices</h2>
        </div>
        <Form.Group as={Col} md="2" className="pe-3" controlId="validationCustom01">
          <Form.Control onChange={handleSearch} type="text" placeholder="Search devices" />
        </Form.Group>
      </div>

      <div className="d-flex justify-content-end">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic" className="table-column-btn">
            <BsGear />
          </Dropdown.Toggle>
          <Dropdown.Menu className="table-column-filter">
            {columns.slice(5).map((column, index) => (
              <Dropdown.Item key={index}>
                <input type="checkbox" name={column.name} onChange={handlerCheckbox} checked={column.show} />
                <label>&nbsp;{column.fieldName}</label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
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
        <Table striped hover responsive>
          <thead>
            <tr>
              {columns.length > 0  && columns.map(({ id, fieldName, name, show }) => (
                <th id={name} className={`${show ? "show" : "hide"} `} key={id}>
                  {fieldName}
                </th>
              ))}

              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {filtered.map((item, index) => {
              return (
                <tr key={index}>
                  {columns.length > 0  && columns.map(({ fieldName, name, show }) => (
                    <td id={name} className={`${show ? "show" : "hide"} `}>
                      {item[name] || "---"}
                    </td>
                  ))}
                  <td id="actions" className="text-center">
                    <i
                      className="bi bi-person-dash-fill px-1"
                      title="Un Assign"
                      onClick={() => handleUnassignment(item._id)}
                    ></i>
                  </td>

                  {/* <td id="firstName">{item.userFname}</td>
                  <td id="lastName">{item.userLname}</td>
                  <td id="email">{item.userEmail}</td>
                  <td id="productType">{item.productType}</td>
                  <td id="assignedBy">{item.assignBy}</td>
                  <td id="assignedOn">{getDate(item.assignDate)}</td>
                  <td id="userName">{item.userName || "---"}</td>
                  <td id="productCategory">{item.productCategory || "---"}</td>
                  <td id="systemName">{item.systemName || "---"}</td>
                  <td id="systemModel">{item.systemModel || "---"}</td>
                  <td id="systemBrand">{item.systemBrand || "---"}</td>
                  <td id="cpu">{item.cpu || "---"}</td>
                  <td id="ram">{item.ram || "---"}</td>
                  <td id="storageCapacity">{item.storageCapacity || "---"}</td>
                  <td id="os">{item.os || "---"}</td>
                  <td id="macAddress">{item.macAddress || "---"}</td>
                  <td id="productKey">{item.productKey || "---"}</td>
                  <td id="serialNumber">{item.serialNumber || "---"}</td>
                  <td id="storageType">{item.storageType || "---"}</td>
                  <td id="productKey">{item.productKey || "---"}</td> */}
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
