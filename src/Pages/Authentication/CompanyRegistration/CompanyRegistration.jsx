import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { CompanyDetails } from "../../../Slices/Authentication/AuthenticationSlice";
import {
  getIndustryTypes,
  getEmployeeCount,
  getCompanyType,
  getCountries,
  getStates,
  getCities,
} from "../../../Slices/Commondropdown/CommondropdownSlice";
import PhoneInput from "react-phone-input-2";

const CompanyRegistration = (props) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [industryOptions, setIndustryOptions] = useState([]);
  const [companyTypeOptions, setCompanyTypeOptions] = useState([]);
  const [employeeCountOptions, setEmployeeCountOptions] = useState([]);
  const countries = useSelector((state) => state.CommonDropdownData.countries);
  const states = useSelector((state) => state.CommonDropdownData.states);
  const cities = useSelector((state) => state.CommonDropdownData.cities);

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    contact: "",
    portal: null,
    company_type_id: null,
    industryId: null,
    website:"",
    taxTypId: "",
    employeeCountId: null,
    taxInfo: "",
    logo: null,
    countryId: null,
    stateId: null,
    cityId: null,
    postalCode: null,
    address: "",
    is_group_company: null,
    group_name: "",
  });

  const [errors, setErrors] = useState({
    companyName: "",
    companyEmail: "",
    group_name: "",
    postalCode: "",
    address: "",
  });

  useEffect(() => {
    fetchIndustryType();
    fetchEmployeeCount();
    fetchCompanyType();
    dispatch(getCountries());
  }, [dispatch]);

  useEffect(() => {
    if (formData.countryId) {
      dispatch(getStates(formData.countryId));
    }
  }, [formData.countryId, dispatch]);

  useEffect(() => {
    if (formData.stateId) {
      dispatch(
        getCities({ countryId: formData.countryId, stateId: formData.stateId })
      );
    }
  }, [formData.stateId, formData.countryId, dispatch]);

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

  const fetchCompanyType = async () => {
    const response = await dispatch(getCompanyType());
    if (response.payload && response.payload.success) {
      const transformedData = [
        { idcompany_type_id: "", company_type_name: "Select Company Type" },
        ...response.payload.data.map((company) => ({
          idcompany_type_id: company.company_type_id,
          company_type_name: company.company_type,
        })),
      ];
      setCompanyTypeOptions(transformedData);
    }
  };

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

  const loading = useSelector(
    (state) => state.Authentication.status === "loading"
  );

  const validateEmail = (email) => {
    const emailPattern =
      /^(?!\d+@)\w+([-+.']\w+)*@(?!\d+\.)\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailPattern.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validation .......
    if (
      name === "companyName" ||
      name === "website" ||
      name === "group_name" ||
      name === "postalCode" ||
      name === "address"
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

    // Email validation
    if (name === "companyEmail") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyEmail: "Email cannot be empty or contain only spaces.",
        }));
      } else if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyEmail: "Please enter a valid email address.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, companyEmail: "" }));
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      is_group_company: value,
      group_name: value === "Y" ? prev.group_name : "",
    }));
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, companyLogo: e.target.files[0] });
  };

  const isFormValid = () => {
    const {
      companyName,
      companyEmail,
      // contactNumber,
      // portal,
      company_type_id,
      industryId,
      // taxTypId,
      employeeCountId,
      // taxInfo,
      // logo,
      countryId,
      stateId,
      cityId,
      postalCode,
      address,
      is_group_company,
    } = formData;

    return (
      companyName &&
      !errors.companyName &&
      // validateEmail(companyEmail) &&
      companyEmail &&
      // !errors.companyEmail &&
      // contactNumber &&
      // portal &&
      company_type_id &&
      industryId &&
      // taxTypId &&
      employeeCountId &&
      // taxInfo &&
      // logo &&
      countryId &&
      stateId &&
      cityId &&
      postalCode &&
      !errors.postalCode &&
      address &&
      !errors.address &&
      is_group_company
    );
  };

  // handle submit code here...
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      companyName,
      companyEmail,
      contact,
      portal,
      company_type_id,
      industryId,
      employeeCountId,
      taxTypId,
      taxInfo,
      logo,
      countryId,
      stateId,
      cityId,
      postalCode,
      address,
      website,
      is_group_company,
      group_name,
    } = formData;

    const payload = {
      companyName,
      companyEmail,
      contact: contact ? parseInt(contact) : null,
      portal,
      company_type_id: company_type_id ? parseInt(company_type_id) : null,
      industryId: industryId ? parseInt(industryId) : null,
      employeeCountId: employeeCountId ? parseInt(employeeCountId) : null,
      taxTypId: taxTypId ? parseInt(taxTypId) : null,
      taxInfo,
      logo,
      countryId: countryId ? parseInt(countryId) : null,
      stateId: stateId ? parseInt(stateId) : null,
      cityId: cityId ? parseInt(cityId) : null,
      postalCode: postalCode ? parseInt(postalCode) : null,
      address,
      website,
      is_group_company: is_group_company === "Y" ? 1 : 0,
      group_name: is_group_company === "Y" ? group_name : null,
    };

    const response = await dispatch(CompanyDetails(payload));

    if (CompanyDetails.fulfilled.match(response)) {
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
        // localStorage.setItem("token", response.payload.token);
      }
    } else if (CompanyDetails.rejected.match(response)) {
      // Extract the error message from the payload
      const errorMessage =
        response.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleBack = () => {
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handlePhoneNumberChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      contact: value,
    }));
  };

  return (
    <Container fluid className="mt-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row className="justify-content-center">
        <Col md={12} lg={8}>
          <Card
            className="mt-3"
            style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
          >
            <Card.Body className="p-0">
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick={true}
              />
              <h2 className="text-center text-danger mt-2 fw-semibold">
                Add Company
              </h2>
              <hr style={{ width: "100%" }} />
              <Container>
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
                      {errors.companyName && (
                        <small className="text-danger">
                          {errors.companyName}
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
                      />
                      {errors.companyEmail && (
                        <small className="text-danger">
                          {errors.companyEmail}
                        </small>
                      )}
                    </Col>

                    <Col md={4} className="form-group">
                      <Form.Label>Phone Number</Form.Label>
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
                        labelName="Website"
                        type="url"
                        name="website"
                        value={formData.website}
                        placeholder="Enter your Website URL"
                        onChange={handleInputChange}
                        mandatoryIcon={true}
                        maxLength={256}
                      />
                      {errors.website && (
                        <small small className="text-danger">
                          {errors.website}
                        </small>
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
                        dropdownLabelName="Company Type"
                        options={companyTypeOptions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company_type_id: e.target.value,
                          })
                        }
                        selectedValue={formData.company_type_id || ""}
                        mandatoryIcon={true}
                        valueKey="idcompany_type_id"
                        labelKey="company_type_name"
                      />
                    </Col>
                    <Col md={4} className="form-group mt-2">
                      <Form.Label className="">Group Company</Form.Label>
                      <span className="text-danger">*</span>
                      {formData.is_group_company === "Y" ? (
                        <>
                          <Form>
                            <Row>
                              <Col>
                                <Form.Control
                                  type="text"
                                  name="group_name"
                                  placeholder="Group Name"
                                  value={formData.group_name}
                                  onChange={(e) => handleInputChange(e)}
                                  className="shadow-none border-secondary-subtle"
                                />
                                {errors.group_name && (
                                  <small small className="text-danger">
                                    {errors.group_name}
                                  </small>
                                )}
                              </Col>
                            </Row>
                          </Form>
                        </>
                      ) : (
                        <Col className="d-flex justify-content-between" md={4}>
                          <Col md={2} className="form-group">
                            <Form.Check
                              label="Yes"
                              name="group1"
                              type="radio"
                              value="Y"
                              onChange={() => handleRadioChange("Y")}
                            />
                          </Col>
                          <Col md={2} className="form-group">
                            <Form.Check
                              label="No"
                              name="group1"
                              type="radio"
                              value="N"
                              onChange={() => handleRadioChange("N")}
                            />
                          </Col>
                        </Col>
                      )}
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
                      <CustomInput
                        labelName="Company Logo"
                        type="file"
                        placeholder="No file chosen"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        // mandatoryIcon={true}
                      />
                    </Col>

                    <Col md={4} className="form-group mt-2">
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
                        selectedValue={formData.countryId}
                        mandatoryIcon={true}
                        valueKey="value"
                        labelKey="label"
                      />
                    </Col>

                    <Col md={4} className="form-group mt-2">
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
                        selectedValue={formData.stateId || ""}
                        mandatoryIcon={true}
                        valueKey="value"
                        labelKey="label"
                      />
                    </Col>
                    <Col md={4} className="form-group mt-2">
                      <CustomDropdown
                        dropdownLabelName="City"
                        options={cities.map((city) => ({
                          value: city.city_id,
                          label: city.city_name,
                        }))}
                        onChange={(e) =>
                          setFormData({ ...formData, cityId: e.target.value })
                        }
                        selectedValue={formData.cityId}
                        mandatoryIcon={true}
                        valueKey="value"
                        labelKey="label"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4} className="form-group mt-2">
                      <CustomInput
                        labelName="ZIP/PIN Code"
                        type="numeric"
                        value={formData.postalCode}
                        name="postalCode"
                        placeholder="ZIP/PIN Code"
                        onChange={handleInputChange}
                        mandatoryIcon={true}
                        maxLength={6}
                      />
                      {errors.postalCode && (
                        <small small className="text-danger">
                          {errors.postalCode}
                        </small>
                      )}
                    </Col>

                    <Col md={8} className="form-group mt-2">
                      <Form.Label>Street Address</Form.Label>
                      <span className="text-danger">*</span>
                      <Form.Control
                        as="textarea"
                        placeholder="Street Address"
                        className="shadow-none border-secondary-subtle"
                        rows={2}
                        value={formData.address}
                        name="address"
                        onChange={handleInputChange}
                      />
                      {errors.address && (
                        <small small className="text-danger">
                          {errors.address}
                        </small>
                      )}
                    </Col>
                  </Row>

                  <Row className="justify-content-end mb-3 mt-3">
                    <Col md={2}>
                      <CustomSingleButton
                        _ButtonText="Submit"
                        onPress={handleSubmit}
                        backgroundColor="#000"
                        Text_Color="#fff"
                        borderColor="#000"
                        height="44px"
                        disabled={!isFormValid()}
                      />
                    </Col>
                    {loading && <CommonLoader />}
                    <Col md={2}>
                      <CustomSingleButton
                        _ButtonText="Cancel"
                        onPress={handleBack}
                        backgroundColor="red"
                        Text_Color="#fff"
                        borderColor="red"
                        height="44px"
                      />
                    </Col>
                  </Row>
                </Form>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyRegistration;
