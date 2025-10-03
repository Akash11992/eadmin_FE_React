import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import CustomInput from "../../CustomInput/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getMappedId } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import MultiEmailInput from "../../CustomInput/MultiEmailInput";

const ApproverSelector = (props) => {
  const { form, handleFormChange, getDepartment_subDepartment, setForm,business ,HodAction} =
    props;
  const dispatch = useDispatch();

  useEffect(() => {
    if (form.p_approval_id == 1) {
      handleApprover();
    }
  }, [form.p_approval_id,form?.companyName, form?.departmentName]);

  const handleApprover = async () => {
    const matchedDepartment = getDepartment_subDepartment.find(
      (dept) => dept.dept_code == form?.departmentName
    );
    const matchedBusiness = business.find(
      (bus) => bus.businessId == form?.companyName
    );
    const payload = {
      vendor_id: form?.travelMode == 1 ? "Air" : null,
      report_type: matchedDepartment?.dept_type || matchedBusiness?.business_code,
    };

    if (form?.departmentName) {
      const response = await dispatch(getMappedId(payload));
      setForm((prev) => ({
        ...prev,
        hod: response?.payload?.data?.data,
      }));
    } else {
      toast.warning("Please Select Department");
    }
  };
  return (
    <Row className="mt-3 align-items-center">
      <Col md={3}>
        <Form.Group>
          <Form.Label>
            Approver <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            id="approverId"
            name="approve_status"
            value={form.p_approval_id}
            onChange={(e) => handleFormChange("p_approval_id", e.target.value)}
            disabled = { HodAction ? true : false}
          >
            <option value="-1">Select Option</option>
            <option value="1">HoD</option>
            <option value="2">Other</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={6}>
        {form.p_approval_id == "2" ? (
            <MultiEmailInput
              emails={form.supervisorEmail.split(",") || []}
              onChange={(emails) =>
                handleFormChange("supervisorEmail", emails.join(","))
              }
              label="Other Reporting Manager Email"
              placeHolder="Enter Email"
              mandatoryIcon={true}
              // isDisable = { HodAction ? false : true}
              
            />
        ) : // <CustomInput
        //   type="text"
        //   labelName="Other Reporting Manager Email"
        //   value={form.supervisorEmail || ""}
        //   placeholder="Enter Other Reporting Manager Email"
        //   onChange={(e) =>
        //     handleFormChange("supervisorEmail", e.target.value)
        //   }
        //   mandatoryIcon
        // />
        form.p_approval_id == "1" ? (
          <CustomInput
            type="text"
            labelName="HoD Email"
            value={form.hod?.length > 0 ? form.hod[0]?.to : ""}
            onChange={(e) =>
              handleFormChange("supervisorEmail", e.target.value)
            }
            placeholder="Enter HoD Email"
            isDisable
            mandatoryIcon
          />
        ) : null}
      </Col>

      <Col md={3}>
        {form.p_approval_id == "2" ? (
          <CustomInput
            type="text"
            labelName="Reason for Changing HoD"
            value={form?.reasonChangingSupervisor || ""}
            placeholder="Enter Reason for Changing HoD"
            onChange={(e) =>
              handleFormChange("reasonChangingSupervisor", e.target.value)
            }
            isDisable = {HodAction ? true : false}
          />
        ) : form.p_approval_id == "1" ? (
          <CustomInput
            type="text"
            labelName="HoD ID"
            value={form.hod?.length > 0 ? form.hod[0]?.employee_id : ""}
            isDisable
          />
        ) : null}
      </Col>
    </Row>
  );
};

export default ApproverSelector;
