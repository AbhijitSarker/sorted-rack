import React, { useState, useEffect } from "react";
import { axiosSecure } from "../../api/axios";
import { Card, Col } from "react-bootstrap";

const Dashbaord = () => {
  const [dashboardStats, setDashboardStats] = useState({});

  useEffect(() => {
    (async () => {
      const response = await axiosSecure.get("/product", {
        headers: {
          Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
        },
      });
      if (response?.data?.products) {
        const { products } = response.data;

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
    })();
  }, []);

  return (
    <div className="stock-main-body container">
      <h2 className="py-3">My Stock</h2>
      <div className="row">
        {dashboardStats?.length > 0 &&
          dashboardStats?.map((stock, index) => (
            <Col xl={3} lg={3} md={6} className="mb-4" key={index}>
              <Card className="text-center shadow-sm h-100">
                <Card.Body>
                  <Card.Title as="h1" className="display-4 fw-bold text-primary">
                    {stock.assignedDevicesCount}
                  </Card.Title>
                  <Card.Subtitle as="h5" className="mb-2 text-capitalize text-secondary">
                    {stock.deviceCategory} Being used
                  </Card.Subtitle>
                  <hr />
                  <p className="border-bottom pb-3 mb-3">
                    Available:
                    <span className="text-success fw-semibold"> {stock.availableDevicesCount}</span>
                  </p>
                  <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded shadow-sm">
                    <div className="text-uppercase small">Total</div>
                    <h2 className="fw-bold m-0">{stock.availableDevicesCount + stock.assignedDevicesCount}</h2>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </div>
    </div>
  );
};

export default Dashbaord;
