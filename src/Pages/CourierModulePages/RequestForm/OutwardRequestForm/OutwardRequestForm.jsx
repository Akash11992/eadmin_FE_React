import React, { useEffect, useState } from "react";
import {
  Form,
  Container,
  Row,
  Col,
  ListGroup,
  FormControl,
} from "react-bootstrap";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import {
  getCompanyDetailsByAccount,
  getDepartmentDropdown,
  getDestination,
  getEmpolyeeId,
  getPersonalOfficialDropdown,
  getShipperNameDropdown,
  hanldePinCodeUpload,
  insertRequestOutwardCourier,
} from "../../../../Slices/CourierSevices/CourierSevicesSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "../../../../Components/CustomDropdown/CustomDropdown";
import AutosizeTextarea from "../../../../Components/AutosizeTextarea/AutosizeTextarea";
import { useNavigate } from "react-router-dom";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import debounce from "lodash.debounce";
import { getPinCodes } from "../../../../Slices/CompanyDetails/CompanyDetailSlice";
import AddPinCode from "../../../../Components/AddPinCode/AddPinCode";

const OutwardRequestForm = () => {
  const [suggestion, setSuggestion] = useState([]);
  const [suggestionVisibility, setSuggestionVisibility] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const empName = useSelector((state) => state.CourierService.employeeId?.data || []);
  const destination = useSelector((state) => state.CourierService.destination);
  const createdBy = userData?.data?.name;

  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [pinSet, setPinSet] = useState({
    enterPincode: "",
    enterState: "",
    enterDestination: "",
    enterIntl_dom_loc: "",
  });

  const handlePinChange = (name, value) => {
    setPinSet({ ...pinSet, [name]: value });
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setSuggestion([]);
      setSuggestionVisibility(false);
    }
  };
  const handleSuggestionSelect = (suggestion) => {
    handleFormChange("pincode", suggestion.Pincode);
    handleFormChange("destination", suggestion.destination);
    handleFormChange("state", suggestion.State);
    handleFormChange("intl_dom_loc", suggestion.Product);
    setError("");
    setSuggestionVisibility(false);
    setSuggestion([]);
  };

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

  const pinCodeList = useSelector(
    (state) => state.companyDetail.pinCodeList || []
  );
  const shipperNameDropdown = useSelector(
    (state) => state.CourierService.shipperNameDropdown?.data
  );
  const [form, setForm] = useState({
    company_id: "",
    user_Id: "",
    emp_code: "",
    sender_name: "",
    sender_department: "",
    official_or_personal: "",
    consignee_mobile_no: "",
    consignee_name: "",
    pincode: "",
    destination: "",
    description: "",
    is_active: "1",
    action: "c",
    created_by: "",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPersonalOfficialDropdown("O_OR_P"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getShipperNameDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getDepartmentDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCompanyDetailsByAccount());
  }, [dispatch]);
  useEffect(() => {
    if (form.pincode) {
      dispatch(getDestination(form.pincode));
    }
    dispatch(getPinCodes());
  }, [form.pincode, dispatch]);

  useEffect(() => {
    debouncedFetchPinCodes(form.pincode);
    return () => debouncedFetchPinCodes.cancel();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
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
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setInputValue(item.Employee);
    handleFormChange("sender_name", item.Employee);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  useEffect(() => {
    if (form.sender_name) {
      dispatch(getEmpolyeeId(form.sender_name));
    }
  }, [form.sender_name, dispatch]);
  useEffect(() => {
    if (destination && destination.length > 0) {
      const description = destination[0]["Description"];
      setForm((prevState) => ({
        ...prevState,
        destination: description || "",
      }));
    }
  }, [destination]);

  const personalOfficialDropdown = useSelector(
    (state) => state.CourierService.personalOfficialDropdown
  );

  const handleFormChange = (name, value) => {
    setForm((item) => ({ ...item, [name]: value }));
  };

  const handleSaveDetails = async () => {
    if (!form.official_or_personal)
      return toast.warning("Select Official/Personal!");
    if (!form.sender_name) return toast.warning("Enter Sender Name!");
    if (!form.emp_code) return toast.warning("Enter Employee Code!");
    if (!form.consignee_mobile_no) return toast.warning("Enter Mobile No!");
    if (!form.pincode) return toast.warning("Enter Pincode!");
    if (!form.sender_department)
      return toast.warning("Select Sender Department!");

    const response = await dispatch(insertRequestOutwardCourier(form));
    response.meta.requestStatus === "fulfilled"
      ? toast.success(response.payload.message) &&
        setTimeout(() => navigate("/outwardcourier"), 2000)
      : toast.error("Failed to Save Details");
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

  const debouncedFetchPinCodes = debounce((pincode) => {
    if (pincode?.length >= 1) {
      const matchingPincodes = pinCodeList.filter((pin) =>
        pin.Pincode.toString().startsWith(pincode)
      );

      if (matchingPincodes?.length > 0) {
        setSuggestion(matchingPincodes);
        setError("");
        setSuggestionVisibility(true);
      } else {
        setSuggestion([]);
        setError("Pincode not found");
        setSuggestionVisibility(false);
      }
    } else if (pincode?.length === 0) {
      setSuggestion([]);
      setError("");
      setForm((prevForm) => ({
        ...prevForm,
        destination: "",
        intl_dom_loc: "",
        state: "",
      }));
      setSuggestionVisibility(false);
    } else {
      setSuggestion([]);
      setError("");
      setSuggestionVisibility(false);
    }
  }, 200);

  return (
    <Container fluid className="card">
      <Form>
        <Row>
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
              labelName="Created by"
              placeholder="Enter Name"
              value={createdBy}
              isDisable={true}
            />
          </Col>
          <Col md={3} className="my-2"></Col>
          <Col md={3} className="my-2"></Col>
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
                      key={index}
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
              name="emp_code"
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
              name="sender_department"
              value={form.sender_department}
              onChange={(e) =>
                handleFormChange("sender_department", e.target.value)
              }
              isDisable={true}
              mandatoryIcon={true}
            />
          </Col>

          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Consignee Name"
              placeholder="Enter Consignee Name"
              value={form.consignee_name}
              name="consignee_name"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  handleFormChange("consignee_name", value);
                }
              }}
            />
          </Col>

          <Col md={3} className=" d-flex justify-content-evenly">
            <Col md={9} className="my-2">
              <CustomInput
                type="text"
                mandatoryIcon={true}
                labelName="Pin Code"
                placeholder="Enter Pin Code"
                value={form.pincode}
                name="pincode"
                onChange={(e) => {
                  const value = e.target.value;
                  const regex = /^[a-zA-Z0-9]*$/; // Allows both numbers and alphabets
                  if (regex.test(value) && value.length <= 10) { // Allows up to 10 characters
                    handleFormChange("pincode", value);
                    debouncedFetchPinCodes(value);
                  }
                }}
              />

              {/* Show suggestions pinCode code here.... */}
              {suggestion?.length > 0 && (
                <div className="suggestions-list col-3">
                  {suggestion?.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion.Pincode} - {suggestion.destination},
                      {suggestion.State}
                    </div>
                  ))}
                </div>
              )}
              {error && (
                <div className="text-danger" style={{ fontSize: "12px" }}>
                  {error}
                </div>
              )}
            </Col>

            <Col md={1}></Col>

            <Col
              className={
                error
                  ? "align-content-around mt-3"
                  : "align-content-end mb-2 my-lg-auto"
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
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Destination"
              placeholder=""
              value={form.destination}
              onChange={(e) => handleFormChange("destination", e.target.value)}
              isDisable
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Mobile No"
              placeholder="Enter Mobile No"
              name="consignee_mobile_no"
              value={form.consignee_mobile_no}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\+?\d{0,14}$/.test(value)) { // Allows an optional '+' followed by up to 14 digits
                  handleFormChange("consignee_mobile_no", value);
                }
              }}
              mandatoryIcon={true}
            />
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
          <Col md={8}></Col>
          <Col md={4} className="row">
            <Col md={6}>
              <CustomSingleButton
                _ButtonText="Save"
                height={40}
                onPress={handleSaveDetails}
              />
            </Col>
            <Col md={6}>
              <CustomSingleButton
                _ButtonText="Cancel"
                height={40}
                onPress={() => navigate("/inwardCourier")}
              />
            </Col>
          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default OutwardRequestForm;