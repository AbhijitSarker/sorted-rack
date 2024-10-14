import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdAssignmentInd } from "react-icons/md";
import { Link } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import Modal from "react-bootstrap/Modal";
import { Typeahead } from "react-bootstrap-typeahead";
import { convertDate } from "../../../Utility/utility";
import { StockContext } from "../../../contexts/StockContext";
import PaginationComponent from "../../../component/Pagination/Pagination";
import { Col, Form, Row } from "react-bootstrap";
import { Toaster } from "../../../component/Toaster/Toaster";
import { HeaderContext } from "../../../contexts/HeaderContext";
import './stockList.scss'
const deleteStock = (stockItemId) =>
  axiosSecure.delete(`/product/${stockItemId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token
        }`,
    },
  });

const ListStock = () => {
  const [showToaster, setShowToaster] = useState(false);
  const { deviceCategory, setDeviceCategory } = useContext(StockContext);
  const [response, error, loading, axiosFetch] = useAxios();
  const [devicesDetails, setDevicesDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showRemoveDeviceModal, setShowRemoveDeviceModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const userList = useRef([]);
  const [emailList, setEmailList] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState([]);
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const removeDeviceIdRef = useRef(null);
  const { setHeaderText } = useContext(HeaderContext);

  useEffect(() => {
    setHeaderText('Stock Listing');
  }, [setHeaderText]);

  const handleAssignmentModal = () =>
    setShowAssignmentModal(!showAssignmentModal);
  const handleRemoveDeviceModal = () => {
    setShowRemoveDeviceModal(!showRemoveDeviceModal);
    setCurrentPage(1);
  };

  const handleRemoveDevice = () => {
    setShowLoader(true);
    (async () => {
      const response = await deleteStock(removeDeviceIdRef.current);
      response && setShowLoader(false);
      handleRemoveDeviceModal();
      setRefresh(!refresh);
      setShowToaster(true);
    })();
  };

  const getAllStockDetails = () =>
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: "/product",
      requestConfig: [
        {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token
              }`,
          },
        },
      ],
    });

  const getAllUsers = async () => {
    const { data } = await axiosSecure.get("/user", {
      headers: {
        Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token
          }`,
      },
    });
    userList.current = data.user.filter(
      (usr) => usr.branch === "Goa" && usr.status === "active"
    );
    const usersEmail = userList.current.map((user) => user.email);
    setEmailList(usersEmail);
  };

  const handleUserSelection = (stockId) => {
    setSelectedUserEmail([]);
    setSelectedStockId(stockId);
    handleAssignmentModal();
  };

  const handleUserStockAssignment = async () => {
    const selectedUserId = userList.current.find(
      (user) => user.email === selectedUserEmail[0]
    )._id;

    setShowLoader(true);
    await axiosSecure.post(
      "/assignedProduct",
      {
        branch: "Goa",
        user: selectedUserId,
        product: selectedStockId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails &&
            JSON.parse(localStorage.userDetails).token
            }`,
        },
      }
    );
    setShowLoader(false);
    setRefresh(!refresh);
    handleAssignmentModal();
  };

  const handleProductCategorySelect = (evt) => {
    getAllStockDetails();
    setDeviceCategory(evt);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (response?.products?.length > 0) {
      const filteredResponse = response?.products?.filter(
        (product) =>
          product.tag === "notassigned" &&
          product.productCategory === deviceCategory
      );
      setDevicesDetails(filteredResponse);
    }
  }, [response]);

  const filtered = useMemo(() => {
    let filteredResult = devicesDetails;
    setTotalItems(devicesDetails?.length);

    if (search) {
      if (deviceCategory === "System") {
        filteredResult = filteredResult.filter((result) =>
          result.systemName.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        filteredResult = filteredResult.filter((result) =>
          result.accessoriesName.toLowerCase().includes(search.toLowerCase())
        );
      }
    }
    return filteredResult?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [currentPage, response, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getAllStockDetails();
    getAllUsers();
  }, [refresh, deviceCategory]);

  return (
    <Container className="stock-management">
      <Row className="stock-filters">
        <Form.Group as={Col} md="3" controlId="stockSearchFilter">
          <Form.Control
            onChange={handleSearch}
            type="text"
            placeholder={`Search ${deviceCategory}`}
          />
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="stockCategoryFilter">
          <DropdownButton
            id="dropdown-basic-button"
            title={deviceCategory}
            onSelect={handleProductCategorySelect}
          >
            <Dropdown.Item eventKey="System">System</Dropdown.Item>
            <Dropdown.Item eventKey="Accessories">Accessories</Dropdown.Item>
          </DropdownButton>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="addStock">
          <Link to="/stock/add" className="btn btn-primary w-100">
            Add {deviceCategory}
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
        <div className="stock-table-container">
          <Table hover bordered responsive>
            <thead>
              <tr>
                {deviceCategory === "System" ? (
                  <>
                    <th>System Name</th>
                    <th>System Brand</th>
                    <th>System Model</th>
                    <th>OS</th>
                    <th>CPU</th>
                    <th>RAM</th>
                    <th>Storage Type</th>
                    <th>Storage Capacity</th>
                    <th>MAC Address</th>
                    <th>Product Key</th>
                    <th>Serial Number</th>
                    <th>Date of Purchase</th>
                    <th>Warranty Period</th>
                  </>
                ) : (
                  <>
                    <th>Accessories Type</th>
                    <th>Accessories Name</th>
                    <th>Date of Purchase</th>
                    <th>Serial Number</th>
                    <th>Warranty</th>
                  </>
                )}
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((item, index) => (
                <tr key={index}>
                  {deviceCategory === "System" ? (
                    <>
                      <td className="stock-name">{item.systemName}</td>
                      <td>{item.systemBrand}</td>
                      <td>{item.systemModel}</td>
                      <td>{item.os}</td>
                      <td>{item.cpu}</td>
                      <td>{item.ram}</td>
                      <td>{item.storageType}</td>
                      <td>{item.storageCapacity}</td>
                      <td>{item.macAddress}</td>
                      <td>{item.productKey}</td>
                      <td>{item.serialNumber}</td>
                      <td>{convertDate(item.dateOfPurchase || "")}</td>
                      <td>{item.warrantyPeriod}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.productType}</td>
                      <td className="stock-name">{item.accessoriesName}</td>
                      <td>{convertDate(item.dateOfPurchase || "")}</td>
                      <td>{item.serialNumber}</td>
                      <td>{item.warrantyPeriod}</td>
                    </>
                  )}
                  <td className="text-center device-action">
                    <Link to={`/stock/edit/${item._id}`} className="btn btn-sm btn-outline-primary me-2">
                      Edit
                    </Link>
                    <Button variant="outline-danger" size="sm" className="me-2" onClick={() => {
                      handleRemoveDeviceModal();
                      removeDeviceIdRef.current = item._id;
                    }}>
                      Delete
                    </Button>
                    <Button variant="outline-info" size="sm" onClick={() => handleUserSelection(item._id)}>
                      Assign
                    </Button>
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
      <Modal
        show={showRemoveDeviceModal}
        onHide={handleRemoveDeviceModal}
        className={showLoader ? "on-loading" : ""}
      >
        {!showLoader ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Do you really want to delete these records? This process cannot
              be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleRemoveDeviceModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRemoveDevice}
                disabled={showLoader}
              >
                {showLoader ? <Spinner animation="grow" /> : "Delete"}
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <Spinner animation="grow" variant="danger" />
        )}
      </Modal>

      <Modal show={showAssignmentModal} onHide={handleAssignmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Please select the user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Typeahead
            id="basic-example"
            onChange={setSelectedUserEmail}
            options={emailList}
            placeholder="Choose user email.."
            selected={selectedUserEmail}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAssignmentModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={showLoader}
            onClick={handleUserStockAssignment}
          >
            {showLoader ? "Assigning..." : "Assign"}
          </Button>
        </Modal.Footer>
      </Modal>
     
</Container >

  );
};

export default ListStock;
