import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyList,
  getDepartments,
} from "../../../../../../Slices/Commondropdown/CommondropdownSlice";
import { fetchDepartment_SubDepartments, fetchsubDepartments, get_ola_uber_VendorName } from "../../../../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { getFrequencyDropdown } from "../../../../../../Slices/Alert/AlertTravelManagement/AlertTravelManagementSlice";
import { getBusinessTypes } from "../../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import { Button, Col, Form, Row } from "react-bootstrap";
import CustomDropdown from "../../../../../../Components/CustomDropdown/CustomDropdown";
import MultiSelectDropdown from "../../../../../../Components/CustomDropdown/MultiSelectDropdown";
import MultiEmailInput from "../../../../../../Components/CustomInput/MultiEmailInput";
import { toast } from "react-toastify"; 
import { ExportToXLSX } from "../../../../../../Components/Excel-JS/ExportToXLSX";

const AlertForm = (props) => {
  const {
    formData,
    handleFormChange,
    handleCheckboxChange,
    handleSave,
    setFormData,
  } = props;

  const dispatch = useDispatch();

  const { companyList } = useSelector(
    (state) => state.CommonDropdownData
  );
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  const { ola_uber_vendorNameData, getDepartment_subDepartment, subDepartment } = useSelector(
    (state) => state.TravelManagement
  );

  const alertTravelDetails = useSelector((state) => state.AlertTravelManagement.alertTravelDetails);  // Assuming you're selecting this from the Redux store

  useEffect(() => {
    const payload = {
      busineesId: formData.business || null,
      deptCode: null
    };
    dispatch(fetchDepartment_SubDepartments(payload));
  }, [formData.business]);

  useEffect(() => {
    const payload = {
      deptCode: formData.department,
    };
    dispatch(fetchsubDepartments(payload));
  }, [formData.department]);

  useEffect(() => {
    dispatch(getBusinessTypes());
    dispatch(getCompanyList());
    dispatch(get_ola_uber_VendorName("ALERT_TRAVEL_MODE"));
  }, [dispatch]);
const travelData=alertTravelDetails.data
  const handleExportExcel = () => {
    if (travelData?.length > 0) {
      ExportToXLSX(travelData, "Travel Request Details");
    } else {
      toast.warning("No Records Found");
    }
  };
  const companyData = companyList?.data || [];

  return (
    <>
      <Row className="mb-3">
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Select Company"
            options={[
              { company_id: "", company_name: "Select company" },
              ...companyData,
            ]}
            selectedValue={formData.company}
            onChange={(e) => handleFormChange("company", e.target.value)}
            valueKey="company_id"
            labelKey="company_name"
            mandatoryIcon={true}
          />
        </Col>
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Business"
            options={[
              { businessId: "", businessName: "Select Business" },
              ...(businesstype?.data || []),
            ]}
            selectedValue={formData.business}
            onChange={(e) => handleFormChange("business", e.target.value)}
            valueKey="businessId"
            labelKey="businessName"
          />
        </Col>
        <Col md={4}>
          <MultiSelectDropdown
            data={getDepartment_subDepartment}
            valueKey="dept_code"
            labelKey="department_desc"
            value={formData.department}
            label="Department"
            handleCheckboxChange={(e) => handleCheckboxChange(e, "department")}
            selectLabel="Select Department"
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Sub Department"
            options={[
              { subDeptId: "", subDepartmentDesc: "Select Department" },
              ...(subDepartment || []),
            ]}
            selectedValue={formData.subDepartment}
            onChange={(e) => handleFormChange("subDepartment", e.target.value)}
            valueKey="subDeptId"
            labelKey="subDepartmentDesc"
          />
        </Col>
        <Col md={4}>
          <MultiSelectDropdown
            data={ola_uber_vendorNameData}
            valueKey="value"
            labelKey="label"
            value={formData.vendor}
            label="Travel Mode"
            handleCheckboxChange={(e) => handleCheckboxChange(e, "vendor")}
            selectLabel="Select Mode"
            mandatoryIcon={true}
          />
        </Col>
        <Col md={4}>
          <Form.Group controlId="toEmail">
            <MultiEmailInput
              emails={formData?.to?.split(",") || []}
              onChange={(emails) => handleFormChange("to", emails.join(","))}
              label="To"
              placeHolder="Enter Email"
              mandatoryIcon={true}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="ccEmail">
            <MultiEmailInput
              emails={formData?.cc?.split(",") || []}
              onChange={(emails) => handleFormChange("cc", emails.join(","))}
              label="CC"
              placeHolder="Enter Email"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="">
        <Col md={12}>
          <Button variant="dark" type="submit" onClick={handleSave}>
            Save
          </Button>{" "}
          <Button
            variant="danger"
            type="reset"
            onClick={() =>
              setFormData({
                company: "",
                department: "",
                subDepartment: [],
                frequency: "",
                vendor: [],
                business: "",
                to: "",
                cc: "",
                id: null,
              })
            }
          >
            Cancel
          </Button>{" "}
          <Button variant="dark" onClick={handleExportExcel}>
            Export to Excel
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default AlertForm;
