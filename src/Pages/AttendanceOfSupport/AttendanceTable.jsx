import React from "react";
import { Table } from "react-bootstrap";

const tableHeaders = [
  "Sr. No.",
  "Emp Code",
  "Employee Name",
  "Gender",
  "Date of Birth",
  "Age",
  "Date of Joining Ambit Group",
  "Total Year of Service",
  "Remarks",
  "Category",
  "Designation",
  "Department",
  "Sub-Department",
  "Employee Location",
  "Employee Sub-Location",
  "Employee State",
  "Vendor Name",
  "In Time",
  "Out Time",
  "Total Working Hours",
  "OT",
  "Billed to Ambit Entity",
  "Remarks",
  "Basic + DA",
  "HRA 5%",
  "Allowance",
  "Conveyance Allowance",
  "Washing Allowance",
  "Gross Payable",
  "PF @ 12%",
  "ESIC @ 0.75%",
  "Relieving Charges",
  "PTAX",
  "Professional Tax",
  "LWF",
  "TOTAL DED.",
  "NET PAY (pm)",
  "PF @ 13%",
  "ESIC @ 3.25%",
  "Leave will be charged at actual",
  "Bonus @ 8.33%",
  "Gratuity",
  "Uni",
  "ML WF",
  "Approved CTC effect CTC Total (pm)",
  "Service Charge @",
  "Grand Total",
  "Present Days",
  "Month Days",
];

const tableData = [
  {
    srNo: "01",
    empCode: "E123",
    employeeName: "John Doe",
    gender: "Male",
    dateOfBirth: "1990-05-12",
    age: "34",
    dateOfJoining: "2010-04-15",
    totalYearOfService: "14",
    remarks: "-",
    category: "Permanent",
    designation: "Senior Developer",
    department: "IT",
    subDepartment: "Web Development",
    employeeLocation: "Mumbai",
    employeeSubLocation: "Andheri",
    employeeState: "Maharashtra",
    "In Time": "10 AM",
    "Out Time": "6:30 PM",
    "Total Working Hours": "10 hours",
    OT: "3 hours",
    vendorName: "Tech Solutions",
    billedToAmbitEntity: "Ambit Pvt. Ltd.",
    basicDA: "50000",
    hra5: "2500",
    allowance: "1000",
    conveyanceAllowance: "500",
    washingAllowance: "300",
    grossPayable: "54300",
    pf12: "6000",
    esic075: "406",
    relievingCharges: "-",
    pTax: "200",
    professionalTax: "250",
    lwf: "100",
    totalDed: "6956",
    netPay: "47344",
    pf13: "6500",
    esic325: "1765",
    leaveCharges: "-",
    bonus833: "4500",
    gratuity: "2500",
    uni: "-",
    mlWf: "-",
    approvedCTC: "60000",
    serviceCharge: "1000",
    grandTotal: "61000",
    presentDays: "30",
    monthDays: "31",
  },
];

const AttendanceTable = () => {
  return (
    <div className="schroll" card>
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

export default AttendanceTable;
