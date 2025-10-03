import React from "react";
import { Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import "./CommonInput.css";
const CustomInput = (props) => {
  const {
    value,
    onChange,
    placeholder,
    type,
    labelName,
    maxLength,
    mandatoryIcon,
    name,
    textcolor,
    isValid,
    isDisable,
    accept,
    ref,
    onKeyPress,
    height,
    isMin,
    isMax,
    readOnly,
    onKeyDown,
    onPaste,
    multiple
  } = props;
  const inputStyle = {
    height: height,
    textAlign: type === "number" ? "right" : "left",
  };

  return (
    <div>
      {labelName && <Form.Label className={textcolor}>{labelName}</Form.Label>}
      {mandatoryIcon && <span className="text-danger">*</span>}
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        name={name}
        className={
          "shadow-none border-secondary-subtle placeholder-right placeholder-left"
        }
        inputMode={type === "number" ? "numeric" : "text"}
        isValid={isValid}
        disabled={isDisable}
        accept={accept}
        ref={ref}
        onKeyPress={onKeyPress}
        min={isMin}
        max={isMax}
        readOnly={readOnly}
        style={inputStyle}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        multiple={multiple}
        // className={type === "number" ? "placeholder-right" : "placeholder-left"}
        // style={{ ...inputStyle, ...placeholderStyle }}
      />
    </div>
  );
};

export default CustomInput;
