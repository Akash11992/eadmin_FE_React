import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AmbitLogo from "../../../Assets/Image/login_logo.png";
import AmbitBGLogo from "../../../Assets/Image/login_bg.png";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import {
  getUserDetails,
  LoginDetails,
} from "../../../Slices/Authentication/AuthenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { ToastContainer, toast } from "react-toastify";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Decryption from "../../../Components/Decryption/Decryption";
import "./Login.css";
import { API_LOGIN_SSO } from "../../../Services/ApiConstant";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const loading = useSelector(
    (state) => state.Authentication.status === "loading"
  );
  const decrypt = Decryption(); // Call the Decryption function to get the decrypt method

  const [formData, setFormData] = useState({
    Email: "",
    Pas: "",
  });
  const [errors, setErrors] = useState({
    Email: "",
    Pas: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      handleSSOLogin()
    }
  }, [])
  const handleSSOLogin = async () => {
    const details = await dispatch(getUserDetails());
    console.log(details?.payload)
    const decryptData = await decrypt(details?.payload?.session);
    const data = {
      data: decryptData,
      token: details?.payload?.token,
    };
    localStorage.setItem("userData", JSON.stringify(data));
    if (decryptData && decryptData?.companyId) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      navigate("/companyRegistration");
    }
  }
  const validateEmail = (email) => {
    const emailPattern =
      /^(?!\d+@)\w+([-+.']\w+)*@(?!\d+\.)\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    // Password validation
    if (name === "Pas") {
      if (value.length <= 3) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Pas: "Password must be at least 3 characters long.",
        }));
      }
      //  else {
      //   const regex =
      //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      //   if (!regex.test(value)) {
      //     setErrors((prevErrors)=>({
      //       ...prevErrors,
      //       Pas:"Password must include uppercase, lowercase, number, and special character."
      //     }));
      //   }
      else {
        setErrors((prevErrors) => ({ ...prevErrors, Pas: "" }));
      }
      // }
    }

    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = () => {
    const { Email, Pas } = formData;
    return Email && Pas && !errors.Email && !errors.Pas;
  };

  // handle submit code here..
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(LoginDetails(formData));

    if (LoginDetails.fulfilled.match(response)) {
      if (response.payload.statusCode === 200) {
        const details = await dispatch(getUserDetails());
        const decryptData = decrypt(details.payload.session);
        const data = {
          data: decryptData,
          token: details.payload.token,
        };
        localStorage.setItem("userData", JSON.stringify(data));
        // navigate(response?.payload?.data?.data?.is_individual === 1 ? "/dashboard" : "/companyRegistration");
        setTimeout(() => {
          if (decryptData && decryptData.companyId) {
            navigate("/dashboard");
          } else {
            navigate("/companyRegistration");
          }
        }, 1000);
        toast.success(response.payload.data.message);
      }
    } else if (LoginDetails.rejected.match(response)) {
      const errorMessage =
        response.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${AmbitBGLogo})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100%",
        opacity: 1,
        backgroundPosition: "center",
        overflowX: "hidden",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row
        className="d-flex justify-content-around align-items-center"
        style={{
          backgroundColor: "rgba(255,255,255, 0.3)",
          height: "100vh",
          opacity: 0.9,
        }}
      >
        <div>
          <Col md={12} className="logo_outer mt-5 text-center">
            <img src={AmbitLogo} alt="Logo" />
          </Col>
          <Col md={12} className="mt-5 login-white text-center">
            <h3 className="log text-white">LOGIN</h3>
            <p style={{ fontSize: "small" }} className="text-white">
              Please enter your details
            </p>
          </Col>
        </div>

        <Col
          md={12}
          className="px-0"
          style={{ backgroundColor: "#0000004a" }}
          id="login_form"
        >
          <Form className="py-md-4 py-0" action="vendor_management.html">
            <div className="login_outer col-md-4 m-auto">
              <CustomInput
                labelName="Email address"
                type="email"
                textcolor="text-white"
                value={formData.Email}
                name="Email"
                placeholder="Enter email"
                onChange={handleChange}
                mandatoryIcon={true}
              />
              {errors.Email && (
                <small className="text-danger" style={{ fontSize: "12px" }}>
                  {errors.Email}
                </small>
              )}
              <div className="mt-3 position-relative">
                <CustomInput
                  labelName="Password"
                  textcolor="text-white"
                  type={showPassword ? "text" : "password"}
                  value={formData.Pas}
                  name="Pas"
                  placeholder="Password"
                  onChange={handleChange}
                  mandatoryIcon={true}
                />

                <span
                  className="position-absolute"
                  style={{
                    top: "70%",
                    right: "10px",
                    cursor: "pointer",
                    transform: "translateY(-50%)",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="black" />
                  ) : (
                    <FaEye className="black" />
                  )}
                </span>
              </div>
              {errors.Pas && (
                <small className="text-danger" style={{ fontSize: "12px" }}>
                  {errors.Pas}
                </small>
              )}

              {loading && <CommonLoader />}
              <Col className="mt-4">
                <CustomSingleButton
                  _ButtonText="Log in"
                  height={40}
                  borderColor="#000"
                  onPress={handleSubmit}
                  disabled={!isFormValid()}
                />
              </Col>
            </div>
          </Form>
        </Col>
        <Col Col md={12} className="text-center">
          {/* <Nav className="flex-column">
            <Nav.Link
              href="registration"
              style={{
                textDecoration: "none",
                color: "white",
              }}
              className="justify-content-center d-flex flex-wrap align-items-baseline gap-2"
            >
              <p>Don't have an account?</p>
              <h6>Sign-up</h6>
            </Nav.Link>
          </Nav> */}
          <Nav className="flex-column">
            <div
              className="justify-content-center d-flex flex-wrap align-items-baseline gap-2"
              style={{ color: "white" }}
            >
              <p style={{ margin: 0 }}>Don't have an account?</p>
              <Nav.Link
                onClick={() => navigate("/registration")}
                // href="registration"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Sign-up
              </Nav.Link>
              <Nav.Link
                // onClick={() => navigate(API_LOGIN_SSO)}
                onClick={() => window.open(API_LOGIN_SSO.DATA, "_blank")}
                // href="registration"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Login with SSO
              </Nav.Link>
            </div>
          </Nav>

          {/* </Col> */}
          {/* <Col md={12} className="py-5" style={{ backgroundColor: "rgba(255,255,255, 0.3)" }}> */}
          <p
            className="d-block m-0 py-1 text-white text-center"
            id="term_condition"
          >
            By logging in, you agree to the <span>Terms &amp; Conditions</span>
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
