import React, { useCallback, useState, useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import CustomAutoComplete from "../../../../Components/CustomAutoComplete/CustomAutoComplete";
import CustomDropdown from "../../../../Components/CustomDropdown/CustomDropdown";
import {
  createVoucherCreation,
  sendForApprovalVoucherCreation,
  updateVoucherCreation,
  insertPettycashConveyance,
} from "../../../../Slices/PettyCashManagement/PettyCashSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmpolyeeName,
  getShipperNameDropdown,
} from "../../../../Slices/CourierSevices/CourierSevicesSlice";
import { getTravelModeDetails } from "../../../../Slices/PettyCashManagement/PettyCashDropdownSlice";
import { addScheduler } from "../../../../Slices/Scheduler/schedulerSlice";
import ConveyanceEmail from "../EmailTemplate/ConveyanceEmail";
import { uploadFile, getFile } from "../../../../Slices/Attachment/attachmentSlice";

const ConveyanceMobileView = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const { selectedVoucherValue, formState, getVoucherData } = props;
  const userNameDropdown = useSelector(
    (state) => state.CourierService?.shipperNameDropdown?.data || []
  );
  const travelModeAllData = useSelector(
    (state) => state?.PettyCashDropdown?.travelModeData
  );
  const { empolyeeName } = useSelector((state) => state.CourierService);
  const [file, setFile] = useState(null);
  const [getData, setGetData] = useState("");

  const [rows, setRows] = useState(() => {
    const voucherData = Array.isArray(getVoucherData)
      ? getVoucherData
      : [getVoucherData];

    return voucherData.map((voucher) => ({
      date: voucher?.date
        ? new Date(voucher.date).toISOString().split("T")[0]
        : "",
      user_id: parseInt(voucher?.user_id) || "",
      travel_mode: parseInt(voucher?.mode_id) || "",
      travel_details: voucher?.from_place || "",
      amount: voucher?.amount || "",
      remark: voucher?.remarks || "",
      file: "receipt_101.pdf"
    }));
  });

  const addRow = () => {
    setRows([
      ...rows,
      {
        date: "",
        user_id: "",
        travel_mode: "",
        travel_details: "",
        amount: "",
        remark: "",
        file: ""
      }
    ]);
  };

  useEffect(() => {
    dispatch(getTravelModeDetails("TRAVEL_MODE"));
    dispatch(getShipperNameDropdown());
    if (getVoucherData) {
      handleGetFile();
    }
  }, [dispatch]);

  const handleGetFile = async () => {
    const Payload = {
      referenceName: "Petty Cash Management",
      referenceKey: getVoucherData?.reference_no,
      referenceSubName: "Voucher Creation",
    };
    await dispatch(getFile(Payload));
  };

  const handleEmployeeNameChange = useCallback(
    async (selectedValue, index) => {
      if (selectedValue && selectedValue.Employee) {
        const { Employee, Emp_id, company_name, user_details } = selectedValue;

        const updatedRows = [...rows];
        updatedRows[index] = {
          ...updatedRows[index],
          user_name: Emp_id,
          user_id: Emp_id,
          company_details: company_name,
          file: "receipt_101.pdf",
          user_details: user_details,
        };
        setRows(updatedRows);
      } else {
        const updatedRows = [...rows];
        updatedRows[index] = {
          ...updatedRows[index],
          user_name: "",
          user_id: "",
          company_details: "",
          file: "",
          user_details: "",
        };
        setRows(updatedRows);
      }
    },
    [rows, dispatch]
  );

  const handleInput = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    
    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
      ...(name === 'voucher_date' && { date: value }),
      ...(name === 'from_place' && { travel_details: value }),
      ...(name === 'remarks' && { remark: value }),
      ...(name === 'company_details' && { file: value })
    };
    
    setRows(updatedRows);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile || null);
  };

  const handleTravelMode = (e, index) => {
    const mode = e.target.value;
    const updatedRows = [...rows];
    updatedRows[index].travel_mode = mode;
    setRows(updatedRows);
  };

  const handleFile = async () => {
    if (!file) return;
    
    const formdata = new FormData();
    formdata.append("attachment", file);
    formdata.append("referenceName", "Petty Cash Management");
    formdata.append("referenceKey", getData?.reference_no);
    formdata.append("referenceSubName", "Voucher Creation");

    await dispatch(uploadFile(formdata));
  };

  const fetchSchedulerApi = async () => {
    const emailBodyForInwardCourier = ConveyanceEmail(getData);
    const userEmail = getData?.email;
    const voucherNo = getData?.voucher_no;
    const formData = new FormData();
    const isFileUpload = 0;
    formData.append("attachment", null);
    formData.append("to", userEmail);
    formData.append("subject", `Petty Cash Management-${voucherNo}`);
    formData.append("content", emailBodyForInwardCourier);
    formData.append("is_file_upload", isFileUpload);
    await dispatch(addScheduler(formData));
  };

  const createPayload = (rows) => {
    return rows.map(row => ({
      date: row.date || "",
      user_id: row.user_id || "",
      travel_mode: row.travel_mode || "",
      travel_details: row.travel_details || "",
      amount: row.amount || "",
      remark: row.remark || "",
      file: row.file || ""
    }));
  };

  const validateRows = (rows) => {
    return rows.every(row => 
      row.date && 
      row.user_id && 
      row.travel_mode && 
      row.travel_details && 
      row.amount
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!rows || rows.length === 0) {
      toast.error("No data to save.");
      return;
    }

    if (!validateRows(rows)) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      const payload = {
        voucherType: selectedVoucherValue,
        status: 1,
        voucherData: JSON.stringify(createPayload(rows)),
        file: "",
      };

      const response = await dispatch(insertPettycashConveyance(payload));
      if (response?.meta?.requestStatus === "fulfilled") {
        const successMsg = response?.payload?.[0]?.result;
        handleFile();
        toast.success(successMsg);
        setTimeout(() => {
          navigate("/voucherCreation");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!rows || rows.length === 0) {
      toast.error("No data to save.");
      return;
    }

    if (!validateRows(rows)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        vouchers: JSON.stringify(createPayload(rows)),
        voucherType: selectedVoucherValue,
        status: 1,
        voucherNo: getVoucherData[0]?.voucher_number,
      };

      const response = await dispatch(createVoucherCreation(payload));
      if (response?.payload?.data?.success === true) {
        toast.success("Voucher Updated Successfully");
        setTimeout(() => {
          navigate("/voucherCreation");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    }
  };

  const handleforApproval = async (e) => {
    e.preventDefault();
    if (!rows || rows.length === 0) {
      toast.error("No data to save.");
      return;
    }

    if (!validateRows(rows)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        vouchers: JSON.stringify(createPayload(rows)),
        voucherType: selectedVoucherValue,
        status: 2,
        voucherNo: getVoucherData ? getVoucherData[0]?.voucher_number : null,
      };

      const response = await dispatch(createVoucherCreation(payload));
      const getData = response?.payload?.data?.data[0];
      setGetData(getData);

      if (response?.meta?.requestStatus === "fulfilled") {
        const successMsg = response?.payload?.[0]?.result;
        handleFile();
        fetchSchedulerApi();
        toast.success(successMsg);
        setTimeout(() => {
          navigate("/voucherCreation");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting for approval:", error);
      toast.error("Error submitting for approval");
    }
  };

  const handleCancle = async () => {
    const result = await Swal.fire({
      title: "Are you sure for Cancel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      width: "400px",
      customClass: {
        popup: "custom-popup",
      },
    });

    if (result.isConfirmed) {
      navigate("/voucherCreation");
    }
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  if (selectedVoucherValue === 1) {
    return (
      <div id="conveyance-form">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <div className="container-fluid my-0 p-0">
          <Form>
            {rows.map((row, index) => (
              <div key={index} className="mb-4">
                <div className="row">
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <CustomInput
                      type="date"
                      name="voucher_date"
                      value={row.date}
                      onChange={(e) => handleInput(e, index)}
                      placeholder="Enter Date"
                      labelName="Date"
                      mandatoryIcon={true}
                    />
                  </div>
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <CustomAutoComplete
                      field={"Employee"}
                      data={userNameDropdown}
                      onChange={(e) => handleEmployeeNameChange(e, index)}
                      placeholder="Enter User Name"
                      value={userNameDropdown.find(
                        (item) => item.Emp_id === row.user_id
                      )?.Employee || ""}
                      labelName="User Name"
                      mandatoryIcon={true}
                    />
                  </div>
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <CustomInput
                      type="text"
                      name="company_details"
                      value={row.company_details}
                      onChange={(e) => handleInput(e, index)}
                      placeholder="Company Details"
                      isDisable={true}
                      labelName="Company Details"
                      mandatoryIcon={true}
                    />
                  </div>
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <CustomInput
                      type="text"
                      name="user_details"
                      value={row.user_details}
                      onChange={(e) => handleInput(e, index)}
                      placeholder="User Department"
                      isDisable={true}
                      labelName="User Department"
                      mandatoryIcon={true}
                    />
                  </div>
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <CustomDropdown
                      labelKey="label"
                      valueKey="value"
                      options={[
                        { value: null, label: "Select Mode" },
                        ...(Array.isArray(travelModeAllData?.data)
                          ? travelModeAllData?.data?.map((e) => ({
                              value: e.value,
                              label: e.label,
                            }))
                          : []),
                      ]}
                      selectedValue={row.travel_mode}
                      onChange={(e) => handleTravelMode(e, index)}
                      dropdownLabelName="Travel Mode"
                      mandatoryIcon={true}
                    />
                  </div>
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <CustomInput
                      type="text"
                      name="from_place"
                      value={row.travel_details}
                      onChange={(e) => handleInput(e, index)}
                      placeholder="Enter Travel Details"
                      labelName="Travel Details"
                      mandatoryIcon={true}
                    />
                  </div>
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <CustomInput
                      type="text"
                      name="amount"
                      value={row.amount}
                      onChange={(e) => handleInput(e, index)}
                      placeholder="Enter Amount"
                      labelName="Amount"
                      mandatoryIcon={true}
                    />
                  </div>
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <CustomInput
                      type="text"
                      name="remarks"
                      value={row.remark}
                      onChange={(e) => handleInput(e, index)}
                      placeholder="Enter Remark"
                      labelName="Remark"
                    />
                  </div>
                  <div className="col-md-2 mt-2" id="conveyanceMobile__div">
                    <Form.Label>Upload File</Form.Label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleFileChange(e, index)}
                    />
                  </div>
                </div>

                <hr />
                <div className="d-flex justify-content-between align-items-end">
                  <div
                    className="mt-3"
                    style={{
                      display: getVoucherData ? "none" : "block",
                    }}
                  >
                    {index === rows.length - 1 ? (
                      <Button
                        variant="dark"
                        className="btn-sm mt-1"
                        onClick={addRow}
                      >
                        +
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        className="btn-sm mt-1"
                        onClick={() => removeRow(index)}
                      >
                        -
                      </Button>
                    )}
                    <span className="ms-4"> row - {index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
            <Alert
              variant="warning"
              style={{
                backgroundColor: "#fff3cd",
                color: "#856404",
                margin: "0",
                padding: "5px",
                paddingHorizontal: "10px",
                display: getVoucherData ? "none" : "block",
              }}
            >
              Note: Please click on + button to add rows
            </Alert>
          </Form>

          <div className="d-flex justify-content-end gap-3 mb-3 mt-3">
            <CustomSingleButton
              onPress={handleforApproval}
              _ButtonText="Send for Approval"
              backgroundColor="#000"
              height="44px"
              width="auto"
            />
            <CustomSingleButton
              onPress={getVoucherData ? handleUpdate : handleSave}
              _ButtonText={getVoucherData ? "Update" : "Save"}
              backgroundColor="#000"
              height="44px"
              width="auto"
            />
            <CustomSingleButton
              onPress={handleCancle}
              _ButtonText="Cancel"
              backgroundColor="#000"
              height="44px"
              width="auto"
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default ConveyanceMobileView;