import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import {
  getCountries,
  getStates,
  getCities,
  getcategorydropdown,
} from "../../../Slices/Commondropdown/CommondropdownSlice";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { getSubCategorydropdown } from "../../../Slices/Commondropdown/CommondropdownSlice";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { createVendor } from "../../../Slices/VendorManagement/VendorManagementSlice";
import { updateVendordata } from "../../../Slices/VendorManagement/VendorManagementSlice";
import { fetchEmpDropDownData } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import VMComponent from "../VMComponent/VMComponent";
import Swal from "sweetalert2";
import { Title } from "../../../Components/Title/Title";

const AddVendor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const userToEdit = location.state || null;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // const updateCatchData = location.state?.vendorUserData;
  const vendorUserData = location.state?.vendorUserData[0] || {};
  console.log(vendorUserData, "vendorUserData");
  const dispatch = useDispatch();
  const { countries, states, cities, categorys, subcategories } = useSelector(
    (state) => state.CommonDropdownData
  );
  const countryDropdown = countries?.data;
  const stateDropdown = states?.data;
  const cityDropdown = cities?.data;
  const categoriesData = categorys?.data?.data;
  const subcategoriesFindData = subcategories?.data?.data;
  const [isPreferredVendor, setIsPreferredVendor] = useState(
    vendorUserData ? vendorUserData?.PREFERRED_VENDOR : false
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    vendorUserData ? vendorUserData?.SUB_CATEGORY_ID : ""
  );
  const { getEmpDropData } = useSelector((state) => state.TravelManagement);
  const [formData, setFormData] = useState({
    supplierCode: vendorUserData ? vendorUserData?.SUPPLIER_CODE : "",
    accountCode: vendorUserData ? vendorUserData?.ACCOUNT_CODE : "",
    accountType: vendorUserData ? vendorUserData?.ACCOUNT_TYPE : "",
    selectedCategory: vendorUserData ? vendorUserData?.CATEGORY_ID : null,
    // subCategoryId: null,
    description: vendorUserData ? vendorUserData?.SHORT_HEADING : "",
    firstName: vendorUserData ? vendorUserData?.FIRST_NAME : "",
    lastName: vendorUserData ? vendorUserData?.LAST_NAME : "",
    responsibility: vendorUserData ? vendorUserData?.RESPONSE_ID : "",
    companyName: vendorUserData ? vendorUserData?.DESCRIPTION : "",
    preferredVendor: vendorUserData ? vendorUserData?.PREFERRED_VENDOR : null,
    addressLine: vendorUserData ? vendorUserData?.ADDR_LINE : "",
    cityId: vendorUserData ? vendorUserData?.CITY : null,
    stateId: vendorUserData ? vendorUserData?.STATE : null,
    postalCode: vendorUserData ? vendorUserData?.POSTAL_CODE : null,
    countryId: vendorUserData ? vendorUserData?.COUNTRY : null,
    phoneNo: vendorUserData ? vendorUserData?.PHONE_NO : "",
    mobileNo: vendorUserData ? vendorUserData?.MOBILE_NO : "",
    emailId: vendorUserData ? vendorUserData?.EMAIL_ID : "",
    logo: null,
    otherEmails:
      typeof vendorUserData?.CC_EMAILS === "string"
        ? vendorUserData.CC_EMAILS.split(",").filter(
            (email) => email?.trim() !== ""
          )
        : [],
  });
  const [multiEmailInput, setMultiEmailInput] = useState("");
  const gstOptions = [
    { value: "", label: "Select a GST treatmen" },
    { value: "registered_regular", label: "Registered Business - Regular" },
    {
      value: "registered_composition",
      label: "Registered Business - Composition",
    },
    { value: "unregistered", label: "Unregistered Business" },
  ];

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (emailId) => {
    const emailPattern =
      /^(?!\d+@)\w+([-+.']\w+)*@(?!\d+\.)\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailPattern.test(emailId);
  };
  console.log(formData?.otherEmails, multiEmailInput);
  const addEmail = (email) => {
    const trimmed = email?.trim();
    if (trimmed === "") return;

    if (!validateEmail(trimmed)) {
      setErrors("Invalid email address");
      return;
    }

    if (formData?.otherEmails?.includes(trimmed)) {
      setErrors("Email already added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      otherEmails: [...prev?.otherEmails, trimmed],
    }));
    setMultiEmailInput("");
    setErrors("");
  };

  const handleMultiEmailChange = (e) => {
    const value = e.target.value;
    const parts = value?.split(",");
    const last = parts[parts?.length - 1];

    // Update the current typing part only
    setMultiEmailInput(last);

    // Add all valid previous parts
    parts?.slice(0, -1).forEach((email) => addEmail(email));
  };

  const handleKeyDown = (e) => {
    if (["Enter", ",", " "]?.includes(e.key)) {
      e.preventDefault();
      addEmail(multiEmailInput);
    }
    if (e.key === "Backspace" && multiEmailInput?.trim() === "") {
      const emails = [...formData?.otherEmails];
      if (emails?.length > 0) {
        const lastEmail = emails.pop();
        setFormData((prev) => ({
          ...prev,
          otherEmails: emails,
        }));
        setMultiEmailInput(lastEmail + ", ");
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const emails = paste.split(/[\s,;]+/);
    const valid = [];
    const invalid = [];

    emails.forEach((email) => {
      const trimmed = email.trim();
      if (!trimmed) return;
      if (validateEmail(trimmed)) {
        if (!formData.otherEmails.includes(trimmed)) {
          valid.push(trimmed);
        }
      } else {
        invalid.push(trimmed);
      }
    });

    if (valid.length > 0) {
      setFormData((prev) => ({
        ...prev,
        otherEmails: [...prev.otherEmails, ...valid],
      }));
    }

    setMultiEmailInput("");
    if (invalid.length > 0) {
      setErrors(`Invalid emails: ${invalid.join(", ")}`);
    } else {
      setErrors("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target || e;

    if (name === "supplierCode") {
      if (/[^a-zA-Z0-9]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          supplierCode: "Only letters and numbers are allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, supplierCode: "" }));
      }
    }

    if (name === "accountCode") {
      if (/[^a-zA-Z0-9]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          accountCode: "Only numbers are allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, accountCode: "" }));
      }
    }

    if (name === "accountType") {
      if (/[^a-zA-Z]/.test(value) || value.length > 1) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          accountType: "Only a single alphabet is allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, accountType: "" }));
      }
    }
    if (name === "firstName" || name === "lastName" || name === "companyName") {
      if (/[^a-zA-Z\s]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only alphabets are allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }
    if (name === "description") {
      if (/[^a-zA-Z0-9\s]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only alphabets are allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }

    if (name === "mobileNo" || name === "phoneNo") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only spaces or dots are not allowed.",
        }));
      } else if (/[^0-9]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Please enter only digits.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }

    if (name === "emailId") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailId: "Email cannot be empty or contain only spaces.",
        }));
      } else if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailId: "Please enter a valid email address.",
        }));
      } else if (value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailId: "",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, emailId: "" }));
      }
    }

    if (name === "postalCode") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          postalCode: "Only spaces or dots are not allowed.",
        }));
      } else if (/[^0-9]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          postalCode: "Please enter only digits.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, postalCode: "" }));
      }
    }
    if (name === "description" || name === "phoneNo") {
      if (/^[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only spaces or dots are not allowed.",
        }));
      } else if (/[^a-zA-Z0-9\s]/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Special characters are not allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    dispatch(getCountries());
    fetchCategorydropdown();
    dispatch(fetchEmpDropDownData());
  }, [dispatch]);

  useEffect(() => {
    if (formData.countryId) {
      dispatch(getStates(formData.countryId));
    }
  }, [formData.countryId, dispatch]);

  useEffect(() => {
    if (formData.selectedCategory) {
      dispatch(getSubCategorydropdown(formData.selectedCategory));
    }
  }, [formData.selectedCategory]);

  useEffect(() => {
    if (formData.stateId && formData.countryId) {
      dispatch(
        getCities({ countryId: formData.countryId, stateId: formData.stateId })
      );
    }
  }, [formData.stateId, formData.countryId, dispatch]);

  const fetchCategorydropdown = async () => {
    await dispatch(getcategorydropdown());
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = {
      supplierCode: formData.supplierCode,
      accountCode: formData.accountCode,
      accountType: formData.accountType,
      categoryId: formData.selectedCategory,
      subCategoryId: selectedSubCategory,
      description: formData.companyName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      shortHeading: formData?.description,
      preferredVendor: isPreferredVendor,
      addressLine: formData.addressLine,
      city: formData.cityId,
      state: formData.stateId,
      postalCode: formData.postalCode,
      country: formData.countryId,
      phoneNo: formData.phoneNo,
      mobileNo: formData.mobileNo,
      emailId: formData.emailId,
      response_id: formData.responsibility,
      ccEmails: formData.otherEmails,
    };

    try {
      const response = await dispatch(createVendor(userData));
      setLoading(false);
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload.message || "User created successfully!");
        setTimeout(() => {
          navigate("/vendorManagement");
        }, 2000);
      } else {
        toast.error(response.error.message || "Failed to create user");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      vendor_id: vendorUserData.VENDOR_ID,
      supplier_code: formData.supplierCode,
      account_code: formData.accountCode,
      account_type: formData.accountType,
      category_id: formData.selectedCategory,
      sub_category_id: selectedSubCategory,
      description: formData.companyName,
      first_name: formData.firstName,
      last_name: formData.lastName,
      shortHeading: formData?.description,
      preferred_vendor: isPreferredVendor,
      addr_line: formData.addressLine,
      city: formData.cityId,
      state: formData.stateId,
      postal_code: formData.postalCode,
      country: formData.countryId,
      phone_no: formData.phoneNo,
      mobile_no: formData.mobileNo,
      email_id: formData.emailId,
      response_id: formData.responsibility,
      ccEmails: formData.otherEmails,
    };

    try {
      const response = await dispatch(
        updateVendordata({ ...userData, vendorId: vendorUserData?.vendorId })
      );
      setLoading(false);
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload.message || "User updated successfully!");
        setTimeout(() => {
          navigate("/vendorManagement");
        }, 2000);
      } else {
        toast.error(response.error.message || "Failed to update user");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userToEdit) {
      handleUpdateUser(e);
    } else {
      handleCreateUser(e);
    }
  };
  const isFormValid = () => {
    const {
      supplierCode,
      accountCode,
      accountType,
      selectedCategory,
      description,
      firstName,
      lastName,
      companyName,
      // preferredVendor,
      addressLine,
      cityId,
      stateId,
      postalCode,
      phoneNo,
      mobileNo,
      emailId,
    } = formData;

    return (
      supplierCode &&
      accountCode &&
      accountType &&
      selectedCategory &&
      description &&
      firstName &&
      lastName &&
      companyName &&
      // preferredVendor &&
      addressLine &&
      cityId &&
      stateId &&
      postalCode &&
      !errors.postalCode &&
      phoneNo &&
      mobileNo &&
      !errors.mobileNo &&
      emailId &&
      !errors.emailId
    );
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const handleClose = async () => {
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
      navigate("/vendorManagement");
    }
  };

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <div className="mt-4">
        <Form>
          <Title title={userToEdit ? "Edit Vendor" : "Add Vendor"} />
          <hr />

          <div>
            <VMComponent
              formData={formData}
              handleInputChange={handleInputChange}
              errors={errors}
              categoriesData={categoriesData}
              subcategoriesFindData={subcategoriesFindData}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
              getEmpDropData={getEmpDropData}
              handleFormChange={handleFormChange}
              gstOptions={gstOptions}
              countryDropdown={countryDropdown}
              stateDropdown={stateDropdown}
              cityDropdown={cityDropdown}
              setFormData={setFormData}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              isPreferredVendor={isPreferredVendor}
              setIsPreferredVendor={setIsPreferredVendor}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              multiEmailInput={multiEmailInput}
              handleMultiEmailChange={handleMultiEmailChange}
            />
          </div>

          <Row className="mt-3 mb-3 justify-content-end m-0">
            <Col md={8}></Col>
            <Col className="row">
              <Col md={2}></Col>
              <Col md={5}>
                <CustomSingleButton
                  _ButtonText={userToEdit ? "Update" : "Submit"}
                  height={40}
                  onPress={handleSubmit}
                  disabled={!isFormValid()}
                />
              </Col>
              <Col md={5}>
                <CustomSingleButton
                  onPress={handleClose}
                  _ButtonText="Cancel"
                  backgroundColor="red"
                  Text_Color="#fff"
                  height={40}
                  width="auto"
                />
              </Col>
            </Col>
          </Row>
        </Form>
      </div>
      {loading && <CommonLoader />}
    </div>
  );
};

export default AddVendor;
