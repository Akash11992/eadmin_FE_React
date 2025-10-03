import React, { useEffect, useMemo, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import JourneyBooking from "../../../../Components/TravelManegementComponets/JourneyBooking/JourneyBooking";
import VendorForm from "../../../../Components/TravelManegementComponets/VendorForm/VendorForm";
import NewTravelRequestFrom from "../../../../Components/TravelManegementComponets/NewTravelRequestFrom/NewTravelRequestFrom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getJourneyClass,
  insertTravelRequestForm,
  getTravelDetailsDataById,
  fetchEmpDropDownData,
  fetchVendorNameDetails,
  getStops,
  getTravellerTime,
  getFlightName,
  getMeal,
} from "../../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import ApproverSelector from "../../../../Components/TravelManegementComponets/ApproverSelector/ApproverSelector";
import { addScheduler } from "../../../../Slices/Scheduler/schedulerSlice";
import BookingCommonTravel from "../../../../Components/TravelManegementComponets/BookingCommonTravel/BookingCommonTravel";
import { getUserList } from "../../../../Slices/ManageUserSlice/ManageUserSlice";
import MultiSelectDropdown from "../../../../Components/CustomDropdown/MultiSelectDropdown";
import { getBusinessTypes } from "../../../../Slices/CompanyDetails/CompanyDetailSlice";
import { format, isValid } from "date-fns";
import FinalJourneyDetailsOnMail from "../../../../Components/TravelManegementComponets/FinalJourneyDetailsOnMail/FinalJourneyDetailsOnMail";
import ReactDOMServer from "react-dom/server";
import JourneyDetailsToVendorOnMail from "../../../../Components/TravelManegementComponets/JourneyDetailsToVendorOnMail/JourneyDetailsToVendorOnMail";
import Encryption from "../../../../Components/Decryption/Encryption";
const TravelRequestForm = () => {
  const [form, setForm] = useState({
    travelerName: "",
    companyName: "",
    departmentName: "",
    subDepartmentName: "",
    employeeId: "",
    travelMode: "",
    travelType: "",
    fileUpload: null,
    remark: "",
    p_approval_id: "",
    supervisorName: "",
    supervisorId: 0,
    reasonChangingSupervisor: "",
    supervisorEmail: "",
    hod: "",
    vendorName: [],
  });

  const [journeys, setJourneys] = useState([
    {
      // id: 1,
      date_of_journey: "",
      from_place: "",
      to_place: "",
      flight_name: [],
      journey_class: [],
      frequenct_flyer_no: 0,
      stops: ["1"],
      time: [],
      travel_date_from: "",
      travel_date_to: "",
      meal: "1",
      showMealOptions: false,
      seat_preference: "",
      remarks: "",
      pick_details: [],
      selectJourney: false,
    },
  ]);

  const [vendor, setVendor] = useState([
    {
      vendorName: "",
      journeyDate: "",
      fromPlace: "",
      toPlace: "",
      flightName: "",
      journeyClass: "",
      stops: "",
      totalAmount: "",
      document: null,
      remark: "",
      reference_id: "",
      travel_id: "",
      journey_id: "",
      selectVendor: false,
    },
  ]);
  const [existingData, setExistingData] = useState(null);
  const [open, setOpen] = useState(true);
  const [travelID, setTravelID] = useState(0);
  const [finalBookVenderData, setFinalBookVenderData] = useState([]);
  const [finalHodBookingData, setFinalHodBookingData] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const encrypt = Encryption();

  const {
    stops,
    travelModeData,
    journeyClassData,
    getTravelDetaById,
    getEmpDropData,
    vendorDetailsNameData,
    getDepartment_subDepartment,
    travellerTime,
    flight_name,
    meal,
  } = useSelector((state) => state.TravelManagement);

  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );

  const savedUserData = JSON.parse(localStorage.getItem("userData"));

  const loading = useSelector(
    (state) => state.TravelManagement.status === "loading"
  );

  const { editMode, reference_id, hodview } = location.state || {};

  // Air journey

  const handleFormChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  useEffect(() => {
    dispatch(getJourneyClass("JOURNEY_CLASS"));
    dispatch(fetchEmpDropDownData());
    dispatch(getUserList());
    dispatch(getBusinessTypes());
    dispatch(getStops("TRAVEL_STOP"));
    dispatch(getTravellerTime("TRAVEL_TIME"));
    dispatch(getFlightName("FLIGHT_NAME"));
    dispatch(getMeal("MEAL"));
  }, [dispatch]);

  useEffect(() => {
    const fetchVendorNames = async () => {
      const payload = {
        sub_category_id: 1,
      };
      try {
        await dispatch(fetchVendorNameDetails(payload));
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    };
    fetchVendorNames();
  }, []);

  useEffect(() => {
    if (reference_id) {
      fetchDetailsById();
    }
  }, [reference_id]);

  const fetchDetailsById = async () => {
    const response = await dispatch(
      getTravelDetailsDataById({
        p_reference_id: reference_id,
        p_limit: "10",
      })
    );
    if (response.payload.success === true) {
      setExistingData(response.payload.data[0]);
    }
  };

  const parseValue = (value) => {
    try {
      if (Array.isArray(value)) return value;
      if (typeof value === "string" && value?.trim()?.startsWith("[")) {
        return JSON?.parse(value);
      }
      return value ? [value] : [];
    } catch (error) {
      console.error("Error parsing value:", value, error);
      return [];
    }
  };

  const formatDateOrTime = (value) => {
    if (!value) return "-";
    if (/^\d{2}:\d{2}$/.test(value)) {
      return value;
    }

    try {
      return format(new Date(value), "dd-MM-yyyy");
    } catch (error) {
      return "-";
    }
  };
  // const existingData = getTravelDetaById?.data?.[0];

  useEffect(() => {
    if (editMode && reference_id) {
      setTravelID(existingData?.TRF_ID);

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
          vendorName:
            parseValue(existingData?.TRF_VENDOR)?.toString()?.split(",") || [],
          p_approval_id:
            existingData?.approval_details?.[0]?.TITSM_APPROVAL_ID || 0,
          supervisorId:
            existingData?.approval_details?.[0]?.TITSM_SUPERVISOR_ID || 0,
          reasonChangingSupervisor:
            existingData?.approval_details?.[0]?.TITSM_REASON_FOR_CHANGE || "",
          supervisorEmail:
            existingData?.approval_details?.[0]?.TITSM_APPROVAL_ID == 2
              ? existingData?.approval_details?.[0]?.TITSM_SUPERVISOR_NAME
              : "",
          fileUrl: existingData?.TRF_UPLOADED_DOCS_URL,
        });
        if (
          existingData?.final_vendor_details &&
          existingData.final_vendor_details.length > 0
        ) {
          const mappedTravelDetails = existingData?.final_vendor_details?.map(
            (item, index) => ({
              "S No": index + 1,
              "Vendor Name": item?.TRVD_VENDOR_ID,
              ReferenceID: item?.TRVD_REFERENCE_ID || "",
              BookedBy: item?.booked_by || "",
              DateOfJourney: formatDateOrTime(item?.TRVD_DATE_OF_JOURNEY) || "",
              "From Place": item?.TRVD_FROM_LOCATION || "",
              "To Place": item?.TRVD_TO_LOCATION || "",
              "Flight Name": item?.TRVD_FLIGHT_NAME || "", // Map flight name
              "Journey Class": item?.TRVD_JOURNEY_CLASS || "",
              Time: item?.TRVD_TIME || "",
              Amount: item?.TRVD_TOTAL_AMOUNT || "",
              Documents_File:
                (
                  <a href={item.TRVD_DOCUMENT_FILE_URL} target="_blank">
                    {" "}
                    {item?.TRVD_DOCUMENT_FILE}
                  </a>
                ) || "",
              Remarks: item?.TRVD_REMARKS || "",
            })
          );

          setFinalHodBookingData(existingData?.final_vendor_details);
          setFinalBookVenderData(mappedTravelDetails);
        } else {
          setFinalBookVenderData([]);
        }
      }
    }
  }, [editMode, reference_id, existingData]);

  const memoizedVendorName = useMemo(() => {
    return vendorDetailsNameData?.map((opt) => opt.VENDOR_ID.toString()) || [];
  }, [vendorDetailsNameData]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      vendorName: memoizedVendorName,
    }));
  }, [memoizedVendorName]);

  // Handle vendor name
  const handleVendorNameChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      handleFormChange("vendorName", [...form?.vendorName, value]);
    } else {
      handleFormChange(
        "vendorName",
        form?.vendorName.filter((vendorName) => vendorName !== value)
      );
    }
  };

  // Validation....
  const handleValidDetails = (isSaveLater) => {
    if (!form?.travelerName || !form?.remark?.trim()) {
      return toast.warning("Please fill all mandatory fields marked as *.");
    }
    if (!journeys.length) {
      return toast.warning(
        "Please add at least one journey detail for air travel."
      );
    }
    const isJourneyValid = journeys.every((journey) => {
      if (!journey.date_of_journey) {
        toast.warning("Please fill the 'Date of Journey' for all journeys.");
        return false;
      }
      if (
        typeof journey.from_place !== "string" ||
        !journey.from_place.trim()
      ) {
        toast.warning("Please fill the 'From Place' for all journeys.");
        return false;
      }
      if (typeof journey.to_place !== "string" || !journey.to_place.trim()) {
        toast.warning("Please fill the 'To Place' for all journeys.");
        return false;
      }
      return true;
    });
    if (!isJourneyValid) {
      return;
    }
    const invalidDates = journeys?.some((journey) => {
      const fromDate = new Date(journey.travel_date_from);
      const toDate = new Date(journey.travel_date_to);
      return toDate < fromDate;
    });
    if (invalidDates) {
      return toast.warning(
        "Please ensure all 'To Dates' are not earlier than 'From Dates'."
      );
    }
    if (!editMode && form.vendorName.length === 0) {
      return toast.warning("Please select at least one vendor.");
    }
    if (editMode && !form.p_approval_id && existingData?.TRF_SAVE_LATER == 0) {
      return toast.warning("Please select Approver.");
    }
    // Approver validation
    if (form.p_approval_id == "2") {
      if (!form?.supervisorEmail?.trim()) {
        return toast.warning(
          "Supervisor email is mandatory for Other approver."
        );
      }
      if (!existingData?.final_vendor_details) {
        return toast.warning("Please Book at least one vendor");
      }
    }
    if (form.p_approval_id == "1") {
      if (!HodEmail) {
        return toast.warning("HoD email is mandatory for HoD approver.");
      }
      if (!existingData?.final_vendor_details) {
        return toast.warning("Please Book at least one vendor");
      }
    }
    handleInsertTravelRequest(isSaveLater);
  };
  const handleInsertTravelRequest = async (isSaveLater) => {
    const payload = new FormData();
    const dataToEncrypt = {
      p_travel_id: editMode && reference_id ? travelID : 0,
      p_user_id: savedUserData?.data?.userId,
      p_traveller_name: form.travelerName,
      p_company_id: form.companyName ? form.companyName : 0,
      p_department: form.departmentName ? form.departmentName : 0,
      p_sub_department: form.subDepartmentName ? form.subDepartmentName : 0,
      p_travel_reason: form.travelType ? form.travelType : "",
      p_traveller_employee_id:
        editMode && reference_id ? form?.employeeId : form?.travelerName,
      p_travel_mode_id: 1,
      p_travel_type_id: 0,
      p_frequent_no: 0,
      p_remarks: form.remark,
      p_save_later: isSaveLater ? 1 : 0,
      p_journey_details: JSON.stringify(journeys),
      p_approval_id: form.p_approval_id || "0",
      p_supervisor_name:
        form.p_approval_id == "1" ? HodEmail : form.supervisorEmail || "",
      p_supervisor_id: form.supervisorId || "0",
      p_reason_for_change: form.reasonChangingSupervisor || "",
      p_vendor_id: form.vendorName,
    };
    const encryptPayload = encrypt(dataToEncrypt);
    payload.append("p_file_name", form.fileUpload);
    payload.append("encryptedData", encryptPayload);

    try {
      const response = await dispatch(insertTravelRequestForm(payload));
      if (response?.payload?.success) {
        toast.success(
          response?.payload?.data || "Travel request submitted successfully."
        );
        if (isSaveLater == 1) {
          setTimeout(() => {
            navigate("/InternationalTravelRequest");
          }, 2000);
        } else {
          sendEmails(response?.payload.reference_id);
        }
        setTimeout(() => {
          navigate("/InternationalTravelRequest");
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
  const HodEmail = form?.hod?.length > 0 ? form?.hod[0]?.to : null;
  const defaultVendorEmails = vendorDetailsNameData?.filter((item) =>
    form.vendorName?.includes(item.VENDOR_ID?.toString())
  );
  console.log(defaultVendorEmails, "defaultVendorEmails");
  const vendorEmail = defaultVendorEmails?.map((v) => v.EMAIL_ID);
  console.log(vendorEmail, "vendorEmail");

  const name = Array.isArray(getEmpDropData)
    ? getEmpDropData?.find((item) => item.userId == form.travelerName)
    : null;

  const ccEMails = useMemo(() => {
    const userEmail = savedUserData?.data?.userEmail || "";
    const primaryEmail = name?.userEmail || userEmail;
    const secondaryEmail = name?.rmEmail || primaryEmail;

    if (editMode && finalBookVenderData?.length > 0) {
      return `${userEmail},${secondaryEmail},${primaryEmail}`;
    }

    return `${userEmail}`;
  }, [editMode, finalBookVenderData, savedUserData, name]);

  const currentBaseUrl = new URL(window.location.href).origin;

  const emailBodyForHod = ReactDOMServer?.renderToStaticMarkup(
    <FinalJourneyDetailsOnMail
      finalHodBookingData={finalHodBookingData}
      referenceId={reference_id}
      savedUserData={savedUserData}
      vendor={vendor}
      vendorDetailsNameData={vendorDetailsNameData}
      flightNameMap={flight_name}
      journeyClassOption={journeyClassData}
      timeData={travellerTime}
      name={name}
      currentBaseUrl={currentBaseUrl}
    />
  );

  const emailBodyForVendor = ReactDOMServer?.renderToStaticMarkup(
    <JourneyDetailsToVendorOnMail
      journeys={journeys}
      form={form}
      stopsData={stops}
      timeData={travellerTime}
      mealOptions={meal}
      flightNameMap={flight_name}
      journeyClassOption={journeyClassData}
      name={name}
      bookerName={savedUserData?.data?.name}
    />
  );

  const defaultHODEmails =
    form.p_approval_id == "2"
      ? form?.supervisorEmail
      : form.p_approval_id == "1"
      ? HodEmail
      : null;

  // const fetchSchedulerApi = async (id) => {
  //   const formData = new FormData();
  //   formData.append("attachment", form.fileUpload);
  //   formData.append(
  //     "to",
  //     editMode && finalBookVenderData?.length > 0
  //       ? defaultHODEmails
  //       : vendorEmail
  //   );
  //   formData.append("cc", ccEMails);
  //   formData.append(
  //     "subject",
  //     editMode && finalBookVenderData?.length > 0
  //       ? `International Travel request for ${name?.username}: Req.ID-${reference_id}`
  //       : ` Request for Proposal: Ambit International Travel request: Req.ID-${
  //           id || reference_id
  //         }`
  //   );
  //   formData.append(
  //     "content",
  //     editMode && finalBookVenderData?.length > 0
  //       ? emailBodyForHod
  //       : emailBodyForVendor
  //   );
  //   formData.append("is_file_upload", form.fileUpload instanceof File ? 1 : 0);
  //   await dispatch(addScheduler(formData));
  //   // }
  // };

  const sendEmails = async (id) => {
    const currentBaseUrl = new URL(window.location.href).origin;

    if (editMode && finalBookVenderData?.length > 0) {
      const subject = `International Travel request for ${name?.username}: Req.ID-${reference_id}`;
      const to = defaultHODEmails;
      const cc = ccEMails;
      const content = emailBodyForHod;

      await fetchSchedulerApi(to, cc, subject, content);
    } else {
      const subject = `Request for Proposal: Ambit International Travel request: Req.ID-${id ||reference_id}`;
      for (const vendor of defaultVendorEmails || []) {
        const to = vendor.EMAIL_ID;
        const vendorCCList =
          typeof vendor?.CC_EMAILS === "string"
            ? vendor.CC_EMAILS.split(",")
                .map((e) => e.trim())
                .filter(Boolean)
            : [];

        const ccFromGlobal = ccEMails
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
          
        const finalCCList = Array.from(
          new Set([...vendorCCList, ...ccFromGlobal])
        );

        await fetchSchedulerApi(
          to,
          finalCCList?.join(","),
          subject,
          emailBodyForVendor
        );
      }
    }
  };

  const fetchSchedulerApi = async (to, cc, subject, content) => {
    const formData = new FormData();
    formData.append("attachment", form.fileUpload);
    formData.append("to", to);
    formData.append("cc", cc);
    formData.append("subject", subject);
    formData.append("content", content);
    formData.append("is_file_upload", form.fileUpload instanceof File ? 1 : 0);
    await dispatch(addScheduler(formData));
  };

  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />

      <Row className="mt-3">
        <Col>
          <h4>
            {editMode
              ? "Update Travel Request Form"
              : "New Travel Request Form"}
          </h4>
        </Col>
      </Row>
      <hr />

      <Form>
        <NewTravelRequestFrom
          form={form}
          businesstype={businesstype}
          travellerName={getEmpDropData}
          travelMode="1"
          handleFormChange={handleFormChange}
          editMode={editMode}
          reference_id={reference_id}
          setForm={setForm}
          HodAction={hodview}
        />
        <JourneyBooking
          open={open}
          journeys={journeys}
          setOpen={setOpen}
          travelModeData={travelModeData}
          journeyClassData={journeyClassData}
          editMode={editMode}
          stops={stops}
          travellerTime={travellerTime}
          flight_name={flight_name}
          meal={meal}
          HodAction={hodview}
          setJourneys={setJourneys}
          setVendor={setVendor}
          travelID={travelID}
          finalBookVenderData={finalBookVenderData}
          existingData={existingData}
          reference_id={reference_id}
          parseValue={parseValue}
        />
        <div>
          <div>
            {editMode && existingData?.TRF_SAVE_LATER == 0 ? (
              <VendorForm
                vendor={vendor}
                vendorNameData={vendorDetailsNameData}
                setVendor={setVendor}
                journeyClassData={journeyClassData}
                flight_name={flight_name}
                HodAction={hodview}
                setJourneys={setJourneys}
                reference_id={reference_id}
                finalBookVenderData={finalBookVenderData}
                existingData={existingData}
                setExistingData={setExistingData}
              />
            ) : null}
          </div>
        </div>
        {(!editMode || existingData?.TRF_SAVE_LATER == 1) && (
          <Row className="mt-3">
            <Col md="4">
              <MultiSelectDropdown
                data={vendorDetailsNameData}
                valueKey="VENDOR_ID"
                labelKey="DESCRIPTION"
                value={form.vendorName}
                isDisabled={false}
                selectLabel="Vendor Details"
                label="Vendor Details"
                handleCheckboxChange={handleVendorNameChange}
                defaultchecked={true}
              />
            </Col>
          </Row>
        )}
        {finalBookVenderData.length > 0 && (
          <BookingCommonTravel
            data={finalBookVenderData}
            heading={"Final Booking Details :"}
          />
        )}
        {editMode &&
        existingData?.TRF_SAVE_LATER == 0 &&
        finalBookVenderData.length > 0 ? (
          <ApproverSelector
            form={form}
            handleFormChange={handleFormChange}
            getDepartment_subDepartment={getDepartment_subDepartment}
            setForm={setForm}
            business={businesstype?.data}
            HodAction={hodview}
          />
        ) : null}
        {/* Form Buttons */}
        <Row className="mt-5">
          <Col md="4">
            <CustomSingleButton
              _ButtonText={"Back"}
              onPress={() => navigate("/InternationalTravelRequest")}
              height="40px"
            />
          </Col>
          <Col md="4">
            {!hodview && (
              <CustomSingleButton
                _ButtonText={"Save for Later"}
                onPress={() => {
                  handleValidDetails(1);
                }}
                height="40px"
              />
            )}
          </Col>
          <Col md="4">
            {!hodview && (
              <CustomSingleButton
                _ButtonText={"Submit Tour Request"}
                onPress={() => handleValidDetails(0)}
                height="40px"
              />
            )}
          </Col>
        </Row>
      </Form>
      {loading && <CommonLoader />}
    </div>
  );
};

export default TravelRequestForm;
