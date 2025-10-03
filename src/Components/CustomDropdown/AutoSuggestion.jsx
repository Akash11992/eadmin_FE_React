import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

const AutoSuggestion = (props) => {
  const {
    dropdownLabelName,
    options,
    valueKey,
    labelKey,
    onChange,
    selectedValue,
    mandatoryIcon,
    isDisable,
    placeholder,
    matchDepartments,
  } = props;

  const [searchTerm, setSearchTerm] = useState("");
  // Sync searchTerm with selectedValue
  useEffect(() => {
    if (selectedValue === null || selectedValue === undefined) {
      setSearchTerm(""); // Reset searchTerm if selectedValue is null
    } else {
      const selectedOption = options.find(
        (option) => option[valueKey]?.toString() == selectedValue?.toString()
      );
      setSearchTerm(selectedOption ? selectedOption[labelKey] : "");
    }
  }, [selectedValue, options, valueKey, labelKey]);

  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onChange && onChange(e);
  };

  const handleSelect = (option) => {
    setSearchTerm(option[labelKey]);
    onChange({ target: { value: option[valueKey] } });
    setIsFocused(false);
  };

  const filteredOptions = options?.filter((option) =>
    option[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="align-items-center position-relative">
      {dropdownLabelName && (
        <Form.Label htmlFor="customDropdown">{dropdownLabelName}</Form.Label>
      )}
      {mandatoryIcon && <span className="text-danger ms-0">*</span>}
      <InputGroup>
        <Form.Control
          type="text"
          id="customDropdown"
          aria-label={dropdownLabelName}
          onChange={handleSearch}
          value={searchTerm}
          className="shadow-none border-secondary-subtle"
          disabled={isDisable}
          placeholder={placeholder || "Start typing..."}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} 
          autoComplete="off"// Delayed blur to allow option click
        />
      </InputGroup>
      {isFocused && (
        <div
          className="position-absolute bg-white border border-secondary-subtle rounded w-100 p-2"
          style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option[valueKey]}
                onClick={() => handleSelect(option)}
                className="dropdown-item"
                style={{
                  cursor: "pointer",
                  // backgroundColor: "#e6e8eb"
                }}
              >
                {option[labelKey]}
              </div>
            ))
          ) : (
            <div className="dropdown-item text-muted">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoSuggestion;
