import { Col, Row } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { getStatusDropdown } from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import { useEffect } from "react";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";

const ReplyTextEditor = ({ form, handleFormChange, reply, setFile, view }) => {
  const dispatch = useDispatch();
  const { statusDropdown } = useSelector((state) => state.AdminHelpDesk);

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
  }, [dispatch]);

  return (
    <>
      <Row>
        <Col md={3} xs={12} className="">
          <CustomDropdown
            mandatoryIcon={true}
            dropdownLabelName="Status"
            options={statusDropdown}
            labelKey="label"
            valueKey="value"
            selectedValue={form.status}
            onChange={(e) => handleFormChange("status", e.target.value)}
            isDisable={view === true}
          />
        </Col>
      </Row>
      <Row className="mt-2 mb-5">
        <Col md={12}>
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
            value={form.content}
            style={{ height: 150 }}
            readOnly={view === true}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <CustomInput
            labelName="Upload Attachment"
            type="file"
            placeholder="Upload Document"
            onChange={(e) => setFile(e.target.files[0])}
            isDisable={view === true}
          />
        </Col>
      </Row>
    </>
  );
};

export default ReplyTextEditor;
