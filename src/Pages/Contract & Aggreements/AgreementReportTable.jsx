import React from "react";
import { Table } from "react-bootstrap";

const tableHeaders = [
  "Sr. No.",
  "Upload By",
  "Date",
  "Agreement Type",
];

const tableData = [
  {
    srNo: "01",
    "Upload By": "xyz",
    date: "01/05/2024",
    "Agreement Type": "xyz",
  },
];
const AgreementReportTable = () => {
  return (
    <div card>
      <Table striped bordered hover style={{ whiteSpace: "pre" }}>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <th key={index} className="text-white bg-danger">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {tableHeaders.map((header, headerIndex) => (
                <td key={headerIndex} className="text-center">
                  {row[Object.keys(row)[headerIndex]] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AgreementReportTable;
