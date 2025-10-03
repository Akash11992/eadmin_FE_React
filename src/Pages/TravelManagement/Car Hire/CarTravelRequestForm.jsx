import React, { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import NewTravelRequestFrom from "../../../Components/TravelManegementComponets/NewTravelRequestFrom/NewTravelRequestFrom";
import { useDispatch, useSelector } from "react-redux";
import ReactDOMServer from "react-dom/server";

import {
  fetchEmpDropDownData,
  fetchVendorNameDetails,
  getCarType,
  getJourneyClass,
  getPackage,
  getTravelDetailsDataById,
  getTravelMode,
  insertTravelRequestForm,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { getUserList } from "../../../Slices/ManageUserSlice/ManageUserSlice";
import { getBusinessTypes } from "../../../Slices/CompanyDetails/CompanyDetailSlice";
import { useState } from "react";
import CarJourneyBookingTable from "../../../Components/TravelManegementComponets/CarJourneyBookingTable/CarJourneyBookingTable";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { addScheduler } from "../../../Slices/Scheduler/schedulerSlice";
import FinalCarJourneyEmail from "../../../Components/TravelManegementComponets/FinalCarJourneyEmail/FinalCarJourneyEmail";
import Encryption from "../../../Components/Decryption/Encryption";

const CarTravelRequestForm = () => {
  const [form, setForm] = useState({
    travelerName: "",
    companyName: "",
    departmentName: "",
    subDepartmentName: "",
    employeeId: "",
    travelType: "",
    fileUpload: null,
    remark: "",
    p_approval_id: 0,
    travelID: 0,
    vendorName: "",
    selectedTraveler: "",
  });

  const [carJourneys, setCarJourneys] = useState([
    {
      date_of_journey: "",
      from_place: "",
      to_place: "",
      flight_name: [],
      journey_class: [],
      frequenct_flyer_no: 0,
      stops: [],
      time: [],
      travel_date_from: "",
      travel_date_to: "",
      meal: 0,
      showMealOptions: false,
      seat_preference: "",
      remarks: "",
      pick_details: [],
    },
  ]);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const encrypt = Encryption()

  const { editMode, reference_id } = location.state || {};
  const savedUserData = JSON.parse(localStorage.getItem("userData"));

  const {
    travelModeData,
    journeyClassData,
    getTravelDetaById,
    getEmpDropData,
    vendorDetailsNameData,
    getDepartment_subDepartment,
    packageData,
    carType,
    subDepartment,
  } = useSelector((state) => state.TravelManagement);
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  const existingData = getTravelDetaById?.data?.[0];

  useEffect(() => {
    dispatch(getTravelMode("TRAVEL_MODE"));
    dispatch(getJourneyClass("JOURNEY_CLASS"));
    dispatch(fetchEmpDropDownData());
    dispatch(getUserList());
    dispatch(getBusinessTypes());
    dispatch(getCarType("CAR_TYPE"));
    dispatch(getPackage("PACKAGE"));
    {
      editMode &&
        reference_id &&
        dispatch(
          getTravelDetailsDataById({
            p_reference_id: reference_id,
            p_limit: "10",
          })
        );
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchVendorNames = async () => {
      const payload = {
        sub_category_id: 2,
      };
      try {
        await dispatch(fetchVendorNameDetails(payload));
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    };
    fetchVendorNames();
  }, []);
  const parseValue = (value) => {
    try {
      if (Array.isArray(value)) return value;
      if (typeof value === "string" && value.trim().startsWith("[")) {
        return JSON.parse(value);
      }
      return value ? [value] : [];
    } catch (error) {
      console.error("Error parsing value:", value, error);
      return [];
    }
  };

  useEffect(() => {
    if (editMode && reference_id) {
      if (existingData) {
        setForm({
          travelerName: existingData?.TRF_TRAVELLER_EMPLOYEE_ID || "",
          companyName: existingData?.TRF_COMPANY_ID || "",
          employeeId: existingData?.TRF_TRAVELLER_EMPLOYEE_ID || "",
          travelMode: existingData?.TRF_TRAVEL_MODE_ID || "",
          travelType: existingData?.TRF_TRAVEL_REASON || "",
          departmentName: existingData?.TRF_DEPARTMENT || "",
          subDepartmentName: existingData?.TRF_SUB_DEPARTMENT || "",
          fileUpload: existingData?.TRF_UPLOADED_DOCS || "",
          remark: existingData?.TRF_REMARKS || "",
          p_approval_id: 0,
          supervisorName: "",
          supervisorId: 0,
          reasonChangingSupervisor: "",
          travelID: existingData?.TRF_ID,
          vendorName:
          parseValue(existingData?.TRF_VENDOR)?.toString().split(",") || [],        });

        if (Array.isArray(existingData?.journey_details)) {
          const mappedJourneys = existingData.journey_details.map(
            (journey) => ({
              TRJM_ID: journey?.TRJM_ID || "",
              TRJM_REFERENCE_ID: journey?.TRJM_REFERENCE_ID || "",
              date_of_journey: journey?.TRJM_DATE_OF_JOURNEY || "",
              from_place: journey?.TRJM_FROM_PLACE || "",
              to_place: journey?.TRJM_TO_PLACE || "",
              flight_name: parseValue(journey?.TRJM_FLIGHT_NAME),
              journey_class: parseValue(journey?.TRJM_TRAVEL_JOURNEY_CLASS),
              frequenct_flyer_no: journey?.TRJM_FREQUENT_FLYER_NO || 0,
              stops: parseValue(journey?.TRJM_STOPS),
              time: parseValue(journey?.TRJM_TIME),
              travel_date_from: journey?.TRJM_DATE_TIME_RANGE_FROM || "",
              travel_date_to: journey?.TRJM_DATE_TIME_RANGE_TO || "",
              meal: journey?.TRJM_MEAL || 0,
              showMealOptions: Boolean(journey?.TRJM_MEAL),
              seat_preference: "",
              remarks: journey?.TRJM_REMARKS || "",
              pick_details: parseValue(journey?.TRJM_PICK_UP_DETAILS),
            })
          );
          setCarJourneys(mappedJourneys);
        }
      }
    }
  }, [editMode, reference_id, getTravelDetaById, existingData]);

  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  const handleValidDetails = (isSaveLater) => {
    if (!form?.travelerName || !form?.remark?.trim()) {
      return toast.warning("Please fill all mandatory fields marked as *.");
    }
    if (!carJourneys.length) {
      return toast.warning(
        "Please add at least one journey detail for car travel."
      );
    }
    const isCarJourneyValid = carJourneys.every((carJourney) => {
      if (!carJourney.date_of_journey) {
        toast.warning(
          "Please fill the 'Date of Journey' for all car journeys."
        );
        return false;
      }

      if (!carJourney.from_place?.trim()) {
        toast.warning("Please fill the 'From Place' for all car journeys.");
        return false;
      }

      if (!carJourney.to_place?.trim()) {
        toast.warning("Please fill the 'To Place' for all car journeys.");
        return false;
      }

      if (!carJourney.travel_date_from?.trim()) {
        toast.warning("Please fill the 'Pickup Time' for all car journeys.");
        return false;
      }
      return true;
    });

    if (!isCarJourneyValid) {
      return;
    }

    if (!editMode && !form.vendorName) {
      return toast.warning("Please select at least one vendor.");
    }
    handleInsertTravelRequest(isSaveLater);
  };

  const handleInsertTravelRequest = async (isSaveLater) => {
    const payload = new FormData();
    const dataToEncrypt = {
      p_travel_id:  editMode && reference_id ? form.travelID : 0,
      p_user_id: savedUserData?.data?.userId,
      p_traveller_name: form.travelerName,
      p_company_id: form.companyName ? form.companyName : 0,
      p_department: form.departmentName ? form.departmentName : 0,
      p_sub_department: form.subDepartmentName ? form.subDepartmentName : 0,
      p_travel_reason: form.travelType ? form.travelType : "",
      p_traveller_employee_id: editMode && reference_id ? form?.employeeId : form?.travelerName,
      p_travel_mode_id: "2",
      p_travel_type_id: 0,
      p_frequent_no: 0,
      p_remarks: form.remark,
      p_save_later: isSaveLater ? 1 : 0,
      p_journey_details: JSON.stringify(carJourneys),
      p_approval_id:  "0",
      p_supervisor_name:  "",
      p_supervisor_id:  "0",
      p_reason_for_change: "",
      p_vendor_id: form.vendorName,
    };
    payload.append("p_file_name", form.fileUpload);
    payload.append("encryptedData", encrypt(dataToEncrypt));
    try {
      const response = await dispatch(insertTravelRequestForm(payload));
      if (response?.payload?.success) {
        toast.success(
          response?.payload?.data || "Travel request submitted successfully."
        );
        if (isSaveLater == 1) {
          setTimeout(() => {
            navigate("/carHire");
          }, 2000);
        }else{
					fetchSchedulerApi(response?.payload?.reference_id);
				}
        setTimeout(() => {
          navigate("/carHire");
        }, 2000);
      } else {
        toast.error(
          response?.payload?.message ||
            "Travel request form submission failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error in travel request submission:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const travellerEmail = getEmpDropData?.find(
    (item) => item.userId == form.travelerName
  );
  const ccEmail = `${savedUserData?.data?.userEmail},${travellerEmail?.userEmail}`;
  const selectedVendor = vendorDetailsNameData.find(
    (item) => item.VENDOR_ID == form.vendorName
  );
  const emailBodyForCarJourneyToHod = ReactDOMServer.renderToStaticMarkup(
    <FinalCarJourneyEmail
      carJourneys={carJourneys}
      form={form}
      selectedTraveler={getEmpDropData}
      carType={carType}
      packageData={packageData}
      savedUserData={savedUserData}
      selectedVendor={selectedVendor}
    />
  );
  const fetchSchedulerApi = async (id) => {
    const formData = new FormData();
    formData.append("attachment", form.fileUpload);
    formData.append("to", selectedVendor?.EMAIL_ID);
    formData.append("cc", ccEmail);
    formData.append("subject", `Ambit Car Hire booking request: Req. ID:${id} `);
    formData.append("content", emailBodyForCarJourneyToHod);
    formData.append("is_file_upload", form.fileUpload instanceof File ? 1 : 0);
    await dispatch(addScheduler(formData));
    // }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row className="dashboard me-1 ms-1">
        <Row className="mt-3">
          <Col>
            <h4>
              {editMode
                ? "Update Car Hire Request Form"
                : "New Car Hire Request Form"}
            </h4>
          </Col>
        </Row>
        <hr />
        <Card>
          <Card.Body>
            <NewTravelRequestFrom
              form={form}
              businesstype={businesstype}
              getDepartment_subDepartment={getDepartment_subDepartment}
              subDepartments={subDepartment}
              travellerName={getEmpDropData}
              travelModeData={travelModeData}
              handleFormChange={handleFormChange}
              editMode={editMode}
              reference_id={reference_id}
              setForm={setForm}
            />
            <CarJourneyBookingTable
              open={true}
              carJourneys={carJourneys}
              setCarJourneys={setCarJourneys}
              journeyClassData={journeyClassData}
              editMode={editMode}
              carType={carType}
              packageData={packageData}
            />
            {(!editMode ||
              existingData?.TRF_TRAVEL_MODE_ID === 2 ||
              existingData?.TRF_SAVE_LATER == 1) && (
              <Row className="mt-3">
                <Col md="4">
                  <CustomDropdown
                    labelKey="DESCRIPTION"
                    valueKey="VENDOR_ID"
                    dropdownLabelName={"Vendor Details"}
                    Dropdownlable
                    options={vendorDetailsNameData}
                    selectedValue={form.vendorName}
                    onChange={(e) => {
                      handleFormChange("vendorName", e.target.value);
                    }}
                  />
                </Col>
              </Row>
            )}
            <Row className="mt-5">
              <Col md="4">
                <CustomSingleButton
                  _ButtonText={"Back"}
                  onPress={() => navigate("/carHire")}
                  height="40px"
                />
              </Col>
              <Col md="4">
                <CustomSingleButton
                  _ButtonText={"Save for Later"}
                  onPress={() => {
                    handleValidDetails(1);
                  }}
                  height="40px"
                />
              </Col>
              <Col md="4">
                <CustomSingleButton
                  _ButtonText={"Submit Tour Request"}
                  onPress={() => handleValidDetails(0)}
                  height="40px"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default CarTravelRequestForm;
