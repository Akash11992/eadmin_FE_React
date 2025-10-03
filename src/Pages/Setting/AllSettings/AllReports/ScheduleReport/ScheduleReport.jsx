import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Dropdown,
  Pagination,
} from "react-bootstrap";
import { TablePagination } from "@mui/material";
import { Title } from "../../../../../Components/Title/Title";

const ScheduleReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row>
        <Col md={12}>
          <Row className="mt-3 ms-0">
            <Title title="Statistics" />
          </Row>
         <hr/>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className="nav-link active"
                id="home-tab"
                data-toggle="tab"
                href="#home"
              >
                Email
              </a>
            </li>
          </ul>

          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="home">
              <Row className="mt-2">
                <Col md={6}>
                  <Row>
                    {["Active", "Bounced", "Sent", "Opened", "In Queue"].map(
                      (status, index) => (
                        <Col key={index} md={2} sm={12} className="text-center">
                          <h3>
                            <a >0</a>
                          </h3>
                          <p>{status}</p>
                        </Col>
                      )
                    )}
                  </Row>
                </Col>
              </Row>

              <Row className="pt-2 align-items-center">
                <Col md={12}>
                  <Form.Check
                    type="checkbox"
                    label="Select All"
                    className="d-inline-block"
                  />
                  <Dropdown className="d-inline-block ms-3">
                    <Dropdown.Toggle
                      variant="info"
                      id="dropdown-basic"
                      disabled
                      className="btn-dark"
                    >
                      Action <i className="bi bi-chevron-down"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Reschedule</Dropdown.Item>
                      <Dropdown.Item href="#">Stop Mails</Dropdown.Item>
                      <Dropdown.Item href="#">Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>

              <div className="overflow-auto mt-3">
                <Table responsive>
                  <tbody>
                    {[
                      { email: "kumar.sonu@cylsys.com" },
                      { email: "pankaj.tete@gmail.com" },
                    ].map((entry, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Check type="checkbox" />
                        </td>
                        <td>
                          To <b>{entry.email}</b>
                        </td>
                        <td>
                          <h5 className="text-info">
                            <a
                              className="text-opacity-100 text-decoration-none"
                            >
                              test1
                            </a>
                          </h5>
                          <p className="small">I am testing template</p>
                        </td>
                        <td>
                          <Button variant="success" size="sm">
                            Active
                          </Button>
                        </td>
                        <td>Oct 28, 2024, 2:41:00 PM</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <TablePagination
        component="div"
        count={10}
        page={page}
        onPageChange={(event, newPage) => handleChangePage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) =>
          handleChangeRowsPerPage(event.target.value)
        }
        classes={{
          selectLabel: "custom-select-label",
          displayedRows: "custom-select-label",
        }}
      />
    </div>
  );
};

export default ScheduleReport;
