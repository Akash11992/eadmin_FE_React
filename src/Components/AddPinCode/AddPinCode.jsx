import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CustomInput from "../CustomInput/CustomInput";
import { Col, Row } from "react-bootstrap";

const AddPinCode = (props) => {
  const {
    handleClose,
    show,
    handleSavePinCode,
    enterPincode,
    handlePinChange,
    enterState,
    enterDestination,
    enterIntl_dom_loc,
  } = props;
  const isFormValid =
    enterPincode && enterState && enterDestination && enterIntl_dom_loc;
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <CustomInput
                type="text"
                mandatoryIcon={true}
                labelName="Pin Code"
                placeholder="Enter Pin Code"
                value={enterPincode}
                onChange={(e) => {
                  const value = e.target.value;
                  const regex = /^[a-zA-Z0-9]*$/; // Allows both numbers and alphabets
                  if (regex.test(value) && value.length <= 10) { // Allows up to 10 characters
                    handlePinChange("enterPincode", value);
                  }
                }}
              />
            </Col>
            <Col md={6}>
              <CustomInput
                type="text"
                labelName="State"
                placeholder="Enter State"
                mandatoryIcon={true}
                value={enterState}
                onChange={(e) => handlePinChange("enterState", e.target.value)}
                // isDisable
              />
            </Col>

            <Col md={6} className="mt-2">
              <CustomInput
                mandatoryIcon={true}
                type="text"
                labelName="Destination"
                placeholder="Enter Destination"
                value={enterDestination}
                onChange={(e) =>
                  handlePinChange("enterDestination", e.target.value)
                }
                // isDisable
              />
            </Col>

            <Col md={6} className="mt-2">
              <CustomInput
                type="text"
                labelName="Intl Dom Loc"
                placeholder="Enter Intl Dom Loc"
                mandatoryIcon={true}
                value={enterIntl_dom_loc}
                onChange={(e) => {
                  const input = e.target.value.toUpperCase(); // Convert to uppercase
                  if (["D", "L", "I"].includes(input) || input === "") {
                    handlePinChange("enterIntl_dom_loc", input); // Only accept valid values
                  }
                }}
                maxLength="1"
              />
              <small style={{ color: "gray", fontStyle: "italic" }}>
                Allowed values: D (Domestic), L (Local), I (International)
              </small>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            onClick={handleSavePinCode}
            disabled={!isFormValid}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddPinCode;
