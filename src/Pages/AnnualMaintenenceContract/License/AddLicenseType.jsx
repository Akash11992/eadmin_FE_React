import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Col, Row } from "react-bootstrap";
import CustomInput from "../../../Components/CustomInput/CustomInput";

const AddLicenseType = (props) => {
  const { handleClose, show, handleSave, setLicense_Types, license_Types } =
    props;
  const isFormValid = license_Types;
  return (
    <>
      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Add License Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <CustomInput
                type="text"
                labelName="License Type"
                placeholder="Enter License Type"
                mandatoryIcon={true}
                value={license_Types}
                onChange={(e) => setLicense_Types(e.target.value)}
                // isDisable
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="dark"
            onClick={handleSave}
            disabled={!isFormValid}
          >
            Save
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddLicenseType;