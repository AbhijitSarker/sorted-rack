import React, { useState, useEffect, useContext } from "react";
import { axiosSecure } from "../../api/axios";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HeaderContext } from "../../contexts/HeaderContext";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [ticketStats, setTicketStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const [latestTickets, setLatestTickets] = useState([]);
  const { setHeaderText } = useContext(HeaderContext);

  useEffect(() => {
    setHeaderText('Dashboard');
  }, [setHeaderText]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productResponse, ticketResponse, userResponse, latestTicketsResponse] = await Promise.all([
          axiosSecure.get("/product", {
            headers: {
              Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
            },
          }),
          axiosSecure.get("/ticket/stats", {
            headers: {
              Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
            },
          }),
          axiosSecure.get("/user/stats", {
            headers: {
              Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
            },
          }),
          axiosSecure.get("/ticket/latest", {
            headers: {
              Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
            },
          }),
        ]);

        if (productResponse?.data?.products) {
          const { products } = productResponse.data;

          const unAssignedSystemCount = products.filter(
            (product) => product.productCategory === "System" && product.tag === "notassigned"
          ).length;
          const assignedSystemCount = products.filter(
            (product) => product.productCategory === "System" && product.tag === "assigned"
          ).length;

          const unAssignedAccessoriesCount = products.filter(
            (product) => product.productCategory === "Accessories" && product.tag === "notassigned"
          ).length;

          const assignedAccessoriesCount = products.filter(
            (product) => product.productCategory === "Accessories" && product.tag === "assigned"
          ).length;

          setDashboardStats([
            {
              deviceCategory: "System",
              availableDevicesCount: unAssignedSystemCount,
              assignedDevicesCount: assignedSystemCount,
            },
            {
              deviceCategory: "Accessories",
              availableDevicesCount: unAssignedAccessoriesCount,
              assignedDevicesCount: assignedAccessoriesCount,
            },
          ]);
        }

        if (ticketResponse?.data) {
          setTicketStats(ticketResponse.data);
        }

        if (userResponse?.data) {
          setUserStats(userResponse.data);
        }
        if (latestTicketsResponse?.data) {
          setLatestTickets(latestTicketsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="stock-main-body container">
      <h2 className="py-3">Dashboard</h2>
      <Row>
        {dashboardStats?.map((stock, index) => (
          <Col xl={3} lg={3} md={6} className="mb-4" key={index}>
            <Card className="text-center shadow-sm h-100">
              <Card.Body>
                <Card.Title as="h1" className="display-4 fw-bold text-primary">
                  {stock.availableDevicesCount}
                </Card.Title>
                <Card.Subtitle as="h5" className="mb-2 text-capitalize text-secondary">
                  Available {stock.deviceCategory}:
                </Card.Subtitle>
                <hr />
                <p className="border-bottom pb-3 mb-3">
                  <span className="text-success fw-semibold">In Use: {stock.availableDevicesCount}</span>
                </p>
                <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded shadow-sm">
                  <div className="text-uppercase small">Total</div>
                  <h2 className="fw-bold m-0">{stock.availableDevicesCount + stock.assignedDevicesCount}</h2>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Ticket Statistics Card */}
        <Col xl={3} lg={3} md={6} className="mb-4">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title as="h1" className="display-4 fw-bold text-primary">
                {ticketStats.openTickets || 0}
              </Card.Title>
              <Card.Subtitle as="h5" className="mb-2 text-capitalize text-secondary">
                Open Tickets
              </Card.Subtitle>
              <hr />
              <p className="border-bottom pb-3 mb-3">
                <span className="text-warning fw-semibold me-2">Archive: {ticketStats.archiveTickets || 0}</span>
                <span className="text-success fw-semibold">Closed: {ticketStats.closedTickets || 0}</span>
              </p>
              <p className="border-bottom pb-3 mb-3">
                <span className="text-warning fw-semibold me-2">In Progress: {ticketStats.inProgressTickets || 0}</span>
                <span className="text-success fw-semibold">Resolved: {ticketStats.resolvedTickets || 0}</span>
              </p>
              <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded shadow-sm">
                <div className="text-uppercase small">Total Tickets</div>
                <h2 className="fw-bold m-0">{ticketStats.totalTickets || 0}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* User Statistics Card */}
        <Col xl={3} lg={3} md={6} className="mb-4">
          <Card className="text-center shadow-sm h-100">
            <Card.Body>
              <Card.Title as="h1" className="display-4 fw-bold text-primary">
                {userStats.activeUsers || 0}
              </Card.Title>
              <Card.Subtitle as="h5" className="mb-2 text-capitalize text-secondary">
                Active Users
              </Card.Subtitle>
              <hr />
              <p className="border-bottom pb-3 mb-3">
                Inactive: <span className="text-danger fw-semibold">{userStats.inactiveUsers || 0}</span>
              </p>
              <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded shadow-sm mt-10">
                <div className="text-uppercase small">Total Users</div>
                <h2 className="fw-bold m-0">{userStats.totalUsers || 0}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Latest Tickets Table */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>Latest Tickets</h3>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td>{ticket.title}</td>
                      <td>{ticket.status}</td>
                      <td>{ticket.priority}</td>
                      <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                      <td>
                        <Link to={`/ticket/${ticket._id}`} replace>
                          <Button size="sm" variant="outline-primary">View Details </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>


    </div>
  );
};

export default Dashboard;