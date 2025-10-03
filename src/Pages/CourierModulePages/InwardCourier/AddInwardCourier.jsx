import React, { useEffect, useState } from "react";
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
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import {
  insertInwardCourier,
  updateInwardCourier,
  getTypeOfCourierDropdown,
  getDepartmentDropdown,
  getReturnReasonDropdown,
  getCourierModeDropdown,
  getCourierTypeDropdown,
  getLocationDropdown,
  getShipperNameDropdown,
  getVendorNameDropdown,
  getDestination,
  getReceiverNameDropdown,
  getEmpolyeeName,
  getCourierStatusDropdown,
  // getInwardCourierData,
  hanldePinCodeUpload,
  getCourierCompanyData,
} from "../../../Slices/CourierSevices/CourierSevicesSlice";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import AutosizeTextarea from "../../../Components/AutosizeTextarea/AutosizeTextarea";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "./AddInwardCourier.css";
import {
  updateFile,
  uploadFile,
} from "../../../Slices/Attachment/attachmentSlice";
import { addScheduler } from "../../../Slices/Scheduler/schedulerSlice";
import InwardCourierMail from "./InwardCourierMail";
import AddPinCode from "../../../Components/AddPinCode/AddPinCode";
import debounce from "lodash.debounce";
import { getPinCodes } from "../../../Slices/CompanyDetails/CompanyDetailSlice";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import moment from "moment";

