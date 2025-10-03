import React from "react";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core css
// import "primeicons/primeicons.css"; 
// import "primeflex/primeflex.css"; 
import { Form } from "react-bootstrap";
import './CommonCalender.css';

const CommonCalender = (props) => {
  const { selectedDate, onChange, placeholder, labelName, mandatoryIcon ,textcolor} =
    props;

  const handleDateChange = (e) => {
    if (onChange) {
      onChange(e.value);
    }
  };
 return (
    <div>

      {labelName && <Form.Label className={textcolor}>{labelName}</Form.Label>}
      {mandatoryIcon && <span className="text-danger">*</span>}
      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
        placeholder={placeholder || "Select date"}
        dateFormat="dd/mm/yy"
        className="shadow-none border-secondary-subtle custom-calendar"
      />
    </div>
  );
};

export default CommonCalender;
