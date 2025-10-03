import React, { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Title } from "../../Components/Title/Title";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import CustomInput from "../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
const AgreementUpload = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [agreementType, setAgreementType] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleAgreementTypeChange = (e) => {
    setAgreementType(e.target.value);
  };

  // Dummy dropdown data
  const data = [
    { value: "1", label: "Type 1" },
    { value: "2", label: "Type 2" },
    { value: "3", label: "Type 3" },
    { value: "4", label: "Type 4" },
    { value: "5", label: "Type 5" },
  ];

  const handleSubmit = () => {
    if (!file || !name || !date) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    // Handle file upload logic
    console.log("File:", file);
    console.log("Name:", name);
    console.log("Date:", date);
    console.log("Agreement Type:", agreementType);
  };

  return (
    <Row className="me-1 ms-1">
      <Card>
        <Title title="Upload Agreement Document" />
        <Card.Body>
          <Form>
            <Row className="align-items-center">
              <Col md={3} className="mb-3">
                <CustomInput
                  labelName="Name"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={handleNameChange}
                  maxLength={50}
                />
              </Col>

              <Col md={3} className="mb-3">
                <CustomInput
                  labelName="Date"
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  maxLength={50}
                />
              </Col>

              <Col md={3} className="mb-3">
                <CustomDropdown
                  dropdownLabelName="Agreement Type"
                  options={data}
                  onChange={handleAgreementTypeChange}
                  selectedValue={agreementType}
                />
              </Col>

              <Col md={3} className="mb-3">
                <CustomInput
                  labelName="Upload Agreement"
                  type="file"
                  onChange={handleFileChange}
                />
              </Col>
            </Row>
            <Col className="d-flex justify-content-around my-3">
              <CustomSingleButton
                _ButtonText="Upload"
                onPress={handleSubmit}
                backgroundColor="Black"
                width={80}
                height={40}
              />
            </Col>
          </Form>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default AgreementUpload;
