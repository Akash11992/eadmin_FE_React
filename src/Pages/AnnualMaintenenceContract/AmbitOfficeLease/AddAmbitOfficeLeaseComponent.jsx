import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import MUIStartDate from "../../../Components/DatePicker/MUIStartDate";
import { useDispatch, useSelector } from "react-redux";
import { fetchDropdownData } from "../../../Slices/AMC/AMCSlice";
import { getCompanyList } from "../../../Slices/Commondropdown/CommondropdownSlice";
import { fetchEmpDropDownData } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { Autocomplete, TextField } from "@mui/material";

const AddAmbitOfficeLeaseComponent = (props) => {
  const { form, handleFormChange, setForm } = props;
  const dispatch = useDispatch();
  const { propertyType } = useSelector((state) => state.AMC);
  const { getEmpDropData } = useSelector((state) => state.TravelManagement);
  const { companyList } = useSelector((state) => state.CommonDropdownData);

  useEffect(() => {
    dispatch(
      fetchDropdownData({
        id: "PROPERTY_TYPE",
        type: "AMC",
        key: "propertyType",
      })
    );
    dispatch(getCompanyList());
    dispatch(fetchEmpDropDownData());
  }, [dispatch]);

  const companyData = companyList?.data || [];

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      efficiency: calculateEfficiency() || "", // Initialize usableArea if it's not already set
    }));
  }, [form.chargableArea, form.usableArea]);

  const calculateEfficiency = () => {
    if (!form.chargableArea || !form.usableArea) return 0; // Prevent divide by zero
    return ((form.usableArea / form.chargableArea) * 100).toFixed(2);
  };
  return (
    <>
      <Row>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Name of Property:"
            placeholder="Enter Property Name"
            mandatoryIcon={true}
            value={form.nameOfProp}
            onChange={(e) => handleFormChange("nameOfProp", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Address:"
            placeholder="Enter Address"
            mandatoryIcon={true}
            value={form.address}
            onChange={(e) => handleFormChange("address", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomDropdown
            dropdownLabelName="Property Type:"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[
              { label: "Select Property Type", value: "" },
              ...(propertyType || []),
            ]}
            selectedValue={form.propType}
            onChange={(e) => handleFormChange("propType", e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="my-2">
          <CustomDropdown
            dropdownLabelName="Entity"
            labelKey="company_name"
            valueKey="company_id"
            mandatoryIcon={true}
            options={[
              { company_id: "", company_name: "Select company" },
              ...companyData,
            ]}
            selectedValue={form.entity}
            onChange={(e) => handleFormChange("entity", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <Form.Label>
            Responsibility: <span className="text-danger">*</span>
          </Form.Label>
          <Autocomplete
            options={getEmpDropData}
            getOptionLabel={(option) => option.username || ""}
            isOptionEqualToValue={(option, value) =>
              option.userId === value.userId
            }
            renderInput={(params) => <TextField {...params} size="small" placeholder="Select Responsibility" />}
            onChange={(event, newValue) =>
              handleFormChange(
                "responsibility",
                newValue ? newValue.userId : null
              )
            }
            value={
              getEmpDropData.find(
                (emp) => emp.userId === form.responsibility
              ) || null
            }
            size="small"
          />
        </Col>
      </Row>
      <Row>
        <Col className="mt-3">
          <span className="align-content-center text-danger">
            Tenure of Agreement:
          </span>
        </Col>
        <Col md={4} className="my-2">
          <MUIStartDate
            Label="Start Date"
            mandatoryIcon={true}
            onChange={(newValue) =>
              handleFormChange(
                "toaStartDate",
                newValue ? newValue.format("YYYY-MM-DD") : null
              )
            }
            value={form.toaStartDate}
            MaxValue={form.toaEndDate}
          />
        </Col>
        <Col md={4} className="my-2">
          <MUIStartDate
            Label="End Date"
            mandatoryIcon={true}
            onChange={(newValue) =>
              handleFormChange(
                "toaEndDate",
                newValue ? newValue.format("YYYY-MM-DD") : null
              )
            }
            value={form.toaEndDate}
            MinValue={form.toaStartDate}
          />
        </Col>
      </Row>
      <Row>
        <Col className="mt-3">
          <span className="align-content-center text-danger">
            Lock-in Period:
          </span>
        </Col>
        <Col md={4} className="my-2">
          <MUIStartDate
            Label="Start Date"
            mandatoryIcon={true}
            onChange={(newValue) =>
              handleFormChange(
                "lipStartDate",
                newValue ? newValue.format("YYYY-MM-DD") : null
              )
            }
            value={form.lipStartDate}
            MaxValue={form.lipEndDate}
          />
        </Col>
        <Col md={4} className="my-2">
          <MUIStartDate
            Label="End Date"
            mandatoryIcon={true}
            onChange={(newValue) =>
              handleFormChange(
                "lipEndDate",
                newValue ? newValue.format("YYYY-MM-DD") : null
              )
            }
            value={form.lipEndDate}
            MinValue={form.lipStartDate}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Rent Free Period:"
            placeholder="Enter Period"
            value={form.rentFree}
            onChange={(e) => handleFormChange("rentFree", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Notice Period:"
            placeholder="Enter Period"
            value={form.noticePeriod}
            onChange={(e) => handleFormChange("noticePeriod", e.target.value)}
            isMin={0}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="number"
            labelName="Usable Area (sq.ft.):"
            placeholder="Enter Usable Area"
            value={form.usableArea}
            onChange={(e) => handleFormChange("usableArea", e.target.value)}
            isMin={0}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="my-2">
          <CustomInput
            type="number"
            labelName="Chargable Area (sq.ft.):"
            placeholder="Enter Chargable Area"
            value={form.chargableArea}
            onChange={(e) => handleFormChange("chargableArea", e.target.value)}
            isMin={0}

          />
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="number"
            labelName="Efficiency:"
            placeholder="Enter Efficiency"
            value={form.efficiency}
            onChange={(e) => handleFormChange("efficiency", e.target.value)}
            isMin={0}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Renewal Term:"
            placeholder="Enter Term"
            value={form.renewalTerm}
            onChange={(e) => handleFormChange("renewalTerm", e.target.value)}
          />
        </Col>
      </Row>
    </>
  );
};

export default AddAmbitOfficeLeaseComponent;
