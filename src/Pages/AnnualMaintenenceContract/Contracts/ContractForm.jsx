import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDropdownData } from "../../../Slices/AMC/AMCSlice";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { Col, Form, Row } from "react-bootstrap";
import MUIStartDate from "../../../Components/DatePicker/MUIStartDate";

const ContractForm = (props) => {
  const { form, handleFormChange } = props;
  const dispatch = useDispatch();
  const { getEmpDropData } = useSelector((state) => state.TravelManagement);
  const { vendor, serviceType } = useSelector((state) => state.AMC);

  useEffect(() => {
    dispatch(
      fetchDropdownData({ id: "Contract", type: "VENDOR", key: "vendor" })
    );
    dispatch(
      fetchDropdownData({ id: "SERVICE_TYPE", type: "AMC", key: "serviceType" })
    );
  }, [dispatch]);

  return (
    <>
      <Row>
        <Col md={4} className="my-2">
          <CustomDropdown
            dropdownLabelName="Vendor Name"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[{ label: "Select", value: "" }, ...(vendor || [])]}
            selectedValue={form.vendor}
            onChange={(e) => handleFormChange("vendor", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <MUIStartDate
            Label="Start Period:"
            onChange={(newValue) =>
              handleFormChange(
                "startDate",
                newValue ? newValue.format("YYYY-MM-DD") : ""
              )
            }
            value={form.startDate}
            MaxValue={form.endDate}
          />
        </Col>
        <Col md={4} className="my-2">
          <MUIStartDate
            Label="End Period:"
            onChange={(newValue) =>
              handleFormChange(
                "endDate",
                newValue ? newValue.format("YYYY-MM-DD") : ""
              )
            }
            value={form.endDate}
            MinValue={form.startDate}
          />{" "}
        </Col>
      </Row>
      <Row>
        <Col md={4} className="my-2">
          <CustomDropdown
            dropdownLabelName="Type of Service:"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[{ label: "Select", value: "" }, ...(serviceType || [])]}
            selectedValue={form.serviceType}
            onChange={(e) => handleFormChange("serviceType", e.target.value)}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomInput
            type="text"
            labelName="Remark:"
            placeholder="Enter Remark"
            value={form.remark}
            onChange={(e) => handleFormChange("remark", e.target.value)}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="file"
            labelName="Upload Document"
            accept=".pdf,.jpeg,.jpg,.png"
            selectedValue={form.file}
            onChange={(e) => handleFormChange("file", e.target.files[0])}
          />
        </Col>
      </Row>
    </>
  );
};

export default ContractForm;
