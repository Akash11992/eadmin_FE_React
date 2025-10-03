import { useDispatch, useSelector } from "react-redux";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { Title } from "../../../Components/Title/Title";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import RepairAndMaintenanceText from "./RepairAndMaintenanceText"; // Import for Repair & Maintenance
import Conveyance from "./Conveyance";
import Canteen from "./Canteen";
import ConveyanceOthers from "./ConveyanceOthers";
import AdvanceAgainstSalaryAw from "./AdvanceAgainstSalaryAw";

import "./Main.css";
import {
  getCreatedByList,
  getVoucherDetails,
} from "../../../Slices/PettyCashManagement/PettyCashDropdownSlice";
import { useLocation } from "react-router-dom";
import MobileRecharge from "./MobileRecharge/MobileRecharge";
import OthersVoucher from "./OthersVoucher/OthersVoucher";
import Meeting from "./Meeting/Meeting";
import { ToastContainer } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";

const AddVoucherCreation = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { voucherData, isEditMode, voucherType, createdBy, isViewMode, path } =
    location.state || {};

  const createdByList = useSelector(
    (state) => state.PettyCashDropdown.createdByList
  );

  const voucherTypeData = useSelector(
    (state) => state?.PettyCashDropdown?.voucherDetailsData
  );
  const creadtedBy =
    createdByList?.find((item) => item.label === createdBy)?.code || null;

    const [formState, setFormState] = useState({
    selectedVoucherValue: isEditMode ? voucherType : null,
    createdBy: isEditMode ? creadtedBy : null,
    userId: null,
  });
  // useEffect code here ..
  useEffect(() => {
    return () => dispatch(getVoucherDetails("VOUCHER_TYPE"));
  }, []);

  useEffect(() => {
    dispatch(getCreatedByList("OFFICE_BOY"));
    return () => {};
  }, []);

  const [rows, setRows] = useState([
    {
      category: "",
      itemName: "",
      quantity: "",
      rate: "",
      amount: "",
      receivedItems: "",
    },
  ]);

  const handleChange = useCallback((name, value) => {
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleInput = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
    };
    setRows(updatedRows);
    // console.log("All Rows Data:", updatedRows);
  };

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="mb-2">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <Card className="border-0">
          <Title
            title={isEditMode ? "Update Voucher Form" : "Voucher Creation Form"}
          />
          <Form className="mt-0">
            <Row className="mt-3">
              <Col md={3}>
                <Form.Label>
                  Created By <span className="text-danger">*</span>
                </Form.Label>
                <Autocomplete
                  options={
                    Array.isArray(createdByList)
                      ? createdByList.map((e) => ({
                          label: e.label,
                          value: e.code,
                        }))
                      : []
                  }
                  getOptionLabel={(option) => option.label || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value?.value
                  }
                  value={
                    createdByList
                      ? createdByList.find(
                          (item) => item.code == formState?.createdBy
                        ) || null
                      : null
                  }
                  onChange={(event, newValue) => {
                    handleChange("createdBy", newValue ? newValue.value : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Name"
                      size="small"
                    />
                  )}
                  disabled={isEditMode || isViewMode ? true : false}
                />
                {/* <CustomDropdown
                  dropdownLabelName="Created By"
                  options={[
                    {
                      value: "",
                      label: "Select Name",
                    },
                    ...(Array.isArray(createdByList)
                      ? createdByList?.map((e) => ({
                          label: e?.label,
                          value: e?.code,
                        }))
                      : []),
                  ]}
                  onChange={(e) => handleChange("createdBy", e?.target?.value)}
                  selectedValue={formState?.createdBy}
                  labelKey="label"
                  valueKey="value"
                  isDisable={isEditMode ? true : false}
                /> */}
              </Col>
              <Col md={3} id="voucher_type_div">
                <CustomDropdown
                  dropdownLabelName="Voucher Type"
                  options={[
                    {
                      value: null,
                      label: "Select Type",
                    },
                    ...(Array.isArray(voucherTypeData?.data)
                      ? voucherTypeData?.data?.map((e) => ({
                          label: e?.label,
                          value: e?.value,
                        }))
                      : []),
                  ]}
                  onChange={(e) =>
                    handleChange("selectedVoucherValue", e?.target?.value)
                  }
                  selectedValue={formState?.selectedVoucherValue}
                  labelKey="label"
                  valueKey="value"
                  isDisable={isEditMode || isViewMode ? true : false}
                />
              </Col>
            </Row>

            <Conveyance
              formState={formState}
              isViewMode={isViewMode}
              path={path}
            />
            <RepairAndMaintenanceText
              formState={formState}
              isViewMode={isViewMode}
              path={path}
            />
            <Canteen
              formState={formState}
              isViewMode={isViewMode}
              path={path}
            />
            <MobileRecharge
              formState={formState}
              isViewMode={isViewMode}
              path={path}
            />
            <Meeting
              formState={formState}
              isViewMode={isViewMode}
              path={path}
            />
            <OthersVoucher
              formState={formState}
              isViewMode={isViewMode}
              path={path}
            />
            <ConveyanceOthers
              selectedVoucherValue={formState.selectedVoucherValue}
              isViewMode={isViewMode}
              path={path}
            />
            <AdvanceAgainstSalaryAw
              selectedVoucherValue={formState.selectedVoucherValue}
              isViewMode={isViewMode}
              path={path}
            />
          </Form>
        </Card>
      </Row>
    </div>
  );
};

export default AddVoucherCreation;
