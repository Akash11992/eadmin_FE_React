import React from "react";
import { Col, Row } from "react-bootstrap";
import CustomInput from "../../../Components/CustomInput/CustomInput";

const FormComponent = (props) => {
  const { form, handleFormChange } = props;

  return (
    <>
      <Row>
        <Col md={4}>
          <CustomInput
            type="file"
            labelName="Upload Agreement:"
            onChange={(e) => handleFormChange("file", e.target.files[0])}
            accept= ".pdf, .jpeg, .jpg, .png"
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="number"
            labelName="Deposit Amount:"
            placeholder="Enter Amount"
            value={form.depositAmt}
            onChange={(e) => handleFormChange("depositAmt", e.target.value)}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="text"
            labelName="Parking:"
            placeholder="Enter Details"
            value={form.parking}
            onChange={(e) => handleFormChange("parking", e.target.value)}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col md={4}>
          <CustomInput
            type="text"
            labelName="Maintenance/Property Taxes:"
            placeholder="Enter Details"
            value={form.propTax}
            onChange={(e) => handleFormChange("propTax", e.target.value)}
          />
        </Col>
       
      </Row>
    </>
  );
};

export default FormComponent;