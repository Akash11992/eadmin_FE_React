import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Heading from "../../Components/Heading/Heading";
import AgreementText from "../../Components/AgreementText/AgreementText";

const BusinessAgreement = () => {
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row>
        <Col md={12} className="card p-4" id="agreement-content">
          <Heading text="Business Agreement" />
          <AgreementText />
        </Col>
      </Row>
    </div>
  );
};

export default BusinessAgreement;
