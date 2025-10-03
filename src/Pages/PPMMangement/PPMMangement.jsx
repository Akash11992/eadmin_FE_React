import React, { useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Title } from "../../Components/Title/Title";
import AddButton from "../../Components/Buttons/AddButton";
import "../../Assets/css/PPMManagement/PPMManagement.css";
import TableHeader from "../../Components/TableHeader/TableHeader";
import { Link } from "react-router-dom";
import ExportToExcel from "../../Components/Exports/ExportToExcel";
import { TablePagination } from "@mui/material";

const PPMManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const coloumn = [
    { value: "srno", label: "Sr. No" },
    { value: "scheduleId", label: "Schedule Id" },
    { value: "service", label: "Service" },
    { value: "unit", label: "Unit" },
    { value: "quantity", label: "Quantity" },
    { value: "from", label: "From" },
    { value: "to", label: "To" },
    { value: "frequency", label: "Frequency" },
    { value: "ppmDate", label: "PPM Date" },
    { value: "status", label: "Status" },
  ];

  const data = [
    {
      srno: 1,
      scheduleId: "SCH001",
      service: "HVAC Maintenance",
      unit: "TR",
      quantity: 5,
      from: "2023-01-01",
      to: "2023-01-10",
      frequency: "Quarterly",
      ppmDate: "2023-01-05",
      status: "Done",
    },
    {
      srno: 2,
      scheduleId: "SCH002",
      service: "Electrical Inspection",
      unit: "KVA",
      quantity: 10,
      from: "2023-02-01",
      to: "2023-02-10",
      frequency: "Half Yearly",
      ppmDate: "2023-02-05",
      status: "Pending",
    },
    {
      srno: 3,
      scheduleId: "SCH003",
      service: "Plumbing Check",
      unit: "Nos.",
      quantity: 15,
      from: "2023-03-01",
      to: "2023-03-10",
      frequency: "Quarterly",
      ppmDate: "2023-03-05",
      status: "Done",
    },
    {
      srno: 4,
      scheduleId: "SCH004",
      service: "Fire Alarm Testing",
      unit: "TR",
      quantity: 20,
      from: "2023-04-01",
      to: "2023-04-10",
      frequency: "Quarterly",
      ppmDate: "2023-04-05",
      status: "Pending",
    },
    {
      srno: 5,
      scheduleId: "SCH005",
      service: "Lift Maintenance",
      unit: "KVA",
      quantity: 8,
      from: "2023-05-01",
      to: "2023-05-10",
      frequency: "Half Yearly",
      ppmDate: "2023-05-05",
      status: "Done",
    },
  ];

  return (
    <Row className="dashboard me-1 ms-1">
      <Card>
        <Title title="PPM Management" />
        <Card.Body>
          <Row className=" d-flex justify-content-between">
            <Col md={2}>
              <ExportToExcel />
            </Col>
            <Col md={2} className="text-end">
              <AddButton path="/ppmSchedule" />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col id="schrollTable">
              <Table size="sm" bordered  hover className="text-center">
                <TableHeader coloumn={coloumn} />
                <tbody style={{ fontSize: 14 }}>
                  {data
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((item) => (
                      <tr key={item.scheduleId}>
                        {coloumn.map((col) => (
                          <td key={col.value}>
                            {col.value === "scheduleId" ? (
                              <Link
                                to="/ppmSchedule"
                                className="text-decoration-none"
                              >
                                {item[col.value]}
                              </Link>
                            ) : (
                              item[col.value]
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </Table>
              <TablePagination
                component="div"
                count={data.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default PPMManagement;
