import React from "react";
import { Form } from "react-bootstrap";

const AutosizeTextarea = (props) => {
  const { value, onChnage, rows, label, mandatoryIcon, isDisable } = props;

  return (
    <div>
      {label && <Form.Label>{label}</Form.Label>}
      {mandatoryIcon && <span className="text-danger ms-2">*</span>}

      <Form.Control
        as="textarea"
        rows={rows}
        value={value}
        onChange={onChnage}
        disabled={isDisable}
      />
      {/* <TextareaAutosize
          minRows={minRows}
          maxRows={maxRows}
          value={value}
          onChnage={onChnage}
          placeholder={placeholder}
        /> */}
    </div>
  );
};

export default AutosizeTextarea;
