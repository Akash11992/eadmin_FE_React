import React from "react";
import { MultiSelect } from "primereact/multiselect";
import { Form } from "react-bootstrap";

const MultiSelectDropdown2 = (props) => {
  const {
    value,
    onChange,
    options,
    optionLabel,
    placeholder,
    selectAll,
    label,
    height
  } = props;

  return (
    <div className="multi-select-wrapper">
      <style>{`
        ul {
          padding: 0 !important;
        }
          .p-multiselect-select-all-label {
          margin: 0px !important
          }
          .custom-height {
          height: ${height || "auto"};
        }
      `}</style>
      <Form.Label>{label}</Form.Label>
      <MultiSelect
        value={value}
        onChange={onChange}
        options={options}
        optionLabel={optionLabel}
        placeholder={placeholder}
        display="chip"
        // maxSelectedLabels={3}
        className="shadow-none border-secondary-subtle w-100"
        panelClass="custom-multiselect-panel"
        showSelectAll={true}
        selectAllLabel="Select All"
        style={{ height: height || "auto" }}
      />
    </div>
  );
};

export default MultiSelectDropdown2;
