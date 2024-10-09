import React, { useState, useEffect } from "react";
import { axiosSecure } from "../../api/axios";
import { Card, Col, Row } from "react-bootstrap";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [ticketStats, setTicketStats] = useState({});
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productResponse, ticketResponse, userResponse] = await Promise.all([
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
          console.log(ticketResponse);
          setTicketStats(ticketResponse.data);
        }

        if (userResponse?.data) {
          console.log(userResponse);
          setUserStats(userResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  console.log(ticketStats.avgResolutionTime);
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
                <span className="text-warning fw-semibold me-2">Open: {ticketStats.openTickets || 0}</span>
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
    </div>
  );
};

export default Dashboard;