import React, { useEffect, useState, useCallback } from "react";
import { Table, Row, Col } from "react-bootstrap";
import CustomDropdown from "../../../../../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../../../../../Components/CustomInput/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import {
  getModuleList,
  getPageList,
} from "../../../../../../Slices/Role/RoleSlice";
import MultiEmailInput from "../../../../../../Components/CustomInput/MultiEmailInput";

const AddNewApproval = () => {
  const [form, setForm] = useState({
    module: null,
    page: null,
    level: 1,
  });
  const [rows, setRows] = useState([{ Level: 1, To: "", CC: "" }]);
  const dispatch = useDispatch();

  const { moduleList, pageList } = useSelector((state) => state.Role);
  useEffect(() => {
    fetchModuletype();
  }, []);

  useEffect(() => {
    form.module && fetchPages();
  }, [form.module]);

  const fetchModuletype = async () => {
    await dispatch(getModuleList());
  };
  const fetchPages = async () => {
    const payload = {
      module_ids: [form.module],
    };
    const response = await dispatch(getPageList(payload));
  };

  const handleFormChange = useCallback((name, value) => {
    if (name === "level") {
      const levelCount = Math.max(1, parseInt(value) || 1);
      setForm((prevState) => ({ ...prevState, level: levelCount }));
      const newRows = Array.from({ length: levelCount }, (_, index) => ({
        Level: index + 1,
        To: "",
        CC: "",
      }));

      setRows(newRows);
    } else {
      setForm((prevState) => ({ ...prevState, [name]: value }));
    }
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  console.log(rows, "rows");
  return (
    <>
      <Row>
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Module:"
            labelKey="module_name"
            valueKey="module_id"
            mandatoryIcon={true}
            options={[
              { module_id: "", module_name: "Select" },
              ...(moduleList?.data || []),
            ]}
            selectedValue={form.module}
            onChange={(e) => handleFormChange("module", e.target.value)}
          />
        </Col>
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Pages:"
            labelKey="form_name"
            valueKey="form_id"
            mandatoryIcon={true}
            options={[
              { form_id: "", form_name: "Select" },
              ...(pageList?.data || []),
            ]}
            selectedValue={form.page}
            onChange={(e) => handleFormChange("page", e.target.value)}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            type="number"
            labelName="Levels for Approval:"
            mandatoryIcon={true}
            placeholder="Enter Number of Levels"
            value={form.level}
            onChange={(e) => handleFormChange("level", e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Table size="sm" striped bordered hover className="mt-3">
            <thead>
              <tr className="text-center">
                <th className="bg-danger text-white">Level</th>
                <th className="bg-danger text-white">To</th>
                <th className="bg-danger text-white">CC</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.Level}</td>
                  <td>
                    <MultiEmailInput
                      emails={row?.To?.split(",") || []}
                      onChange={(emails) =>
                        handleInputChange(index, "To", emails.join(","))
                      }
                      placeHolder="Enter Email"
                    />
                  </td>
                  <td>
                    <MultiEmailInput
                      emails={row?.CC?.split(",") || []}
                      onChange={(emails) =>
                        handleInputChange(index, "CC", emails.join(","))
                      }
                      placeHolder="Enter Email"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default AddNewApproval;
