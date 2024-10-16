import React, { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import SytemDetailsForm from "./SytemDetailsForm";
import AccessoriesFormContainer from "./AccessoriesForm";

import { BsMouse2, BsCpu } from "react-icons/bs";
import { StockContext } from "../../../contexts/StockContext";
import { HeaderContext } from "../../../contexts/HeaderContext";
const AddStock = () => {
  const { deviceCategory } = useContext(StockContext);
  const [activeTab, setActiveTab] = useState(deviceCategory);
  const handleSelect = (selectedTab) => setActiveTab(selectedTab);
  const { setHeaderText } = useContext(HeaderContext);

  useEffect(() => {
    setHeaderText('Add Stock');
  }, [setHeaderText]);

  return (
    <Container style={{ width: "80%" }}>
      <Row>
        <Col xl={12} className="my-4 ">
        </Col>
      </Row>
      <Row>
        <Col xl={12}>
          <Tabs className="myClass border border-0" activeKey={activeTab} onSelect={handleSelect}>
            <Tab
              className="tab"
              eventKey={"System"}
              title={
                <div className="tab-outer">
                  <BsCpu className="tab-icon" />
                  <h6 className="tab-text">System</h6>
                </div>
              }
            >
              <SytemDetailsForm />
            </Tab>
            <Tab
              className="tab"
              eventKey={"Accessories"}
              title={
                <div className="tab-outer">
                  <BsMouse2 className="tab-icon" />
                  <h6 className="tab-text">Accessories</h6>
                </div>
              }
            >
              <AccessoriesFormContainer />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default AddStock;
