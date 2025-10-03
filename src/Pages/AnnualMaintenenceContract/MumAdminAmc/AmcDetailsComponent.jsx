import { Col, Dropdown, Row } from "react-bootstrap";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import BudgetTable from "./BudgetTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchDropdownData } from "../../../Slices/AMC/AMCSlice";
import { useEffect } from "react";
import { getCompanyList } from "../../../Slices/Commondropdown/CommondropdownSlice";
import { getBuildingDropdown } from "../../../Slices/OfficeSupply/OfficeSupplySlice";

const AmcDetailsComponent = (props) => {
  const { form, handleFormChange, setForm, type, AttachmentDetails } = props;
  const dispatch = useDispatch();
  const { typeDropdown, serviceSchedule, paymentTerm, vendor } = useSelector(
    (state) => state.AMC
  );
  const { companyList } = useSelector((state) => state.CommonDropdownData);
  const { building } = useSelector((state) => state.OfficeSupply);
  useEffect(() => {
    dispatch(
      fetchDropdownData({ id: "AMC_TYPE", type: "AMC", key: "typeDropdown" })
    );
    dispatch(
      fetchDropdownData({
        id: "SERVICE_SCH",
        type: "AMC",
        key: "serviceSchedule",
      })
    );
    dispatch(
      fetchDropdownData({ id: "PAYMENT_TERM", type: "AMC", key: "paymentTerm" })
    );
    dispatch(fetchDropdownData({ id: "Admin", type: "VENDOR", key: "vendor" }));
    dispatch(getCompanyList());
    dispatch(getBuildingDropdown({ type: "building", id: 0 }));
  }, [dispatch]);

  const companyData = companyList?.data || [];

  return (
    <>
      <Row>
        <Col md={3} className="my-2">
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
        <Col md={3} className="my-2">
          <CustomInput
            type="text"
            labelName="Vendor ID"
            placeholder="Enter ID"
            value={form.vendor}
            isDisable
          />
        </Col>
        <Col md={3} className="my-2">
          <CustomInput
            type="text"
            labelName="Equipment:"
            placeholder="Enter Equipment Details"
            value={form.equip_details}
            onChange={(e) => handleFormChange("equip_details", e.target.value)}
            mandatoryIcon={true}
          />
        </Col>
        <Col md={3} className="my-2">
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
      </Row>
      <Row>
        <Col md={3} className="my-2">
          <CustomDropdown
            dropdownLabelName="Location"
            mandatoryIcon={true}
            options={[{ label: "Select", value: "" }, ...(building || [])]}
            labelKey="label"
            valueKey="value"
            selectedValue={form.location}
            onChange={(e) => handleFormChange("location", e.target.value)}
          />
        </Col>
        <Col md={3} className="my-2">
          <CustomDropdown
            dropdownLabelName="AMC Type"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[
              { label: "Select Type", value: "" },
              ...(typeDropdown || null),
            ]}
            selectedValue={form.type}
            onChange={(e) => handleFormChange("type", e.target.value)}
          />
        </Col>
        <Col md={3} className="my-2 ">
          <CustomDropdown
            dropdownLabelName="Service Schedule:"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[
              { label: "Select Schedule", value: "" },
              ...(serviceSchedule || []),
            ]}
            selectedValue={form.service_sch}
            onChange={(e) => handleFormChange("service_sch", e.target.value)}
          />
        </Col>
        <Col md={3} className="my-2">
          <CustomDropdown
            dropdownLabelName="Payment Term"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[
              { label: "Select Term", value: "" },
              ...(paymentTerm || []),
            ]}
            selectedValue={form.paymentTerm}
            onChange={(e) => handleFormChange("paymentTerm", e.target.value)}
          />
        </Col>
      </Row>
      {/* <Row className="">
        <Col md={3} className="my-2">
          <CustomInput
            type="text"
            labelName="PO Number"
            placeholder="Enter PO Number"
            mandatoryIcon={true}
            value={form.po_number}
            onChange={(e) => handleFormChange("po_number", e.target.value)}
          />
        </Col>
        <Col md={3} className="my-2">
          <CustomInput
            type="file"
            labelName="Upload Document"
            // mandatoryIcon={true}
            accept=".pdf,.jpeg,.jpg,.png"
            selectedValue={form.file}
            onChange={(e) => handleFormChange("file", e.target.files[0])}
          />
        </Col>
        <Col md={3} style={{ marginTop: "39px" }}>
          <Dropdown>
            <Dropdown.Toggle
              variant="dark"
              id="dropdown-basic"
              disabled={!AttachmentDetails || AttachmentDetails.length === 0}
            >
              View Document
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {AttachmentDetails?.map((file, index) => (
                <Dropdown.Item
                  key={file.referenceSubName || index}
                  href={file.attachment_path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.referenceSubName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row> */}
    </>
  );
};
export default AmcDetailsComponent;
