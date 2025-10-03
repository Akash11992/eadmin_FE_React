import React, { useEffect, useState } from "react";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import { Col, Form, Row } from "react-bootstrap";
import { addLicense, fetchDropdownData } from "../../../Slices/AMC/AMCSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmpDropDownData } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { Autocomplete, TextField } from "@mui/material";
import MUIStartDate from "../../../Components/DatePicker/MUIStartDate";
import AddLicenseType from "./AddLicenseType";
import { ToastContainer, toast } from "react-toastify";
import MultiSelectDropdown2 from "../../../Components/CustomDropdown/MultiSelectDropdown2";
import { getCompanyList } from "../../../Slices/Commondropdown/CommondropdownSlice";
import MultiSelectDropdown from "../../../Components/CustomDropdown/MultiSelectDropdown";
import { Title } from "../../../Components/Title/Title";

const LicenseForm = (props) => {
  const { form, handleFormChange } = props;
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [license_Types, setLicense_Types] = useState("");
  const dispatch = useDispatch();
  const { licenseType, regionWard, licensePeriod } = useSelector(
    (state) => state.AMC
  );
  const { getEmpDropData } = useSelector((state) => state.TravelManagement);

  const companyListData =
    useSelector((state) => state.CommonDropdownData.companyList) || [];

  useEffect(() => {
    dispatch(
      fetchDropdownData({ id: "LICENSE_TYPE", type: "AMC", key: "licenseType" })
    );
    dispatch(
      fetchDropdownData({
        id: "REGION_WARD",
        type: "AMC",
        key: "regionWard",
      })
    );
    dispatch(
      fetchDropdownData({
        id: "LICENSE_PERIOD",
        type: "AMC",
        key: "licensePeriod",
      })
    );
    dispatch(fetchEmpDropDownData());
    fetchCompanyListData();
  }, [dispatch]);

  const fetchCompanyListData = async () => {
    await dispatch(getCompanyList());
  };
  const handleSaveType = () => {
    setTimeout(() => {
      setLicense_Types("");
      toast.success("License Type Added Successfully");
    }, 1000);
  };
  // const handleCheckboxChangeVoucherType = (e) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     voucherType: e.value,
  //   }));
  // };
  const handleAddLicense = async () => {
    const payload = {};
    // const response = await dispatch(addLicense(payload));
    // console.log("response", response);
    // if (response.payload.statusCode === 200) {
    //   toast.success(response.payload.data.data[0].result);
    //   setTimeout(() => {
    //     // window.location.reload();
    //     setShow(false);
    //     dispatch(fetchEmpDropDownData());
    //   }, 2000);
    // }
  };
  console.log(form?.others_license_Types,'sds')
  return (
    <div className="mt-2">
      <Title title="Add License Details" />
      <hr />
      <Row>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <Col md={4} className="my-2">
          {/* <CustomInput
            type="text"
            labelName="Company Name:"
            placeholder="Enter Company Name"
            value={form.Company}
            onChange={(e) => handleFormChange("Company", e.target.value)}
            mandatoryIcon={true}
          /> */}
          <MultiSelectDropdown2
            value={form.Company}
            onChange={(e) => handleFormChange("Company", e.target.value)}
            options={[
              ...(Array.isArray(companyListData?.data)
                ? companyListData?.data?.map((e) => ({
                    value: e.company_id,
                    label: e.company_name,
                  }))
                : []),
            ]}
            optionLabel="label"
            placeholder="Select Company Name"
            label="Company Name"
            height="42px"
            mandatoryIcon={true}
          />
          {/* <MultiSelectDropdown
            data={companyListData?.data || []}
            valueKey="company_id"
            labelKey="company_name"
            label="Company Name"
            selectLabel="Select Company Name"
            value={form.Company || []}
            handleCheckboxChange={(e) => handleFormChange("Company", e.target.value)}
          /> */}
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Name of Govt. Agency"
            placeholder="Enter Govt. Agency Name"
            value={form.nameOfEstablishment}
            onChange={(e) =>
              handleFormChange("nameOfEstablishment", e.target.value)
            }
            mandatoryIcon={true}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomDropdown
            dropdownLabelName="License Type"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[{ label: "Select", value: "" }, ...(licenseType || [])]}
            selectedValue={form.type}
            // onChange={(e) => handleFormChange("type", e.target.value)}
            onChange={(e) => {
              const selectedValue = e.target.value;
              handleFormChange("type", selectedValue);
              if (selectedValue === "7") {
                setShow(true);
              } else {
                setShow(false);
              }
            }}
          />
        </Col>
        {show || form?.others_license_Types && (
          // <AddLicenseType
          //   setShow={setShow}
          //   show={show}
          //   handleShow={handleShow}
          //   handleClose={handleClose}
          //   handleSave={handleAddLicense}
          //   setLicense_Types={setLicense_Types}
          //   license_Types={license_Types}
          // />
          <Col md={4} className="my-2">
            <CustomInput
              type="text"
              labelName="Others License Type"
              placeholder="Enter Others License Type"
              // mandatoryIcon={true}
              value={form?.others_license_Types}
              // onChange={(e) => setLicense_Types(e.target.value)}
              onChange={(e)=> handleFormChange("others_license_Types", e.target.value)}
              // isDisable
            />
          </Col>
        )}
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Name of Service Vendor"
            placeholder="Enter Service Vendor Name"
            value={form.serviceVendor}
            onChange={(e) => handleFormChange("serviceVendor", e.target.value)}
            mandatoryIcon={true}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="License No:"
            placeholder="Enter License Number"
            mandatoryIcon={true}
            value={form.licenseNo}
            onChange={(e) => handleFormChange("licenseNo", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomDropdown
            dropdownLabelName="Region and Ward:"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[{ label: "Select", value: "" }, ...(regionWard || [])]}
            selectedValue={form.regionWard}
            onChange={(e) => handleFormChange("regionWard", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomDropdown
            dropdownLabelName="Period:"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[{ label: "Select", value: "" }, ...(licensePeriod || [])]}
            selectedValue={form.period}
            onChange={(e) => handleFormChange("period", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <MUIStartDate
            Label="Renewal Due Date:"
            onChange={(newValue) =>
              handleFormChange(
                "renewalDate",
                newValue ? newValue.format("YYYY-MM-DD") : ""
              )
            }
            value={form.renewalDate}
          />
        </Col>
        {/* <Col md={4} className="my-2">
          <Form.Label>
            Responsibility: <span className="text-danger">*</span>
          </Form.Label>
          <Autocomplete
            options={getEmpDropData} // Pass the array directly
            getOptionLabel={(option) => option.username || null} // Display the username
            isOptionEqualToValue={(option, value) =>
              option.userId === value.userId
            }
            renderInput={(params) => <TextField {...params} size="small" />}
            onChange={(event, newValue) =>
              handleFormChange(
                "responsibility",
                newValue ? newValue.userId : null
              )
            }
            value={
              getEmpDropData.find((emp) => emp.userId == form.responsibility) ||
              null
            } // Set the selected value
            size="small"
          />
        </Col> */}
        <Col md={4} className="my-2">
          <CustomInput
            type="file"
            labelName="Upload Document"
            accept=".pdf,.jpeg,.jpg,.png"
            selectedValue={form.file}
            onChange={(e) => handleFormChange("file", e.target.files[0])}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Remark"
            placeholder="Enter Remark"
            value={form.remark}
            onChange={(e) => handleFormChange("remark", e.target.value)}
            // mandatoryIcon={true}
          />
        </Col>
      </Row>
    </div>
  );
};

export default LicenseForm;