import React from "react";
import { Form } from "react-bootstrap";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";

const MultiEmailInput = (props) => {
  const { emails, onChange, label, placeHolder, mandatoryIcon } = props;
  return (
    <>
      {label && <Form.Label>{label}</Form.Label>}
      {mandatoryIcon && <span className="text-danger ms-0">*</span>}
      <ReactMultiEmail
        placeholder={placeHolder}
        emails={emails || []}
        onChange={onChange}
        validateEmail={(email) => isEmail(email)}
        getLabel={(email, index, removeEmail) => (
          <div key={index} data-tag>
            {email}
            <span
              data-tag-handle
              onClick={() => removeEmail(index)}
              style={{ cursor: "pointer" }}
            >
              ×
            </span>
          </div>
        )}
      />
    </>
  );
};

export default MultiEmailInput;
