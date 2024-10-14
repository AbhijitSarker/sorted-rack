import React, { useState, useEffect, useContext } from "react";
import { axiosSecure } from "../../api/axios";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HeaderContext } from "../../contexts/HeaderContext";
import { FaArchive, FaCheckCircle, FaKeyboard, FaLaptop, FaTicketAlt, FaUsers } from "react-icons/fa";

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

  const StatCard = ({ title, value, icon, color }) => (
    <Card className={`stat-card ${color}`}>
      <Card.Body>
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
          <h3 className="stat-value">{value}</h3>
          <p className="stat-title">{title}</p>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="dashboard container-fluid">
      <Row className="mb-4">
        {dashboardStats?.map((stock, index) => (
          <Col lg={3} md={6} sm={12} className="mb-4" key={index}>
            <StatCard
              title={`Available ${stock.deviceCategory}`}
              value={stock.availableDevicesCount}
              icon={stock.deviceCategory === "System" ? <FaLaptop /> : <FaKeyboard />}
              color={stock.deviceCategory === "System" ? "blue" : "green"}
            />
          </Col>
        ))}
        <Col lg={3} md={6} sm={12} className="mb-4">
          <StatCard
            title="Open Tickets"
            value={ticketStats.openTickets || 0}
            icon={<FaTicketAlt />}
            color="orange"
          />
        </Col>
        <Col lg={3} md={6} sm={12} className="mb-4">
          <StatCard
            title="Active Users"
            value={userStats.activeUsers || 0}
            icon={<FaUsers />}
            color="purple"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={3} md={6} sm={12} className="mb-4">
          <StatCard
            title="Archived Tickets"
            value={ticketStats.archiveTickets || 0}
            icon={<FaArchive />}
            color="red"
          />
        </Col>
        <Col lg={3} md={6} sm={12} className="mb-4">
          <StatCard
            title="Closed Tickets"
            value={ticketStats.closedTickets || 0}
            icon={<FaCheckCircle />}
            color="teal"
          />
        </Col>
        {/* Add more stat cards as needed */}
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header className="">
              <h5 className="my-2">Latest Tickets</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive bordered className="mb-0">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td>{ticket.title}</td>
                      <td>
                        <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                      <td>
                        <Link to={`/ticket/${ticket._id}`} replace>
                          <Button size="sm" variant="outline-primary">View Details</Button>
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