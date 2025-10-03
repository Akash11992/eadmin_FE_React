import React, { useState } from "react";
import CustomInput from "../../../../../Components/CustomInput/CustomInput";
import { Col, Container, Row } from "react-bootstrap";
import CustomDropdown from "../../../../../Components/CustomDropdown/CustomDropdown";
import CustomSingleButton from "../../../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../../../Components/Title/Title";
import { TablePagination } from "@mui/material";
import CustomTable from "../../../../../Components/CustomeTable/CustomTable";

const data = [
  {
    value: 1,
    lable: "Vendor Management",
  },
  {
    value: 2,
    lable: "Courier Service",
  },
  {
    value: 3,
    lable: "Travel Management",
  },
  {
    value: 4,
    lable: "Customer Satisfaction Feedback",
  },
  {
    value: 5,
    lable: "Admin Helpdesk",
  },
  {
    value: 6,
    lable: "Visitor Management System",
  },
  {
    value: 7,
    lable: "Office Supply",
  },
];
const tableData = [
  {
    "S No" : 1,
    "Company":"Cylsys Software Solutions",
    "Email":"	pankaj.tete@gmail.com",
    "Is_active":"true",
    "Action":"c",
    "Created_by":"Rahul kumar Singh",
    "Created_at":"Oct 28, 2024, 2:36:19 PM"

  }
]
const contactData = [
  {
    "S No" : 1,
    "Company":"Cylsys Software Solutions",
    "Email":"	pankaj.tete@gmail.com",
    "Is_active":"true",
    "Action":"c",
    "Created_by":"Rahul kumar Singh",
    "Created_at":"Oct 28, 2024, 2:36:19 PM"

  }
]
const listData = [
  {
    "S No" : 1,
    "List_name":"Transfer_letter_List",
    "Company":"Cylsys Software Solutions",
    "Is_active":"true",
    "Action":"c",
    "Created_by":"Rahul kumar Singh",
    "Created_at":"Oct 28, 2024, 2:36:19 PM"

  }
]
const userData = [
  {
    "S No" : 1,
    "User_name":"Rahul",
    "Company":"Cylsys Software Solutions",
    "Is_email_verified":"yes",
    "Is_admin_approved":"Yes",
    "Is_active":"true",
    "Action":"c",
    "Created_by":"Rahul kumar Singh",
    "Created_at":"Oct 28, 2024, 2:36:19 PM"

  }
]
const AuditReport = () => {
  const [value, setValue] = useState(null);
  const [formData, setFormData] = useState({
    formDate: "",
    toDate: "",
    campagin: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [tableContent, setTableContent] = useState(tableData);
  const [title, setTitle] = useState("Vendor Management Audit Report");
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  // handle search code here...
  const handleSearch = () => {
    const selectedCampaign = formData.campagin;
    let newTitle = "";
    let newData = [];

    switch (selectedCampaign) {
      case "1":
        newTitle = "Vendor Management Audit Report";
        newData = tableData; 
        break;
      case "2":
        newTitle = "Courier Service Audit Report";
        newData = tableData;
        break;
      case "3":
        newTitle = "Travel Management Audit Report";
        newData = contactData;
        break;
      case "4":
        newTitle = "Customer Satisfaction Feedback Audit Report";
        newData = listData;
        break;
      case "5":
        newTitle = "Admin Helpdesk Audit Report";
        newData = listData;
        break;
      case "6":
        newTitle = "Visitor Management System Audit Report";
        newData = tableData;
        break;
      case "7":
        newTitle = "Office Supply Audit Report";
        newData = userData;
        break;
      default:
        newTitle = "Vendor Management Audit Report";
        newData = tableData;
        break;
    }
    setTitle(newTitle);
    setTableContent(newData);
  };
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="mt-3 ms-0">
        <Title title="Audit Report" />
      </Row>
      <hr />
      <Row>
        <Col md={3}>
          <CustomInput
            labelName="From Date"
            type="date"
            value={formData?.formDate}
            name="formDate"
            // placeholder="Role Name"
            onChange={handleInputChange}
            // mandatoryIcon={true}
          />
        </Col>
        <Col md={3}>
          <CustomInput
            labelName="To Date"
            type="date"
            value={formData?.toDate}
            name="toDate"
            // placeholder="Role Name"
            onChange={handleInputChange}
            // mandatoryIcon={true}
          />
        </Col>
        <Col md={3}>
          <CustomDropdown
            dropdownLabelName="Audit Report For"
            options={[
              { value: "", label: "Select Campagin" },
              ...data.map((e) => ({
                value: e.value,
                label: e.lable,
              })),
            ]}
            // options={designationData}
            onChange={(e) =>
              setFormData({ ...formData, campagin: e.target.value })
            }
            selectedValue={formData.campagin}
            valueKey="value"
            labelKey="label"
          />
        </Col>
        <Col md={2} className="align-content-end mt-4">
          <CustomSingleButton
            _ButtonText={"Search"}
            height={40}
            onPress={handleSearch}
            // disabled={!isFormValid()}
          />
        </Col>
      </Row>
      <Row className="m-0 mb-2 mt-4">
        <Container className="">{title}</Container>
      </Row>
      <CustomTable
        data={tableContent.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )}
        setValue={setValue}
        SelectColumnValue={value}
        selectedRows={selectedRows}
        allSelected={allSelected}
        firstColumnVisibility={true}
        dataContained={tableContent?.length || []}
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AuditReport;
