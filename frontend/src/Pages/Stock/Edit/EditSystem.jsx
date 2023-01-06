import React, { useState, useEffect, useRef, useContext } from "react";
import { Formik } from "formik";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import * as yup from "yup";

import { useParams, useNavigate } from "react-router-dom";
import { axiosSecure, getAuthorizationHeader } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import { StockContext } from "../../../contexts/StockContext";

const EditSystemDetails = () => {
  const systemSchema = yup.object().shape({
    systemBrand: yup.string().required("System Brand is required"),
    systemModel: yup.string().required("System Model is required"),
    systemName: yup.string().required("System Name is required"),
    os: yup.string().required("OS is required"),
    cpu: yup.string().required("CPU is required"),
    ram: yup.string().required("RAM is required"),
    storageType: yup.string().required("Storage Type is required"),
    storageCapacity: yup.string().required("Storage Capacity is required"),
    macAddress: yup.string().required("MAC Address is required"),
    ipAddress: yup.string().required("IP Address is required"),
    // productKey: yup.string().required("Product Key is required"),
    serialNumber: yup.string().required("Serial number is required"),
    // dateOfPurchase: yup.date().required("Date Of Purchase is required"),
    // warrantyPeriod: yup.string().required("Warranty is required"),
  });
  const schemaAccessories = yup.object().shape({
    productType: yup.string().required("Product Type is required"),
    accessoriesName: yup.string().required("Accessories Name is required"),
    dateOfPurchase: yup.string().required("Date Of Purchase is required"),
    serialNumber: yup.string().required("Serial Number is required"),
    warrantyPeriod: yup.string().required("Warranty is required"),
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({});
  const productCategoryRef = useRef(null);
  const [response, error, loading, axiosFetch] = useAxios();
  const { setDeviceCategory } = useContext(StockContext);

  const getDeviceDetails = () =>
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: `/product/${id}`,
      requestConfig: [
        {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
          },
        },
      ],
    });

  useEffect(() => {
    getDeviceDetails();
  }, []);

  useEffect(() => {
    if (response) {
      const deviceDetails = response?.product || {};
      if (Object.keys(deviceDetails).length > 0) {
        productCategoryRef.current = deviceDetails.productCategory;
        productCategoryRef.current === "Accessories"
          ? setInitialValues({
              accessoriesName: deviceDetails.accessoriesName,
              dateOfPurchase: deviceDetails.dateOfPurchase?.split("T")[0] || "",
              productType: deviceDetails.productType,
              serialNumber: deviceDetails.serialNumber,
              warrantyPeriod: deviceDetails.warrantyPeriod,
            })
          : setInitialValues({
              systemBrand: deviceDetails.systemBrand,
              systemModel: deviceDetails.systemModel,
              systemName: deviceDetails.systemName,
              os: deviceDetails.os,
              cpu: deviceDetails.cpu,
              ram: deviceDetails.ram,
              storageType: deviceDetails.storageType,
              storageCapacity: deviceDetails.storageCapacity,
              macAddress: deviceDetails.macAddress,
              ipAddress: deviceDetails.ipAddress,
              //  productKey: deviceDetails.productKey,
              serialNumber: deviceDetails.serialNumber,
              //  dateOfPurchase: deviceDetails.dateOfPurchase?.split("T")[0] || "",
              //  warrantyPeriod: deviceDetails.warrantyPeriod,
            });
      }
    }
  }, [response]);

  const handleUpdateStockDetails = async (values, setSubmitting) => {
   const responseUpdated = await axiosSecure.patch(`/product/${id}`, values, {
     headers: { Authorization: getAuthorizationHeader() },
   });

   setSubmitting(false);
   if (responseUpdated) {
     setDeviceCategory(productCategoryRef.current);
     navigate("/stock", { replace: true });
   }
 };

  return (
    <Container className="mt-3" style={{ width: "80%" }}>
      <Row>
        <h2 className="mb-2">Edit Stock</h2>
        <Col>
          {Object.keys(initialValues).length > 0 &&
            productCategoryRef.current === "Accessories" && (
              <Formik
                validationSchema={schemaAccessories}
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) =>
                  handleUpdateStockDetails(values, setSubmitting)
                }
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xl={6}>
                        <Form.Group className="mb-2">
                          <Form.Select
                            className="py-3"
                            type="text"
                            name="productType"
                            value={values.productType}
                            defaultValue={values.productType}
                            onChange={handleChange}
                            isInvalid={
                              touched.productType && !!errors.productType
                            }
                            aria-label="Default select example"
                          >
                            <option value="" disabled hidden>
                              Accessories Type
                            </option>
                            <option value="Mouse">Mouse</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Headphone">Headphone</option>
                            <option value="Keyboard">Keyboard</option>
                            <option value="USBDongle">USB Dongle</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Control.Feedback type="invalid">
                          {errors.productType}
                        </Form.Control.Feedback>
                      </Col>
                      <Col xl={6}>
                        <FloatingLabel
                          className="mb-3"
                          label="Accessories Name"
                        >
                          <Form.Control
                            type="text"
                            name="accessoriesName"
                            placeholder="Accessories Name"
                            value={values.accessoriesName}
                            onChange={handleChange}
                            isInvalid={
                              touched.accessoriesName &&
                              !!errors.accessoriesName
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.accessoriesName}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col xl={6}>
                        <FloatingLabel className="mb-3" label="Serial Number">
                          <Form.Control
                            type="text"
                            name="serialNumber"
                            placeholder="Serial Number"
                            value={values.serialNumber}
                            onChange={handleChange}
                            isInvalid={
                              touched.serialNumber && !!errors.serialNumber
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.serialNumber}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col xl={6}>
                        <FloatingLabel className="mb-3" label="Warranty Period">
                          <Form.Control
                            type="text"
                            name="warrantyPeriod"
                            placeholder="Serial Number"
                            value={values.warrantyPeriod}
                            onChange={handleChange}
                            isInvalid={
                              touched.warrantyPeriod && !!errors.warrantyPeriod
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.warrantyPeriod}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel
                          className="mb-3"
                          label="Date Of Purchase"
                        >
                          <Form.Control
                            type="date"
                            onFocus={(evt) => (evt.target.type = "date")}
                            onBlur={(evt) => (evt.target.type = "date")}
                            name="dateOfPurchase"
                            placeholder="Date Of Purchase"
                            value={values.dateOfPurchase}
                            onChange={handleChange}
                            isInvalid={
                              touched.dateOfPurchase && !!errors.dateOfPurchase
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.dateOfPurchase}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={12} className=" mt-4">
                        <Button type="submit">Edit Accessories</Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            )}

          {Object.keys(initialValues).length > 0 &&
            productCategoryRef.current === "System" && (
              <Formik
                validationSchema={systemSchema}
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) =>
                  handleUpdateStockDetails(values, setSubmitting)
                }
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="System Brand">
                          <Form.Control
                            type="text"
                            name="systemBrand"
                            placeholder="System Brand"
                            value={values.systemBrand}
                            onChange={handleChange}
                            isInvalid={
                              touched.systemBrand && !!errors.systemBrand
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.systemBrand}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="System Model">
                          <Form.Control
                            type="text"
                            name="systemModel"
                            placeholder="System Model"
                            value={values.systemModel}
                            onChange={handleChange}
                            isInvalid={
                              touched.systemModel && !!errors.systemModel
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.systemModel}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="System Name">
                          <Form.Control
                            type="text"
                            name="systemName"
                            placeholder="System Name"
                            value={values.systemName}
                            onChange={handleChange}
                            isInvalid={
                              touched.systemName && !!errors.systemName
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.systemName}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="System OS">
                          <Form.Control
                            type="text"
                            name="os"
                            placeholder="System OS"
                            value={values.os}
                            onChange={handleChange}
                            isInvalid={touched.os && !!errors.os}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.os}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="CPU">
                          <Form.Control
                            type="text"
                            name="cpu"
                            placeholder="CPU"
                            value={values.cpu}
                            onChange={handleChange}
                            isInvalid={touched.cpu && !!errors.cpu}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.cpu}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="RAM">
                          <Form.Control
                            type="text"
                            name="ram"
                            placeholder="RAM"
                            value={values.ram}
                            onChange={handleChange}
                            isInvalid={touched.ram && !!errors.ram}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.ram}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="Storage Type">
                          <Form.Control
                            type="text"
                            name="storageType"
                            placeholder="Storage Type"
                            value={values.storageType}
                            onChange={handleChange}
                            isInvalid={
                              touched.storageType && !!errors.storageType
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.storageType}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel
                          className="mb-3"
                          label="Storage Capacity"
                        >
                          <Form.Control
                            type="text"
                            name="storageCapacity"
                            placeholder="Storage Capacity"
                            value={values.storageCapacity}
                            onChange={handleChange}
                            isInvalid={
                              touched.storageCapacity &&
                              !!errors.storageCapacity
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.storageCapacity}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="MAC Address">
                          <Form.Control
                            type="text"
                            name="macAddress"
                            placeholder="MAC Address"
                            value={values.macAddress}
                            onChange={handleChange}
                            isInvalid={
                              touched.macAddress && !!errors.macAddress
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.macAddress}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="IP Address">
                          <Form.Control
                            type="text"
                            name="ipAddress"
                            placeholder="IP Address"
                            value={values.ipAddress}
                            onChange={handleChange}
                            isInvalid={touched.ipAddress && !!errors.ipAddress}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.ipAddress}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      {/* <Col md={6}>
                        <FloatingLabel className="mb-3" label="Product Key">
                          <Form.Control
                            type="text"
                            name="productKey"
                            placeholder="Product Key"
                            value={values.productKey}
                            onChange={handleChange}
                            isInvalid={
                              touched.productKey && !!errors.productKey
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.productKey}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col> */}
                      <Col md={6}>
                        <FloatingLabel className="mb-3" label="Serial Number">
                          <Form.Control
                            type="text"
                            name="serialNumber"
                            placeholder="Serial Number"
                            value={values.serialNumber}
                            onChange={handleChange}
                            isInvalid={
                              touched.serialNumber && !!errors.serialNumber
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.serialNumber}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      {/* <Col md={6}>
                        <FloatingLabel className="mb-3" label="Warranty Period">
                          <Form.Control
                            type="text"
                            name="warrantyPeriod"
                            placeholder="Warranty Period"
                            value={values.warrantyPeriod}
                            onChange={handleChange}
                            isInvalid={
                              touched.warrantyPeriod && !!errors.warrantyPeriod
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.warrantyPeriod}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col> */}
                      {/* <Col md={6}>
                        <FloatingLabel
                          className="mb-3"
                          label="Date Of Purchase"
                        >
                          <Form.Control
                            type="date"
                            onFocus={(evt) => (evt.target.type = "date")}
                            onBlur={(evt) => (evt.target.type = "date")}
                            name="dateOfPurchase"
                            placeholder="Date Of Purchase"
                            value={values.dateOfPurchase}
                            onChange={handleChange}
                            isInvalid={
                              touched.dateOfPurchase && !!errors.dateOfPurchase
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.dateOfPurchase}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col> */}
                    </Row>
                    <Row>
                      <Col xl={12} className=" mt-4">
                        <Button type="submit">Edit System</Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            )}
        </Col>
      </Row>
    </Container>
  );
};

export default EditSystemDetails;
