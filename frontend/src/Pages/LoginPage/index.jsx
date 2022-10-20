import jwt_decode from "jwt-decode";
import React, { useRef, useEffect, useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BiErrorCircle } from "react-icons/bi";

import { axiosOpen } from "../../api/axios";
import logo from "../../assests/images/site-logo.png";
const LOGIN_URL = "auth/login";

const LoginForm = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToster, setShowToster] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [userToken, setUserToken] = useState(null);
  // const [userData, error, loading, axiosFetch] = useAxios();

  useEffect(() => {
    if (userToken) {
      const decodedToken = jwt_decode(userToken);
      const { email, role, branch, userId } = decodedToken;
      const userDetails = {
        branch,
        email,
        role,
        userId,
        token: userToken,
      };
      localStorage.userDetails = JSON.stringify(userDetails);
      navigate("/", { replace: true });
    }
  }, [userToken]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosOpen.post(LOGIN_URL, { email, password });
      setUserToken(response?.data?.token);
    } catch (err) {
      if (err.response.status === 401) {
        setShowToster(true);
        setTimeout(() => setShowToster(false), 3000);
      }
    }
  };

  return (
    <div aria-live="polite" aria-atomic="true" className="position-relative">
      {showToster ? (
        <ToastContainer position="top-end" className="p-3">
          <Toast>
            <Toast.Header className="toaster-header">
              <BiErrorCircle className="toaster-icon" />
              <div className="toaster-body">
                <strong className="me-auto">Oops!</strong>
                <br />
                <strong className="me-auto">Invalid Credential</strong>
                {/* <small className="text-muted">just now</small> */}
              </div>
            </Toast.Header>
            {/* <Toast.Body>Invalid Credential</Toast.Body> */}
          </Toast>
        </ToastContainer>
      ) : (
        <></>
      )}
      <div className="form-outer">
        <div className="form-container">
          <div className="form-inner">
            <img src="https://www.crafted.email/wp-content/uploads/2022/09/Privacy-policy-rafiki.png" alt="" />
          </div>
          <div className="form-2">
            <div className="form-signin">
              <div className="form-logo">
                <img alt="brand logo" src={logo} width="120px" height="100px" />
              </div>
              <h1 className="text-center">SIGN IN</h1>
              <Form className="form" onSubmit={handleSubmit}>
                <Form.Floating className="mb-3 ">
                  <Form.Control
                    id="floatingInputCustom"
                    type="email"
                    placeholder="name@example.com"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                    required
                  />
                  <label htmlFor="floatingInputCustom">Email ID</label>
                </Form.Floating>
                <Form.Floating>
                  <Form.Control
                    id="floatingPasswordCustom"
                    type="password"
                    placeholder="Password"
                    ref={passwordRef}
                    autoComplete="off"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    value={password}
                    required
                  />
                  <label htmlFor="floatingPasswordCustom">Password</label>
                </Form.Floating>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <Button variant="primary" className="login-btn" type="submit">
                  Login
                </Button>
              </Form>
            </div>
          </div>
        </div>
        <div className="bg"></div>
      </div>
    </div>
  );
};

export default LoginForm;
