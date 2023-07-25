import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, FloatingLabel } from "react-bootstrap";
import { axiosOpen, axiosSecure, getAuthorizationHeader } from "../../../../api/axios";
import { StockContext } from "../../../../contexts/StockContext";
import { Toaster } from "../../../../component/Toaster/Toaster";
import SystemProperties from "../../../../constants/SystemProperties.json";

const initialValues = {
  modal: "",
  systemName: "",
  cpu: "",
  ram: "",
  storageCapacity:"",
  brand:"",
  os: "",
  ipAddress: "",
  macAddress: "",
  storageType: "",
  serialNumber: "",
  antivirusStatus: "",
  warrantyPeriod: "",
  dop: "",
};


const SytemDetailsForm = () => {
  const basicSchema = yup.object().shape({
    modal: yup.string().required("System Model is required"),
    systemName: yup.string().required("System Name is required"),
    cpu: yup.string().required("System CPU is required"),
    ram: yup.string().required("System RAM is required"),
    storageCapacity: yup
      .string()
      .required("System Storage Capacity is required"),
    brand: yup.string().required("System Brand is required"),
    os: yup.string().required("System OS is required"),
    ipAddress: yup.string().required("System IP Address is required"),
    macAddress: yup.string().required("System Mac Address is required"),
    storageType: yup.string().required("System Storage Type is required"),
    serialNumber: yup.string().required("System Serial Number is required"),
    antivirusStatus: yup.string().required("System Anti Virus is required"),
    warrantyPeriod: yup.string().required("System Warranty Period is required"),
    dop: yup.string().required("System Date of Purchase is required"),
  });
  const [showToaster, setShowToaster] = useState(false);
  const [successToaster, setSuccessToaster] = useState(false);
  const { setDeviceCategory } = useContext(StockContext);

  const handleSubmit = async (values, setSubmitting) => {
    const userBranch = JSON.parse(localStorage.getItem("userDetails")).branch;
    try {
      const { status } = await axiosSecure.post(
        "/product",
        {
          cpu: values.cpu,
          ram: values.ram,
          storageCapacity: values.storageCapacity,
          macAddress: values.macAddress,
          os: values.os,
          ipAddress: values.ipAddress,
          systemName: values.systemName,
          antivirusStatus: values.antivirusStatus,
          productType: values.productType,
          storageType : values.storageType,
          serialNumber  : values.serialNumber,
          branch: userBranch,
          brand: values.brand,
          modal: values.modal,
          dop: values.dop,
          warrantyPeriod: values.warrantyPeriod,
          tag: "unassigned",
        },
        {
          headers: { Authorization: getAuthorizationHeader() },
        }
      );
      // if (status === 201) {
      //   setSubmitting(false);
      //   setDeviceCategory("System");
      //   setSuccessToaster(true);
      //   setShowToaster(true);
      // }
    } catch (error) {
      setSuccessToaster(true);
      setShowToaster(true);
    }
  };

  const {
    handleSubmit: formikHandleSubmit,
    handleChange,
    values,
    touched,
    isValid,
    errors,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: basicSchema,
    onSubmit: handleSubmit,
  });

  const navigate = useNavigate();
  return (
    <>
      <Row>
        <Col>
          <h4
            className="fw-bold fs-5 mm "
            style={{ lineHeight: 1, margin: "24px 0" }}
          >
            SYSTEM DETAILS
          </h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={formikHandleSubmit}>
            <Row>
              {SystemProperties.length > 0 &&
                SystemProperties.map(({ id, label, name, type }) => (
                  <Col md={6} key={id}>
                    <FloatingLabel className="mb-3" label={label}>
                      <Form.Control
                        type={type}
                        name={name}
                        placeholder={label}
                        value={values?.[`${name}`]}
                        onChange={handleChange}
                        isInvalid={
                          touched?.[`${name}`] && !!errors?.[`${name}`]
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.[`${name}`]}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                ))}
            </Row>
            <Row>
              <Col xl={12} className="mt-4">
                <Button type="submit">Add System</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Toaster
        title={
          successToaster
            ? "Device Added Successfully"
            : "Oops something went wrong."
        }
        bg={successToaster ? "success" : "danger"}
        showToaster={showToaster}
        setShowToaster={setShowToaster}
        to="stock"
      ></Toaster>
    </>
  );
};

export default SytemDetailsForm;
