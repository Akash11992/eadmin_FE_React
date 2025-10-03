import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EndDate = (props) => {
  const { fromDate, endDate, handleChange, Label,mandatoryIcon } = props;

  return (
    <>
      <Form.Label>{Label}</Form.Label>
      {mandatoryIcon && (
        <span className="text-danger">*</span>
      )}
    {/* <style>{`
        .react-datepicker-wrapper{
         width:100%
    }
    `}

    </style> */}
      <DatePicker
        selected={endDate}
        onChange={handleChange}
        selectsEnd
        startDate={fromDate}
        endDate={endDate}
        minDate={fromDate}
        placeholderText="DD-MM-YYYY"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={15}
        className="form-control"
        dateFormat="dd-MM-yyyy"
        popperPlacement= "left-start"
      />
      
    </>
  );
};

export default EndDate;
