import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

const FinancialYear = (props) => {
  const { selectedYear, handleYear } = props;
  const currentYear = new Date().getFullYear();
  const financialYears = Array.from({ length: 10 }, (_, i) => {
    const startYear = currentYear - i;
    const endYear = startYear + 1;
    return `${startYear}-${endYear.toString().slice(-2)}`; // Converts 2024 to "24"
  });
  return (
    <>
      <Form.Group controlId="financialYear">
        <Form.Select value={selectedYear} onChange={handleYear}>
          <option value=""> Select FY</option>
          {financialYears?.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </>
  );
};

export default FinancialYear;
