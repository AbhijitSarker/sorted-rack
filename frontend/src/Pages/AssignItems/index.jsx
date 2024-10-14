import React, { useRef, useState, useEffect, useMemo, useContext } from "react";
import { BsGear } from 'react-icons/bs';
import { BiCheckCircle } from "react-icons/bi";
import { Form, Table, Toast, Container, Dropdown, Col } from "react-bootstrap";
import { axiosSecure } from "../../api/axios";
import PaginationComponent from "../../component/Pagination/Pagination";
import Columns from "../../constants/AssigmentColumns.json";
import { HeaderContext } from "../../contexts/HeaderContext";
import { Button, Row } from "antd";
import './assignitems.scss';

const AssignItem = () => {
  const [columns, setColumns] = useState(Columns);
  const [assignedDeviceUserList, setAssignedDeviceUserList] = useState([]);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [showToaster, setShowToaster] = useState(false);
  const { setHeaderText } = useContext(HeaderContext);

  useEffect(() => {
    setHeaderText('Assigned Devices');
  }, [setHeaderText]);
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
    const updatedColumns = columns.length > 0 && columns.map((column) => {
      if (column.name === name) {
        column.show = !column.show;
      }
      return column;
    });
    setColumns(updatedColumns);
    setTimeout(() => (document.querySelectorAll(`input[name=${name}]`)[0].checked = checkboxStatus), 500);
  };

  return (
    <Container className="assigned-devices-management">
      <Row className="assigned-devices-filters">
        <Form.Group as={Col} md="3" controlId="assignedDevicesSearchFilter">
          <Form.Control
            onChange={handleSearch}
            type="text"
            placeholder="Search devices"
          />
        </Form.Group>
      </Row>

      {filtered?.length > 0 ? (
        <div className="assigned-devices-table-container">
          <Table hover bordered responsive>
            <thead>
              <tr>
                {columns.length > 0 && columns.map(({ id, fieldName, name, show }) => (
                  <th key={id} className={show ? "" : "d-none"}>
                    {fieldName}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item._id || index}>
                  {columns.length > 0 && columns.map(({ name, show }) => (
                    <td key={name} className={show ? "" : "d-none"}>
                      {item[name] || "---"}
                    </td>
                  ))}
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleUnassignment(item._id)}
                      title="Unassign"
                    >
                      Unassign
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="no-devices-message">No devices found.</p>
      )}
      <div className="d-flex justify-content-end mt-3">
        <PaginationComponent
          total={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <Toast
        className="unassignment-toast"
        onClose={() => setShowToaster(false)}
        show={showToaster}
        delay={2000}
        autohide
      >
        <Toast.Header>
          <BiCheckCircle className="me-2" />
          <strong className="me-auto">Unassignment Successful</strong>
        </Toast.Header>
      </Toast>
    </Container>
  );
};

export default AssignItem;

{/* <div className="d-flex align-items-center justify-content-between my-3">
        <Form.Group as={Col} md="2" className="pe-3" controlId="validationCustom01">
          <Form.Control onChange={handleSearch} type="text" placeholder="Search devices" />
        </Form.Group>
      </div> */}
{/* 
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
      </div> */}
