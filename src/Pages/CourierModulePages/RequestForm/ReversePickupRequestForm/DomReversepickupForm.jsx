// ShipmentForm.js
import React, { useEffect, useState } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../../../Components/CustomDropdown/CustomDropdown";
import { useDispatch, useSelector } from "react-redux";
import AddNewAccountModal from "../../OutwardCourier/AddNewAccountModal";
import { getCompanyDetailsByAccount } from "../../../../Slices/CourierSevices/CourierSevicesSlice";

const DomReversepickupForm = (props) => {
  const {
    formData,
    handleInputChange,
    handleSaveDetails,
    handleCancle,
    isFormValid,
  } = props;
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountCode, setNewAccountCode] = useState("");
  const handleModalSave = () => {
    setShowModal(false);
    handleInputChange("accountNumber", newAccountCode);
  };
  const CourierComName = useSelector(
    (state) => state.CourierService.companybyaccount?.data || []
  );
  useEffect(() => {
    dispatch(getCompanyDetailsByAccount());
  }, [dispatch]);

  return (
    <Form>
      <Row>
        <Col md={3} className="my-2">
          <Form.Group>
            <Form.Label htmlFor="officialOrPersonal">
              Official/Personal <span style={{ color: "red" }}>*</span>
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
                <option value="0">Official</option>
                <option value="1">Personal</option>
              </Form.Control>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={3} className="my-2">
          <CustomInput
            type="text"
            labelName="Behalf of"
            name="behalfOf"
            placeholder="Enter Behalf of"
            value={formData.behalfOf}
            onChange={handleInputChange}
            mandatoryIcon={true}
          />
        </Col>
        <Col md={3} className="my-2" />
        <Col md={3} className="my-2" />
        <Col md={3} className="my-2">
          <CustomDropdown
            selectLevel="Select"
            Dropdownlable={true}
            dropdownLabelName="Account Number"
            labelKey="displayText" // Use combined label
            valueKey="AccountNo"
            options={[
              ...CourierComName.map((item) => ({
                ...item,
                displayText: `${item.AccountNo} - ${item.CompanyName}`, // Combine AccountNo & CompanyName
              })),
              { AccountNo: "Add New", displayText: "Add New" }, // Keep "Add New" option
            ]}
            selectedValue={formData.accountNumber}
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue === "Add New") {
                setShowModal(true);
              } else {
                handleInputChange({
                  target: { name: "accountNumber", value: selectedValue },
                });
              }
            }}
            mandatoryIcon={true}
            className="custom-dropdown"
          />

          {/* <CustomInput
            type="text"
            labelName="Account Number"
            name="accountNumber"
            placeholder="Enter Account Number"
            value={formData.accountNumber}
            onChange={handleInputChange}
            mandatoryIcon={true}
          /> */}
        </Col>
        <AddNewAccountModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleModalSave}
          newAccountName={newAccountName}
          setNewAccountName={setNewAccountName}
          newAccountCode={newAccountCode}
          setNewAccountCode={setNewAccountCode}
        />
        <Col md={3} className="my-2">
          <CustomInput
            type="text"
            labelName="Weight of shipment"
            placeholder="Enter Weight of shipment"
            name="weightOfShipment"
            value={formData.weightOfShipment}
            onChange={handleInputChange}
          />
        </Col>
        <Col md={3} className="my-2">
          <CustomInput
            type="numeric"
            labelName="Number of Box"
            placeholder="Enter Number of Box"
            name="numberOfBox"
            value={formData.numberOfBox}
            onChange={handleInputChange}
            maxLength={5}
          />
        </Col>
        <Col md={3} className="my-2">
          <Form.Group>
            <Form.Label htmlFor="modeOfTransport">Mode of Transport</Form.Label>
            <InputGroup>
              <Form.Control
                as="select"
                id="modeOfTransport"
                name="modeOfTransport"
                value={formData.modeOfTransport}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="Air">Air</option>
                <option value="Road">Road</option>
                <option value="Sea">Sea</option>
              </Form.Control>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={3} className="my-2">
          <CustomInput
            type="text"
            labelName="Point of Contact"
            name="pointOfContact"
            placeholder="Enter Point of Contact"
            value={formData.pointOfContact}
            onChange={handleInputChange}
          />
        </Col>
        <Col md={3} className="my-2">
          <Form.Group>
            <Form.Label htmlFor="pickupAddress">Pickup Address</Form.Label>
            <InputGroup>
              <Form.Control
                as="textarea"
                id="pickupAddress"
                name="pickupAddress"
                placeholder="Enter your pickupAddress"
                value={formData.pickupAddress}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={3} className="my-2">
          <Form.Group>
            <Form.Label htmlFor="deliveryAddress">Delivery Address</Form.Label>
            <InputGroup>
              <Form.Control
                as="textarea"
                id="deliveryAddress"
                placeholder="Enter your deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-3 mb-2 justify-content-end">
        <Col md={2}>
          <CustomSingleButton
            _ButtonText={"Submit"}
            height={"40px"}
            disabled={!isFormValid()}
            onPress={handleSaveDetails}
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

export default DomReversepickupForm;