const AddInwardCourier = () => {
  const location = useLocation();
  const isEditMode = location.state?.isEditMode || false;
  const selectedData = isEditMode ? location.state?.item || {} : location.state;
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [reciptSuggestions, setReciptSuggestions] = useState(false);
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [suggestionsField, setSuggestionsField] = useState([]);

  const [formData, setFormData] = useState({
    reference_no: "",
    empId: "",
    shipper_name: "",
    department: "",
    shipping_date: "",
    time: "",
    consigneeName: "",
    consignee_company_name: "",
    pincode: "",
    location: "",
    mobile_no: "",
    courier_co_name: "",
    type_of_parcel: "",
    courier_type: "",
    reverse_pickup_tokenno: "",
    return_courier_airway_bill_no: "",
    no_of_letters: "",
    received_name: "",
    received_by: "",
    consignment_no: "",
    discription: "",
  });

  const pinCodeList = useSelector(
    (state) => state?.companyDetail?.pinCodeList || []
  );
  const empolyeeName = useSelector((state)=>state.CourierService?.empolyeeName?.data || [],shallowEqual)
  const shipperNameDropdown = useSelector(
    (state) => state.CourierService.shipperNameDropdown?.data || [],shallowEqual
  );
  const receiverNameDropdown = useSelector(
    (state) => state.CourierService.receiverNameDropdown?.data || [],shallowEqual
  );

  const departmentDropdown = useSelector(
    (state) => state?.CourierService?.departmentDropdown?.data || [] ,shallowEqual
  );

  const vendorCompanyDropdown = useSelector(
    (state) => state.CourierService.vendorNameDropdown ,shallowEqual
  );
  const destination = useSelector((state) => state.CourierService.destination?.data ||[] , shallowEqual);
  const companyName = useSelector(
    (state) => state.CourierService.getCompanyDetails , shallowEqual
  );
  const courierCompanies = companyName[0];

  const handlePinChange = (name, value) => {
    setPinSet({ ...pinSet, [name]: value });
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setSuggestion([]);
      setShowSuggestions(false);
    }
  };
  const handleSuggestionSelect = (suggestion) => {
    handleFormChange("pincode", suggestion.Pincode);
    handleFormChange("destination", suggestion.destination);
    handleFormChange("state", suggestion.State);
    handleFormChange("intl_dom_loc", suggestion.Product);
    setSuggestion([]);
    setError("");
    setShowSuggestions(false);
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

  const handleUpdateDetails = async () => {
    const requiredFields = [
      { field: formData.shipper_name, name: "Recipient Name" },
      { field: formData.department, name: "Department" },
      { field: formData.consigneeName, name: "Sender Name" },
      { field: formData.pincode, name: "Pincode" },
      { field: formData.location, name: "Location" },
      { field: formData.courier_co_name, name: "Courier Company Name" },
      { field: formData.type_of_parcel, name: "Type of Parcel" },
      { field: formData.courier_type, name: "Courier Type" },
      { field: formData.received_name, name: "Dispatch Team" },
    ];

    for (let i = 0; i < requiredFields.length; i++) {
      const { field, name } = requiredFields[i];
      if (!field) {
        toast.warning(`${name} is required!`);
        return;
      }
    }

    const fileName = selectedData["File Name"];
    setLoader(true);
    const startTime = Date.now();

    try {
      const response = await dispatch(updateInwardCourier(formData));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload.message);
        if (file) {
          const formdata = new FormData();
          formdata.append("attachment", file);
          formdata.append("referenceName", "Courier Service");
          formdata.append("referenceKey", formData.reference_no);
          formdata.append("referenceSubName", "Inward Courier");

          if (fileName) {
            const fileResponse = await dispatch(updateFile(formdata));
            const { statusCode, data } = fileResponse.payload;
          } else {
            const response = await dispatch(uploadFile(formdata));
          }
        }
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(1500 - elapsedTime, 0);

        setTimeout(() => {
          setLoader(false);
          navigate("/inwardCourier");
        }, remainingTime);
      }
    } catch (error) {
      setLoader(false);
      toast.error("An error occurred while updating details");
    }
  };

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (key === "courier_co_name") {
      if (value) {
        const regex = new RegExp(value, "i");
        const filteredSuggestions = courierCompanies?.filter((company) =>
          regex.test(company.courier_co_name)
        );
        setSuggestionsField(filteredSuggestions);
      } else {
        setSuggestionsField([]);
      }
    } else {
      setSuggestionsField([]);
    }
  };

  const handleSuggestionClicks = (suggestionfield) => {
    setFormData((prev) => ({ ...prev, courier_co_name: suggestionfield }));
    setSuggestionsField([]);
  };
  const {
    typeOfCourierDropdown,
    courierModeDropdown,
    courierTypeDropdown,
    courierStatusDropdown,
  } = useSelector((state) => state.CourierService || []);
  useEffect(() => {
    dispatch(getTypeOfCourierDropdown("TYPE_OF_COURIER"));
    dispatch(getCourierModeDropdown("COURIER_MODE"));
    dispatch(getReturnReasonDropdown("RETURN_REASON"));
    dispatch(getCourierTypeDropdown("COURIER_TYPE"));
    dispatch(getCourierStatusDropdown("COURIER_STATUS"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCourierCompanyData());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getShipperNameDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getReceiverNameDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getVendorNameDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getDepartmentDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getLocationDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (formData.pincode) {
      dispatch(getDestination(formData.pincode));
    }
  }, [formData.pincode]);
  // useEffect(() => {
  //   if(destination?.length>0){
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     location: destination[0]?.Description || "",
  //   }));
  // }
  // }, [destination]);
  useEffect(() => {
    if (destination?.length > 0) {
      const newLocation = destination[0]?.Description || "";
      if (formData.location !== newLocation) {
        setFormData((prev) => ({
          ...prev,
          location: newLocation,
        }));
      }
    }
  }, [destination]);
  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile || null); // Update file state
  };
  
  useEffect(() => {
    if (selectedData) {
      const updatefileName = selectedData["File Name"];
      const deptCode =
        departmentDropdown?.find(
          (dept) => dept?.department_desc === selectedData["Department"]
        )?.department_desc || "";
      const empname =
        shipperNameDropdown?.find(
          (shipper) => shipper?.Employee === selectedData["Recipient Name"]
        )?.Employee || "";
        const empId =
        shipperNameDropdown?.find(
          (shipperid) => shipperid?.Emp_id === selectedData["Emp Id"]
        )?.Emp_id || "";
      const receiverName =
        receiverNameDropdown?.find(
          (loc) => loc?.receiver_name === selectedData["Dispatch Team"]
        )?.receiver_name || "";
      const typeOfCourier =
        typeOfCourierDropdown?.find(
          (type) => type.label === selectedData["Type of Parcel"]
        )?.label || "";
      const status =
        courierStatusDropdown?.find(
          (stat) => stat.label === selectedData["Status"]
        )?.label || "";
      const courierMode =
        courierModeDropdown?.find(
          (mode) => mode?.label === selectedData["Courier Type"]
        )?.label || "";
        let formattedDate = "";
        if (selectedData["Date"]) {
          if (selectedData["Date"].includes("/")) {
            // If date is like "18/04/2025"
            formattedDate = moment(selectedData["Date"], "DD/MM/YYYY").format("YYYY-MM-DD");
          } else if (selectedData["Date"].includes("-")) {
            // If date is like "18-04-2025"
            formattedDate = moment(selectedData["Date"], "DD-MM-YYYY").format("YYYY-MM-DD");
          }
        }
    
        const currentDate = new Date();
        const currentFormattedDate = currentDate.toISOString().substr(0, 10);
        const currentTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      setFormData({
        reference_no: selectedData["Unique No."] || "",
        shipper_name: empname,
        empId : empId,
        department: deptCode,
        shipping_date: formattedDate || currentDate,
        time: selectedData["Time"] || currentTime,
        consigneeName: selectedData["Sender Name"] || "",
        consignee_company_name: selectedData["Sender Company Name"] || "",
        pincode: selectedData["Pincode"] || formData.pincode,
        location: formData.destination || selectedData["Location Name"],
        mobile_no: selectedData["Mobile No."] || "",
        courier_co_name: selectedData["Courier Co. Name"] || "",
        type_of_parcel: typeOfCourier,
        courier_type: courierMode,
        reverse_pickup_tokenno: selectedData["Reverse PickUp Token No"] || null,
        return_courier_airway_bill_no:
          selectedData["Return Courier AWB No"] || null,
        no_of_letters: selectedData["No of Letters"] || null,
        received_name: receiverName,
        received_by: selectedData["Received By"] || null,
        consignment_no: selectedData["Consignment No."] || "",
        status: status,
        discription: selectedData["Description"] || "",
      });
      setInputValue(selectedData["Recipient Name"] || "");
      if (updatefileName) {
        setFile({ name: updatefileName });
      } else {
        setFile(null);
      }
    } else {
      setFormData({
        reference_no: "",
        empId: "",
        department: "",
        shipping_date: "",
        time: "",
        consigneeName: "",
        consignee_company_name: "",
        pincode: "",
        location: "",
        mobile_no: "",
        courier_co_name: "",
        type_of_parcel: "",
        courier_type: "",
        reverse_pickup_tokenno: null,
        return_courier_airway_bill_no: null,
        no_of_letters: null,
        received_name: "",
        received_by: "",
        consignment_no: "",
        discription: "",
      });
      setInputValue("");
      setFile(null);
    }
  }, [
    selectedData,
    departmentDropdown,
    shipperNameDropdown,
    receiverNameDropdown,
    courierTypeDropdown,
    typeOfCourierDropdown,
    courierModeDropdown,
    vendorCompanyDropdown,
  ]);

  useEffect(() => {

    if (formData?.empId) {
      fetchDepartmentbyEmployee();
    }
  }, [formData.empId]);

  const fetchDepartmentbyEmployee = async () => {
   const data = await dispatch(getEmpolyeeName(formData?.empId));
  };
  // useEffect(() => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     department: empolyeeName[0]?.department_desc || "",
  //   }));
  // }, [empolyeeName]);
  useEffect(() => {
    if (empolyeeName.length > 0) {
      const departmentDesc = empolyeeName[0]?.department_desc;
      const department = departmentDropdown.find(
        (dept) => dept.department_desc === departmentDesc
      );
      if (department) {
        setFormData((prev) => ({
          ...prev,
          department: department.department_desc,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          department: "",
        }));
      }
    }
  }, [empolyeeName]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    handleFormChange("empId", "");
    handleFormChange("shipper_name", "");

    if (value.length >= 1) {
      const filteredSuggestions = shipperNameDropdown.filter((item) =>
        item.Employee.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      // setShowSuggestions(true);
      setReciptSuggestions(true);
    } else {
      handleFormChange("department", "");
      handleFormChange("department_desc", "");
      // setShowSuggestions(false);
      setReciptSuggestions(false);
      setSuggestion([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setInputValue(item.Employee);
    handleFormChange("empId", item.Emp_id);
    handleFormChange("shipper_name", item.Employee);
    // setShowSuggestions(false);
    setReciptSuggestions(false);
    setSuggestion([]);
  };

  const handleSaveDetails = async () => {
    const requiredFields = [
      { field: formData.shipper_name, name: "Recipient Name" },
      { field: formData.department, name: "Department" },
      { field: formData.consigneeName, name: "Consignee Name" },
      { field: formData.pincode, name: "Pincode" },
      { field: formData.location, name: "Location" },
      { field: formData.courier_co_name, name: "Courier Company Name" },
      { field: formData.type_of_parcel, name: "Type of Parcel" },
      { field: formData.courier_type, name: "Courier Type" },
      { field: formData.received_name, name: "Dispatch Team" },
    ];
    for (let i = 0; i < requiredFields.length; i++) {
      const { field, name } = requiredFields[i];
      if (!field) {
        toast.warning(`${name} is required!`);
        return;
      }
    }

    setLoader(true);
    const startTime = Date.now();

    try {
      const response = await dispatch(insertInwardCourier(formData));
      console.log(formData,"formData")
      if (response?.payload?.statusCode === 200) {
        toast.success(response.payload.data?.message);
        const result = response.payload.data.data[0][0].result;
        const data = response.payload.data.data[1];         
        await handleFile(result);
        await fetchSchedulerApi(data);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(1500 - elapsedTime, 0);
        setTimeout(() => {
          setLoader(false);
          navigate("/inwardCourier");
        }, remainingTime);
      }
      else{
        console.log('failed')
      }
    } catch (error) {
      setLoader(false);
      toast.error(error);
    }
  };

  const handleSaveasDraft = async () => {
    const requiredFields = [
      { field: formData.department, name: "Department" },
      { field: formData.consigneeName, name: "Sender Name" },
      { field: formData.pincode, name: "Pincode" },
      { field: formData.location, name: "Location" },
      { field: formData.courier_co_name, name: "Courier Company Name" },
      { field: formData.type_of_parcel, name: "Type of Parcel" },
      { field: formData.courier_type, name: "Courier Type" },
      { field: formData.received_name, name: "Dispatch Team" },
    ];

    for (let i = 0; i < requiredFields.length; i++) {
      const { field, name } = requiredFields[i];
      if (!field) {
        toast.warning(`${name} is required!`);
        return;
      }
    }

    setLoader(true);
    const startTime = Date.now();

    try {
      const response = await dispatch(insertInwardCourier(formData));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload?.data.message);
        const result = response.payload?.data.data[0][0].result;
        await handleFile(result);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(1500 - elapsedTime, 0);

        setTimeout(() => {
          setLoader(false);
          navigate("/inwardCourier");
        }, remainingTime);
      }
    } catch (error) {
      setLoader(false);
      console.log("");
    }
  };

  const handleFile = async (result) => {
    const formdata = new FormData();
    formdata.append("attachment", file);
    formdata.append("referenceName", "Courier Service");
    formdata.append("referenceKey", result);
    formdata.append("referenceSubName", "Inward Courier");
    const response = await dispatch(uploadFile(formdata));
    const { requestStatus, data } = response.payload;
    if (requestStatus === 200 || requestStatus === "success") {
      toast.success(data?.message || "File uploaded successfully");
      setTimeout(() => {
        navigate("/inwardCourier");
      }, 2000);
    }
  };

  // useEffect(() => {
  //   dispatch(getInwardCourierData());
  // }, [dispatch]);

  const fetchSchedulerApi = async (data) => {
    const emailBodyForInwardCourier = InwardCourierMail(data);
    const shipperEmail = data[0]["Shipper Email"];
    const uniqueNo = data[0]?.UniqueNo;
    const formData = new FormData();
    const isFileUpload = 0;
    formData.append("attachment", null);
    formData.append("to", shipperEmail);
    formData.append("subject", `Inward Courier Service-${uniqueNo}`);
    formData.append("content", emailBodyForInwardCourier);
    formData.append("is_file_upload", isFileUpload);
    await dispatch(addScheduler(formData));
  };

  const debouncedFetchPinCodes = (pincode) => {
    if (pincode?.length >= 1) {
      const matchingPincodes = pinCodeList?.filter((pin) =>
        pin?.Pincode?.toString().startsWith(pincode)
      );

      if (matchingPincodes?.length > 0) {
        setSuggestion(matchingPincodes);
        setError("");
        setShowSuggestions(true);
      } else {
        setSuggestion([]);
        setError("Pincode not found");
        setShowSuggestions(false);
      }
    } else if (pincode?.length === 0) {
      setSuggestion([]);
      setError("");
      setFormData((prevForm) => ({
        ...prevForm,
        destination: "",
        intl_dom_loc: "",
        state: "",
      }));
      setShowSuggestions(false);
    } else {
      setSuggestion([]);
      setError("");
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    dispatch(getPinCodes());
  }, [dispatch]);

  useEffect(() => {
    debouncedFetchPinCodes(formData.pincode);
  }, []);
  return (
    <Container fluid className="card">
      {loader && <CommonLoader />}
      <Title
        title={isEditMode ? "Update Inward Courier" : "Add Inward Courier"}
      />
      <hr />
      <Form>
        <Row>
          {isEditMode ? (
            <div>
              <h5>Reference Unique No: {formData.reference_no}</h5>
            </div>
          ) : (
            <></>
          )}
          <div>
            <h6 className="my-2" style={{ color: "red" }}>
              Recipient Details
            </h6>
          </div>
          <Col md={2} className="my-2">
            <CustomInput
              type="date"
              labelName="Date"
              value={
                formData.shipping_date
                  // ? moment(formData.shipping_date).format("YYYY-MM-DD")
                  ? moment(formData.shipping_date, ["YYYY-MM-DD", "DD-MM-YY"]).format("YYYY-MM-DD")
                  : ""
              }
              onChange={(e) => {
                const selectedDate = e.target.value;
                const today = new Date().toISOString().split("T")[0]; 

                if (selectedDate <= today) {
                  handleFormChange("shipping_date", selectedDate); 
                } else {
                  toast.error("Future dates are not allowed.");
                }
              }}
            />
          </Col>
          <Col md={2} className="my-2">
            <CustomInput
              type="time"
              labelName="Time"
              value={formData.time}
              onChange={(e) => handleFormChange("time", e.target.value)}
            />
          </Col>
          <Col md={4} className="my-2">
            <div className="position-relative">
              <label>
                Recipient Name
                <span style={{ color: "red" }}>*</span>
              </label>
              <FormControl
                className="mt-2"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter Name"
              />
              {reciptSuggestions && (
                <ListGroup className="suggestions-dropdown position-absolute w-100">
                  {suggestions.map((item) => (
                    <ListGroup.Item
                      key={item?.Emp_id}
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
          <Col md={4} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Department"
              labelKey="department_desc" 
              // valueKey="dept_code"
              valueKey="department_desc"
              // options={[...departmentDropdown]}
              options={[...(Array.isArray(departmentDropdown) ? departmentDropdown : [])]}
              selectedValue={formData?.department}
              // onChange={(e) => {
              //   const selectedDept = departmentDropdown.find(
              //     (dept) => dept.dept_code === e.target.value
              //   );
              //   handleFormChange("department", e.target.value);
              //   handleFormChange(
              //     "department_desc",
              //     selectedDept?.department_desc
              //   );
              // }}
              onChange={(e) => handleFormChange("department", e.target.value)}
              mandatoryIcon={true}
              isDisable
            />
          </Col>

          <div>
            <h6 className="my-2" style={{ color: "red" }}>
              Sender Details
            </h6>
          </div>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Sender Name"
              placeholder="Enter Sender Name"
              value={formData.consigneeName}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[^\d]*$/;
                if (regex.test(value) && value.length <= 8000) {
                  handleFormChange("consigneeName", value);
                }
              }}
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Sender Company Name"
              placeholder="Enter Sender Company Name"
              value={formData.consignee_company_name}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[^\d]*$/;
                if (regex.test(value) && value.length <= 8000) {
                  handleFormChange("consignee_company_name", value);
                }
              }}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Consignment No."
              placeholder="Enter Consignment No."
              value={formData.consignment_no}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z0-9]*$/;
                if (regex.test(value) && value.length <= 12) {
                  handleFormChange("consignment_no", value);
                }
              }}
            />
          </Col>

          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="No of Letters"
              placeholder="Enter No of Letters"
              value={formData.no_of_letters}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[0-9]*$/;
                if (regex.test(value) && value.length <= 5) {
                  handleFormChange("no_of_letters", value);
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
                value={formData?.pincode}
                onChange={(e) => {
                  const value = e.target.value;
                  const regex = /^[0-9]*$/;
                  if (regex.test(value) && value.length <= 6) {
                    handleFormChange("pincode", value);
                    debouncedFetchPinCodes(value);
                  }
                }}
              />

              {/* Show suggestions pinCode code here.... */}
              {
                // !isEditMode &&
                suggestion?.length > 0 && formData?.pincode?.length > 0 && (
                  <div className="suggestions-list col-3">
                    {suggestion.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        {suggestion.Pincode} - {suggestion.destination},{" "}
                        {suggestion.State}
                      </div>
                    ))}
                  </div>
                )
              }
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
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Location"
              placeholder="Enter Location"
              value={formData.location}
              onChange={(e) => handleFormChange("location", e.target.value)}
              isDisable
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Mobile No."
              placeholder="Enter Mobile No"
              value={formData.mobile_no}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[0-9]*$/;
                if (regex.test(value) && value.length <= 10) {
                  handleFormChange("mobile_no", value);
                }
              }}
            />
          </Col>

          <Col md={3} className="my-2" style={{ position: "relative" }}>
            <CustomInput
              type="text"
              mandatoryIcon={true}
              labelName="Courier Co. Name"
              placeholder="Enter Courier Co. Name"
              value={formData?.courier_co_name}
              onChange={(e) => {
                const value = e.target.value;
                const regex = /^[a-zA-Z0-9 ]*$/;
                if (regex.test(value)) {
                  handleFormChange("courier_co_name", value);
                }
              }}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {suggestionsField?.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "13px",
                  width: "90%",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  zIndex: 10,
                  maxHeight: "150px",
                  overflowY: "auto",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {suggestionsField?.map((item) => (
                  <li
                    key={item?.id}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => handleSuggestionClicks(item?.courier_co_name)}
                  >
                    {item.courier_co_name}
                  </li>
                ))}
              </ul>
            )}
          </Col>

          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Type Of Parcel"
              labelKey="label"
              valueKey="label"
              options={[ ...(Array.isArray(typeOfCourierDropdown) ? typeOfCourierDropdown : [])]}
              // options={[...typeOfCourierDropdown]}
              selectedValue={formData.type_of_parcel}
              onChange={(e) =>
                handleFormChange("type_of_parcel", e.target.value)
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
              // options={[...courierModeDropdown]}
              options={[ ...(Array.isArray(courierModeDropdown) ? courierModeDropdown : [])]}
              selectedValue={formData.courier_type}
              onChange={(e) => handleFormChange("courier_type", e.target.value)}
              mandatoryIcon={true}
            />
          </Col>
          {(formData.courier_type === "Return Courier" ||
            formData.return_courier_airway_bill_no) && (
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Returns Courier Airway Bill Nos"
                placeholder="Enter Airway Bill Nos"
                value={formData.return_courier_airway_bill_no}
                onChange={(e) =>
                  handleFormChange(
                    "return_courier_airway_bill_no",
                    e.target.value
                  )
                }
              />
            </Col>
          )}
          {(formData.courier_type === "Reverse PickUP" ||
            formData.reverse_pickup_tokenno) && (
            <Col md={3} className="my-2">
              <CustomInput
                type="text"
                labelName="Reverse Pickup Token No"
                placeholder="Enter Reverse Pickup Token No"
                value={formData.reverse_pickup_tokenno}
                onChange={(e) =>
                  handleFormChange("reverse_pickup_tokenno", e.target.value)
                }
              />
            </Col>
          )}

          <div>
            <h6 className="my-2" style={{ color: "red" }}>
              Delivery Details
            </h6>
          </div>
          <Col md={3} className="my-2">
            <CustomDropdown
              selectLevel={"Select"}
              Dropdownlable={true}
              dropdownLabelName="Dispatch Team"
              labelKey="receiver_name"
              valueKey="receiver_name"
              // options={[...receiverNameDropdown]}
              options={[...(Array.isArray(receiverNameDropdown) ? receiverNameDropdown : [])]}
              selectedValue={formData.received_name}
              onChange={(e) =>
                handleFormChange("received_name", e.target.value)
              }
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3} className="my-2">
            <CustomInput
              type="text"
              labelName="Received By"
              placeholder="Enter Name"
              value={formData.received_by}
              onChange={(e) => handleFormChange("received_by", e.target.value)}
            />
          </Col>
          {isEditMode ? (
            <Col md={3} className="my-2">
              <CustomDropdown
                selectLevel={"Select"}
                Dropdownlable={true}
                dropdownLabelName="Status"
                labelKey="label"
                valueKey="label"
                options={courierStatusDropdown.filter(
                  (status) =>
                    status.label === "Pending" || status.label === "Delivered"
                )}
                selectedValue={formData.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
                mandatoryIcon={true}
              />
            </Col>
          ) : (
            <></>
          )}
          <Col md={3} className="my-2">
            <Form.Label>Upload Document</Form.Label>
            <div className="position-relative">
              <Form.Control
                type="text"
                readOnly
                value={file?.name || ""}
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
              value={formData.discription}
              onChnage={(e) => handleFormChange("discription", e.target.value)}
            />
          </Col>
        </Row>
        <Row className="mt-3 justify-content-end">
          <Col md="auto" className="d-flex gap-2">
            {isEditMode ? (
              <CustomSingleButton
                _ButtonText="Update"
                height={40}
                onPress={handleUpdateDetails}
              />
            ) : (
              <>
                <CustomSingleButton
                  _ButtonText="Draft"
                  height={40}
                  onPress={handleSaveasDraft}
                />
                <CustomSingleButton
                  _ButtonText="Submit"
                  height={40}
                  onPress={handleSaveDetails}
                />
              </>
            )}
            <CustomSingleButton
              _ButtonText="Cancel"
              height={40}
              onPress={() => navigate("/inwardCourier")}
            />
          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddInwardCourier;