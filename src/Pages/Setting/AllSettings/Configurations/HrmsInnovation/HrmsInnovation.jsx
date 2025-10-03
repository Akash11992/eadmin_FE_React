import React from "react";
import { Title } from "../../../../../Components/Title/Title";
import { Row,Col } from "react-bootstrap";
const HrmsInnovation = () => {
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
    <Row className="mt-3 ms-0">
      <Title title="HRMS Innovation" />
    </Row>
    <hr />
    <Row>
          <Col md={3}>
            <h4>Innovation</h4>
          </Col>
          <Col md={3}>
            <h4>Manual Sync</h4>
          </Col>
          <Col md={3}>
            <h4>Frequency</h4>
          </Col>
          <Col md={3}>
            <h4>URL</h4>
          </Col>
        </Row>
  </div>
  );
};

export default HrmsInnovation;
