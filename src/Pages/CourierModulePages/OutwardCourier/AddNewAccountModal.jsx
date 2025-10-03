import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getCompanyDetailsByAccount,
  insertCourierAccountCode,
} from "../../../Slices/CourierSevices/CourierSevicesSlice";

function AddNewAccountModal({
  show,
  onHide,
  newAccountName,
  setNewAccountName,
  newAccountCode,
  setNewAccountCode,
}) {
  const dispatch = useDispatch();
  const isAnyFieldEmpty = !newAccountName || !newAccountCode;

  const handleSaveDetails = async () => {
    if (isAnyFieldEmpty) {
      toast.warning("Please fill in all required fields!");
      return;
    }

    const form = {
      AccountNo: newAccountCode,
      CompanyName: newAccountName,
    };

    try {
      const response = await dispatch(insertCourierAccountCode(form));

      if (response.meta.requestStatus === "fulfilled") {
        toast.success(
          response.payload.message || "Details saved successfully!"
        );
        await dispatch(getCompanyDetailsByAccount(newAccountCode));
        setTimeout(() => {
          onHide();
        }, 1000);
      } else {
        toast.error("Failed to Save Details");
      }
    } catch (error) {
      toast.error("An error occurred while saving details.");
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Courier Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="newAccountCode" className="mt-3">
            <Form.Label>Courier Account Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Courier Account Code"
              value={newAccountCode}
              onChange={(e) => setNewAccountCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="newAccountName">
            <Form.Label>Courier Company Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Courier Company Name"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="dark" onClick={handleSaveDetails}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddNewAccountModal;
