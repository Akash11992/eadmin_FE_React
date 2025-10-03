import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import ReactQuill from "react-quill";
import {
  getApprovedByDropdown,
  getStatusDropdown,
} from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendorNameDetails } from "../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { toast } from "react-toastify";
 
const RepairMaintanance = (props) => {
  const { form, handleFormChange, setFile, id, view } = props;
 
  const dispatch = useDispatch();
  const { statusDropdown, approvedBy } = useSelector(
    (state) => state.AdminHelpDesk
  );
  const { vendorDetailsNameData } = useSelector(
    (state) => state.TravelManagement
  );
  useEffect(() => {
    const fetchVendorNames = async () => {
      const payload = {
        sub_category_id: 15,
      };
      try {
        await dispatch(fetchVendorNameDetails(payload));
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    };
    fetchVendorNames();
  }, []);
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };
  useEffect(() => {
    dispatch(getStatusDropdown("STATUS"));
    dispatch(getApprovedByDropdown("APPROVED_BY"));
  }, [dispatch]);
  return (
    <>
      <Row>
        {/* Status */}
        <Col md={4} className=" mt-3">
          <CustomDropdown
            mandatoryIcon={true}
            dropdownLabelName="Status"
            labelKey="label"
            valueKey="value"
            options={statusDropdown}
            selectedValue={form.status}
            onChange={(e) => handleFormChange("status", e.target.value)}
            isDisable={view === true}
          />
        </Col>
 
        {/* Vendor Name */}
        <Col md={4} className=" mt-3">
          <CustomDropdown
            dropdownLabelName="Vendor Name"
            labelKey="DESCRIPTION"
            valueKey="VENDOR_ID"
            options={[
              { DESCRIPTION: "Select Vendor", VENDOR_ID: "" },
              ...(vendorDetailsNameData || []),
            ]}
            selectedValue={form.vendor}
            onChange={(e) => handleFormChange("vendor", e.target.value)}
            isDisable={view === true}
            mandatoryIcon={true}
          />
        </Col>
 
        {/* Purchase Order */}
        <Col md={4} className=" mt-3">
          <CustomInput
            type="text"
            labelName="Purchase Order"
            placeholder="Enter PO"
            value={form.po}
            onChange={(e) => handleFormChange("po", e.target.value)}
            isDisable={view === true}
          />
        </Col>
 
        {/* Upload Invoice */}
        <Col md={4} className=" mt-3">
          <CustomInput
            type="file"
            labelName="Upload Attachment"
            placeholder="Upload Attachment"
            onChange={(e) => setFile(Array.from(e.target.files))}
            isDisable={view === true}
            accept=" .pdf, .jpg, .jpeg,.png"
            multiple={true}
          />
        </Col>
        <Col md={4} className=" mt-3">
          <CustomInput
            type="number"
            labelName=" Total Cost"
            placeholder="Enter Cost"
            value={form.cost}
            onChange={(e) => handleFormChange("cost", e.target.value)}
            isDisable={view === true}
            isMin={0}
          />
        </Col>
        <Col md={4} className=" mt-3">
          <CustomDropdown
            dropdownLabelName="Approver"
            labelKey="label"
            valueKey="value"
            options={[{ label: "Select Approver", value: "" }, ...approvedBy]}
            selectedValue={form.approvedBy}
            onChange={(e) => handleFormChange("approvedBy", e.target.value)}
            isDisable={view === true}
          />
        </Col>
        <Col md={4} className=" mt-3">
          <CustomInput
            type="text"
            labelName="Approval Status"
            placeholder="Enter Status"
            value={form.approvalStatus}
            isDisable={true}
          />
        </Col>
        <Col md={4} className=" mt-3">
          <CustomInput
            type="date"
            labelName="Approval Date"
            placeholder="Enter Date"
            value={form.dateOfPayment}
            // onChange={(e) => handleFormChange("dateOfPayment", e.target.value)}
            isDisable={true}
          />
        </Col>
        {/* Date of Completion */}
        <Col md={4} className=" mt-3">
          <CustomInput
            type="date"
            labelName="Date Of Completion"
            placeholder="Enter Date"
            value={form.dateOfCompletion}
            onChange={(e) =>
              handleFormChange("dateOfCompletion", e.target.value)
            }
            isDisable={view === true}
          />
        </Col>
 
        {/* Date of Payment */}
 
        {/* Description */}
        <Col md={12} className="mb-5 mt-3">
          <label>
            Description <span className="text-danger">*</span>
          </label>
          <ReactQuill
            theme="snow"
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "blockquote",
              "list",
              "bullet",
              "indent",
              "link",
            ]}
            modules={modules}
            onChange={(content) =>
              handleFormChange(
                "content",
                content === "<p><br></p>" ? null : content
              )
            }
            style={{ height: 150 }}
            readOnly={view === true}
          />
        </Col>
      </Row>
    </>
  );
};
 
export default RepairMaintanance;