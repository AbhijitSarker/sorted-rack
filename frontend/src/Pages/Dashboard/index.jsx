import React, { useState, useEffect } from "react";
import { axiosSecure } from "../../api/axios";

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
            <div className="col-xl-3 col-lg-3 col-md-6" key={index}>
              <div className="single-stock rounded-3 shadow text-center pt-5 mr-3 mb-3">
                <h1 className="pb-3 fw-normal ">{stock.assignedDevicesCount}</h1>
                <h5 className="mb-1 productName text-capitalize">{stock.deviceCategory}</h5>
                <p className="stock-available border-bottom border-dark pb-5 stock">
                  Available: {stock.availableDevicesCount}
                </p>
                <div className="total-stock row d-flex justify-content-center align-items-center">
                  <div className="col-md-6 text-upercase">
                    <p>Total</p>
                  </div>
                  <div className="col-md-6">
                    <h1 className="fw-normal">{stock.availableDevicesCount + stock.assignedDevicesCount}</h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dashbaord;
