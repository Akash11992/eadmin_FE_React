import React, { useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import MultiSelectDropdown from "../../Components/CustomDropdown/MultiSelectDropdown";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  getServiceDetails,
  getTicketMediumDropdown,
  getticketOwnerDropdown,
} from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";

const TicketOwnerMediumDropdown = ({ form, handleFormChange ,view}) => {
  const dispatch = useDispatch();
  const mounted = useRef(false);

  const { service, ticketMediumDropdown, employeeDropdown } = useSelector(
    (state) => state.AdminHelpDesk
  );

  const ticketOwnerPayload = {
    type: "TicketOwner",
    id: 0,
  };
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      dispatch(getticketOwnerDropdown(ticketOwnerPayload));
      dispatch(getTicketMediumDropdown("TM"));
    }
  }, [dispatch]);

  // api call service dropdown
  useEffect(() => {
    dispatch(getServiceDetails({ type: "service", id: form.group }));
  }, [form.group]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      handleFormChange("ticketOwner", [...form?.ticketOwner, value]);
    } else {
      handleFormChange(
        "ticketOwner",
        form?.ticketOwner.filter((owner) => owner !== value)
      );
    }
  };

  return (
    <Row className="mt-3">
      <Col md={4}>
        <CustomDropdown
          dropdownLabelName="Service"
          options={[{ label: "Select Service", value: "0" }, ...service]}
          labelKey="label"
          valueKey="value"
          selectedValue={form.service}
          onChange={(e) => handleFormChange("service", e.target.value)}
          isDisable={view === true}
        />
      </Col>
      <Col md={4}>
        <MultiSelectDropdown
          data={employeeDropdown}
          valueKey="Emp_id"
          labelKey="Employee"
          value={form?.ticketOwner}
          label="Ticket Owner"
          isDisabled={form.disable}
          handleCheckboxChange={handleCheckboxChange}
          selectLabel="Select Ticket Owner"
        />
      </Col>
      <Col md={4}>
        <CustomDropdown
          dropdownLabelName="Ticket Medium"
          options={ticketMediumDropdown}
          labelKey="label"
          valueKey="value"
          selectedValue={form.ticketMedium}
          onChange={(e) => handleFormChange("ticketMedium", e.target.value)}
          isDisable={form.disable}
        />
      </Col>
    </Row>
  );
};

export default TicketOwnerMediumDropdown;
