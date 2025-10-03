import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import { Col, Row } from "react-bootstrap";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import { Title } from "../../../../Components/Title/Title";
import { insertCourierAccountCode, updateCourierAccountCode } from "../../../../Slices/CourierSevices/CourierSevicesSlice";
import { ToastContainer, toast } from "react-toastify";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import { useDispatch } from "react-redux";

const EditAccountCodeMaster = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = location.state?.pinData;
  //   console.log("getData...", getData);
  const [loader, setLoader] = useState(false);
  const [accountCode, setAccountCode] = useState({
    accCode: getData ? getData?.CourierAccountCode : "",
    companyName: getData ? getData?.CompanyName : "",
  });
  const [errors, setErrors] = useState({
    accCode: "",
    companyName: "",
  });

  // handle validation code here..
  const isFormValid = () => {
    const { accCode, companyName } = accountCode;
    return accCode && companyName && !errors?.accCode && !errors?.companyName;
  };

  // handle input field code here..
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (name === "accCode") {
      if (!/^[0-9]*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          accCode: "Only numbers are allowed.",
        }));
      } else if (value.length > 6) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          accCode: "Code must be exactly 6 digits.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          accCode: "",
        }));
      }
    }

    if (name === "companyName") {
      // if (!/^[a-zA-Z\s]*$/.test(value)) {
        if (!/^[a-zA-Z\s()]*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyName: "only alphabets are allowed.",
        }));
      } else if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyName: "spaces or dots are not allowed.",
        }));
      } else if (!/^[A-Z]/.test(value.trim())) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyName: "the first word must be uppercase.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, companyName: "" }));
      }
    }
    setAccountCode({ ...accountCode, [name]: value });
  };

  const handleSaveDetails = async () => {
    setLoader(true);

    const form = {
      AccountNo: accountCode?.accCode,
      CompanyName: accountCode?.companyName,
    };

    try {
      const response = await dispatch(insertCourierAccountCode(form));
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response?.payload?.message);
        setLoader(false);
        setTimeout(() => {
          navigate("/accountCodeMaster");
        }, 1000);
        setAccountCode({
          accCode: "",
          companyName: "",
        });
      } else {
        toast.success(response?.payload?.message);
        setLoader(false);
      }
    } catch (error) {
      toast.error("An error occurred while saving details.");
      console.error(error);
      setLoader(false);
    }
  };

  // handle update pincode code here..
  const handleAccountCodeUpdate = async () => {
    setLoader(true);

    const form = {
      AccountNo: accountCode?.accCode,
      CompanyName: accountCode?.companyName,
    };
    const response = await dispatch(updateCourierAccountCode(form));
    console.log("response.", response);
    if (response?.meta?.requestStatus === "fulfilled") {
      toast.success(response?.payload?.message);
      setLoader(false);
      setTimeout(() => {
        navigate("/accountCodeMaster");
      }, 2000);
      setAccountCode({
        accCode: "",
        companyName: "",
      });
    } else {
      toast.warning("Pin Code Already Exist");
      setLoader(false);
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
      <Row className="mt-3 ms-0">
        <Title
          title={
            getData?.CourierAccountCode
              ? "Update Account Code"
              : "Add Account Code"
          }
        />
      </Row>
      <hr />
      <Row className="mt-3">
        <Col md={3}>
          <CustomInput
            type="text"
            // mandatoryIcon={true}
            labelName="Account Code"
            placeholder="Enter account code"
            value={accountCode?.accCode}
            name={"accCode"}
            onChange={handleChange}
            onKeyPress={(e) => {
              // Allow only numbers
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {errors?.accCode && (
            <small className="text-danger" style={{ fontSize: "12px" }}>
              {errors.accCode}
            </small>
          )}
        </Col>
        <Col md={4}>
          <CustomInput
            type="text"
            // mandatoryIcon={true}
            labelName="Courier Company Name"
            placeholder="Enter courier company name"
            value={accountCode?.companyName}
            name={"companyName"}
            onChange={handleChange}
          />
          {errors?.companyName && (
            <small className="text-danger" style={{ fontSize: "12px" }}>
              {errors?.companyName}
            </small>
          )}
        </Col>
      </Row>
      <Col md={12} className="mt-3">
        <Row className="mt-3 mb-3 justify-content-end">
          <Col md={3}>
            <CustomSingleButton
              _ButtonText={"Save"}
              height={40}
              onPress={getData?.CourierAccountCode ? handleAccountCodeUpdate : handleSaveDetails}
              // onPress={handleSaveDetails}
              disabled={!isFormValid()}
            />
          </Col>
          <Col md={3}>
            <CustomSingleButton
              _ButtonText="Close"
              height={40}
              backgroundColor="#dc3545"
              onPress={() => {
                navigate("/accountCodeMaster");
              }}
            />
          </Col>
        </Row>
      </Col>
      {loader && <CommonLoader />}
    </div>
  );
};

export default EditAccountCodeMaster;
