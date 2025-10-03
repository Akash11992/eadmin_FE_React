import React, { useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import { Title } from "../../Components/Title/Title";
import "../../Assets/css/PPMManagement/PPMManagement.css";
import TableHeader from "../../Components/Title/Header";
import ExportToExcel from "../../Components/Exports/ExportToExcel";
import { TablePagination } from "@mui/material";

const PPMReports = () => {
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
    { value: "vendor", label: "Vendor Name" },
    { value: "service", label: "Service" },
    { value: "unit", label: "Unit" },
    { value: "quantity", label: "Quantity" },
    { value: "from", label: "From" },
    { value: "to", label: "To" },
    { value: "frequency", label: "Frequency" },
    { value: "ppmDate", label: "Activity Date" },
    { value: "status", label: "Status" },
  ];

  const data = [
    {
      srno: 1,
      vendor: "Hyginetech India Pvt Ltd",
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
      vendor: "Hyginetech India Pvt Ltd",
      service: "HVAC Maintenance",
      unit: "TR",
      quantity: 5,
      from: "2023-01-01",
      to: "2023-01-10",
      frequency: "Quarterly",
      ppmDate: "2023-02-05",
      status: "Pending",
    },
    {
      srno: 3,
      vendor: "Hyginetech India Pvt Ltd",
      service: "HVAC Maintenance",
      unit: "TR",
      quantity: 5,
      from: "2023-01-01",
      to: "2023-01-10",
      frequency: "Quarterly",
      ppmDate: "2023-03-05",
      status: "Done",
    },
    {
      srno: 4,
      vendor: "Hyginetech India Pvt Ltd",
      service: "HVAC Maintenance",
      unit: "TR",
      quantity: 5,
      from: "2023-01-01",
      to: "2023-01-10",
      frequency: "Quarterly",
      ppmDate: "2023-04-05",
      status: "Pending",
    },
  ];

  const slicedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Row className="dashboard me-1 ms-1">
      <Card>
        <Title title="PPM Reports" />
        <Card.Body>
          <Row className="justify-content-between">
            <Col md={2}>
              <ExportToExcel />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="scrollTable">
              <Table size="sm" bordered>
                <TableHeader coloumn={coloumn} />
                <tbody style={{fontSize: 14}}>
                  {slicedData.map((item) => (
                    <tr key={item.id}>
                      {coloumn.map((col) => (
                        <td key={col.value}>{item[col.value]}</td>
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

export default PPMReports;
