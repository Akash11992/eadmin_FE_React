import React, { useEffect, useState } from "react";
import { Form, Container, Col, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { Title } from "../../../Components/Title/Title";
import OutwardRequestForm from "./OutwardRequestForm/OutwardRequestForm";
import ReversePickupRequest from "./ReversePickupRequestForm/ReversePickupRequest";

const RequestForm = () => {
  const [formType, setFormType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isEditMode, token_no, reversePick, DomInter, Id } =
    location.state || {};
  useEffect(() => {
    if (isEditMode && reversePick) {
      setFormType("2");
    }
  }, [location.state]);
  const handleFormTypeChange = (e) => {
    const selectedFormType = e.target.value;
    setFormType(selectedFormType);

    if (selectedFormType === "1") {
      handleAddNew();
    }
  };

  const handleAddNew = () => {
    const uniqueNo = generateUniqueReferenceNo();
    navigate(".", { state: { reference_no: uniqueNo } });
  };

  const generateUniqueReferenceNo = () => {
    return Math.floor(Math.random() * 1000000).toString();
  };

  return (
    <Container fluid className={isEditMode ? "" : "card"}>
      {isEditMode ? null : (
        <>
          <Title title="Request Form" />

          <Col md={3} className="my-2">
            <Form.Group>
              <Form.Label htmlFor="officialOrPersonal">
                Request Form Type
              </Form.Label>
              <InputGroup>
                <Form.Control
                  as="select"
                  id="officialOrPersonal"
                  aria-label="Official Or Personal"
                  onChange={handleFormTypeChange}
                  value={formType}
                >
                  <option value="">Select</option>
                  <option value="1">Outward</option>
                  <option value="2">Reverse Pickup</option>
                </Form.Control>
              </InputGroup>
            </Form.Group>
          </Col>

          <hr />
        </>
      )}
      {formType === "1" && <OutwardRequestForm />}
      {formType === "2" && (
        <ReversePickupRequest
          isEditMode={isEditMode}
          token_no={token_no}
          DomInter={DomInter}
          Id={Id}
        />
      )}
    </Container>
  );
};

export default RequestForm;
