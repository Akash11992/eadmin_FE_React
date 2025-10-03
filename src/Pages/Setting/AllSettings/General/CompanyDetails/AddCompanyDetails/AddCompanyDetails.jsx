import React, { useState, useRef, useEffect } from "react";
import "./AddCompanyDetail.css";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "react-phone-input-2";
import { useLocation } from "react-router-dom";
import {
  getCountries,
  getStates,
  getCities,
  getCompanyType,
  getIndustryTypes,
  getEmployeeCount,
} from "../../../../../../Slices/Commondropdown/CommondropdownSlice";
import { useNavigate } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Title } from "../../../../../../Components/Title/Title";
import CustomInput from "../../../../../../Components/CustomInput/CustomInput";
import CommonLoader from "../../../../../../Components/CommonLoader/CommonLoader";
import CustomDropdown from "../../../../../../Components/CustomDropdown/CustomDropdown";
import { getBusinessTypes } from "../../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import { createcompanyDetail } from "../../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import { updateCompanyDetail } from "../../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import CustomSingleButton from "../../../../../../Components/CustomSingleButton/CustomSingleButton";
import MultiSelectDropdown from "../../../../../../Components/CustomDropdown/MultiSelectDropdown";

const AddCompanyDetails = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [companyTypeOptions, setCompanyTypeOptions] = useState([]);
  const [employeeCountOptions, setEmployeeCountOptions] = useState([]);
  const countries = useSelector((state) => state.CommonDropdownData.countries);
  const states = useSelector((state) => state.CommonDropdownData.states);
  const cities = useSelector((state) => state.CommonDropdownData.cities);
  const loading = useSelector(
    (state) => state.companyDetail.status === "loading"
  );
  const location = useLocation();
  const updateGetData = location.state?.sendData;
  // console.log('updateGetData',updateGetData)

  const [formData, setFormData] = useState({
    companyName: updateGetData ? updateGetData?.company_name : "",
    companyEmail: updateGetData ? updateGetData?.company_email : "",
    contact: updateGetData ? updateGetData?.contact_number : "",
    portal: updateGetData ? updateGetData?.portal : "",
    industryId: updateGetData ? updateGetData?.industry_id : "",
    employeeCountId: updateGetData ? updateGetData?.employee_count_id : "",
    business: [],
    companyTypeValue: updateGetData ? updateGetData?.company_type_id : "",
    logo: updateGetData ? updateGetData?.logo_url : null,
    countryId: updateGetData ? updateGetData?.country_id : null,
    stateId: updateGetData ? updateGetData?.state_id : null,
    cityId: updateGetData ? updateGetData?.city_id : null,
    postalCode: updateGetData ? updateGetData?.postal_code : "",
    address: updateGetData ? updateGetData?.address : "",
  });
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );

  const [errors, setErrors] = useState({
    companyName: "",
    companyEmail: "",
    portal: "",
    postalCode: "",
  });

  // useEffect code are here...
  useEffect(() => {
    fetchIndustryType();
    fetchEmployeeCount();
    fetchCompanyType();
    dispatch(getCountries());
    fetchbusinesstype();
  }, [dispatch]);

  // country , city , state functionlity code here...
  useEffect(() => {
    if (formData.countryId) {
      dispatch(getStates(formData.countryId));
    }
  }, [formData.countryId, dispatch]);

  useEffect(() => {
    if (formData.stateId && formData.countryId) {
      dispatch(
        getCities({ countryId: formData.countryId, stateId: formData.stateId })
      );
    }
  }, [formData.stateId, formData.countryId, dispatch]);

  // fetch all business from get apis...
  const fetchbusinesstype = async () => {
    await dispatch(getBusinessTypes());
  };
  const fetchIndustryType = async () => {
    const response = await dispatch(getIndustryTypes());
    if (response.payload && response.payload.success) {
      const transformedData = [
        { idindustry_typ_id: "", industry_typ_name: "Select Industry" },
        ...response.payload.data.map((industry) => ({
          idindustry_typ_id: industry.idindustry_typ_id,
          industry_typ_name: industry.industry_typ_name,
        })),
      ];
      setIndustryOptions(transformedData);
    }
  };

  // fetch all company type from get apis...
  const fetchCompanyType = async () => {
    const response = await dispatch(getCompanyType());
    console.log('response....',response)
    if (response.payload && response.payload.success) {
      const transformedData = [
        { value: "", label: "Select Company Type" },
        ...response.payload.data.map((company) => ({
          value: company.company_type_id,
          label: company.company_type,
        })),
      ];
      setCompanyTypeOptions(transformedData);
    }
  };

  // fetch all employee count from get apis...
  const fetchEmployeeCount = async () => {
    const response = await dispatch(getEmployeeCount());
    if (response.payload && response.payload.success) {
      const transformedData = [
        { employee_count_id: "", employee_range: "Select Employee Count" },
        ...response.payload.data.map((employee) => ({
          employee_count_id: employee.employee_count_id,
          employee_range: employee.employee_range,
        })),
      ];
      setEmployeeCountOptions(transformedData);
    }
  };

  // handle delete function code here....
  const handleCompanyUpdate = async () => {
    const apiData = {
      companyId: updateGetData.company_id,
      companyName: formData.companyName,
      companyEmail: formData.companyEmail,
      contact: formData.contact,
      portal: formData.portal,
      industryId: formData.industryId,
      employeeCountId: formData.employeeCountId,
      business: formData.business.map(Number),
      countryId: formData.countryId,
      logo: formData.logo,
      stateId: formData.stateId,
      cityId: formData.cityId,
      postalCode: formData.postalCode,
      address: formData.address,
      company_type_id: 1,
      taxInfo: null,
      taxTypId: null,
    };

    const response = await dispatch(updateCompanyDetail(apiData));
    if (updateCompanyDetail.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 201) {
        toast.success(response.payload.message);
        setTimeout(() => {
          navigate("/companyDetails");
        }, 1000);
      }
    } else if (updateCompanyDetail.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
    return null;
  };

  //email format rejex define here.....
  const validateEmail = (email) => {
    const emailPattern =
      /^(?!\d+@)\w+([-+.']\w+)*@(?!\d+\.)\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailPattern.test(email);
  };

  // handle all input code here ...
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation for few field.......
    if (name === "companyName" || name === "portal" || name === "postalCode") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only spaces or dots are not allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }

    // company Email validation
    if (name === "companyEmail") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyEmail: "company Email cannot be empty or contain only spaces.",
        }));
      } else if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyEmail: "Please enter a valid company email address.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, companyEmail: "" }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // handle business code here..
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const currentBusiness = Array.isArray(prev.business) ? prev.business : [];
      let updatedBusiness;
      if (checked) {
        updatedBusiness = [...currentBusiness, value];
      } else {
        updatedBusiness = currentBusiness.filter((id) => id !== value);
      }
      console.log("Updated business array:", updatedBusiness); 
      return { ...prev, business: updatedBusiness };
    });
  };
  
  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  // handle contact no code here ...
  const handlePhoneNumberChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      contact: value,
    }));
  };

  const isFormValid = () => {
    const {
      companyName,
      companyEmail,
      contact,
      portal,
      industryId,
      employeeCountId,
      countryId,
      // business,
      stateId,
      cityId,
      postalCode,
      address,
    } = formData;

    return (
      companyName &&
        !errors.companyName &&
        validateEmail(companyEmail) &&
        !errors.companyEmail &&
        contact &&
        portal &&
        !errors.portal &&
        industryId &&
        employeeCountId &&
        countryId &&
        countryId &&
        // business &&
        stateId &&
        cityId &&
        postalCode,
      !errors.postalCode && address
    );
  };

  // handle add company button functionlity code here ...
  const handleSkip = async (e) => {
    e.preventDefault();
    if (!Array.isArray(formData.business)) {
      formData.business = formData.business ? [formData.business] : [];
    }
    const apiData = {
      companyName: formData.companyName,
      companyEmail: formData.companyEmail,
      contact: formData.contact,
      portal: formData.portal,
      industryId: formData.industryId,
      employeeCountId: formData.employeeCountId,
      company_type_id:formData.companyTypeValue,
      countryType:formData.countryType,
      business: formData.business,
      countryId: formData.countryId,
      logo: formData.logo,
      stateId: formData.stateId,
      cityId: formData.cityId,
      postalCode: formData.postalCode,
      address: formData.address,
      taxTypId: null,
      taxInfo: null,
    };

    const response = await dispatch(createcompanyDetail(apiData));
    if (createcompanyDetail.fulfilled.match(response)) {
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.message);
        setTimeout(() => {
          navigate("/companyDetails");
        }, 2000);
      }
    } else if (createcompanyDetail.rejected.match(response)) {
      const errorMessage =
        response.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  // Filter the full business objects for display in the Multiselect based on selected IDs
  const selectedBusinessObjects = businesstype?.data?.filter((business) =>
    formData?.business?.includes(business.businessId)
  );

  const handleCancle = (e) => {
    e.preventDefault();
    setFormData({
      countryId: null,
      stateId: null,
      cityId: null,
    });
    navigate("/companyDetails");
  };

  return (
    <div className="bookmakerTable border rounded-3">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Container fluid>
        <Row className="mt-3 ms-0">
          <Title title="Company Details" />
        </Row>
        <hr />
        <Row>
          <Col md={12}>
            <div className="content-wrapper">
              <div className="card-body">
                <Form>
                  <Row>
                    <Col md={4} className="form-group">
                      <CustomInput
                        labelName="Company Name"
                        type="text"
                        name="companyName"
                        placeholder="Enter your Company Name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        mandatoryIcon={true}
                      />
                      {errors?.companyName && (
                        <small className="text-danger">
                          {errors?.companyName}
                        </small>
                      )}
                    </Col>

                    <Col md={4} className="form-group">
                      <CustomInput
                        labelName="Company Email"
                        type="email"
                        name="companyEmail"
                        value={formData.companyEmail}
                        placeholder="Company Email"
                        onChange={handleInputChange}
                        mandatoryIcon={true}
                        isDisable={updateGetData ? true : false}
                      />
                      {errors?.companyEmail && (
                        <small className="text-danger">
                          {errors?.companyEmail}
                        </small>
                      )}
                    </Col>

                    <Col md={4} className="form-group">
                      <Form.Label>Contact No</Form.Label>
                      <span className="text-danger">*</span>
                      <PhoneInput
                        country={"in"}
                        // defaultCountry="in"
                        name="contact"
                        countryCode
                        format
                        placeholder="+91-0000-55-00"
                        value={formData.contact}
                        onChange={handlePhoneNumberChange}
                        inputClass="your-custom-input-class shadow-none border-secondary-subtle"
                        dropdownClass="your-custom-dropdown-class"
                      />
                    </Col>

                    <Col md={4} className="form-group mt-2">
                      <CustomInput
                        labelName="Portal Name"
                        type="url"
                        name="portal"
                        value={formData.portal}
                        placeholder="Portal Name"
                        onChange={handleInputChange}
                        mandatoryIcon={true}
                        isDisable={updateGetData ? true : false}
                      />
                      {errors?.portal && (
                        <small className="text-danger">{errors?.portal}</small>
                      )}
                    </Col>

                    <Col md={4} className="form-group mt-2">
                      <CustomDropdown
                        dropdownLabelName="Industry"
                        options={industryOptions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            industryId: e.target.value,
                          })
                        }
                        selectedValue={formData.industryId || ""}
                        mandatoryIcon={true}
                        valueKey="idindustry_typ_id"
                        labelKey="industry_typ_name"
                      />
                    </Col>

                    <Col md={4} className="form-group mt-2">
                      <CustomDropdown
                        dropdownLabelName="Employee Count"
                        options={employeeCountOptions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeCountId: e.target.value,
                          })
                        }
                        selectedValue={formData.employeeCountId || ""}
                        mandatoryIcon={true}
                        valueKey="employee_count_id"
                        labelKey="employee_range"
                      />
                    </Col>

                    <Col md={4} className="form-group mt-2">
                      <CustomDropdown
                        dropdownLabelName="Company Type"
                        options={companyTypeOptions}
                        onChange={(e) =>{
                          const selectedValue = e.target.value;
                          console.log("Selected Value:", selectedValue);
                          setFormData({
                            ...formData,
                            companyTypeValue: selectedValue,
                          })
                        }}
                        selectedValue={formData.companyTypeValue || ""}
                        mandatoryIcon={true}
                        valueKey="value"
                        labelKey="label"
                      />
                    </Col>
                    <Col md={4} className="form-group mt-2">
                      <MultiSelectDropdown
                        data={businesstype?.data || []}
                        valueKey="businessId" 
                        labelKey="businessName" 
                        label="Business Name" 
                        selectLabel="Select Business" 
                        value={formData.business || []}
                        handleCheckboxChange={handleCheckboxChange}
                      />
                    </Col>

                    <Col md={4} className="form-group mt-2">
                      <CustomInput
                        labelName="Company Logo"
                        type="file"
                        placeholder="No file chosen"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      Upload Company Logo
                    </Col>
                  </Row>
                  <br />
                  <hr />
                  <h4>address</h4>
                  <hr />
                  <Row>
                    <Col md={4} className="form-group">
                      <CustomDropdown
                        dropdownLabelName="Country"
                        options={[
                          { value: "", label: "Select Country" },
                          ...countries.map((country) => ({
                            value: country.cm_id,
                            label: country.cm_name,
                          })),
                        ]}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            countryId: e.target.value,
                            stateId: "",
                            cityId: "",
                          });
                        }}
                        selectedValue={formData.countryId || null}
                        mandatoryIcon={true}
                        valueKey="value"
                        labelKey="label"
                      />
                    </Col>

                    <Col md={4} className="form-group">
                      <CustomDropdown
                        dropdownLabelName="State/Province"
                        options={states.map((state) => ({
                          value: state.state_id,
                          label: state.state_name,
                        }))}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            stateId: e.target.value,
                            cityId: "",
                          });
                        }}
                        selectedValue={formData.stateId || null}
                        mandatoryIcon={true}
                        valueKey="value"
                        labelKey="label"
                      />
                    </Col>

                    <Col md={4} className="form-group">
                      <CustomDropdown
                        dropdownLabelName="City"
                        options={cities.map((city) => ({
                          value: city.city_id,
                          label: city.city_name,
                        }))}
                        onChange={(e) =>
                          setFormData({ ...formData, cityId: e.target.value })
                        }
                        selectedValue={formData.cityId || null}
                        mandatoryIcon={true}
                        valueKey="value"
                        labelKey="label"
                      />
                    </Col>
                    <Col md={4} className="form-group mt-2">
                      <CustomInput
                        labelName="ZIP/PIN Code"
                        type="numeric"
                        // type="number"
                        value={formData.postalCode}
                        name="postalCode"
                        placeholder="ZIP/PIN Code"
                        onChange={handleInputChange}
                        mandatoryIcon={true}
                        maxLength={6}
                      />
                      {errors?.postalCode && (
                        <small className="text-danger">
                          {errors?.postalCode}
                        </small>
                      )}
                    </Col>

                    <Col md={4} className="form-group">
                      <Form.Label className="pt-1 m-1">
                        Street address
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Street address"
                        className="shadow-none border-secondary-subtle"
                        value={formData.address}
                        name="address"
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3 mb-3 justify-content-end">
                    <Col md={2}>
                      <CustomSingleButton
                        _ButtonText="Cancel"
                        height={40}
                        backgroundColor="#fff"
                        Text_Color="#000"
                        borderColor="gray"
                        onPress={handleCancle}
                      />
                    </Col>
                    <Col md={2}>
                      <CustomSingleButton
                        _ButtonText={updateGetData ? "Update for Now" : "Save"}
                        height={40}
                        disabled={!isFormValid()}
                        onPress={
                          updateGetData ? handleCompanyUpdate : handleSkip
                        }
                      />
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
        {loading && <CommonLoader />}
      </Container>
    </div>
  );
};

export default AddCompanyDetails;
