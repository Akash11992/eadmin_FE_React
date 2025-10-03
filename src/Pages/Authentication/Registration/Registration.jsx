import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Container, Nav } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Registration.css";
import { useDispatch, useSelector } from "react-redux";
import { RegistrationDetails } from "../../../Slices/Authentication/AuthenticationSlice";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { ToastContainer, toast } from "react-toastify";
import { getDesignations } from "../../../Slices/Commondropdown/CommondropdownSlice";
const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    designationId: parseInt(null),
    phone: "",
    is_individual: 0,
    confirmPassword: "",
    // agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    Name: "",
    Email: "",
    Password: "",
  });

  const loading = useSelector(
    (state) => state.Authentication.status === "loading"
  );
  const designationTypeData = useSelector(
    (state) => state.CommonDropdownData.designation
  );

  // useEffect code here ..
  useEffect(() => {
    fetchDesignationtype();
  }, []);

  const fetchDesignationtype = async () => {
    await dispatch(getDesignations());
  };

  const handlePhoneNumberChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  //email format rejex define here.....
  const validateEmail = (email) => {
    const emailPattern =
      /^(?!\d+@)\w+([-+.']\w+)*@(?!\d+\.)\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    // Validation .......
    // if (name === "Name") {
    //   if (/^[\s.]+|[\s.]+$/.test(value)) {
    //     setErrors((prevErrors) => ({
    //       ...prevErrors,
    //       [name]: "Only spaces or dots are not allowed.",
    //     }));
    //   } else {
    //     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    //   }
    // }
    // Name validation: Only alphabets allowed
    if (name === "Name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Name: "only alphabets are allowed.",
        }));
      } else if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Name: "spaces or dots are not allowed.",
        }));
      } else if (!/^[A-Z]/.test(value.trim())) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Name: "the first word must be uppercase.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, Name: "" }));
      }
    }

    // Email validation
    if (name === "Email") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Email: "Email cannot be empty or contain only spaces.",
        }));
      } else if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Email: "Please enter a valid email address.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, Email: "" }));
      }
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Password validation
    if (name === "Password") {
      if (value.length < 6) {
        setErrors((prev) => ({
          ...prev,
          Password: "Password must be at least 6 characters long.",
        }));
      } else {
        const regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!regex.test(value)) {
          setErrors((prev) => ({
            ...prev,
            Password:
              "Password must include uppercase, lowercase, number, and special character.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, Password: "" }));
        }
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.Password) {
        setPasswordError("password do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  // validate code here ..
  const isFormValid = () => {
    const { Name, Email, Password, designationId, phone, confirmPassword } =
      formData;

    return (
      Name &&
      !errors.Name &&
      validateEmail(Email) &&
      !errors.Email &&
      Password &&
      !errors.Password &&
      designationId &&
      phone &&
      confirmPassword &&
      !passwordError.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "formdata");
    const response = await dispatch(RegistrationDetails(formData));
    if (RegistrationDetails.fulfilled.match(response)) {
      if (response.payload.statusCode === 201) {
        console.log("data", response.payload.data.message);
        setTimeout(() => {
          // navigate(formData?.is_individual === 1 ? "/" : "/companyRegistration");
          navigate("/");
        }, 2000);
        toast.success(response.payload.data.message);
      }
    } else if (RegistrationDetails.rejected.match(response)) {
      const errorMessage =
        response.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  return (
    <div
      style={{
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <Card
        className="mt-5 col-md-8 mx-auto"
        style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <Form className="d-flex flex-column">
          <h2 className="text-center text-danger mt-2 fw-semibold">
            Create an Account
          </h2>
          <hr style={{ width: "100%" }} />
          <Container className="mb-4">
            <Row>
              <Col md={6}>
                <CustomInput
                  labelName="Your Name"
                  type="text"
                  value={formData.Name}
                  name="Name"
                  placeholder="Name"
                  onChange={handleChange}
                  mandatoryIcon={true}
                />
                {errors.Name && (
                  <small className="text-danger" style={{ fontSize: "12px" }}>
                    {errors.Name}
                  </small>
                )}
              </Col>
              <Col md={6}>
                <CustomInput
                  labelName="Your Email"
                  type="email"
                  value={formData.Email}
                  name="Email"
                  placeholder="Email"
                  onChange={handleChange}
                  mandatoryIcon={true}
                />
                {errors.Email && (
                  <small className="text-danger" style={{ fontSize: "12px" }}>
                    {errors.Email}
                  </small>
                )}
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mt-2">
                <CustomDropdown
                  dropdownLabelName="Designation"
                  options={[
                    { value: "", label: "Select Designation" },
                    ...designationTypeData.map((e) => ({
                      value: e.dm_id,
                      label: e.dm_name,
                    })),
                  ]}
                  // options={designationData}
                  onChange={(e) =>
                    setFormData({ ...formData, designationId: e.target.value })
                  }
                  selectedValue={parseInt(formData.designationId)}
                  valueKey="value"
                  labelKey="label"
                />
              </Col>
              <Col md={6}>
                <Form.Group className="mb-0 mt-2" controlId="formPhoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <span className="text-danger">*</span>
                  <PhoneInput
                    country={"in"}
                    // defaultCountry="in"
                    countryCode
                    format
                    placeholder="+00-0000-00-00"
                    value={formData.phone}
                    onChange={handlePhoneNumberChange}
                    inputClass="your-custom-input-class shadow-none border-secondary-subtle"
                    dropdownClass="your-custom-dropdown-class "
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mt-2">
                <Form.Group
                  className="mb-0"
                  controlId="formPassword"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Password</Form.Label>
                  <span className="text-danger">*</span>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    className="shadow-none border-secondary-subtle"
                    placeholder="Password"
                    value={formData.Password}
                    onChange={handlePasswordChange}
                    style={{ fontSize: "1.1rem", width: "100%" }}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </Form.Group>
                {errors.Password && (
                  <small className="text-danger" style={{ fontSize: "12px" }}>
                    {errors.Password}
                  </small>
                )}
              </Col>

              <Col md={6} className="mt-2">
                <Form.Group
                  className="mb-0"
                  controlId="formConfirmPassword"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Confirm Password</Form.Label>
                  <span className="text-danger">*</span>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="shadow-none border-secondary-subtle"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handlePasswordChange}
                    style={{ fontSize: "1.1rem", width: "100%" }}
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "70%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </Form.Group>
                {passwordError && (
                  <div
                    className="text-danger"
                    style={{ fontSize: "0.9rem", fontSize: "12px" }}
                  >
                    {passwordError}
                  </div>
                )}
              </Col>
            </Row>

            <Form.Group className="mb-3 mt-3" controlId="formAgree">
              <Form.Check
                type="checkbox"
                label="I agree to the Terms of Service and Privacy Policy"
                name="agreeToTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formIndividual">
              <Form.Check
                type="checkbox"
                label="I am an Individual not a company"
                name="is_individual"
                checked={formData?.is_individual === 1}
                onChange={handleChange}
              />
            </Form.Group>
            {loading && <CommonLoader />}
            <div className="mt-3">
              <CustomSingleButton
                _ButtonText="Create Account"
                height={40}
                borderColor="#000"
                onPress={handleSubmit}
                disabled={!isFormValid()}
              />
            </div>
            <Nav className="flex-column">
              <div
                className="justify-content-center d-flex flex-wrap align-items-baseline gap-2"
                style={{ color: "Black" }}
              >
                <p style={{ margin: 0 }}>Already have an account?</p>
                <Nav.Link
                  // href="/"
                  onClick={() => navigate("/")}
                  style={{
                    textDecoration: "none",
                    color: "Black",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Nav.Link>
              </div>
            </Nav>
          </Container>
        </Form>
      </Card>
    </div>
  );
};

export default Registration;
