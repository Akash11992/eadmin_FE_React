import React, { useState } from "react";
import CustomInput from "../../../../../Components/CustomInput/CustomInput";
import { Col, Container, Row } from "react-bootstrap";
import CustomDropdown from "../../../../../Components/CustomDropdown/CustomDropdown";
import CustomSingleButton from "../../../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../../../Components/Title/Title";
const EmailAnalytics = () => {
  const [formData, setFormData] = useState({
    formDate: "",
    toDate: "",
    campagin: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const data = [
    {
      value: 1,
      lable: "All",
    },
  ];
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="mt-3 ms-0">
        <Title title="Email Analytics" />
      </Row>
      <hr />
      <Row>
        <Col md={3}>
          <CustomInput
            labelName="From Date"
            type="date"
            value={formData?.formDate}
            name="formDate"
            // placeholder="Role Name"
            onChange={handleInputChange}
            // mandatoryIcon={true}
          />
        </Col>
        <Col md={3}>
          <CustomInput
            labelName="To Date"
            type="date"
            value={formData?.toDate}
            name="toDate"
            // placeholder="Role Name"
            onChange={handleInputChange}
            // mandatoryIcon={true}
          />
        </Col>
        <Col md={3}>
          <CustomDropdown
            dropdownLabelName="Campagin"
            options={[
              { value: "", label: "Select Campagin" },
              ...data.map((e) => ({
                value: e.value,
                label: e.lable,
              })),
            ]}
            // options={designationData}
            onChange={(e) =>
              setFormData({ ...formData, campagin: e.target.value })
            }
            selectedValue={parseInt(formData.campagin)}
            valueKey="value"
            labelKey="label"
          />
        </Col>
        <Col md={2} className="align-content-end mb-4 mt-4">
          <CustomSingleButton
            _ButtonText={"Search"}
            height={40}
            onPress={() => {
              alert("work in progress..!");
            }}
            // disabled={!isFormValid()}
          />
        </Col>
      </Row>
      <Row className="m-0 mb-4 mt-2">

      <Container className="border text-center">
        No Records found
      </Container>
      </Row>

    </div>
  );
};

export default EmailAnalytics;
