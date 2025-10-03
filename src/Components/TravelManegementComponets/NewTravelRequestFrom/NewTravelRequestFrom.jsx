import React, { useEffect, useState } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";

import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import CustomInput from "../../CustomInput/CustomInput";
import AutoSuggestion from "../../CustomDropdown/AutoSuggestion";
import { toast } from "react-toastify";
import {
  fetchDepartment_SubDepartments,
  fetchsubDepartments,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { useDispatch, useSelector } from "react-redux";

const NewTravelRequestFrom = (props) => {

  const {
    form,
    travellerName,
    travelMode,
    handleFormChange,
    editMode,
    reference_id,
    businesstype,
    setForm,
    HodAction
  } = props;
  const dispatch = useDispatch();
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const { getDepartment_subDepartment, subDepartment } = useSelector(
    (state) => state.TravelManagement
  );
  useEffect(() => {
     fetchDepartmentsDetails();
  }, [form?.companyName]);

  useEffect(() => {
    form?.departmentName && fetchSubDepartmentsDetails();
  }, [form?.departmentName]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size should not exceed 5 MB.");
        e.target.value = "";
        return;
      }
      setForm((prevForm) => ({
        ...prevForm,
        fileUpload: file,
      }));
    } else {
      toast.error("Please select a file.");
    }
  };

  const fetchDepartmentsDetails = async () => {
    const payload = {
      busineesId: form?.companyName || 0,
    };

    try {
      await dispatch(fetchDepartment_SubDepartments(payload));
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const fetchSubDepartmentsDetails = async () => {
    const payload = {
      deptCode: form?.departmentName || 0,
    };

    try {
      await dispatch(fetchsubDepartments(payload));
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  return (
    <>
      {editMode && (
        <Form.Group as={Col} md="4" className="mb-3 text-danger">
          <Form.Label htmlFor="Inward">
            Travel Request No. - {reference_id}
          </Form.Label>
        </Form.Group>
      )}
      <Row>
        <Col md="4">
          <AutoSuggestion
            dropdownLabelName="Traveler Name"
            labelKey="username"
            valueKey="userId"
            options={travellerName}
            selectedValue={form?.travelerName}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedTraveler = travellerName.find(
                (item) => item.userId.toString() === selectedId.toString()
              );
              if (selectedTraveler) {
                handleFormChange("travelerName", selectedTraveler.userId);
              } else {
                handleFormChange("travelerName", "");
              }
            }}
            mandatoryIcon
            placeholder="Search Traveler Name..."
            isDisable = {HodAction ? true : false}
          />
        </Col>

        <Col md="4">
          <Form.Group controlId="employeeID">
            <CustomInput
              labelName="Traveler Employee Id"
              type="text"
              value={form?.travelerName}
              placeholder="Enter traveler employee Id"
              isDisable
            />
          </Form.Group>
        </Col>

        <Col md="4">
          <CustomDropdown
            dropdownLabelName="Business"
            labelKey="businessName"
            valueKey="businessId"
            Dropdownlable
            options={businesstype?.data}
            selectedValue={form.companyName}
            onChange={(e) => handleFormChange("companyName", e.target.value)}
            isDisable = {HodAction ? true : false}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md="4">
          <CustomDropdown
            dropdownLabelName="Department"
            labelKey="department_desc"
            valueKey="dept_code"
            Dropdownlable
            options={getDepartment_subDepartment}
            selectedValue={form.departmentName}
            onChange={(e) => handleFormChange("departmentName", e.target.value)}
            isDisable = {HodAction ? true : false}
          />
        </Col>
        <Col md="4">
          <CustomDropdown
            dropdownLabelName="Sub Department"
            labelKey="department_desc"
            valueKey="dept_code"
            Dropdownlable
            options={subDepartment}
            selectedValue={form.subDepartmentName}
            onChange={(e) =>
              handleFormChange("subDepartmentName", e.target.value)
            }
            isDisable = {HodAction ? true : false}
          />
        </Col>
        <Col md="4">
          <CustomInput
            labelName="Travel Reason"
            type="text"
            value={form.travelType}
            placeholder="Enter Travel Reason"
            onChange={(e) => handleFormChange("travelType", e.target.value)}
            isDisable = {HodAction ? true : false}
          />
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md="4">
          <CustomInput
            labelName="Project Code"
            type="text"
            value={form.remark}
            placeholder="Enter Project Code"
            onChange={(e) => handleFormChange("remark", e.target.value)}
            mandatoryIcon
            isDisable = {HodAction ? true : false}
          />
        </Col>
        <Col md="4">
          <CustomInput
            labelName="Upload Document"
            type="file"
            onChange={onFileChange}
            accept=".jpg,.png,.jpeg,.pdf"
            isDisable = {HodAction ? true : false}
          />
        </Col>
        <Col md="4" className="">
          <CustomInput
            labelName="Booked by"
            type="text"
            value={savedUserData?.data?.name}
            isDisable
          />
        </Col>
      </Row>
    </>
  );
};

export default NewTravelRequestFrom;
