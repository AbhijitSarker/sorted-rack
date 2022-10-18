import React from "react";
import { Dropdown } from "react-bootstrap";
import "./DropdownCust.scss";

const DropdownCust = ({ menuList, value, onSelectHandler }) => {
  return (
    <Dropdown onSelect={(selectedOption) => onSelectHandler(selectedOption)}>
      <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-cust-btn">
        {value}
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-cust">
        {menuList.map(({ id, name }) => (
          <Dropdown.Item eventKey={name} key={id}>
            {name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownCust;
