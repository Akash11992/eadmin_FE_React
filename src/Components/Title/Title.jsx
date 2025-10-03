import React from "react";
import { CardHeader } from "react-bootstrap";

export const Title = ({ title }) => {
  return (
    <CardHeader className="text-danger">
      <h5>{title}</h5>{" "}
    </CardHeader>
    // <Row className="mt-2">
    //     <Col className="text-danger">
    //       <h5>{title}</h5>
    //     </Col>
    //   </Row>
  );
};
