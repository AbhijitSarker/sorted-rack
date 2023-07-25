import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdAssignmentInd } from "react-icons/md";
import { Link } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import { Typeahead } from "react-bootstrap-typeahead";
import { convertDate } from "../../../Utility/utility";
import { StockContext } from "../../../contexts/StockContext";
import PaginationComponent from "../../../component/Pagination/Pagination";
import { Container, Row, Col, Form, Modal, Spinner, Table, Dropdown, DropdownButton, Button, Card, FloatingLabel, Stack } from "react-bootstrap";
import { Toaster } from "../../../component/Toaster/Toaster";
import BranchContext  from "../../../contexts/BranchContext";

const deleteStock = (stockItemId) =>
  axiosSecure.delete(`/product/${stockItemId}`, {
    headers: {
      Authorization: `Bearer ${
        localStorage.userDetails && JSON.parse(localStorage.userDetails).token
      }`,
    },
});

const ShowDeviceDetails = ({ filtered, handleRemoveDeviceModal, handleUserSelection, deviceCategory, removeDeviceIdRef }) => {
  return (<>
    {
      deviceCategory === "System" ? (
        <Table className="mt-4" striped hover>
          <thead>
            <tr>
              <th className="stock-brand">System Brand</th>
              <th className="stock-model">System Model</th>
              <th className="stock-name">System Name</th>
              <th className="stock-os">OS</th>
              <th className="stock-cpu">CPU</th>
              <th className="stock-ram">RAM</th>
              <th className="stock-capacity">Storage Capacity</th>
              <th className="stock-mac">MAC Address</th>
              <th className="stock-serial">Serial Number</th>
              <th className="stock-date">Date OF Purchase</th>
              <th className="stock-warranty">Warranty Period</th>
              <th className="text-center table-action">Action</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {
              filtered.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center">No Data Found</td>
              </tr>) :(
                <>
                {
                  filtered.map((item, index) => (
                    <tr key={index}>
                      <td className="stock-brand"> {item?.brand} </td>
                      <td className="stock-model"> {item.modal} </td>
                      <td className="stock-name"> {item.systemName} </td>
                      <td className="stock-os"> {item.os} </td>
                      <td className="stock-cpu"> {item.cpu} </td>
                      <td className="stock-ram"> {item.ram} </td>
                      <td className="stock-capacity"> {item.storageCapacity} </td>
                      <td className="stock-mac"> {item.macAddress} </td>
                      <td className="stock-serial"> {item.serialNumber} </td>
                      <td className="stock-date">
                        {convertDate(item.dop || "")}
                      </td>
                      <td className="stock-warranty"> {item.warrantyPeriod} </td>
                      <td className="text-center table-action">
                        <Link
                          to={`/stock/edit/${item._id}`}
                          title="Edit"
                          className="px-1"
                          replace
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                        <i
                          className="bi bi-trash-fill px-1"
                          title="Delete"
                          onClick={() => {
                            handleRemoveDeviceModal();
                            removeDeviceIdRef.current = item._id;
                          }}
                        ></i>
                        <i
                          title="Assign"
                          className="bi bi-person-check-fill px-1"
                          onClick={() => handleUserSelection(item._id)}
                        ></i>
                      </td>
                    </tr>
                  ))} 
                
                </>
              )
            }
          </tbody>
        </Table>
      ) : (
        <Table className="mt-4" striped hover>
          <thead>
            <tr>
              <th>Accessories Type</th>
              <th>Accessories Name</th>
              <th>Date Of Purchase</th>
              <th>Serial Number</th>
              <th>Warranty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {filtered.map((item, index) => (
              <tr key={index}>
                <td> {item?.productType} </td>
                <td> {item?.accessoriesName} </td>
                <td> {convertDate(item.dateOfPurchase || "")} </td>
                <td> {item.serialNumber} </td>
                <td> {item.warrantyPeriod} </td>
                <td>
                  <Link to={`/stock/edit/${item._id}`} replace>
                    <BiEdit />
                  </Link>
                  <AiFillDelete
                    onClick={() => {
                      handleRemoveDeviceModal();
                      removeDeviceIdRef.current = item._id;
                    }}
                  />
                  <MdAssignmentInd
                    onClick={() => handleUserSelection(item._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )
    }
  </>)
}

const ListStock = () => {  
  const { branch, setBranch } = useContext(BranchContext);
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
  const ITEMS_PER_PAGE = 5;
  const removeDeviceIdRef = useRef(null);
  const [advanceFilter, setAdvanceFilter] = useState({
    processor: [],
    ram: [],
  });
  const [updateData, setUpdateData] = useState(false);

  function advanceFilterHandler(event) {
    debugger
    const { name, value } = event.target;
    const checkbox = event.target;
    const label = document.querySelector(`label[for=${checkbox.id}]`);
    const labelContent = label.textContent;
    if (checkbox.checked) {
      if(name === "processor-filter") {
        setAdvanceFilter({...advanceFilter, processor: [...advanceFilter.processor, labelContent]})
      } 
      if(name === "ram-filter") {
        setAdvanceFilter({...advanceFilter, ram: [...advanceFilter.ram, labelContent]})
      }

    } else {
      debugger
      if(name === "processor-filter") {
        setAdvanceFilter({...advanceFilter, processor: advanceFilter.processor.filter((item) => item !== labelContent)})
      } 
      if(name === "ram-filter") {
        setAdvanceFilter({...advanceFilter, ram: advanceFilter.ram.filter((item) => item !== labelContent)})
      }
    }

    setUpdateData(value => !value)
  }

  useEffect(() => {
    let filteredData = [];
    if(advanceFilter.ram.length > 0) {
      filteredData = devicesDetails.filter((item) => {
        if(advanceFilter.ram.includes(item.ram.replace(/\s/g, ""))) {
          return item;
        }
      });
      setDevicesDetails(filteredData);
    } else {
      getAllStockDetails();
    }

  }, [updateData])

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
            Authorization: `Bearer ${
              localStorage.userDetails &&
              JSON.parse(localStorage.userDetails).token
            }`,
          },
        },
      ],
    });

  const getAllUsers = async () => {
    const { data } = await axiosSecure.get("/user", {
      headers: {
        Authorization: `Bearer ${
          localStorage.userDetails && JSON.parse(localStorage.userDetails).token
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
          Authorization: `Bearer ${
            localStorage.userDetails &&
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
      const products = response?.products;
      let filteredProducts = [...products];
      if(branch !== "All") {
        filteredProducts = products.filter((product) => product.branch.toLowerCase() === branch.toLowerCase())
      }
      setDevicesDetails(filteredProducts);
    }
  }, [response, branch]);

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
    <div className="flex-grow-1 mt-3 h-100 w-100 px-4">
      <div className="d-flex align-items-center justify-content-between">
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
      </div>

      <Stack direction="horizontal" className="justify-content-between mb-4">
        <h2>Stock Listing</h2>
        <Stack direction="horizontal" gap={2}>
          <FloatingLabel controlId="searchFloatingInput" label="Search" className="m-0 primary-custom-btn">
            <Form.Control type="text" placeholder="Search System" style={{ minHeight: "50px", maxHeight: "50px" }} />
          </FloatingLabel>
          <DropdownButton
            id="dropdown-basic-button"
            className="primary-custom-btn m-0"
            title={deviceCategory}
            onSelect={handleProductCategorySelect}
          >
            <Dropdown.Item eventKey="System">System</Dropdown.Item>
            <Dropdown.Item eventKey="Accessories">Accessories</Dropdown.Item>
          </DropdownButton>
          <Link to="/stock/add" className="primary-custom-btn">
            <Button variant="primary mb-2 float-right">
              Add {deviceCategory}
            </Button>
          </Link>
          <Button className="primary-custom-btn">Advance Filter</Button>
        </Stack>
        
      </Stack>
      <Container>
        <Row>
          <Col>
            <Card body>
                <Stack direction="horizontal" className="align-items-center" gap={3}>
                  <label className="fw-bold">Processor:</label>
                  <div>
                    <Form.Check
                      inline
                      label="Intel"
                      name="processor-filter"
                      type={"checkbox"}
                      id="intel-processors"
                    />
                    <Form.Check
                      inline
                      label="AMD"
                      name="processor-filter"
                      type={"checkbox"}
                      id="amd-processors"
                    />
                  </div>
                </Stack>
                <Stack direction="horizontal" className="align-items-center" gap={3}>
                  <label className="fw-bold">RAM Capacity:</label>
                  <div>
                    {
                      ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"].map((item) => (
                        <Form.Check
                            inline
                            label={item}
                            name="ram-filter"
                            type={"checkbox"}
                            id={`ram-${item}`}
                            onChange={advanceFilterHandler}
                          />
                      ))
                    }
                  </div>
                </Stack>

            </Card>
          </Col>
        </Row>
      </Container>

      <div style={{ width: "100%", overflow: "auto" }}>
        <ShowDeviceDetails 
          filtered={devicesDetails}
          handleRemoveDeviceModal={handleRemoveDeviceModal}
          handleUserSelection={handleUserSelection}
          deviceCategory={deviceCategory}
          removeDeviceIdRef={removeDeviceIdRef}
        />
      </div>
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && error && <p className="error-msg">{error}</p>}
      <div className="d-flex justify-content-end me-3 mt-3">
        <PaginationComponent
          total={devicesDetails?.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      <Toaster
        title="user deleted successfully"
        bg="danger"
        showToaster={showToaster}
        setShowToaster={setShowToaster}
        to="stock"
      ></Toaster>
    </div>
  );
};

export default ListStock;