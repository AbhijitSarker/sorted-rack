import React, { useContext, useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, FloatingLabel } from "react-bootstrap";
import { axiosSecure, getAuthorizationHeader } from "../../../../api/axios";
import { StockContext } from "../../../../contexts/StockContext";
import { Toaster } from "../../../../component/Toaster/Toaster";

const SytemDetailsForm = () => {
  const [showToaster, setShowToaster] = useState(false);
  const [successToaster, setSuccessToaster] = useState(false);
  const { setDeviceCategory } = useContext(StockContext);

  const navigate = useNavigate();
  const schema = yup.object().shape({
    systemBrand: yup.string().required("system Brand is required"),
    systemModel: yup.string().required("system Model is required"),
    systemName: yup.string().required("system Name is required"),
    os: yup.string().required("OS is required"),
    cpu: yup.string().required("CPU is required"),
    ram: yup.string().required("RAM is required"),
    storageType: yup.string().required("storage Type is required"),
    storageCapacity: yup.string().required("storage Capacity is required"),
    macAddress: yup.string().required("Mac Address is required"),
    ipAddress: yup.string().required("IP Address is required"),
    serialNumber: yup.string().required("Serial Number Key is required"),
    // productKey: yup.string().required("Product Key is required"),
    // warrantyPeriod: yup.string().required("warranty Period Key is required"),
    // dateOfPurchase: yup.string().required("Purchase Date is required"),
  });

  return (
    <>
      <Row>
        <Col>
          <h4 className="fw-bold fs-5 mm " style={{ lineHeight: 1, margin: "24px 0" }}>
            SYSTEM DETAILS
          </h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            validationSchema={schema}
            initialValues={{
              systemBrand: "",
              systemModel: "",
              systemName: "",
              os: "",
              cpu: "",
              ram: "",
              storageType: "",
              storageCapacity: "",
              macAddress: "",
              ipAddress: "",
              serialNumber: "",
              // productKey: "",
              // dateOfPurchase: "",
              // warrantyPeriod: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              (async () => {
                try {
                  const { status } = await axiosSecure.post(
                    "/product",
                    {
                      productCategory: "System",
                      productType: "Laptop",
                      systemBrand: values.systemBrand,
                      systemModel: values.systemModel,
                      systemName: values.systemName,
                      os: values.os,
                      cpu: values.cpu,
                      ram: values.ram,
                      storageType: values.storageType,
                      storageCapacity: values.storageCapacity,
                      macAddress: values.macAddress,
                      ipAddress: values.ipAddress,
                      serialNumber: values.serialNumber,
                      // productKey: values.productKey,
                      // dateOfPurchase: values.dateOfPurchase,
                      // warrantyPeriod: values.warrantyPeriod,
                    },
                    {
                      headers: { Authorization: getAuthorizationHeader() },
                    }
                  );
                  if (status === 201) {
                    setSubmitting(false);
                    setDeviceCategory("System");
                    setSuccessToaster(true);
                    setShowToaster(true);
                  }
                } catch (error) {
                  setSuccessToaster(true);
                  setShowToaster(true);
                }
              })();
            }}
          >
            {({ handleSubmit, handleChange, handleBlur, values, touched, isValid, errors }) => (
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
                        isInvalid={touched.systemBrand && !!errors.systemBrand}
                      />
                      <Form.Control.Feedback type="invalid">{errors.systemBrand}</Form.Control.Feedback>
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
                        isInvalid={touched.systemModel && !!errors.systemModel}
                      />
                      <Form.Control.Feedback type="invalid">{errors.systemModel}</Form.Control.Feedback>
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
                        isInvalid={touched.systemName && !!errors.systemName}
                      />
                      <Form.Control.Feedback type="invalid">{errors.systemName}</Form.Control.Feedback>
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
                      <Form.Control.Feedback type="invalid">{errors.os}</Form.Control.Feedback>
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
                      <Form.Control.Feedback type="invalid">{errors.cpu}</Form.Control.Feedback>
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
                      <Form.Control.Feedback type="invalid">{errors.ram}</Form.Control.Feedback>
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
                        isInvalid={touched.storageType && !!errors.storageType}
                      />
                      <Form.Control.Feedback type="invalid">{errors.storageType}</Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel className="mb-3" label="Storage Capacity">
                      <Form.Control
                        type="text"
                        name="storageCapacity"
                        placeholder="Storage Capacity"
                        value={values.storageCapacity}
                        onChange={handleChange}
                        isInvalid={touched.storageCapacity && !!errors.storageCapacity}
                      />
                      <Form.Control.Feedback type="invalid">{errors.storageCapacity}</Form.Control.Feedback>
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
                        isInvalid={touched.macAddress && !!errors.macAddress}
                      />
                      <Form.Control.Feedback type="invalid">{errors.macAddress}</Form.Control.Feedback>
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
                      <Form.Control.Feedback type="invalid">{errors.ipAddress}</Form.Control.Feedback>
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
                        isInvalid={touched.productKey && !!errors.productKey}
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
                        isInvalid={touched.serialNumber && !!errors.serialNumber}
                      />
                      <Form.Control.Feedback type="invalid">{errors.serialNumber}</Form.Control.Feedback>
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
                    <FloatingLabel className="mb-3" label="Date Of Purchase">
                      <Form.Control
                        type="text"
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
                      <div className="invalid-feedback">
                        {errors.dateOfPurchase &&
                          touched.dateOfPurchase &&
                          errors.dateOfPurchase}
                      </div>
                    </FloatingLabel>
                  </Col> */}
                </Row>
                <Row>
                  <Col xl={12} className="mt-4">
                    <Button type="submit">Add System</Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
      <Toaster
        title={successToaster ? "Device Added Successfully" : "Oops something went wrong."}
        bg={successToaster ? "success" : "danger"}
        showToaster={showToaster}
        setShowToaster={setShowToaster}
        to="stock"
      ></Toaster>
    </>
  );
};

export default SytemDetailsForm;
