import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";

const ReminderModal = ({ show, handleClose }) => {
  const [selectedFrequency, setSelectedFrequency] = useState("");

  const handleFrequencyChange = (value) => {
    setSelectedFrequency(value);
  };

  return (
    <Modal show={show} onHide={handleClose} size="md">
      <Modal.Header closeButton>
        <h5 className="text-danger">Reminder</h5>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12}>
            <Form.Group className="d-flex">
              <Form.Label className="me-2">Service</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Add Service"
                className="border-bottom-1 border-start-0 bg-body-tertiary border-end-0 border-top-0"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12} md={4} className="d-flex align-items-center">
            <Form.Label className="me-2">Frequency</Form.Label>
            <Form.Check
              type="radio"
              name="frequency"
              label="Yearly"
              checked={selectedFrequency === "Yearly"}
              onChange={() => handleFrequencyChange("Yearly")}
            />
          </Col>
          <Col
            xs={12}
            md={4}
            className="d-flex align-items-center justify-content-center"
          >
            <Form.Check
              type="radio"
              name="frequency"
              label="Half Yearly"
              checked={selectedFrequency === "HalfYearly"}
              onChange={() => handleFrequencyChange("HalfYearly")}
            />
          </Col>
          <Col xs={12} md={4} className="d-flex align-items-center">
            <Form.Check
              type="radio"
              name="frequency"
              label="Quarterly"
              checked={selectedFrequency === "Quarterly"}
              onChange={() => handleFrequencyChange("Quarterly")}
            />
          </Col>
        </Row>
        <Row className=" d-flex mt-3">
          <Col xs={12} md={6} className="d-flex align-items-center">
            <Form.Label className="me-2">Date</Form.Label>
            <Form.Control type="date" className ="bg-body-tertiary"  />
          </Col>
          <Col xs={12} md={6} className="d-flex align-items-center">
            <FaArrowRight className="me-2" />
            <Form.Control type="date" className ="bg-body-tertiary" />
          </Col>
        </Row>
        <Row className=" d-flex mt-3">
          <Col xs={12} md={12} className="d-flex align-items-center">
            <Form.Label className="me-2">Remark</Form.Label>
            <Form.Control as="textarea" className ="bg-body-tertiary" rows={3} />
            </Col>
        </Row>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="dark" onClick={handleClose}>Save</Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default ReminderModal;
