import React from "react";
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const tableHeaders = [
  "Sr.No.",
  "Date",
  "Time",
  "Unique Inward No.",
  "Pickup Date",
  "Sender's Name",
  "Sender's Department Code",
  "Consignee Name",
  "Consignee's Company Name",
  "AirWay Bill No.",
  "Pin Code",
  "Destination",
  "State",
  "Consignee Mobile No",
  "Internal Courier Slip No.",
  "Courier Account Code",
  "Courier Company Name",
  "Official Or Personal",
  "Courier Type Code",
  "Type of Courier",
  "D=Domestic L=Local I=International",
  "Courier Weight",
  "Code",
  "Description"
];

const tableData = [
  {
    srNo: "01",
    date: "09/04/2024",
    time: "12:15",
    uniqueInwardNo: "518",
    pickupDate: "19/02/2024",
    senderName: "vikky parmar",
    senderDepartmentCode: "1503",
    consigneeName: "Amit Soni",
    consigneeCompanyName: "Reliance pvt.",
    airWayBillNo: "52",
    pinCode: "483225",
    destination: "Bhopal",
    state: "Madhya Pradesh",
    consigneeMobileNo: "6261446325",
    internalCourierSlipNo: "1245",
    courierAccountCode: "145256256",
    courierCompanyName: "Ambit",
    officialOrPersonal: "Personal",
    courierTypeCode: "14568",
    typeOfCourier: "Air",
    domesticLocalInternational: "-",
    courierWeight: "55Kg",
    code: "5246",
    description: "-"
  }
];

const CourierReportTable = () => {
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

export default CourierReportTable;
