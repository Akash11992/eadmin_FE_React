import React, { useEffect, useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import CustomInput from "../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import {
  getBuildingDropdown,
  getLocationDropdown,
  getPriorityDropdown,
} from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import useDownloader from "react-use-downloader";

const TicketDetailsFields = ({
  form,
  handleFormChange,
  setFile,
  AttachmentDetails,
  ticketdataById,
  view
}) => {
  const dispatch = useDispatch();
  const { priorityDropdown, building, location } = useSelector(
    (state) => state.AdminHelpDesk
  );
  const mounted = useRef(false);
  const { download } = useDownloader();

  const payload = { type: "location", id: form.building };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      dispatch(getPriorityDropdown("PRIORITY"));
      dispatch(getBuildingDropdown({ type: "building", id: 0 }));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLocationDropdown(payload));
  }, [form.building]);

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

  return (
    <>
      <Row className="mt-3">
        <Col md={4}>
          <CustomInput
            type="number"
            labelName="SLA(Day/Hrs)"
            placeholder="Enter SLA"
            value={form.days}
            onChange={(e) => handleFormChange("days", e.target.value)}
            isDisable={form.disable}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="email"
            labelName="Escalation Email Id"
            placeholder="Enter Email ID"
            value={form?.escalationEmail}
            onChange={(e) =>
              handleFormChange("escalationEmail", e.target.value)
            }
            isDisable={form.disable}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="email"
            labelName="Email Contact"
            placeholder="Enter Email ID"
            value={form?.email}
            onChange={(e) => handleFormChange("email", e.target.value)}
            isDisable={true}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Priority"
            labelKey="label"
            valueKey="value"
            options={priorityDropdown}
            selectedValue={form.priority}
            onChange={(e) => handleFormChange("priority", e.target.value)}
            isDisable={form.disable}
          />
        </Col>
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Building"
            labelKey="label"
            valueKey="value"
            options={[{ label: "Select Building", value: 0 }, ...building]}
            selectedValue={form.building}
            onChange={(e) => handleFormChange("building", e.target.value)}
            isDisable={form.disable}
          />
        </Col>
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Location"
            labelKey="label"
            valueKey="value"
            options={[{ label: "Select Location", value: 0 }, ...location]}
            selectedValue={form.location}
            onChange={(e) => handleFormChange("location", e.target.value)}
            isDisable={form.disable}
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={8}>
          <Form.Label>
            Description <span className="text-danger">*</span>
          </Form.Label>
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
            onChange={(Description) =>
              handleFormChange("Description", Description)
            }
            value={form.Description}
            readOnly={form.disable}
            style={{
              maxHeight: 200,
              overflowY: "scroll",
            }}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            labelName="Upload Attachment"
            type="file"
            placeholder="Upload Document"
            onChange={(e) => setFile(e.target.files[0])}
            isDisable={view === true}
          />{" "}
          {AttachmentDetails?.length > 0 && (
            <Col>
              <ul className="">
                {AttachmentDetails?.map((attach) => (
                  <li key={attach.id} data-id={attach.id}>
                    <Button
                      className="text-primary btn-light no-hover"
                      onClick={() =>
                        download(attach.attachment_path, attach.attachment)
                      }
                    >
                      {attach.attachment}
                    </Button>
                  </li>
                ))}
              </ul>
            </Col>
          )}
          {ticketdataById?.files && ticketdataById?.files?.length > 0 && (
            <Col>
              <ul className="">
                {ticketdataById?.files?.map((attach) => (
                  <li>
                    <Button
                      className="text-primary btn-light no-hover"
                      onClick={() => download(attach.attachment, attach.name)}
                    >
                      {attach.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </Col>
          )}
        </Col>
      </Row>
    </>
  );
};

export default TicketDetailsFields;
