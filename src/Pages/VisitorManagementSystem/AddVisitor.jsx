import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  FormControl,
  ListGroup,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Title } from "../../Components/Title/Title";
import CustomInput from "../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import Webcam from "react-webcam";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointmentStatusDropdown,
  getCardTypeDropdown,
  getGenderDropdown,
  getPurposeOfVisitDropdown,
  getVisitorDetailsByConact,
  insertVisitorManagement,
  updateVisitorManagementData,
} from "../../Slices/VisitorManagement/VisitorManagementSlice";
import {
  getDepartmentDropdown,
  getEmpolyeeName,
  getShipperNameDropdown,
} from "../../Slices/CourierSevices/CourierSevicesSlice";
import { getFile, uploadFile } from "../../Slices/Attachment/attachmentSlice";
import VisitorMeetingMail from "./VisitorMeetingEmail";
import { addScheduler } from "../../Slices/Scheduler/schedulerSlice";
import Swal from "sweetalert2";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";

const AddVisitor = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState(null);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };
  const location = useLocation();
  const isEditMode = location.state?.isEditMode || false;
  const selectedData = isEditMode ? location.state?.item || {} : location.state;
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchReport, setSearchReport] = useState({
    empId: "",
    visitor_id: "",
    contact_number: null,
    visitor_name: "",
    v_company_name: "",
    emailId: "",
    gender: "",
    no_of_person: "",
    department_id: "",
    office_location: "",
    meeting_with: "",
    purpose_of_visit: "",
    card_type: "",
    card_no: "",
    issued_by: "",
    appointment_status: "",
    visit_date: "",
    in_time: "",
    out_time: "",
    card_received_by: "",
    remark: "",
    photo_capture: "",
  });

  const departmentDropdown = useSelector(
    (state) => state.CourierService.departmentDropdown.data || []
  );
  useEffect(() => {
    dispatch(getDepartmentDropdown());
  }, [dispatch]);
  const genderDropdownData = useSelector(
    (state) => state.VisitorManagement.genderDropdown
  );
  useEffect(() => {
    if (selectedData) {
      const formattedDate = selectedData["Visit Date"]
        ? selectedData["Visit Date"].split("/").reverse().join("-")
        : new Date().toISOString().split("T")[0];

      const gender =
        genderDropdownData.find((gen) => gen.label === selectedData["Gender"])
          ?.label || "";
      const purposeofvisit =
        PurposeOfVisitDropdownData.find(
          (pur) => pur.label === selectedData["Purpose of Visit"]
        )?.label || "";
      const deptpartment =
        departmentDropdown.find(
          (dept) => dept.department_desc === selectedData["Department"]
        )?.department_desc || "";
      const cardType =
        cardTypeDropdownData.find(
          (card) => card.label === selectedData["Card Type"]
        )?.label || "";
      const appointmentstatus =
        AppointmentStatusDropdownData.find(
          (gen) => gen.label === selectedData["Appointment Status"]
        )?.label || "";

      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      setSearchReport({
        visitor_id: selectedData["Visitor Id"] || "",
        contact_number: selectedData["Contact Number"] || "",
        visitor_name: selectedData["Visitor Name"] || "",
        v_company_name: selectedData["Company Name"] || "",
        emailId: selectedData["Email Address"] || "",
        no_of_person: selectedData["No of Persons"] || "",
        gender: gender,
        department_id: deptpartment,
        office_location: selectedData["Office Location"] || "",
        meeting_with: selectedData["Meeting With"] || "",
        purpose_of_visit: purposeofvisit,
        card_type: cardType,
        card_no: selectedData["Visitor Card No"] || "",
        issued_by: selectedData["Issued By"] || "",
        appointment_status: appointmentstatus,
        visit_date: formattedDate,
        in_time:
          selectedData["In Time"] && selectedData["In Time"].trim() !== ""
            ? selectedData["In Time"]
            : currentTime,
        out_time:
          selectedData["Out Time"] === ""
            ? currentTime
            : selectedData["Out Time"] || "",
        card_received_by: selectedData["Card Received By"] || "",
        remark: selectedData["Remarks"] || "",
        photo_capture: selectedData[""] || "",
      });
      setInputValue(selectedData["Meeting With"] || "");
    } else {
      const currentDate = new Date();
      const currentTime = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const todayDate = currentDate.toISOString().split("T")[0];

      setSearchReport({
        empId: "",
        visitor_id: "",
        contact_number: "",
        visitor_name: "",
        v_company_name: "",
        emailId: "",
        gender: "",
        no_of_person: "",
        department_id: "",
        office_location: "Ambit House",
        meeting_with: "",
        purpose_of_visit: "",
        card_type: "Visitor Card",
        card_no: "",
        issued_by: "",
        appointment_status: "",
        visit_date: todayDate,
        in_time: currentTime,
        out_time: "",
        card_received_by: "",
        remark: "",
        photo_capture: "",
      });
      setInputValue("");
    }
  }, [selectedData, genderDropdownData, departmentDropdown]);

  const PurposeOfVisitDropdownData = useSelector(
    (state) => state.VisitorManagement.PurposeOfVisitDropdown || []
  );
  const AppointmentStatusDropdownData = useSelector(
    (state) => state.VisitorManagement.appointmentStatusDropdown || []
  );
  const cardTypeDropdownData = useSelector(
    (state) => state.VisitorManagement.cardTypeDropdown || []
  );
  const shipperNameDropdown = useSelector(
    (state) => state.CourierService.shipperNameDropdown.data || []
  );
  const { empolyeeName } = useSelector((state) => state.CourierService);

  useEffect(() => {
    dispatch(getGenderDropdown("GENDER"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getPurposeOfVisitDropdown("PURPOSE_OF_VISIT"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAppointmentStatusDropdown("APPOINTMENT_STATUS"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCardTypeDropdown("VISITOR_CARD_TYPE"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getShipperNameDropdown());
  }, [dispatch]);

  // useEffect(() => {
  //   setSearchReport(searchReport?.contact_number.length > 0 ? "1" : "");
  // }, []);

  useEffect(() => {
    setSearchReport((prevState) => ({
      ...prevState,
      no_of_person: prevState.contact_number ? "1" : "",
    }));
  }, [searchReport.contact_number]);

  const visitorDetailsByContact = useSelector(
    (state) => state.VisitorManagement?.visitorGetDetailsByContact
  );
  const handleSuggestionClick = (item) => {
    setInputValue(item.Employee);
    setSearchReport((prev) => ({
      ...prev,
      meeting_with: item.Employee,
      empId: item.Emp_id,
    }));
    if (item.Emp_id) {
      dispatch(getEmpolyeeName(item.Emp_id)).then((response) => {
        const firstEmployee = response?.payload?.data?.[0] || {};
        const department = firstEmployee.department_desc || "";
        const departmentId = firstEmployee.department_desc || "";
        setSearchReport((prev) => ({
          ...prev,
          department_desc: department,
          department_id: departmentId,
        }));
      });
    }

    setShowSuggestions(false);
  };

  useEffect(() => {
    const fetchDepartmentbyEmployee = async () => {
      await dispatch(getEmpolyeeName(searchReport.empId));
    };
    if (searchReport.empId) {
      fetchDepartmentbyEmployee();
    }
  }, [searchReport.empId]);

  useEffect(() => {
    if (empolyeeName?.length) {
      setSearchReport((prevState) => ({
        ...prevState,
        department_desc: empolyeeName[0]?.department_desc || "",
        department_id: empolyeeName[0]?.department_desc || "",
      }));
    }
  }, [empolyeeName]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    setSearchReport((prev) => ({
      ...prev,
      meeting_with: value,
      empId: "",
      department_id: "",
      department_desc: "",
    }));

    if (value.length >= 1) {
      const filteredSuggestions = shipperNameDropdown.filter((item) =>
        item.Employee.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFormChange = (field, value) => {
    setSearchReport((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSaveDetails = async () => {
    const validations = [
      // {
      //   field: searchReport.contact_number,
      //   message: "Contact number is required!",
      // },
      {
        field: searchReport.visitor_name,
        message: "Visitor name is required!",
      },
      { field: searchReport.gender, message: "Gender is required!" },
      {
        field: searchReport.purpose_of_visit,
        message: "Purpose of visit is required!",
      },
      {
        field: searchReport.meeting_with,
        message: "Meeting With is required!",
      },

      { field: searchReport.card_type, message: "Card type is required!" },
      { field: searchReport.visit_date, message: "Visit date is required!" },
      { field: searchReport.in_time, message: "In time is required!" },
    ];

    for (const { field, message } of validations) {
      if (!field) {
        toast.warning(message);
        return;
      }
    }

    setLoader(true);
    const startTime = Date.now();
    try {
      const response = await dispatch(insertVisitorManagement(searchReport));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload?.data.message);
        const { visitor_id, visitor_name, email } = response.payload?.data.data[0][0];
        handleFile(visitor_id, visitor_name);
        fetchSchedulerApi(email, visitor_id);
        setTimeout(() => {
          setLoader(false);
          navigate("/visitorManagementSystem");
        }, Math.max(1500 - (Date.now() - startTime), 0));
      }
    } catch (error) {
      setLoader(false);
      toast.error("Something went wrong!");
    }
  };

  const handleUpdateDetails = async () => {
    setLoader(true);
    const startTime = Date.now();
    const response = await dispatch(updateVisitorManagementData(searchReport));
    if (response.meta.requestStatus === "fulfilled") {
      toast.success(response.payload.message);
      setTimeout(() => {
        setLoader(false);
        navigate("/visitorManagementSystem");
      }, Math.max(1500 - (Date.now() - startTime), 0));
    }
  };
  const handleCapture = (event) => {
    event.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      const base64Image = imageSrc.split(",")[1];
      const byteCharacters = atob(base64Image);
      const byteNumbers = Array.from(byteCharacters).map((char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const mimeType = imageSrc.includes("image/png")
        ? "image/png"
        : "image/jpeg";
      const blob = new Blob([byteArray], { type: mimeType });

      setCapturedImage(blob);
      console.log("Captured Blob:", blob);
    } else {
      console.error("No image captured from Webcam.");
    }
  };
  const handleFile = async (visitorId, visitorname) => {
    if (!capturedImage) {
      const formData = new FormData();

      for (const attach of Attachment) {
        console.log("Processing attachment:", attach); // Debugging

        if (!attach || !attach.attachment_path) {
          toast.error("Invalid attachment: File path is missing.");
          continue; // Skip this iteration for invalid entries
        }

        try {
          // Fetch the file from the attachment path
          const response = await fetch(attach.attachment_path);
          if (!response.ok) {
            toast.error(`Failed to fetch file from ${attach.attachment_path}`);
            continue;
          }
          const blob = await response.blob();
          const mimeType = blob.type;

          // Validate file type (Only allow PNG, JPG, JPEG)
          if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
            toast.error(
              `Invalid file type: ${mimeType}. Allowed types: PNG, JPEG.`
            );
            return;
          }

          // Create a File object from the Blob
          const file = new File([blob], attach.attachment || "file", {
            type: mimeType,
          });

          // Append the file directly to FormData
          formData.append(
            "attachment",
            file,
            attach.attachment_name || file.name
          );
        } catch (error) {
          toast.error("Error processing attachment.");
          console.error("Attachment processing error:", error);
        }
      }

      formData.append("referenceName", "Visitor Management");
      formData.append("referenceKey", visitorId);
      formData.append("referenceSubName", "Visitor Management");

      try {
        const response = await dispatch(uploadFile(formData));
        const { requestStatus, data } = response.payload;

        if (requestStatus === 200 || requestStatus === "success") {
          toast.success(data?.message || "File uploaded successfully");
        } else {
          console.log("File upload failed");
        }
      } catch (error) {
        toast.error("An unexpected error occurred during the upload.");
        console.error("Upload error:", error);
      }
    } else {
      // If a captured image exists, proceed with the original logic
      const mimeType = capturedImage.type;
      const fileExtension = mimeType === "image/png" ? ".png" : ".jpg";
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
      const dynamicFilename = `visitor ${visitorname}${timestamp}${fileExtension}`;
      const formData = new FormData();
      formData.append("attachment", capturedImage, dynamicFilename);
      formData.append("referenceName", "Visitor Management");
      formData.append("referenceKey", visitorId);
      formData.append("referenceSubName", "Visitor Management");

      try {
        const response = await dispatch(uploadFile(formData));
        const { requestStatus, data } = response.payload;

        if (requestStatus === 200 || requestStatus === "success") {
          console.log("File uploaded successfully");
        } else {
          console.log("File upload failed");
        }
      } catch (error) {
        toast.error("An unexpected error occurred during the upload.");
        console.error(error);
      }
    }
  };

  const webcamRef = React.useRef(null);

  const AttachmentDetails = useSelector((state) => state.Attachment.attachment);
  const fetchVisitorDetailsFiles = () => {
    const visitorId = selectedData["Visitor Id"];
    const Payload = {
      referenceName: "Visitor Management",
      referenceKey: visitorId,
      referenceSubName: "Visitor Management",
    };
    dispatch(getFile(Payload));
  };

  useEffect(() => {
    if (isEditMode) {
      fetchVisitorDetailsFiles();
    }
  }, [isEditMode, dispatch]);

  useEffect(() => {
    if (searchReport.contact_number) {
      setSearchReport((prevState) => ({
        ...prevState,
        visitor_name: visitorDetailsByContact[0][0]?.visitor_name || "",
        v_company_name: visitorDetailsByContact[0][0]?.v_company_name || "",
        emailId: visitorDetailsByContact[0][0]?.emailId || "",
        gender: visitorDetailsByContact[0][0]?.gender || "",
      }));
    }
  }, [visitorDetailsByContact]);

  const fetchVisitorDetailsByContact = (contactNumber) => {
    if (!isEditMode && contactNumber && contactNumber.length >= 10) {
      dispatch(getVisitorDetailsByConact(contactNumber));
    }
  };
  const Attachment = useSelector((state) => state.Attachment.attachment);
  const VisitorDetailsFiles = () => {
    if (
      visitorDetailsByContact &&
      visitorDetailsByContact.length > 0 &&
      searchReport.contact_number
    ) {
      const visitorId = visitorDetailsByContact[0][0]?.visitor_id;
      if (visitorId) {
        const Payload = {
          referenceName: "Visitor Management",
          referenceKey: visitorId,
          referenceSubName: "Visitor Management",
        };
        dispatch(getFile(Payload));
      } else {
        console.log("Visitor ID is not available");
      }
    } else {
      if (!searchReport.contact_number) {
        console.log("Contact number is not available");
      } else {
        console.log("Visitor details not available");
      }
    }
  };

  useEffect(() => {
    if (
      visitorDetailsByContact &&
      visitorDetailsByContact.length > 0 &&
      searchReport.contact_number
    ) {
      VisitorDetailsFiles();
    }
  }, [visitorDetailsByContact]);

  const fetchSchedulerApi = async (email, visitor_id) => {
    const mailcontent = VisitorMeetingMail(searchReport);
    const visitor = visitor_id;
    const senderEmail = email;
    const formData = new FormData();
    const isFileUpload = 0;
    formData.append("attachment", null);
    formData.append("to", senderEmail);
    formData.append("subject", `Visitor Management_${visitor}`);
    formData.append("content", mailcontent);
    formData.append("is_file_upload", isFileUpload);
    await dispatch(addScheduler(formData));
  };
  const handleCancle = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      width: "350px",
      customClass: {
        popup: "custom-popup",
      },
    });

    if (result.isConfirmed) {
      navigate("/visitorManagementSystem");
    }
  };

  const handleDetails = () => {
    if (isEditMode) {
      handleUpdateDetails();
    } else {
      handleSaveDetails();
    }
  };

  useEffect(() => {
    const getCurrentTime = () => {
      const now = new Date();
      return now.toTimeString().slice(0, 5); // Format: HH:mm
    };

    setSearchReport((prevState) => ({
      ...prevState,
      in_time: prevState.in_time || getCurrentTime(), // Set default only if not set
    }));
  }, []);

  return (
    <div>
      <Container className="border rounded-3 p-4">
        {loader && <CommonLoader />}
        <Title
          title={isEditMode ? "Update Visitor Name" : "Add Visitor Name"}
        />
        <hr />
        <Form>
          <Row className="mb-3">
            {isEditMode ? (
              <Col md={6}>
                {AttachmentDetails && AttachmentDetails.length > 0 ? (
                  AttachmentDetails.map((attach, index) =>
                    attach.attachment_path ? (
                      <img
                        key={index}
                        src={attach.attachment_path}
                        alt="Attachment"
                        style={{
                          width: "200px",
                          height: "auto",
                          margin: "10px",
                        }}
                      />
                    ) : (
                      <p key={index}>No image available</p>
                    )
                  )
                ) : (
                  <></>
                )}
              </Col>
            ) : (
              <>
                <Col md={6}>
                  <Webcam
                    audio={false}
                    height={140}
                    screenshotFormat="image/jpeg"
                    width={230}
                    videoConstraints={videoConstraints}
                    ref={webcamRef}
                    className="border"
                  />
                  <div className="mt-3">
                    <button className="btn btn-danger" onClick={handleCapture}>
                      Capture Photo
                    </button>
                  </div>
                </Col>
                <Col md={6}>
                  {capturedImage ? (
                    <div>
                      <img
                        src={URL.createObjectURL(capturedImage)}
                        alt="Captured"
                        className="img-thumbnail"
                      />
                    </div>
                  ) : (
                    <>
                      {searchReport.contact_number === null ? (
                        <p>No contact number available. Clearing images...</p>
                      ) : Attachment && Attachment.length > 0 ? (
                        Attachment.map((attach, index) =>
                          attach.attachment_path ? (
                            <img
                              key={index}
                              src={attach.attachment_path}
                              alt="Attachment"
                              style={{
                                width: "200px",
                                height: "auto",
                                margin: "10px",
                              }}
                            />
                          ) : (
                            <p key={index}>No image available</p>
                          )
                        )
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </Col>
              </>
            )}
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <CustomInput
                type="tel"
                labelName="Contact Number"
                // mandatoryIcon={true}
                value={searchReport.contact_number}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9+]/g, "");
                  handleFormChange("contact_number", value);

                  if (value.length >= 10) {
                    fetchVisitorDetailsByContact(value);
                  } else if (value.length === 0) {
                    setSearchReport((prevState) => ({
                      ...prevState,
                      contact_number: "",
                      visitor_name: "",
                      v_company_name: "",
                      emailId: "",
                      gender: "",
                    }));
                  }
                }}
                placeholder="Enter contact number"
                maxLength="14"
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="text"
                labelName="Visitor Name"
                mandatoryIcon={true}
                value={searchReport.visitor_name}
                onChange={(e) => {
                  const alphabetOnly = e.target.value.replace(
                    /[^A-Za-z\s]/g,
                    ""
                  );
                  handleFormChange("visitor_name", alphabetOnly);
                }}
                placeholder="Enter visitor name"
              />
            </Col>

            <Col md={4}>
              <CustomInput
                type="text"
                labelName="Company Name"
                value={searchReport.v_company_name}
                onChange={(e) =>
                  handleFormChange("v_company_name", e.target.value)
                }
                placeholder="Enter Company Name"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <CustomInput
                type="email"
                labelName="Email Address"
                value={searchReport.emailId}
                onChange={(e) => handleFormChange("emailId", e.target.value)}
                placeholder="Enter email address"
              />
            </Col>
            <Col md={4}>
              <CustomDropdown
                selectLevel={"Select"}
                Dropdownlable={true}
                dropdownLabelName="Gender"
                mandatoryIcon={true}
                options={genderDropdownData || []}
                valueKey="label"
                labelKey="label"
                selectedValue={searchReport.gender}
                onChange={(e) => handleFormChange("gender", e.target.value)}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="numeric"
                labelName="No of Persons"
                value={searchReport.no_of_person}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 1 || value === "") {
                    handleFormChange("no_of_person", value);
                  }
                }}
                placeholder="Enter No of Persons"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <CustomDropdown
                selectLevel={"Select"}
                Dropdownlable={true}
                dropdownLabelName="Purpose of Visit"
                mandatoryIcon={true}
                options={PurposeOfVisitDropdownData || []}
                valueKey="label"
                labelKey="label"
                selectedValue={searchReport.purpose_of_visit}
                onChange={(e) =>
                  handleFormChange("purpose_of_visit", e.target.value)
                }
              />
            </Col>
            <Col md={4}>
              <CustomDropdown
                dropdownLabelName="Office Location"
                // mandatoryIcon={true}
                options={[
                  { label: "Select", value: "" },
                  { label: "Ambit House", value: "Ambit House" },
                ]}
                valueKey="value"
                labelKey="label"
                selectedValue={searchReport.office_location}
                onChange={(e) =>
                  handleFormChange("office_location", e.target.value)
                }
                selectLevel="Select Office Location"
              />
            </Col>
            <Col md={4}>
              <div className="position-relative">
                <label>Meeting With</label>
                <span style={{ color: "red" }}>*</span>
                <FormControl
                  className="mt-2"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
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
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <CustomDropdown
                key={searchReport.department_id}
                selectLevel={"Select"}
                Dropdownlable={true}
                dropdownLabelName="Department"
                labelKey="department_desc"
                valueKey="department_desc"
                options={departmentDropdown || []}
                selectedValue={searchReport.department_id || ""}
                onChange={(e) => {
                  const selectedDept = departmentDropdown.find(
                    (dept) => dept.department_desc === e.target.value
                  );
                  handleFormChange("department_id", e.target.value);
                  handleFormChange(
                    "department_desc",
                    selectedDept?.department_desc || ""
                  );
                }}
                mandatoryIcon={true}
                isDisable={!searchReport.department_id}
              />
            </Col>
            <Col md={4}>
              <CustomDropdown
                selectLevel={"Select"}
                Dropdownlable={true}
                dropdownLabelName="Card Type"
                mandatoryIcon={true}
                options={cardTypeDropdownData || []}
                valueKey="label"
                labelKey="label"
                selectedValue={searchReport.card_type}
                onChange={(e) => handleFormChange("card_type", e.target.value)}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="text"
                labelName="Card no"
                // mandatoryIcon={true}
                value={searchReport.card_no}
                onChange={(e) => handleFormChange("card_no", e.target.value)}
                placeholder="Enter Visitor"
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <CustomInput
                type="text"
                labelName="Issued By"
                // mandatoryIcon={true}
                value={searchReport.issued_by}
                onChange={(e) => handleFormChange("issued_by", e.target.value)}
                placeholder="Enter Issued By"
              />
            </Col>
            {/* <Col md={4}>
              <CustomDropdown
                selectLevel={"Select"}
                Dropdownlable={true}
                dropdownLabelName="Appointment Status"
                mandatoryIcon={true}
                options={[...AppointmentStatusDropdownData]}
                valueKey="label"
                labelKey="label"
                selectedValue={searchReport.appointment_status}
                onChange={(e) =>
                  handleFormChange("appointment_status", e.target.value)
                }
              />
            </Col> */}
            <Col md={4}>
              <CustomInput
                type="datetime-local"
                labelName="Visit Date & In Time"
                mandatoryIcon={true}
                value={`${searchReport.visit_date}T${searchReport.in_time}`}
                onChange={(e) => {
                  const [date, time] = e.target.value.split("T");
                  handleFormChange("visit_date", date);
                  handleFormChange("in_time", time);
                }}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="time"
                labelName="Out Time"
                // mandatoryIcon={true}
                value={searchReport.out_time}
                onChange={(e) => handleFormChange("out_time", e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <CustomInput
                type="text"
                labelName="Card Received By"
                // mandatoryIcon={true}
                value={searchReport.card_received_by}
                onChange={(e) =>
                  handleFormChange("card_received_by", e.target.value)
                }
                placeholder="Enter Card Received By"
              />
            </Col>
            <Col md={4}>
              <Form.Group controlId="remark">
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={searchReport.remark}
                  onChange={(e) => handleFormChange("remark", e.target.value)}
                  placeholder="Enter remark"
                  style={{ resize: "both", overflow: "auto" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3 mb-2 justify-content-end">
            <Col md={2}>
              <CustomSingleButton
                _ButtonText={isEditMode ? "Update" : "Submit"}
                height={"40px"}
                onPress={handleDetails}
              />
            </Col>
            <Col md={2}>
              <CustomSingleButton
                _ButtonText="Cancel"
                height={"40px"}
                onPress={handleCancle}
              />
            </Col>
          </Row>
        </Form>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default AddVisitor;
