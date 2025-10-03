import React, { useMemo } from "react";
import { Dropdown, Form } from "react-bootstrap";
import "./MultiSelectDropdown.css";

const MultiSelectDropdown = (props) => {
  const {
    data = [],
    valueKey,
    labelKey,
    value,
    label,
    isDisabled,
    handleCheckboxChange,
    selectLabel,
    name,
    mandatoryIcon,
  } = props;

  const memoizedEmployeeOptions = useMemo(() => data, [data]);

  const selectedItems = memoizedEmployeeOptions.filter((option) =>
    value?.includes(option[valueKey]?.toString())
  );

  let displayText;
  if (selectedItems.length > 1) {
    displayText = `${selectedItems[0][labelKey]} + ${
      selectedItems.length - 1
    } `;
  } else if (selectedItems.length === 1) {
    displayText = selectedItems[0][labelKey];
  } else {
    displayText = selectLabel;
  }

  const renderCheckboxes = () =>
    memoizedEmployeeOptions.map((option) => (
      <Form.Check
        type="checkbox"
        label={option[labelKey]}
        value={option[valueKey]?.toString()}
        onChange={(e) => handleCheckboxChange(e)}
        key={option[valueKey]}
        name={name}
        checked={value?.includes(option[valueKey]?.toString())}
        className="mx-2"
      />
    ));

  return (
    <>
      {label && <Form.Label>{label}</Form.Label>}
      {mandatoryIcon && <span className="text-danger ms-0">*</span>}

      <Dropdown>
        <Dropdown.Toggle
          className="w-100 custom-dropdown-toggle"
          variant="outline-secondary"
          id="dropdown-basic"
          disabled={isDisabled}
        >
          {displayText || "Select Options"}
        </Dropdown.Toggle>
        <Dropdown.Menu className="w-100 scrollable-dropdown-menu">
          <Form>
            {renderCheckboxes()}
            </Form>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default MultiSelectDropdown;
