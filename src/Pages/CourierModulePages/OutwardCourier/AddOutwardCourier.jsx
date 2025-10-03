import React, { useCallback, useEffect, useState } from "react";
import {
  Form,
  Container,
  Row,
  Col,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import "./AddOutwardCourier.css";
import {
  getTypeOfCourierDropdown,
  getDepartmentDropdown,
  getCourierModeDropdown,
  getCourierTypeDropdown,
  getShipperNameDropdown,
  getLocationDropdown,
  getPersonalOfficialDropdown,
  insertOutwardCourier,
  getVendorNameDropdown,
  getReturnReasonDropdown,
  getCourierStatusDropdown,
  getEmpolyeeName,
  updateOutwardCourier,
  getCompanyDetailsByAccount,
  hanldePinCodeUpload,
  getEmpolyeeId,
} from "../../../Slices/CourierSevices/CourierSevicesSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import AutosizeTextarea from "../../../Components/AutosizeTextarea/AutosizeTextarea";
import { useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  updateFile,
  uploadFile,
} from "../../../Slices/Attachment/attachmentSlice";
import AddNewAccountModal from "./AddNewAccountModal";
import AddPinCode from "../../../Components/AddPinCode/AddPinCode";
import debounce from "lodash.debounce";
import { getPinCodes } from "../../../Slices/CompanyDetails/CompanyDetailSlice";
import { addScheduler } from "../../../Slices/Scheduler/schedulerSlice";
import OutwardCourierMail from "./OutwardCourierMail";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import moment from "moment";
import { Autocomplete, TextField } from "@mui/material";

const AddOutwardCourier = () => {
  const [showModal, setShowModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountCode, setNewAccountCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const isEditMode = location.state?.isEditMode || false;
  const selectedData = isEditMode ? location.state?.item || {} : location.state;
  const [inputValue, setInputValue] = useState("");
  const [fileName, setFileName] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPinSuggestions, setShowPinSuggestions] = useState(false);
  const [pinSet, setPinSet] = useState({
    enterPincode: "",
    enterState: "",
    enterDestination: "",
    enterIntl_dom_loc: "",
  });
  // +Pincode state here...
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // erorr state in pincode autosuggestion
  const [error, setError] = useState("");
  const refno = selectedData.reference_no;

  useEffect(() => {
    dispatch(getPinCodes());
  }, []);

  const handleModalSave = () => {
    setShowModal(false);
    handleFormChange("courier_Account_code", newAccountCode);
  };
  const senderNameDropdown = useSelector(
    (state) => state?.CourierService?.shipperNameDropdown?.data || []
  );
  const vendorCompanyDropdown = useSelector(
    (state) => state?.CourierService?.vendorNameDropdown?.data || []
  );
  const destination = useSelector((state) => state.CourierService.destination);
  const empName = useSelector((state) => state?.CourierService?.employeeId?.data || []);

  const returnReasonDropdown = useSelector(
    (state) => state.CourierService.returnReasonDropdown
  );
  const CourierComName = useSelector(
    (state) => state.CourierService.companybyaccount?.data || []
  );
  const shipperNameDropdown = useSelector(
    (state) => state.CourierService.shipperNameDropdown?.data || []
  );
  const {
    typeOfCourierDropdown,
    courierModeDropdown,
    personalOfficialDropdown,
    courierStatusDropdown,
  } = useSelector((state) => state.CourierService);
  useEffect(() => {
    dispatch(getTypeOfCourierDropdown("TYPE_OF_COURIER"));
    dispatch(getCourierModeDropdown("COURIER_MODE"));
    dispatch(getCourierTypeDropdown("COURIER_TYPE"));
    dispatch(getPersonalOfficialDropdown("O_OR_P"));
    dispatch(getCourierStatusDropdown("COURIER_STATUS"));
  }, []);
  const pinCodeList = useSelector(
    (state) => state.companyDetail.pinCodeList || []
  );

  const [form, setForm] = useState({
    company_id: "",
    reference_no: "",
    user_Id: "",
    emp_code: "",
    sender_name: "",
    sender_department: "",
    official_or_personal: "",
    courier_co_name: "",
    Air_way_bill_no: "",
    courier_Account_code: "",
    internal_courier_slip_no: "",
    type_of_courier: "",
    courier_type: "",
    intl_dom_loc: "",
    state: "",
    consignee_name: "",
    consignee_company_name: "",
    consignee_mobile_no: "",
    courier_weight: "",
    pincode: "",
    description: "",
    shipping_date: "",
    delivery_date: null,
    delivery_time: "",
    recipient_name: "",
    courier_status: "Pending",
    status_desc: "",
    return_courier_airway_bill_no: "",
    reason: "",
    destination: "",
    email: "",
    created_by: "",
  });

  useEffect(() => {
    console.log(selectedData, "selectedData...........")
    if (selectedData) {
      const updatefileName = selectedData["File Name"];
      const sendername =
        senderNameDropdown?.find(
          (shipper) => shipper.Employee === selectedData["Sender Name"]
        )?.Employee || "";
      const typeOfCourier =
        typeOfCourierDropdown.find(
          (type) => type.label === selectedData["Type Of Parcel"]
        )?.label || "";

      const courierType =
        courierModeDropdown.find(
          (mode) => mode.label === selectedData["Courier Type"]
        )?.label || "";

      const reason =
        returnReasonDropdown.find(
          (reason) => reason.error_STATUS === selectedData["Reason"]
        )?.error_STATUS || "";

      const personalOfficial =
        personalOfficialDropdown.find(
          (per) => per.label === selectedData["Official Or Personal"]
        )?.label || "";

      const status =
        courierStatusDropdown.find(
          (status) => status.label === selectedData["Courier Status"]
        )?.label || "Pending";

      const courierCom =
        vendorCompanyDropdown.find(
          (vendor) => vendor.DESCRIPTION === selectedData["Courier Co. Name"]
        )?.DESCRIPTION || "";

      const formattedDate = selectedData["Pickup Date"]
        ? moment(selectedData["Pickup Date"], ["DD/MM/YYYY", "DD-MM-YY"]).format("YYYY-MM-DD")
        : "";
      const formattedDate2 = selectedData["Delivery Date"]
        ? moment(selectedData["Delivery Date"], ["DD/MM/YYYY", "DD-MM-YY"]).format("YYYY-MM-DD")
        : null;
      setForm({
        company_id: selectedData?.company_id || "",
        reference_no: selectedData["Ref Unique No"] || "",
        emp_code: selectedData["Employee Code"] || "",
        sender_name: sendername,
        sender_department: selectedData?.Department || "",
        official_or_personal: personalOfficial,
        courier_co_name: courierCom,
        Air_way_bill_no: selectedData["AirWay Bill No."] || "",
        courier_Account_code: selectedData["Courier Account Code"] || "",
        internal_courier_slip_no:
          selectedData["Internal Courier Slip No."] || "",
        type_of_courier: typeOfCourier,
        courier_type: courierType,
        intl_dom_loc: selectedData["Intl|Dom|Loc Courier"] || "",
        state: selectedData["State"] || "",
        consignee_name: selectedData["Consignee Name"] || "",
        consignee_company_name: selectedData["Consignees Company Name"] || "",
        consignee_mobile_no: selectedData["Consignee Mobile No"] || "",
        courier_weight: selectedData["Courier Weight"] || "",
        pincode: selectedData["Pin Code"] || "",
        description: selectedData["Description"] || "",
        shipping_date: formattedDate,
        delivery_date: formattedDate2,
        delivery_time: selectedData["Delivery Time"] || "",
        recipient_name: selectedData["Recipient Name"] || "",
        courier_status: status,
        status_desc: selectedData["status_desc"] || "",
        return_courier_airway_bill_no:
          selectedData["Return Courier AWB No"] || "",
        reason: reason,
        destination: selectedData["Destination"] || "",
        email: selectedData["Email"] || "",
        created_by: selectedData["Created By"] || "",
      });
      setInputValue(selectedData["Sender Name"] || "");
      if (updatefileName) {
        setFileName({ name: updatefileName }); // Mimic the file object
      } else {
        setFileName(null);
      }
    }
  }, [
    selectedData,
    vendorCompanyDropdown,
    personalOfficialDropdown,
    courierStatusDropdown,
    senderNameDropdown,
    typeOfCourierDropdown,
    courierModeDropdown,
    returnReasonDropdown,
  ]);

  useEffect(() => {
    if (form.sender_name) {
      dispatch(getEmpolyeeId(form.sender_name));
    }
  }, [form.sender_name]);

  useEffect(() => {
    if (empName && empName.length > 0) {
      const userId = empName[0]["user_id"];
      const department = empName[0]["department_desc"];
      handleFormChange("emp_code", userId);
      handleFormChange("sender_department", department);
    }
  }, [empName]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    handleFormChange("emp_code", "");
    handleFormChange("sender_name", "");

    if (value.length >= 1) {
      const filteredSuggestions = shipperNameDropdown?.filter((item) =>
        item.Employee.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      handleFormChange("sender_department", "");
      handleFormChange("department_desc", "");
      setShowSuggestions(false);
    }
  };
  const handleSuggestionClick = (item) => {
    setInputValue(item.Employee);
    handleFormChange("sender_name", item.Employee);
    setShowSuggestions(false);
  };

  const fetchPinCodeDetails = useCallback(
    (pincode) => {
      if (pincode && pinCodeList?.length > 0) {
        const findDetails = pinCodeList.find((pin) => pin.Pincode === pincode);
        updateFormWithPinCodeDetails(findDetails);
      } else {
        updateFormWithPinCodeDetails(null);
      }
    },
    [pinCodeList]
  );

  const updateFormWithPinCodeDetails = (details) => {
    setForm((prevForm) => ({
      ...prevForm,
      destination: details?.destination || "",
      intl_dom_loc: details?.Product || "",
      state: details?.State || "",
    }));
  };

  useEffect(() => {
    if (form?.pincode) {
      fetchPinCodeDetails(form?.pincode);
    }
  }, [form?.pincode, fetchPinCodeDetails]);

  useEffect(() => {
    if (destination && destination.length > 0) {
      const description = destination[0]["Destination"];
      const stateDescription = destination[0]["State"];
      const intlDomLoc = destination[0]["Intl|Dom|Loc Courier"];
      handleFormChange("destination", description);
      handleFormChange("state", stateDescription);
      handleFormChange("intl_dom_loc", intlDomLoc);
      setError("");
    } else {
      // setError("Record not found");
      setForm({
        destination: "",
        intl_dom_loc: "",
        state: "",
      });
    }
  }, [destination]);
  const requiredFields = [
    { field: form.shipping_date, name: "Pickup Date" },
    { field: form.sender_name, name: "Sender Name" },
    { field: form.emp_code, name: "Employee Code" },
    { field: form.sender_department, name: "Department" },
    { field: form.official_or_personal, name: "Official or Personal" },
    { field: form.courier_weight, name: "Courier Weight" },
    { field: form.courier_Account_code, name: "Courier Account Code" },
    { field: form.courier_co_name, name: "Courier Company Name" },
    { field: form.type_of_courier, name: "Type of Parcel" },
    { field: form.courier_type, name: "Courier Type" },
    { field: form.pincode, name: "Pin Code" },
    { field: form.destination, name: "Destination" },
    { field: form.courier_status, name: "Courier Status" },
  ];

  const handleSaveDetails = async () => {
    for (let { field, name } of requiredFields) {
      if (!field) {
        toast.warning(`${name} is required!`);
        return;
      }
    }

    setLoader(true);
    const startTime = Date.now();
    try {
      const response = await dispatch(insertOutwardCourier(form));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(
          response.payload.message || "Details saved successfully!"
        );
        const result = response.payload.data;
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(1500 - elapsedTime, 0);
        if (fileName) {
          await handleFile(result);
        }
        setTimeout(() => {
          setLoader(false);
          navigate("/outwardcourier");
        }, remainingTime);
      } else {
        toast.warn("Airway Bill Number already exists!");
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      toast.error("An error occurred while saving details.");
      console.error(error);
    }
  };

  const handleUpdateDetails = async () => {
    for (let { field, name } of requiredFields) {
      if (!field) {
        toast.warning(`${name} is required!`);
        return; // Exit early if any field is empty
      }
    }

    setLoader(true);
    const startTime = Date.now();
    try {
      const response = await dispatch(updateOutwardCourier(form));
      console.log("form", form)
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload.message);

        if (fileName) {
          const formdata = new FormData();
          formdata.append("attachment", fileName);
          formdata.append("referenceName", "Courier Service");
          formdata.append("referenceKey", form.reference_no);
          formdata.append("referenceSubName", "Outward Courier");

          if (selectedData["File Name"]) {
            const fileResponse = await dispatch(updateFile(formdata));
            const { statusCode, data } = fileResponse.payload;
          } else {
            const fileResponse = await dispatch(uploadFile(formdata));
            const { statusCode, data } = fileResponse.payload;
          }
        }

        if (
          form.courier_status === "Delivered" ||
          form.courier_status === "Pending"
        ) {
          await fetchSchedulerApi();
        }

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(1500 - elapsedTime, 0);
        setTimeout(() => {
          setLoader(false);
          navigate("/outwardcourier");
        }, remainingTime);
      } else {
        toast.warn("AirWay Bill No. already exists.");
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      toast.error("An error occurred while updating details.");
    }
  };

  const fetchSchedulerApi = async () => {
    const mailcontent = OutwardCourierMail(form);
    const refno = form.reference_no;
    const senderEmail = form.email;
    const formData = new FormData();
    const isFileUpload = 0;
    formData.append("attachment", null);
    formData.append("to", senderEmail);
    formData.append("subject", `Outward Courier Service_${refno}`);
    formData.append("content", mailcontent);
    formData.append("is_file_upload", isFileUpload);
    await dispatch(addScheduler(formData));
  };

  // handle pincode Submit code here..
  const handlePinCodeAdd = async () => {
    const form = {
      Pincode: pinSet.enterPincode,
      Area: "",
      Description: pinSet.enterDestination,
      State_Description: pinSet.enterState,
      CD: null,
      Product: pinSet.enterIntl_dom_loc,
    };
    const response = await dispatch(hanldePinCodeUpload(form));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success(response.payload.message);
      setTimeout(() => {
        handleClose();
      }, 2000);
      setPinSet({
        pinSet: "",
        enterDestination: "",
        enterIntl_dom_loc: "",
        enterState: "",
      });
    } else {
      toast.warning("Pin Code Already Exist");
    }
  };

  useEffect(() => {
    dispatch(getDepartmentDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getLocationDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getVendorNameDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getReturnReasonDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCompanyDetailsByAccount());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getShipperNameDropdown());
  }, [dispatch]);

  const handleFormChange = (name, value) => {
    setForm((prevState) => {
      const updatedState = { ...prevState, [name]: value };
      if (!prevState.courier_status) {
        updatedState.courier_status = "Pending";
      }
      if (name === "recipient_name") {
        if (value.trim() !== "") {
          updatedState.courier_status = "Delivered";
        } else {
          updatedState.courier_status = "Pending";
        }
      }

      return updatedState;
    });
  };

  const handlePinChange = (name, value) => {
    setPinSet({ ...pinSet, [name]: value });
  };
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFileName(uploadedFile || null); // Update file state
  };

  const handleFile = async (result) => {
    const formData = new FormData();
    formData.append("attachment", fileName);
    formData.append("referenceName", "Courier Service");
    formData.append("referenceKey", result);
    formData.append("referenceSubName", "Outward Courier");
    const response = await dispatch(uploadFile(formData));
    const { requestStatus, data } = response.payload;
    if (requestStatus === 200 || requestStatus === "success") {
      toast.success(data?.message || "File uploaded successfully");
      setTimeout(() => {
        navigate("/outwardcourier");
      }, 2000);
    }
  };

  useEffect(() => {
    if (!form.sender_name) {
      setForm((prevForm) => ({
        ...prevForm,
        emp_code: "",
        sender_department: "",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        emp_code: "",
        sender_department: "",
      }));
    }
  }, [form.sender_name]);
  return (
    <Container fluid className="card">
      {loader && <CommonLoader />}
      <Title
        title={isEditMode ? "Update Outward Courier" : "Add Outward Courier"}
      />
      <hr />
      <Form>
        <Row>
          {isEditMode ? (
            <div>
              <h5>Reference Unique No: {form.reference_no}</h5>
            </div>
          ) : (
            <></>
          )}
          <div>
            <h6 className="my-2" style={{ color: "red" }}>
              Sender Details
            </h6>
          </div>
          <Col md={3} className="my-2">
            <CustomInput
              type="date"
              labelName="Pickup Date"
              value={form.shipping_date || ""}
              onChange={(e) => handleFormChange("shipping_date", e.target.value)}
              mandatoryIcon={true}
            />
          </Col>

          <Col md={3} className="my-2">
            <div className="position-relative">
              <label>
                Sender Name
                <span style={{ color: "red" }}>*</span>
              </label>
              <FormControl
                className="mt-2"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    handleInputChange(e);
                  }
                }}
                placeholder="Enter Name"
              />
              {showSuggestions && (
                <ListGroup className="suggestions-dropdown position-absolute w-100">
                  {suggestions.map((item, index) => (
                    <ListGroup.Item
                      key={item?.id}
                      onClick={() => handleSuggestionClick(item)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.Employee}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Col>

          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Employee Code"
              placeholder=""
              value={form.emp_code}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  handleFormChange("emp_code", value);
                }
              }}
              mandatoryIcon={true}
              isDisable={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Department"
              placeholder=""
              value={form.sender_department}
              onChange={(e) =>
                handleFormChange("sender_department", e.target.value)
              }
              isDisable={true}
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Official or Personal"
              labelKey="label"
              valueKey="label"
              options={[...personalOfficialDropdown]}
              selectedValue={form.official_or_personal}
              onChange={(e) =>
                handleFormChange("official_or_personal", e.target.value)
              }
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Courier Weight (Kgs)"
              placeholder="Enter Courier Weight"
              value={form.courier_weight}
              onChange={(e) => {
                const value = e.target.value;
                const alphanumericPattern = /^[a-zA-Z0-9]*\.?[a-zA-Z0-9]*$/;
                if (alphanumericPattern.test(value) || value === "") {
                  handleFormChange("courier_weight", value);
                }
              }}
              mandatoryIcon={true}
            />
          </Col>
          <AddNewAccountModal
            show={showModal}
            onHide={() => setShowModal(false)}
            onSave={handleModalSave}
            newAccountName={newAccountName}
            setNewAccountName={setNewAccountName}
            newAccountCode={newAccountCode}
            setNewAccountCode={setNewAccountCode}
          />

          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Courier Co. Name"
              labelKey="DESCRIPTION"
              valueKey="DESCRIPTION"
              // options={[...vendorCompanyDropdown]}
              options={[...(Array.isArray(vendorCompanyDropdown) ? vendorCompanyDropdown : [])]}
              selectedValue={form.courier_co_name}
              onChange={(e) =>
                handleFormChange("courier_co_name", e.target.value)
              }
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel="Select"
              Dropdownlable={true}
              dropdownLabelName="Courier Account Code"
              labelKey="displayText" // Use a computed label key
              valueKey="AccountNo"
              options={[
                ...CourierComName.map((item) => ({
                  ...item,
                  displayText: `${item.AccountNo} - ${item.CompanyName}`, // Combine AccountNo & CompanyName
                })),
                { AccountNo: "Add New", displayText: "Add New" }, // Keep "Add New" option
              ]}
              selectedValue={form.courier_Account_code}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "Add New") {
                  setShowModal(true);
                } else {
                  handleFormChange("courier_Account_code", selectedValue);
                }
              }}
              mandatoryIcon={true}
              className="custom-dropdown"
            />
          </Col>

          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Type Of Parcel"
              labelKey="label"
              valueKey="label"
              options={[...typeOfCourierDropdown]}
              selectedValue={form.type_of_courier}
              onChange={(e) =>
                handleFormChange("type_of_courier", e.target.value)
              }
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Courier Type"
              labelKey="label"
              valueKey="label"
              options={[...courierModeDropdown]}
              selectedValue={form.courier_type}
              onChange={(e) => handleFormChange("courier_type", e.target.value)}
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Internal Courier Slip No."
              placeholder="Enter Internal Courier Slip No."
              value={form.internal_courier_slip_no}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9]{0,12}$/.test(value)) {
                  handleFormChange("internal_courier_slip_no", value);
                }
              }}
            />
          </Col>

          <div>
            <h6 className="my-2" style={{ color: "red" }}>
              Consignee Details
            </h6>
          </div>
          <Row>
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Consignee Name"
                placeholder="Enter Consignee Name"
                value={form.consignee_name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    handleFormChange("consignee_name", value);
                  }
                }}
              />
            </Col>

            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Consignee Company Name"
                placeholder="Enter Consignee Company Name"
                value={form.consignee_company_name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[a-zA-Z\s]*$/.test(value)) {
                    handleFormChange("consignee_company_name", value);
                  }
                }}
              />
            </Col>

            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="AirWay Bill No."
                placeholder="Enter AirWay Bill No."
                value={form.Air_way_bill_no}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,12}$/.test(value)) {
                    handleFormChange("Air_way_bill_no", value);
                  }
                }}
              />
            </Col>

            <Col md={3} className=" d-flex justify-content-evenly">
              <Col md={9} className="my-2">
                <Form.Label>
                  Pin Code <span className="text-danger">*</span>
                </Form.Label>
                <Autocomplete
                  options={pinCodeList || []}
                  getOptionLabel={(option) => option?.Pincode || ""} // Show only Pincode in the input field

                  isOptionEqualToValue={(option, value) =>
                    String(option?.Pincode) === String(value?.Pincode)
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      {`${option?.Pincode} - ${option?.destination || "N/A"} - ${option?.State || "N/A"}`}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      autoComplete="off"
                      placeholder="Enter Pin Code"
                      InputProps={{
                        ...params.InputProps,
                        inputProps: {
                          ...params.inputProps,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        },
                      }}
                    />
                  )}
                  onChange={(event, newValue) => {
                    handleFormChange(
                      "pincode",
                      newValue ? newValue?.Pincode : ""
                    );
                  }}
                  value={
                    pinCodeList?.find(
                      (emp) => String(emp?.Pincode) === String(form?.pincode)
                    ) || null
                  }
                  noOptionsText="No Pin Code Found"
                  size="small"
                />
                {error && (
                  <div className="text-danger" style={{ fontSize: "12px" }}>
                    {error}
                  </div>
                )}
              </Col>

              <Col md={1}></Col>

              <Col
                className={
                  error ? "align-content-around mt-3" : "align-content-end mb-2"
                }
                md={2}
              >
                <CustomSingleButton
                  _ButtonText="+"
                  height={40}
                  // width="50%"
                  onPress={handleShow}
                />
              </Col>
            </Col>
            <AddPinCode
              handleClose={handleClose}
              show={show}
              handleSavePinCode={handlePinCodeAdd}
              enterPincode={pinSet.enterPincode}
              handlePinChange={handlePinChange}
              enterState={pinSet.enterState}
              enterDestination={pinSet.enterDestination}
              enterIntl_dom_loc={pinSet.enterIntl_dom_loc}
            />
          </Row>

          <Col md={3} className="my-2">
            <CustomInput
              mandatoryIcon={true}
              type="text"
              labelName="Destination"
              placeholder=""
              value={form?.destination}
              onChange={(e) => handleFormChange("destination", e.target.value)}
              isDisable
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="State"
              placeholder=""
              value={form?.state}
              onChange={(e) => handleFormChange("state", e.target.value)}
              isDisable
            />
          </Col>

          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Intl Dom Loc"
              placeholder=""
              value={form?.intl_dom_loc}
              onChange={(e) => handleFormChange("intl_dom_loc", e.target.value)}
              isDisable
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Mobile No"
              placeholder="Enter Mobile No"
              value={form.consignee_mobile_no}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  handleFormChange("consignee_mobile_no", value);
                }
              }}
              isDisable={isEditMode} // Disable the field when isEditMode is true
            />
          </Col>

          <div>
            <h6 className="my-2" style={{ color: "red" }}>
              Delivery Details
            </h6>
          </div>
          <Col md={3} className="my-2">
            <CustomInput
              type="date"
              labelName="Delivery Date"
              value={
                form.delivery_date
                  ? moment(form.delivery_date).format("YYYY-MM-DD")
                  : ""
              }
              onChange={(e) =>
                handleFormChange("delivery_date", e.target.value)
              }
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="time"
              labelName="Delivery Time"
              value={form.delivery_time}
              onChange={(e) =>
                handleFormChange("delivery_time", e.target.value)
              }
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Recipient Name"
              placeholder="Enter Recipient Name"
              value={form.recipient_name}
              onChange={(e) =>
                handleFormChange("recipient_name", e.target.value)
              }
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Courier Status"
              labelKey="label"
              valueKey="label"
              options={[...courierStatusDropdown]}
              selectedValue={form.courier_status}
              onChange={(e) =>
                handleFormChange("courier_status", e.target.value)
              }
              mandatoryIcon={true}
            />
          </Col>

          {form.courier_status === "3" && (
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Status"
                placeholder="Enter Status"
                value={form.status_desc}
                onChange={(e) =>
                  handleFormChange("status_desc", e.target.value)
                }
              />
            </Col>
          )}

          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Return Courier AWB No"
              placeholder="Enter Return Courier AWB No"
              value={form.return_courier_airway_bill_no}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only alphanumeric characters and a maximum length of 12 characters
                if (/^[a-zA-Z0-9]{0,12}$/.test(value)) {
                  handleFormChange("return_courier_airway_bill_no", value);
                }
              }}
            />
          </Col>

          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Reason"
              labelKey="error_STATUS"
              valueKey="error_STATUS"
              options={[...returnReasonDropdown]}
              selectedValue={form.reason}
              onChange={(e) => handleFormChange("reason", e.target.value)}
            // mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <Form.Label>Upload Document</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="text"
                readOnly
                value={fileName?.name || ""}
                placeholder="No file chosen"
                className="bg-white text-end"
              />
              <label
                htmlFor="fileUpload"
                className="btn btn-dark position-absolute top-0 start-0"
                style={{ height: "100%", cursor: "pointer" }}
              >
                Choose File
              </label>
              <Form.Control
                id="fileUpload"
                type="file"
                onChange={handleFileChange}
                className="d-none bg-white text-end"
                accept=".jpeg,.jpg,.png"
              />
            </div>
          </Col>

          <Col md={3} className="my-2">
            <AutosizeTextarea
              label="Description"
              rows="2"
              value={form.description}
              onChnage={(e) => handleFormChange("description", e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mt-3 justify-content-lg-end">
          <Col md={1}>
            {isEditMode ? (
              <CustomSingleButton
                _ButtonText="Update"
                height={40}
                onPress={handleUpdateDetails}
              />
            ) : (
              <CustomSingleButton
                _ButtonText="Save"
                height={40}
                onPress={handleSaveDetails}
              />
            )}
          </Col>
          <Col md={1}>
            <CustomSingleButton
              _ButtonText="Cancel"
              height={40}
              onPress={() => navigate("/outwardcourier")}
            />
          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddOutwardCourier;