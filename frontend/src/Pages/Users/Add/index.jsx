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
import { Card } from "react-bootstrap";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  password: yup.string().required("Password is required"),
  branch: yup.string().required("Branch is required"),
  email: yup.string().required("Email Address is required"),
  username: yup.string().required("Username is required"),
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
      username: values.username,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
      },
    }
  );

const AddUser = () => {
  const [showAddToaster, setShowAddToaster] = useState(false);
  const [showErrorToaster, setShowErrorToaster] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="flex-grow-1">
      <Card style={{ maxWidth: "600px", width: "100%", margin: "60px auto" }}>
        <Card.Header className="fw-bold text-center">ADD USER</Card.Header>
        <Card.Body>
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
              username: "",
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const response = await handleOnSubmit(values);
                if (response.status === 201) {
                  setShowAddToaster(true);
                }
              } catch (errorMsg) {
                setError(errorMsg.response.data.msg);
                setShowErrorToaster(true);
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
                  <Row>
                    <Col>
                      <FloatingLabel controlId="floatingFirstName" label="First Name" className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="First Name"
                          name="firstName"
                          value={values["firstName"]}
                          onChange={handleChange}
                          isInvalid={touched.firstName && !!errors.firstName}
                        />
                        <div className="invalid-feedback">{errors.firstName && touched.firstName && errors.firstName}</div>
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FloatingLabel controlId="floatingLastName" label="Last Name" className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Last Name"
                          name="lastName"
                          onChange={handleChange}
                          value={values["lastName"]}
                          isInvalid={touched.lastName && !!errors.lastName}
                        />
                        <div className="invalid-feedback">{errors.lastName && touched.lastName && errors.lastName}</div>
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
                        <Form.Control type="text" placeholder="Email" name="email" onChange={handleChange} value={values["email"]} isInvalid={touched.email && !!errors.email} />
                        <div className="invalid-feedback">{errors.email && touched.email && errors.email}</div>
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FloatingLabel controlId="floatingLastName" label="Password" className="mb-3">
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          name="password"
                          onChange={handleChange}
                          value={values["password"]}
                          isInvalid={touched.password && !!errors.password}
                        />
                        <div className="invalid-feedback">{errors.password && touched.password && errors.password}</div>
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FloatingLabel controlId="floatingusername" label="Username" className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="Username"
                          name="username"
                          onChange={handleChange}
                          value={values["username"]}
                          isInvalid={touched.username && !!errors.username}
                        />
                        <div className="invalid-feedback">{errors.username && touched.username && errors.username}</div>
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Select
                        className="form-select mb-3"
                        type="text"
                        name="branch"
                        aria-label="Select a branch"
                        isInvalid={!!touched.branch && !!errors.branch}
                        value={values.branch}
                        onChange={handleChange}
                        style={{ height: "58px" }}
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Goa">Goa</option>
                        <option value="Sylhet">Sylhet</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="my-3 text-center">
                      <Button type="submit" disabled={isSubmitting}>
                        CREATE USER
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
      <Toaster title="User added successfully" bg="success" showToaster={showAddToaster} setShowToaster={setShowAddToaster} to="user"></Toaster>
      <Toaster title={error} bg="danger" showToaster={showErrorToaster} setShowToaster={setShowErrorToaster} to="user/add"></Toaster>
    </div>
  );
};

export default AddUser;
