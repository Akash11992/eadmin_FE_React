import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import "../../Assets/css/Remark/Remark.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Decryption from "../Decryption/Decryption";
import Encryption from "../Decryption/Encryption";
import AutosizeTextarea from "../AutosizeTextarea/AutosizeTextarea";

const OfficeSupplyRemark = () => {
  const [text, setText] = useState("");
  const [referenceId, setReferenceId] = useState(null);
  const decrypt = Decryption();
  const encrypt = Encryption();
  const location = useLocation();
  const navigate = useNavigate();

  const API = `${process.env.REACT_APP_API}/api`;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refId = params.get("remark");
    const decryptData = decrypt(refId);
        console.log(decryptData)

    setReferenceId(decryptData?.id);
  }, [location.search]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const encryptData = encrypt({
    id: referenceId,
    type: "REMARK",
    remark: text,
  });
  const generateRejectLink = () => {
    return `${API}/approvalStatus?data=${encryptData}`;
  };

  const handleSubmit = async () => {
    if (!text) {
      return alert("Please Enter Your Remark");
    }

    const url = generateRejectLink();

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        alert("Remark submitted successfully");
        navigate("/");
      } else {
        alert("Failed to submit the remark. Please try again.");
      }
    } catch (error) {
      console.error("Error hitting the URL:", error);
      alert("An error occurred. Please try again.");
    }
  };
  return (
    <Row className="remark-container">
      <Col md={8} className="text-center">
        <Row className="justify-content-center">
          <p className="remark-description">
            Please add your remark for Request ID: {referenceId} below and click
            submit.
          </p>{" "}
        </Row>
        <Row className="justify-content-center">
          <Col md={8} className="remark-textarea">
            <AutosizeTextarea value={text} onChnage={handleChange} />
          </Col>
        </Row>
        <Row className="justify-content-center mt-4">
          <Col md={4} className="text-center">
            <Button
              variant="success"
              size="md"
              className="btn-block"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default OfficeSupplyRemark;
