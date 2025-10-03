import React from "react";
import { Title } from "../../../../../Components/Title/Title";
import { Row, Col, Nav } from "react-bootstrap";
const Integration = () => {
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="mt-3 ms-0">
        <Title title="Integration" />
      </Row>
      <hr />
      <Row>
        <Col md={3}>
          <Nav className="flex-column mt-3">
            <Nav.Link
              href="hrmsInnovation"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h4>HRMS(Innovation)</h4>
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={3}>
          <Nav className="flex-column mt-3">
            <Nav.Link
              href="Manual_upload.html"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h4>Manual upload</h4>
            </Nav.Link>
          </Nav>
        </Col>
      </Row>
    </div>
  );
};

export default Integration;
