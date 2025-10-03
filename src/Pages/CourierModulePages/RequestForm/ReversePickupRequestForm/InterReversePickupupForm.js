import React from "react";
import { Form, Row, Col, InputGroup, Tab, Tabs } from "react-bootstrap";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import "./InterReversepickupForm.css";
const InterReversepickupForm = (props) => {
  const {
    formData,
    handleInputChange,
    handleFormSubmit,
    isFormValid,
    handleCancle,
    errors,
    getAllDetails
  } = props;

  return (
    <Form>
      <Row>
        <Col md={3} className="my-2">
          <Form.Group>
            <Form.Label htmlFor="officialOrPersonal">
              Official/Personal<span style={{ color: "red" }}>*</span>
            </Form.Label>
            <InputGroup>
              <Form.Control
                as="select"
                id="officialOrPersonal"
                name="officialOrPersonal"
                value={formData.officialOrPersonal}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="1">Official</option>
                <option value="2">Personal</option>
              </Form.Control>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Behalf of"
            name="behalfOf"
            placeholder="Enter Behalf of"
            value={formData.behalfOf}
            onChange={handleInputChange}
            mandatoryIcon={true}
          />
          {errors.behalfOf && (
            <small className="text-danger errorText">{errors.behalfOf}</small>
          )}
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Account Number for pickup"
            name="accountNumber"
            placeholder="Enter Account Number for pickup"
            value={formData.accountNumber}
            onChange={handleInputChange}
            mandatoryIcon={true}
          />
          {errors?.accountNumber && (
            <small className="text-danger errorText">
              {errors?.accountNumber}
            </small>
          )}
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="otherDetails"
        id="reverse-pickup-tabs"
        className="mb-3 my-2"
      >
        <Tab eventKey="Shipper Details" title="Sender Details">
          <Row>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Company Name"
                name="companyName"
                placeholder="Enter Company Name"
                value={formData.companyName}
                onChange={handleInputChange}
                mandatoryIcon={true}
              />
              {errors?.companyName && (
                <small className="text-danger errorText">
                  {errors?.companyName}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <Form.Group>
                <Form.Label htmlFor="address">
                  Address<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter Company Name"
                  />
                </InputGroup>
              </Form.Group>
              {errors?.address && (
                <small className="text-danger errorText">
                  {errors?.address}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <Form.Group>
                <Form.Label htmlFor="streetName">Street Name</Form.Label>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    id="streetName"
                    name="streetName"
                    value={formData.streetName}
                    onChange={handleInputChange}
                    placeholder="Enter street Name"
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                mandatoryIcon={true}
                placeholder="Enter Country"
              />
              {errors?.country && (
                <small className="text-danger errorText">
                  {errors?.country}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                mandatoryIcon={true}
                placeholder="Enter City"
              />
              {errors?.city && (
                <small className="text-danger errorText">{errors?.city}</small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="numeric"
                labelName="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                mandatoryIcon={true}
                maxLength={8}
                placeholder="Enter Zip Code"
              />
              {errors?.zipCode && (
                <small className="text-danger errorText">
                  {errors?.zipCode}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Contact Name"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                // mandatoryIcon={true}
                placeholder="Enter Contact Name"
              />
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Department Name"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                // mandatoryIcon={true}
                placeholder="Enter Department Name"
              />
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="numeric"
                labelName="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                mandatoryIcon={true}
                placeholder="Enter Phone Number"
                maxLength={14}
              />
              {/* {errors?.phoneNumber && (
                <small className="text-danger errorText">
                  {errors?.phoneNumber}
                </small>
              )} */}
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="numeric"
                labelName="Landline Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                // mandatoryIcon={true}
                placeholder="Enter Landline Number"
              />
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Email Address"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                // mandatoryIcon={true}
                placeholder="Enter Email Address"
              />
              {errors?.emailAddress && (
                <small className="text-danger errorText">
                  {errors?.emailAddress}
                </small>
              )}
            </Col>
          </Row>
        </Tab>
        <Tab
          eventKey="Consignee Address ( for all request )"
          title="Consignee Address ( for all request )"
        >
          <Row>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Company Name"
                name="ConsigneecompanyName"
                value={formData.ConsigneecompanyName}
                onChange={handleInputChange}
                mandatoryIcon={true}
                placeholder="Enter Company Name"
              />
              {errors?.ConsigneecompanyName && (
                <small className="text-danger errorText">
                  {errors?.ConsigneecompanyName}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <Form.Group>
                <Form.Label htmlFor="address">
                  Building Name/Number<span style={{ color: "red" }}>*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    id="address"
                    name="Consigneeaddress"
                    value={formData.Consigneeaddress}
                    onChange={handleInputChange}
                    mandatoryIcon={true}
                    placeholder="Enter Company Address"
                  />
                </InputGroup>
              </Form.Group>
              {errors?.Consigneeaddress && (
                <small className="text-danger errorText">
                  {errors?.Consigneeaddress}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <Form.Group>
                <Form.Label htmlFor="streetName">Street Name</Form.Label>
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    id="streetName"
                    name="ConsigneestreetName"
                    value={formData.ConsigneestreetName}
                    onChange={handleInputChange}
                    placeholder="Enter street Name"
                    mandatoryIcon={true}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Country"
                name="Consigneecountry"
                value={formData.Consigneecountry}
                onChange={handleInputChange}
                mandatoryIcon={true}
                placeholder="Enter Country"
              />
              {errors?.Consigneecountry && (
                <small className="text-danger errorText">
                  {errors?.Consigneecountry}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="City"
                name="Consigneecity"
                value={formData.Consigneecity}
                onChange={handleInputChange}
                mandatoryIcon={true}
                placeholder="Enter City"
              />
              {errors?.Consigneecity && (
                <small className="text-danger errorText">
                  {errors?.Consigneecity}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="numeric"
                labelName="Zip Code"
                name="ConsigneezipCode"
                value={formData.ConsigneezipCode}
                onChange={handleInputChange}
                mandatoryIcon={true}
                placeholder="Enter Zip Code"
                maxLength={8}
              />
              {errors?.ConsigneezipCode && (
                <small className="text-danger errorText">
                  {errors?.ConsigneezipCode}
                </small>
              )}
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Contact Name"
                name="ConsigneecontactName"
                value={formData.ConsigneecontactName}
                onChange={handleInputChange}
                // mandatoryIcon={true}
                placeholder="Enter Contact Name"
              />
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Department Name"
                name="ConsigneedepartmentName"
                value={formData.ConsigneedepartmentName}
                onChange={handleInputChange}
                // mandatoryIcon={true}
                placeholder="Enter Department Name"
              />
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Phone Number"
                name="ConsigneephoneNumber"
                value={formData.ConsigneephoneNumber}
                onChange={handleInputChange}
                mandatoryIcon={true}
                placeholder="Enter Phone Number"
                maxLength={14}
              />
              {/* {errors?.ConsigneephoneNumber && (
                <small className="text-danger errorText">
                  {errors?.ConsigneephoneNumber}
                </small>
              )} */}
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Landline Number"
                name="ConsigneemobileNumber"
                value={formData.ConsigneemobileNumber}
                onChange={handleInputChange}
                // mandatoryIcon={true}
                placeholder="Enter Landline Number"
              />
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Email Address"
                name="ConsigneeemailAddress"
                value={formData.ConsigneeemailAddress}
                onChange={handleInputChange}
                // mandatoryIcon={true}
                placeholder="Enter Email Address"
              />
              {errors?.ConsigneeemailAddress && (
                <small className="text-danger errorText">
                  {errors?.ConsigneeemailAddress}
                </small>
              )}
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="Shipment Details" title="Shipment Details">
          <Row>
            <Col md={2} className="my-2">
              <CustomInput
                type="text"
                labelName="Value"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                placeholder="Enter value"
              />
            </Col>
            <Col md={2} className="my-2">
              <CustomInput
                type="text"
                labelName="Weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="Enter Weight"
              />
            </Col>
            <Col md={2} className="my-2">
              <CustomInput
                type="text"
                labelName="No of box/carton"
                name="numberOfBoxes"
                value={formData.numberOfBoxes}
                onChange={handleInputChange}
                placeholder="Enter No of box/carton"
              />
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Dimension"
                name="dimension"
                value={formData.dimension}
                onChange={handleInputChange}
                placeholder="Enter Dimension"
              />
            </Col>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Contents"
                name="contents"
                value={formData.contents}
                onChange={handleInputChange}
                placeholder="Enter Contents"
              />
            </Col>
            <Col md={4} className="my-2">
              <CustomInput
                type="text"
                labelName="Special Instruction"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Enter Special Instruction"

              />
            </Col>
            <Col md={4} className="my-2">
              <CustomInput
                type="text"
                labelName="PO number/Order/Invoice"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleInputChange}
                placeholder="Enter PO number/Order/Invoice"
              />
            </Col>
            <Col md={4} className="my-2">
              {/* <CustomInput
                type="text"
                labelName="Insurance by DHL (additional cost applicable)"
                name="insurance"
                value={formData.insurance}
                onChange={handleInputChange}
              /> */}

              <Form.Label>
                {"Insurance by DHL"}(
                <span style={{ fontSize: "12px" }}>
                  {" "}
                  additional cost applicable{" "}
                </span>
                )
              </Form.Label>

              <Form.Control
                type="text"
                value={formData.insurance}
                onChange={handleInputChange}
                className="shadow-none border-secondary-subtle"
                placeholder="Enter Insurance by DHL"
              />
            </Col>
          </Row>
        </Tab>
      </Tabs>

      <Row className="mt-3 mb-2 justify-content-end">

        <Col md={2}>
          <CustomSingleButton
            _ButtonText="Submit"
            height={"40px"}
            onPress={handleFormSubmit}
            disabled={!isFormValid()}
          />
        </Col>
        <Col md={2}>
          <CustomSingleButton
            _ButtonText="Cancel"
            height={"40px"}
            onPress={handleCancle}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default InterReversepickupForm;
