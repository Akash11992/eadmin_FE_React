import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FromDate = (props) => {
  const { fromDate, endDate, handleChange, Label, mandatoryIcon } = props;
  return (
    <>
      <Form.Label>{Label}</Form.Label>
      {mandatoryIcon && <span className="text-danger">*</span>}
      <DatePicker
        selected={fromDate}
        onChange={handleChange}
        selectsStart
        startDate={fromDate}
        endDate={endDate}
        maxDate={endDate}
        placeholderText="DD-MM-YYYY"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={15}
        className="form-control"
        dateFormat="dd-MM-yyyy"
      />
    </>
  );
};

export default FromDate;
