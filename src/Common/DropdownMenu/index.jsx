import React from "react";
import { Field } from "formik";
import "./DropdownMenu.css";
const DropdownMenu = ({ name, value, onChange, menuList }) => {
  return (
    <Field as="select" name={name} onChange={onChange} className="w-100 dropdownMenu">
      <option label={value || menuList[0].name} hidden></option>
      {menuList.map((item) => (
        <option value={item.name} key={item.id}>
          {item.name}
        </option>
      ))}
    </Field>
  );
};

export default DropdownMenu;
