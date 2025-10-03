import React, { useEffect, useState } from "react";
import { Form, Container, Col } from "react-bootstrap";
import DomReversePickupRequestForm from "./DomReversePickupRequestForm";
import IntReversePickupRequestForm from "./IntReversePickupRequestForm";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetReversePickupById } from "../../../../Slices/ReversePickup/ReversePickupSlice";
import { useLocation } from "react-router-dom";

const ReversePickupRequest = (isEditMode) => {
  console.log("isEditMode......", isEditMode);
  const dispatch = useDispatch();
  const [formType, setFormType] = useState("0");
  const [getAllDetails, setGetAllDetails] = useState({});

  useEffect(() => {
    if (isEditMode?.isEditMode) {
      setFormType(isEditMode?.DomInter === "0" ? "0" : "1");
      getReserveDetails();
    }
  }, []);

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };

  const getReserveDetails = async () => {
    const payload = {
      token_id: isEditMode?.token_no,
    };
    try {
      const response = await dispatch(GetReversePickupById(payload));

      console.log(
        "response in GetReversePickupById..",
        JSON.stringify(response?.payload?.data)
      );
      if (response?.payload?.success === true) {
        setGetAllDetails(response?.payload?.data[0]);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <Container fluid className="card">
      <Col md={3} className="my-2">
        <Form.Group>
          <Form.Label className="text-danger fw-normal">
            {isEditMode?.Id
              ? isEditMode?.DomInter === "0"
                ? "Domestic Update"
                : "International Update"
              : " Domestic or International"}
          </Form.Label>
          {isEditMode?.Id ? (
            <Form.Label className="fw-bold row ms-0">
              Token No. {isEditMode?.token_no}
            </Form.Label>
          ) : (
            <div>
              <Form.Check
                type="radio"
                id="domestic"
                label="Domestic"
                name="formType"
                value="0"
                checked={formType === "0"}
                onChange={handleFormTypeChange}
              />
              <Form.Check
                type="radio"
                id="international"
                label="International"
                name="formType"
                value="1"
                checked={formType === "1"}
                onChange={handleFormTypeChange}
              />
            </div>
          )}
        </Form.Group>
      </Col>
      <hr />
      {formType === "0" && (
        <DomReversePickupRequestForm
          isEditMode={isEditMode}
          getAllDetails={getAllDetails}
        />
      )}
      {formType === "1" && (
        <IntReversePickupRequestForm
          isEditMode={isEditMode}
          getAllDetails={getAllDetails}
        />
      )}
    </Container>
  );
};

export default ReversePickupRequest;
