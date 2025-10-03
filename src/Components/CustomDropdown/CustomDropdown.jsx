import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const CustomDropdown = (props) => {
  const {
    dropdownLabelName,
    options,
    valueKey,
    labelKey,
    onChange,
    selectedValue,
    mandatoryIcon,
    ref,
    isDisable,
    placeholder,
    selectLevel,
    matchDepartments,
    height,
    name,
  } = props;
  const handleChange = (e) => {
    onChange(e);
  };
  return (
    <div className="align-items-center">
      {dropdownLabelName && (
        <Form.Label htmlFor="customDropdown">{dropdownLabelName}</Form.Label>
      )}
      {mandatoryIcon && <span className="text-danger ms-0">*</span>}
      <InputGroup>
        <Form.Control
          as="select"
          id="customDropdown"
          aria-label={dropdownLabelName}
          onChange={handleChange}
          value={selectedValue}
          ref={ref}
          className="shadow-none border-secondary-subtle"
          disabled={isDisable}
          style={{ height: height || "auto" }}
          name={name}
        >
          {/* <option value="">{placeholder}</option> */}
          {props.Dropdownlable && (
            <option value="" disabled>
              {selectLevel || "Select"}
            </option>
          )}

          {options?.map((option) => (
            <option
              key={option[valueKey]}
              value={option[valueKey]}
              style={{
                color: matchDepartments?.includes(option[valueKey])
                  ? "red"
                  : "inherit",
              }}
            >
              {option[labelKey]}
            </option>
          ))}
        </Form.Control>
      </InputGroup>
    </div>
  );
};

export default CustomDropdown;
