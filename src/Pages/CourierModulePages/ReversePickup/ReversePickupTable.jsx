import React from "react";
import { Container, Row, Col, Navbar, Nav, Dropdown, Form, Button, Pagination, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const tableHeaders = [
  "Sr. No.",
  "Time",
  "Unique No.",
  "Month",
  "Day",
  "Date",
  "Shipper Name",
  "Department",
  "Consignee Name",
  "Consignee's Company Name",
  "Pincode",
  "Location",
  "Mobile No.",
  "Courier TYPE",
  "Courier Type Code",
  "Type Of Courier Doc Or Non-Doc",
  "No. of Letters",
  "Reverse Pickup Token No.",
  "Consignment No.",
  "Courier Co. Name",
  "Courier OR Speed-Post Or Hand-Delivery or Reverse_Pickup",
  "Description",
  "Code",
  "Received Name",
  "Remarks",
  "Returns Courier Airway Bill Nos.",
  "Error Code",
  "Return Courier Reason",
];

const tableData = [
  {
    srNo: "01",
    time: "12:45",
    uniqueNo: "381",
    month: "May",
    day: "01",
    date: "01/05/2024",
    shipperName: "Sakshi Sankhe",
    department: "Web Developer",
    consigneeName: "Snkit Soni",
    consigneeCompanyName: "Reliance Pvt.",
    pincode: "48325",
    location: "Mumbai",
    mobileNo: "6261446325",
    courierType: "Air Courier",
    courierTypeCode: "12546",
    typeOfCourier: "Non Doc",
    noOfLetters: "2",
    reversePickupTokenNo: "T145526",
    consignmentNo: "45125",
    courierCoName: "Anup Soni",
    description: "-",
    code: "45612",
    receivedName: "Ankit Soni",
    remarks: "-",
    returnsCourierAirwayBillNos: "14562",
    errorCode: "47895",
    returnCourierReason: "Bed Quality",
  },
];

const ReversePickupTable = () => {
  return (
    <div className="schroll">

      <Table
        striped
        bordered
        hover
        className="m-0"
        style={{ whiteSpace: "pre" }}
      >
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

export default ReversePickupTable;
