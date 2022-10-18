import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useParams, useNavigate } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import useAxios from "../../../Hooks/useAxios";
import "./Edit.scss";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [response, error, loading, axiosFetch] = useAxios();
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    axiosFetch({
      axiosInstance: axiosSecure,
      method: "GET",
      url: `/user/${id}`,
      requestConfig: [
        {
          headers: {
            Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
          },
        },
      ],
    });
  }, []);

  useEffect(() => {
    if (response?.user) {
      const { fname, lname, email, role, branch, status } = response?.user;
      setInitialValues({
        firstName: fname,
        lastName: lname,
        email: email,
        userType: role.toLowerCase(),
        branch: branch,
        status: status,
      });
      // navigate("/user", { replace: true });
    }
  }, [response]);

  return (
    <div className="flex-grow-1">
      {Object.keys(initialValues).length > 0 && (
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            const errors = {};
            if (!values.firstName) {
              errors.firstName = "First name is mandatory";
            }
            if (!values.lastName) {
              errors.lastName = "Last name is mandatory";
            }
            if (!values.email) {
              errors.email = "Email is mandatory";
            }
            if (!values.branch) {
              errors.branch = "Branch is mandatory";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            axiosFetch({
              axiosInstance: axiosSecure,
              method: "PATCH",
              url: `/user/updateuser/${id}`,
              requestConfig: [
                {
                  fname: values.firstName,
                  lname: values.lastName,
                  email: values.email,
                  branch: values.branch,
                  status: values.status,
                  role: "user",
                },
                {
                  headers: {
                    Authorization: `Bearer ${
                      localStorage.userDetails &&
                      JSON.parse(localStorage.userDetails).token
                    }`,
                  },
                },
              ],
            });
            setSubmitting(false);
            navigate("/user", { replace: true });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Container className="edit-user-page d-flex justify-content-center  flex-column">
                <h2 className=" mb-4">Edit User</h2>
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
                    
                      />
                      <p className="errorMsg">
                        {errors.firstName}
                      </p>
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
                   
                      />
                      <p className="errorMsg">
                        {errors.lastName}
                      </p>
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
              
                      />
                      <p className="errorMsg">
                        {errors.email}
                      </p>
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
                        {/* <option selected disabled>Select</option> */}
                        <option value="Dhaka">Dhaka</option>
                        <option value="Goa">Goa</option>
                        <option value="Sylhet">Sylhet</option>
                      </Form.Select>
                      <label for="floatingSelect">Select a branch</label>
                      <div className="invalid-feedback">{errors.branch}</div>
                    </FloatingLabel>
                  </Col>
                  <Col md={12} lg={12} xl={12} className="mt-4 mb-4 ">
                    <Button type="submit" disabled={isSubmitting}>
                      UPDATE USER
                    </Button>
                  </Col>
                </Row>
              </Container>
            </form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default EditUser;
