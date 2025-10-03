import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Title } from "../../Components/Title/Title";
const UploadDocument = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const options = [
    { value: "1", label: "Courier A" },
    { value: "2", label: "Courier B" },
    { value: "3", label: "Courier C" },
  ];

  return (
    <Row className="me-1 ms-1">
      <Card>
        <Title title="Upload Document" />
        <Card.Body>
          <Form>
            <Row className="align-items-center justify-content-md-center">
              <Col md={3} className="mb-3">
                <Form.Label>Upload Document</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
              </Col>

              <Col md={3} className="text-end">
                <Button
                  variant="dark"
                  // onClick={handleSubmit}
                >
                  Upload
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default UploadDocument;
