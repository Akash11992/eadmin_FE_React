import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import DomReversepickupForm from "./DomReversepickupForm";
import { insertReverse_Dom } from "../../../../Slices/ReversePickup/ReversePickupSlice";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const DomReversePickupRequestForm = (getAllDetails) => {
  console.log(getAllDetails?.isEditMode?.Id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const loading = useSelector(
    (state) => state.ReversePickup.status === "loading"
  );
  const [formData, setFormData] = useState({
    officialOrPersonal: "",
    behalfOf: "",
    accountNumber: "",
    weightOfShipment: "",
    numberOfBox: null,
    modeOfTransport: "",
    pointOfContact: "",
    pickupAddress: "",
    deliveryAddress: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const data = getAllDetails?.getAllDetails;
    console.log(getAllDetails?.isEditMode?.isEditMode, "[[[[[data");
    if (getAllDetails?.isEditMode?.isEditMode) {
      setFormData({
        officialOrPersonal: data.RPD_OFFICIAL_PERSONAL,
        behalfOf: data.RPD_BEHALF_OF,
        accountNumber: data?.RPD_ACCOUNT_NO,
        weightOfShipment: data?.RPD_WEIGHT_OF_SHIPMENT,
        numberOfBox: data?.RPD_NO_OF_BOX,
        modeOfTransport: data?.RPD_MODE_OF_TRANSPORT,
        pointOfContact: data?.RPD_POINT_OF_CONTACT,
        pickupAddress: data?.RPD_PICKUP_ADDRESS,
        deliveryAddress: data?.RPD_DELEIVERY_ADDRESS,
      });
    }
  }, [getAllDetails]);
  const handleSaveDetails = async () => {
    const payload = {
      reverse_id: getAllDetails?.isEditMode?.isEditMode
        ? getAllDetails?.isEditMode?.Id
        : "0",
      user_id: savedUserData.data.userId,
      company_id: savedUserData.data.companyId,
      Request_type: "1",
      request_P_I: "0",
      official_personal: formData.officialOrPersonal,
      behalf_of: formData.behalfOf,
      account_no: formData.accountNumber,
      weight_of_shipment: formData.weightOfShipment,
      no_of_box: formData.numberOfBox,
      mode_of_transport: formData.modeOfTransport,
      point_of_contact: formData.pointOfContact,
      account_no_2: "",
      pickup_address: formData.pickupAddress,
      delievery_address: formData.deliveryAddress,
    };
    setLoader(true);
    const startTime = Date.now();
    try {
      const response = await dispatch(insertReverse_Dom(payload));
      if (response?.payload?.success === true) {
        toast.success(response?.payload?.data);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(1500 - elapsedTime, 0);

        setTimeout(() => {
          setLoader(false);
          navigate("/reversepickup");
        }, remainingTime);
      } else {
        toast.error(response?.payload?.data);
      }
    } catch (error) {
      setLoader(false);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const isFormValid = () => {
    // const requiredFields = [
    //   formData.officialOrPersonal,
    //   formData.behalfOf,
    //   formData.accountNumber,
    // ];
    const { officialOrPersonal, behalfOf, accountNumber } = formData;
    // Check if all required fields have a value
    // return requiredFields.every((field) =>
    //   typeof field === "string" ? field.trim() !== "" : !!field
    // );
    // return (
    //   officialOrPersonal && behalfOf && accountNumber
    // )
    return (
      officialOrPersonal !== "" &&
      officialOrPersonal !== null &&
      behalfOf &&
      accountNumber
    );
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
      navigate("/reversepickup");
    }
  };

  return (
    <>
      {loader && <CommonLoader />}
      <DomReversepickupForm
        formData={formData}
        handleInputChange={handleInputChange}
        handleSaveDetails={handleSaveDetails}
        isFormValid={isFormValid}
        handleCancle={() => {
          handleCancle();
        }}
      />
      <ToastContainer />
    </>
  );
};

export default DomReversePickupRequestForm;
