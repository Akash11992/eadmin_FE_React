import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupDropdown,
  getTypeDropdown,
} from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";

const GroupTypeDropdown = ({ form, handleFormChange,view}) => {
  const dispatch = useDispatch();

  const { typeDropdown, groupDropdown } = useSelector(
    (state) => state.AdminHelpDesk
  );
  useEffect(() => {
    dispatch(getTypeDropdown("TYPE"));
    dispatch(getGroupDropdown({ type: "group", id: 0 }));
  }, [dispatch]);

  return (
    <Row>
      <Col md={4}>
        <CustomInput
          type="text"
          labelName="Subject"
          placeholder="Enter Subject"
          mandatoryIcon={true}
          value={form.subject}
          onChange={(e) => handleFormChange("subject", e.target.value)}
          isDisable={form.disable}
        />
      </Col>
      <Col md={4}>
        <CustomDropdown
          dropdownLabelName="Type"
          labelKey="label"
          valueKey="value"
          options={typeDropdown}
          selectedValue={form.type}
          onChange={(e) => handleFormChange("type", e.target.value)}
          isDisable={view === true}
        />
      </Col>
      <Col md={4}>
        <CustomDropdown
          dropdownLabelName="Service Group"
          labelKey="label"
          valueKey="value"
          options={[{ label: "Select Group", value: "0" }, ...groupDropdown]}
          selectedValue={form.group}
          onChange={(e) => handleFormChange("group", e.target.value)}
          isDisable={view === true}
        />
      </Col>
    </Row>
  );
};

export default GroupTypeDropdown;
