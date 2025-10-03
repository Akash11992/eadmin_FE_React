import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ExportToXLSX } from "../../Components/Excel-JS/ExportToXLSX";
import { toast, ToastContainer } from "react-toastify";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../Components/Title/Title";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import FromDate from "../../Components/DatePicker/FromDate";
import EndDate from "../../Components/DatePicker/EndDate";

const data = [
  {
    id: 1,
    subject: "Air Conditioner Not Working",
    description: "The AC in conference room is not cooling properly.",
    raisedBy: "Anil Sharma",
    serviceVendor: "CoolTech Solutions",
    contactPerson: "Ravi Verma",
    buildingLocation: "Block A, 2nd Floor",
    serviceDate: "2025-05-10",
  },
  {
    id: 2,
    subject: "Water Leakage in Pantry",
    description: "Water is leaking from the sink in pantry area.",
    raisedBy: "Pooja Mehta",
    serviceVendor: "PlumbCare Services",
    contactPerson: "Suresh Kumar",
    buildingLocation: "Block B, Ground Floor",
    serviceDate: "2025-05-11",
  },
  {
    id: 3,
    subject: "Printer Malfunction",
    description: "Printer in admin office is jamming frequently.",
    raisedBy: "Rahul Singh",
    serviceVendor: "TechFix Engineers",
    contactPerson: "Amit Desai",
    buildingLocation: "Block C, 1st Floor",
    serviceDate: "2025-05-09",
  },
  {
    id: 4,
    subject: "Elevator Maintenance",
    description: "Routine maintenance for elevator scheduled this week.",
    raisedBy: "Facility Team",
    serviceVendor: "LiftWell Pvt Ltd",
    contactPerson: "Nikhil Gupta",
    buildingLocation: "Main Building",
    serviceDate: "2025-05-12",
  },
  {
    id: 5,
    subject: "Lighting Issue in Basement",
    description: "Some lights in basement parking are flickering.",
    raisedBy: "Security Staff",
    serviceVendor: "BrightLight Solutions",
    contactPerson: "Sunil Patil",
    buildingLocation: "Basement Area",
    serviceDate: "2025-05-08",
  },
];

const MaintenanceReport = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    fromDate: null,
    endDate: null,
    selectedBusiness: "",
    selectedDepartment: null,
  });
  const [businesstype, setBusinesstype] = useState({ data: [] });
  const [getDepartment_subDepartment, setDepartment_subDepartment] = useState(
    []
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );

  const { All_Tickets } = permissionDetailData.data || {};

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const actions = [];

  return (
    <Row className="dashboard me-1 ms-1">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Card className="p-0">
        <Title title="Maintenance Report" />
        <Row className={`mx-0`}>
          <Col md={3} className="my-2">
            <label htmlFor="subject">Subject</label>
            <input type="text" className="form-control" />
          </Col>
          <Col md={3} className="my-2">
            <label htmlFor="Description">Description</label>
            <input type="text" className="form-control" />
          </Col>
          <Col md={3} className="my-2">
            <label htmlFor="raisedBy">Raised By</label>
            <input type="text" className="form-control" />
          </Col>
          <Col md={3} className="my-2">
            <label htmlFor="serviceVendor">Service Vendor</label>
            <input type="text" className="form-control" />
          </Col>
          <Col md={3} className="my-2">
            <label htmlFor="contactPerson">Contact Person</label>
            <input type="text" className="form-control" />
          </Col>
          <Col md={3} className="my-2">
            <label htmlFor="buildingLocation">Building Location</label>
            <input type="text" className="form-control" />
          </Col>
          <Col md={3} className="my-2">
            <label htmlFor="serviceDate">Service Date</label>
            <input type="date" className="form-control" />
          </Col>
        </Row>
        <Row className={`mt-4 mb-2 mx-0`}>
          <Col md={2}>
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height={40}
              //   onPress={handleExportExcel}
            />
          </Col>
          <Col md={8} />

          <Col md={2}>
            <CustomSingleButton
              _ButtonText="Add New"
              height={40}
              onPress={() => navigate("/MaintenanceRequestForm")}
            />
          </Col>
        </Row>
        <CustomTable
          data={data}
          paginationDropDown={false}
          dataContained={data?.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          //   actionVisibility={All_Tickets?.update ? true : false}
          actions={actions}
          clickableColumns={["Ticket ID"]}
          //   onColumnClick={(id) => handleEdit(id)}
          marginTopTable={true}
          lineVisibility={true}
        />
      </Card>
    </Row>
  );
};

export default MaintenanceReport;
