import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  DropdownButton,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { Title } from "../../Components/Title/Title";
import TableHeader from "../../Components/TableHeader/TableHeader";
import { NavLink } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdNotificationsActive } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import DeleteAlert from "../../Components/Validations/DeleteAlert";
import ReminderModal from "./ReminderModal";

const PPMSchedule = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handledeleteItems = () => {
    console.log("ggjhjgs")
  };
  const handleDelete = DeleteAlert({ onDelete: handledeleteItems });
  const coloumn = [
    { value: "SERVICE", label: "Service" },
    { value: "VENDOR", label: "Vendor Name" },
    { value: "UNIT", label: "Unit" },
    { value: "QUANTITY", label: "Quantity" },
    { value: "FREQUENCY", label: "Frequency" },
    { value: "PPMDATE", label: "PPM Date" },
    { value: "STATUS", label: "Status" },
    { value: "ACTION", label: "Action" },
  ];

  return (
    <Row className="dashboard me-1 ms-1">
      <Card>
        <Title title="New PPM Schedule" />
        <Card.Body>
          <Row>
            <Col md={4} className="d-flex justify-content-evenly">
              <Form.Label id="label-input">
                Branch Name<span className="text-danger">*</span>
              </Form.Label>
              <Col md={6}>
                <Form.Group>
                  <Form.Control
                    size="sm"
                    type="text"
                    placeholder="Enter Branch Name"
                  />
                </Form.Group>
              </Col>
            </Col>
            <Col md={4} className="d-flex justify-content-evenly">
              <Form.Label id="label-input">
                From Date <span className="text-danger">*</span>
              </Form.Label>
              <Col md={6}>
                <Form.Group>
                  <Form.Control size="sm" type="date" />
                </Form.Group>
              </Col>
            </Col>
            <Col
              md={4}
              className="d-flex justify-content-evenly"
              id="responseive-width"
            >
              <Form.Label id="label-input">
                To Date<span className="text-danger">*</span>
              </Form.Label>
              <Col md={6}>
                <Form.Group>
                  <Form.Control type="date" size="sm" />
                </Form.Group>
              </Col>
            </Col>{" "}
          </Row>
          <Row className="mt-4">
            <Col >
              <Table size="sm" bordered id="schrollTable">
                <TableHeader coloumn={coloumn} />
                <tbody>
                  <tr>
                    <td style={{ width: "8rem" }}>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Enter Service"
                      />
                    </td>
                    <td style={{ width: "10rem" }}>
                      <Form.Group>
                        <Form.Select size="sm">
                          <option>Select Vendor</option>
                          <option value="1">Hyginetech India Pvt Ltd</option>
                          <option value="2">Adani Electricity</option>
                        </Form.Select>{" "}
                      </Form.Group>
                    </td>
                    <td style={{ width: "5rem" }}>
                      <Form.Group>
                        <Form.Select size="sm">
                          <option>Select Units</option>
                          <option value="1">TR</option>
                          <option value="2">KVA</option>
                          <option value="2">Nos.</option>
                        </Form.Select>{" "}
                      </Form.Group>
                    </td>
                    <td style={{ width: "3rem" }}>
                      <Form.Group>
                        <Form.Control size="sm" type="number" />
                      </Form.Group>
                    </td>
                    <td style={{ width: "7rem" }}>
                      <Form.Group>
                        <Form.Select size="sm">
                          <option>Select Frequency</option>
                          <option value="1">Quaterly</option>
                          <option value="2">Half Yearly</option>
                        </Form.Select>{" "}
                      </Form.Group>
                    </td>
                    <td style={{ width: "6rem" }}>
                      <Form.Group>
                        <Form.Control size="sm" type="date" />
                      </Form.Group>
                    </td>
                    <td style={{ width: "6rem" }}>
                      <Form.Group>
                        <Form.Select size="sm">
                          <option>Select Status</option>
                          <option value="1">Done</option>
                          <option value="2">Pending</option>
                        </Form.Select>{" "}
                      </Form.Group>
                    </td>
                    <td style={{ width: "4rem" }}>
                      <DropdownButton
                        title="Action"
                        variant="dark"
                        drop="start"
                      >
                        <Dropdown.Item href="#/action-2">
                          Edit
                          <FaEdit className="mb-1 ms-2" />
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleDelete}>
                          Delete
                          <MdDelete className="mb-1 ms-2" />
                        </Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="d-flex">
              <Form.Control type="file" />
              <Button variant="dark">
                <FiUpload />
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={2} className="d-flex justify-content-evenly">
              <Button variant="dark" onClick={handleShow}>
                <MdNotificationsActive />
              </Button>
              <NavLink className="btn btn-dark bg-black" to="/ppmManagement">
                Save
              </NavLink>
            </Col>
          </Row>
          <ReminderModal show={show} handleClose={handleClose} />
        </Card.Body>
      </Card>
    </Row>
  );
};

export default PPMSchedule;
