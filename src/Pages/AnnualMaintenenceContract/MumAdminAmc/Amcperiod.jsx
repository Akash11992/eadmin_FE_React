import { Col, Form, Row } from "react-bootstrap";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchDropdownData } from "../../../Slices/AMC/AMCSlice";
import { useEffect } from "react";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import MUIStartDate from "../../../Components/DatePicker/MUIStartDate";
import { fetchEmpDropDownData } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { Autocomplete, TextField } from "@mui/material";

const AmcDetailsComponent = (props) => {
  const { form, handleFormChange } = props;
  const dispatch = useDispatch();
  const { amcStatus } = useSelector((state) => state.AMC);
  const { getEmpDropData } = useSelector((state) => state.TravelManagement);

  useEffect(() => {
    dispatch(
      fetchDropdownData({ id: "AMC_STATUS", type: "AMC", key: "amcStatus" })
    );
    dispatch(fetchEmpDropDownData());
  }, [dispatch]);

  return (
    <>
      <Row>
        <div>
          <h6 className="my-2" style={{ color: "red" }}>
            Period
          </h6>
        </div>

        <Col md={4} className="my-2">
          <MUIStartDate
            Label="Start Date"
            mandatoryIcon={true}
            onChange={(newValue) =>
              handleFormChange(
                "from_date",
                newValue ? newValue.format("YYYY-MM-DD") : ""
              )
            }
            value={form.from_date}
            MaxValue={form.to_date}
          />
        </Col>
        <Col md={4} className="my-2">
          <MUIStartDate
            Label="End Date"
            mandatoryIcon={true}
            onChange={(newValue) =>
              handleFormChange(
                "to_date",
                newValue ? newValue.format("YYYY-MM-DD") : ""
              )
            }
            value={form.to_date}
            MinValue={form.from_date}
          />
        </Col>
        <Col md={4} className="my-2">
          <CustomDropdown
            dropdownLabelName="AMC Status"
            labelKey="label"
            valueKey="value"
            mandatoryIcon={true}
            options={[{ label: "Select", value: "" }, ...(amcStatus || [])]}
            selectedValue={form.status}
            onChange={(e) => handleFormChange("status", e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="my-2">
          <Form.Label>
            Responsibility: <span className="text-danger">*</span>
          </Form.Label>
          <Autocomplete
            options={getEmpDropData} // Pass the array directly
            getOptionLabel={(option) => option.username || null} // Display the username
            isOptionEqualToValue={(option, value) =>
              option.userId === value.userId
            }
            renderInput={(params) => <TextField {...params} size="small" />}
            onChange={(event, newValue) =>
              handleFormChange(
                "responsibility",
                newValue ? newValue.userId : null
              )
            }
            value={
              getEmpDropData.find((emp) => emp.userId == form.responsibility) ||
              null
            } // Set the selected value
            size="small"
          />
        </Col>
      </Row>
    </>
  );
};
export default AmcDetailsComponent;
