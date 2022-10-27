import React, { useState } from "react";
import { Formik } from "formik";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "./users.scss";
import { axiosSecure } from "../../../api/axios";
import * as yup from "yup";
import { Toaster } from "../../../component/Toaster/Toaster";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  password: yup.string().required("Password is required"),
  branch: yup.string().required("Branch is required"),
  email: yup.string().required("Email Address is required"),
});

const handleOnSubmit = (values) =>
  axiosSecure.post(
    "/auth/register",
    {
      fname: values.firstName,
      lname: values.lastName,
      password: values.password,
      branch: values.branch,
      email: values.email,
    },
    {
      headers: {
        Authorization: `Bearer ${
          localStorage.userDetails && JSON.parse(localStorage.userDetails).token
        }`,
      },
    }
  );

const AddUser = () => {
  const [showToaster, setShowToaster] = useState(false);
  return (
    <div className="flex-grow-1">
      <Formik
        validationSchema={schema}
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          userType: "",
          branch: "",
          status: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await handleOnSubmit(values);
            if (response.status === 201) {
              setShowToaster(true);
            }
          } catch (errorMsg) {
            alert(errorMsg.response.data.msg);
          }
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Form onSubmit={handleSubmit}>
            <Container className="add-user-page d-flex flex-column justify-content-center">
              <h2 className=" mb-4 ">Add User</h2>
              <h5 className="fw-bold mb-3">User Details</h5>
              <Row>
                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel
                    controlId="floatingFirstName"
                    label="First Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      name="firstName"
                      value={values["firstName"]}
                      onChange={handleChange}
                      isInvalid={touched.firstName && !!errors.firstName}
                    />
                    <div className="invalid-feedback">
                      {errors.firstName &&
                        touched.firstName &&
                        errors.firstName}
                    </div>
                  </FloatingLabel>
                </Col>

                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel
                    controlId="floatingLastName"
                    label="Last Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      name="lastName"
                      onChange={handleChange}
                      value={values["lastName"]}
                      isInvalid={touched.lastName && !!errors.lastName}
                    />
                    <div className="invalid-feedback">
                      {errors.lastName && touched.lastName && errors.lastName}
                    </div>
                  </FloatingLabel>
                </Col>

                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel
                    controlId="floatingEmail"
                    label="Email"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                      value={values["email"]}
                      isInvalid={touched.email && !!errors.email}
                    />
                    <div className="invalid-feedback">
                      {errors.email && touched.email && errors.email}
                    </div>
                  </FloatingLabel>
                </Col>

                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel
                    controlId="floatingLastName"
                    label="Password"
                    className="mb-3"
                  >
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                      value={values["password"]}
                      isInvalid={touched.password && !!errors.password}
                    />
                    <div className="invalid-feedback">
                      {errors.password && touched.password && errors.password}
                    </div>
                  </FloatingLabel>
                </Col>

                <Col md={6} lg={6} xl={6}>
                  <FloatingLabel>
                    <Form.Select
                      className="form-select"
                      type="text"
                      name="branch"
                      aria-label="Select a branch"
                      isInvalid={!!touched.branch && !!errors.branch}
                      value={values.branch}
                      onChange={handleChange}
                    >
                      <option value="" disabled hidden>
                        Select
                      </option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Goa">Goa</option>
                      <option value="Sylhet">Sylhet</option>
                    </Form.Select>
                    <label htmlFor="floatingSelect">Select a branch</label>
                    <div className="invalid-feedback">
                      {touched.branch && errors.branch}
                    </div>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row></Row>
              <Col md={12} lg={12} xl={12} className="mt-4 mb-4 ">
                <Button type="submit" disabled={isSubmitting}>
                  CREATE USER
                </Button>
              </Col>
            </Container>
          </Form>
        )}
      </Formik>
      <Toaster
        title="User added successfully"
        bg="success"
        showToaster={showToaster}
        setShowToaster={setShowToaster}
        to="user"
      ></Toaster>
    </div>
  );
};

export default AddUser;
