import React, { useState, useContext } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import "./accessoriesFormContainer.scss";
import { axiosSecure } from "../../../../api/axios";
import { StockContext } from "../../../../contexts/StockContext";

const AccessoriesFormContainer = () => {
  const { setDeviceCategory } = useContext(StockContext);
  const navigate = useNavigate();
  const [count, setCount] = useState([1]);
  const handleCloseOption = () => {
    if (count.length > 1) {
      setCount(count.slice(0, -1));
    }
  };
  const schema = yup.object().shape({
    accessoriesType: yup.string().required("Accessories type is required"),
    accessoriesName: yup.string().required("Accessories Name is required"),
    serialNumber: yup.string().required("Serial Number is required"),
    dateOfPurchase: yup.string().required("Date of Purchase is required"),
    warrantyPeriod: yup.string().required("Warranty Period is required"),
  });
  return (
    <>
      <Row>
        <Col xl={12}>
          <h4 className="fw-bold fs-5 my-4">Additional Accessories</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Formik
            validationSchema={schema}
            initialValues={{
              accessoriesType: "",
              accessoriesName: "",
              serialNumber: "",
              dateOfPurchase: "",
              warrantyPeriod: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              (async () => {
                try {
                  const response = await axiosSecure.post(
                    "/product",
                    {
                      productCategory: "Accessories",
                      branch: "Goa",
                      productType: values.accessoriesType,
                      accessoriesName: values.accessoriesName,
                      serialNumber: values.serialNumber,
                      dateOfPurchase: values.dateOfPurchase,
                      warrantyPeriod: values.warrantyPeriod,
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
                  if (response.status === 201) {
                    setDeviceCategory("Accessories");
                    navigate("/stock", { replace: true });
                  }
                } catch (errorMsg) {
                  alert(errorMsg.response.data.msg);
                }
                setSubmitting(false);
              })();
            }}
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
                    <FloatingLabel className="mb-3" label="Accessories Type">
                      <Form.Select
                        type="text"
                        name="accessoriesType"
                        value={values.accessoriesType}
                        onChange={handleChange}
                        isInvalid={
                          !!touched.accessoriesType && !!errors.accessoriesType
                        }
                        aria-label="Default select example"
                      >
                        <option value="" disabled hidden>
                          select
                        </option>
                        <option value="Mouse">Mouse</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Headphone">Headphone</option>
                        <option value="Keyboard">Keyboard</option>
                        <option value="USBDongle">USB Dongle</option>
                      </Form.Select>
                      <div className="invalid-feedback">
                        {touched.accessoriesType && errors.accessoriesType}
                      </div>
                    </FloatingLabel>
                  </Col>
                  <Col xl={6}>
                    <FloatingLabel className="mb-3" label="Accessories Name">
                      <Form.Control
                        type="text"
                        name="accessoriesName"
                        placeholder="Accessories Name"
                        value={values.accessoriesName}
                        onChange={handleChange}
                        isInvalid={
                          touched.accessoriesName && !!errors.accessoriesName
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
                      <Form.Control.Feedback type="invalid">
                        {errors.dateOfPurchase}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col xl={12} className="mt-4">
                    <Button type="submit">Add Accessory</Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </>
  );
};

export default AccessoriesFormContainer;
