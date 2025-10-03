import React from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";

const MonthSelect = (props) => {
  const { selectedDate, handleChange, Label, mandatoryIcon } = props;

  return (
    <>
      <Form.Label>{Label}</Form.Label>
      {mandatoryIcon && <span className="text-danger">*</span>}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
            if (date) {
              const formattedDate = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}`; // Format as YYYY-MM
              handleChange(formattedDate);
            } else {
              handleChange(""); // Clear date logic
            }
          }}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        isClearable
        placeholderText="Select Month"
        className="form-control"
      />
    </>
  );
};

export default MonthSelect;
