import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { insertReverse_Inter } from "../../../../Slices/ReversePickup/ReversePickupSlice";
import { useDispatch, useSelector } from "react-redux";
import InterReversepickupForm from "./InterReversePickupupForm";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import Swal from "sweetalert2";

const IntReversePickupRequestForm = (getAllDetails) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const loading = useSelector(
    (state) => state.ReversePickup.status === "loading"
  );

  const initialFormState = {
    officialOrPersonal: "",
    behalfOf: "",
    accountNumber: "",
    companyName: "",
    address: "",
    streetName: "",
    country: "",
    city: "",
    zipCode: "",
    contactName: "",
    departmentName: "",
    phoneNumber: "",
    mobileNumber: "",
    emailAddress: "",
    ConsigneecompanyName: "",
    Consigneeaddress: "",
    ConsigneestreetName: "",
    Consigneecountry: "",
    Consigneecity: "",
    ConsigneezipCode: "",
    ConsigneecontactName: "",
    ConsigneedepartmentName: "",
    ConsigneephoneNumber: "",
    ConsigneemobileNumber: "",
    ConsigneeemailAddress: "",
    value: null,
    weight: null,
    numberOfBoxes: null,
    dimension: "",
    contents: "",
    specialInstructions: "",
    poNumber: null,
    insurance: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(false);
  useEffect(() => {
    const data = getAllDetails?.getAllDetails;
    if (getAllDetails?.isEditMode?.isEditMode) {
      setFormData({
        officialOrPersonal: data.RPID_OFFICIAL_PERSONAL || "",
        behalfOf: data.RPID_BEHALF_OF || "",
        accountNumber: data.RPID_PICKUP_ACCOUNT_DETAILS || "",
        companyName: data.shipper_details?.[0]?.RIMD_COMPANY_ID || "",
        address: data.shipper_details?.[0]?.RIMD_ADDRESS || "",
        streetName: data.shipper_details?.[0]?.RIMD_STREETNAME || "",
        country: data.shipper_details?.[0]?.RIMD_COUNTRY || "",
        city: data.shipper_details?.[0]?.RIMD_CITY || "",
        zipCode: data.shipper_details?.[0]?.RIMD_ZIP_CODE || "",
        contactName: data.shipper_details?.[0]?.RIMD_CONTACT_NAME || "",
        departmentName: data.shipper_details?.[0]?.RIMD_DEPARTMENT_NAME || "",
        phoneNumber: data.shipper_details?.[0]?.RIMD_PHONE_NO || "",
        mobileNumber: data.shipper_details?.[0]?.RIMD_MOBILE_NO || "",
        emailAddress: data.shipper_details?.[0]?.RIMD_EMAIL_ADDRESS || "",
        ConsigneecompanyName: data.ca_details?.[0]?.RIMD_COMPANY_ID || "",
        Consigneeaddress: data.ca_details?.[0]?.RIMD_ADDRESS || "",
        ConsigneestreetName: data.ca_details?.[0]?.RIMD_STREETNAME || "",
        Consigneecountry: data.ca_details?.[0]?.RIMD_COUNTRY || "",
        Consigneecity: data.ca_details?.[0]?.RIMD_CITY || "",
        ConsigneezipCode: data.ca_details?.[0]?.RIMD_ZIP_CODE || "",
        ConsigneecontactName: data.ca_details?.[0]?.RIMD_CONTACT_NAME || "",
        ConsigneedepartmentName:
          data.ca_details?.[0]?.RIMD_DEPARTMENT_NAME || "",
        ConsigneephoneNumber: data.ca_details?.[0]?.RIMD_PHONE_NO || "",
        ConsigneemobileNumber: data.ca_details?.[0]?.RIMD_MOBILE_NO || "",
        ConsigneeemailAddress: data.ca_details?.[0]?.RIMD_EMAIL_ADDRESS || "",
        value: data.RPID_VALUE || 0,
        weight: data.RPID_WEIGHT || 0,
        numberOfBoxes: data.RPID_NO_OF_CARTON || 0,
        dimension: data.RPID_DIMENSION || "",
        contents: data.RPID_CONTENTS || "",
        specialInstructions: data.RPID_SPECIAL_INSTRUCTION || "",
        poNumber: data.RPID_PO_NUMBER || 0,
        insurance: data.RPID_INSURANCE_BY_DHL || 0,
      });
    }
  }, [getAllDetails]);

  const validateEmail = (email) => {
    const emailPattern =
      /^(?!\d+@)\w+([-+.']\w+)*@(?!\d+\.)\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailPattern.test(email);
  };
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "behalfOf" ||
      name === "accountNumber" ||
      name === "companyName" ||
      name === "address" ||
      name === "streetName" ||
      name === "country" ||
      name === "city" ||
      name === "zipCode" ||
      name === "contactName" ||
      name === "departmentName" ||
      // name === "phoneNumber" ||
      name === "mobileNumber" ||
      name === "phoneNumber" ||
      name === "ConsigneecompanyName" ||
      name === "Consigneeaddress" ||
      name === "ConsigneestreetName" ||
      name === "Consigneecountry" ||
      name === "Consigneecity" ||
      name === "ConsigneezipCode" ||
      name === "ConsigneecontactName" ||
      name === "ConsigneedepartmentName" ||
      name === "ConsigneephoneNumber" ||
      name === "ConsigneemobileNumber" ||
      name === "value" ||
      name === "weight" ||
      name === "numberOfBoxes" ||
      name === "dimension" ||
      name === "contents" ||
      name === "specialInstructions" ||
      name === "poNumber" ||
      name === "insurance"
    ) {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only spaces or dots are not allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }
    if (name === "emailAddress") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailAddress: "Email cannot be empty or contain only spaces.",
        }));
      } else if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailAddress: "Please enter a valid email address.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, emailAddress: "" }));
      }
    }
    if (name === "phoneNumber") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "Only spaces or dots are not allowed.",
        }));
      } else if (/[^0-9]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "Please enter only digits.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: "" }));
      }
    }
    if (name === "ConsigneephoneNumber") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ConsigneephoneNumber: "Only spaces or dots are not allowed.",
        }));
      } else if (/[^0-9]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ConsigneephoneNumber: "Please enter only digits.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ConsigneephoneNumber: "",
        }));
      }
    }
    if (name === "ConsigneeemailAddress") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ConsigneeemailAddress:
            "Email cannot be empty or contain only spaces.",
        }));
      } else if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ConsigneeemailAddress: "Please enter a valid email address.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          ConsigneeemailAddress: "",
        }));
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      travel_id: getAllDetails?.isEditMode?.isEditMode
        ? getAllDetails?.isEditMode?.Id
        : "0",
      user_id: savedUserData.data.userId,
      company_id: savedUserData.data.companyId,
      official_personal: formData?.officialOrPersonal,
      behalf: formData?.behalfOf,
      pickup_account: formData?.accountNumber,
      value: formData?.value,
      weight: formData?.weight,
      no_of_box: formData?.numberOfBoxes,
      dimension: formData?.dimension,
      contents: formData?.contents,
      special_instruction: formData?.specialInstructions,
      po_no: formData?.poNumber,
      insurance: formData?.insurance,
      p_shiper_details: {
        company_name: formData?.companyName,
        address: formData?.address,
        street_name: formData?.streetName,
        country: formData?.country,
        city: formData?.city,
        zip_code: formData?.zipCode,
        contact_name: formData?.contactName,
        department_name: formData?.departmentName,
        phone_no: formData?.phoneNumber,
        mobile_no: formData?.mobileNumber || 0,
        email_address: formData?.emailAddress,
      },
      p_consigner_details: {
        company_name: formData?.ConsigneecompanyName,
        address: formData?.Consigneeaddress,
        street_name: formData?.ConsigneestreetName,
        country: formData?.Consigneecountry,
        city: formData?.Consigneecity,
        zip_code: formData?.ConsigneezipCode,
        contact_name: formData?.ConsigneecontactName,
        department_name: formData?.ConsigneedepartmentName,
        phone_no: formData?.ConsigneephoneNumber,
        mobile_no: formData?.ConsigneemobileNumber || 0,
        email_address: formData?.ConsigneeemailAddress,
      },
    };
    setLoader(true);
    const startTime = Date.now();
    try {
      const response = await dispatch(insertReverse_Inter(payload));
      if (response?.payload?.success === true) {
        toast.success(response?.payload?.data);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(1500 - elapsedTime, 0);
        setTimeout(() => {
          setLoader(false);
          navigate("/reversepickup");
        }, remainingTime);
        if (!getAllDetails?.isEditMode?.isEditMode) {
          setFormData(initialFormState);
        }
      } else {
        toast.error(response?.payload?.message);
      }
    } catch (error) {
      setLoader(false);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  const isFormValid = () => {
    const {
      officialOrPersonal,
      behalfOf,
      accountNumber,
      companyName,
      address,
      // formData.streetName,
      country,
      city,
      zipCode,
      // formData.contactName,
      // formData.departmentName,
      phoneNumber,
      // emailAddress,
      // formData.mobileNumber,
      // formData.emailAddress,
      ConsigneecompanyName,
      Consigneeaddress,
      // formData.ConsigneestreetName,
      Consigneecountry,
      Consigneecity,
      ConsigneezipCode,
      // formData.ConsigneecontactName,
      // formData.ConsigneedepartmentName,
      ConsigneephoneNumber,
      // formData.ConsigneemobileNumber,
      // formData.ConsigneeemailAddress,
    } = formData;

    // Check if all required fields have a value
    // return requiredFields.every((field) =>
    //   typeof field === "string" ? field.trim() !== "" : !!field
    // );
    return (
      officialOrPersonal !== "" &&
      officialOrPersonal !== null &&
      behalfOf &&
      accountNumber &&
      companyName &&
      !errors.companyName &&
      address &&
      !errors.address &&
      // emailAddress &&
      !errors.emailAddress &&
      country &&
      city &&
      !errors.city &&
      zipCode &&
      !errors.zipCode &&
      phoneNumber &&
      !errors.phoneNumber &&
      ConsigneecompanyName &&
      !errors.ConsigneecompanyName &&
      Consigneeaddress &&
      !errors.Consigneeaddress &&
      Consigneecountry &&
      !errors.Consigneecountry &&
      Consigneecity &&
      !errors.Consigneecity &&
      ConsigneezipCode &&
      !errors.ConsigneezipCode &&
      ConsigneephoneNumber &&
      !errors.ConsigneephoneNumber
    );
  };

  const handleCancleNavigation = async () => {
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
      navigate("/reversepickup");
    }
  };

  return (
    <>
      {loader && <CommonLoader />}
      <InterReversepickupForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        isFormValid={isFormValid}
        handleCancle={() => handleCancleNavigation()}
        errors={errors}
        getAllDetails={getAllDetails}
      />
      <ToastContainer />
    </>
  );
};

export default IntReversePickupRequestForm;
