import React from "react";
import { Card, Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { Title } from "../../Components/Title/Title";
import FormComponent from "../../Components/Repair&Maintenance/FormComponent";

const MaintenanceRequestForm = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row className="dashboard me-1 ms-1">
        <Card className="p-0">
          <Title title={"Add Request Form"} />
          <Card.Body className="p-0">
            <FormComponent />
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default MaintenanceRequestForm;
