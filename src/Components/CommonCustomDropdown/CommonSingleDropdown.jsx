import React from "react";
import { Dropdown } from "primereact/dropdown";
import { Form, InputGroup } from "react-bootstrap";
import "./CommonSingleDropdown.css";

const CommonSingleDropdown = (props) => {
  const {
    dropdownLabelName,
    options,
    valueKey = "code",
    labelKey = "name",
    onChange,
    selectedValue,
    mandatoryIcon,
    ref,
    isDisable,
    placeholder = "Select an option",
    filter = true,
    selectLevel,
    matchDepartments,
    height,
  } = props;

  const handleChange = (e) => {
    onChange(e);
  };

  const defaultValueTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option[labelKey]}</div>
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const defaultOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">
        <div>{option[labelKey]}</div>
      </div>
    );
  };

  return (
    <div className="align-items-center">
      {dropdownLabelName && (
        <Form.Label htmlFor="customDropdown">{dropdownLabelName}</Form.Label>
      )}
      {mandatoryIcon && <span className="text-danger ms-0">*</span>}
      <div>
        <Dropdown
          value={selectedValue}
          onChange={handleChange}
          options={options}
          optionLabel={labelKey}
          placeholder={placeholder}
          filter={filter}
          valueTemplate={defaultValueTemplate}
          itemTemplate={defaultOptionTemplate}
          // className="w-100 md:w-14rem"
          className={`w-100 md:w-14rem ${selectedValue ? 'selected-value' : ''}`}
        />
      </div>
    </div>
  );
};

export default CommonSingleDropdown;