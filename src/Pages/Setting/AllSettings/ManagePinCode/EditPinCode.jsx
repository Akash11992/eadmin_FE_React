import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import { Title } from "../../../../Components/Title/Title";
import { Col, Row } from "react-bootstrap";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import {
  hanldePinCodeUpdate,
  hanldePinCodeUpload,
} from "../../../../Slices/CourierSevices/CourierSevicesSlice";
import { ToastContainer, toast } from "react-toastify";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import { useDispatch } from "react-redux";

const EditPinCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getData = location.state?.pinData;
  // console.log('getData..',getData)
  const [loader, setLoader] = useState(false);
  const [pinSet, setPinSet] = useState({
    enterPincode: getData ? getData?.Pincode : "",
    enterState: getData ? getData?.State : "",
    enterDestination: getData ? getData?.Destination : "",
    enterIntl_dom_loc: getData ? getData?.IntlDomLoc : "",
  });
  const [errors, setErrors] = useState({
    enterState: "",
    enterDestination: "",
  });
  const validateAlphabetic = (name, value) => {
    // const regex = /^[A-Za-z\s]*$/;
    const regex = /^[a-zA-Z\s]*$/;
    if (!regex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Only alphabets are allowed.",
      }));
    } else if (/^[\s.]+|[\s.]+$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "spaces or dots are not allowed.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  // handle pincode handlePinChange code here..
  const handlePinChange = (name, value) => {
    setPinSet({ ...pinSet, [name]: value });

    validateAlphabetic(name, value);
  };

  const isFormValid = () => {
    const { enterPincode, enterState, enterDestination, enterIntl_dom_loc } =
      pinSet;
    return (
      enterPincode &&
      enterState &&
      !errors.enterState &&
      enterDestination &&
      !errors.enterDestination &&
      enterIntl_dom_loc
    );
  };

  // handle pincode Submit code here..
  const handlePinCodeAdd = async () => {
    setLoader(true);

    const form = {
      Pincode: pinSet.enterPincode,
      Area: "",
      Description: pinSet.enterDestination,
      State_Description: pinSet.enterState,
      CD: null,
      Product: pinSet.enterIntl_dom_loc,
    };
    const response = await dispatch(hanldePinCodeUpload(form));
    console.log(response, "response");
    if (response?.payload?.statusCode === 200) {
      toast.success(response?.payload?.data?.message);
      setLoader(false);
      setTimeout(() => {
        navigate("/managePincode");
      }, 2000);
      setPinSet({
        enterPincode: "",
        enterDestination: "",
        enterIntl_dom_loc: "",
        enterState: "",
      });
    }
  };

  // handle update pincode code here..
  const handlePinCodeUpdate = async () => {
    setLoader(true);

    const form = {
      pincodeId: getData?.Id,
      Pincode: pinSet?.enterPincode,
      Area: "",
      Description: pinSet?.enterDestination,
      State_Description: pinSet?.enterState,
      CD: null,
      Product: pinSet?.enterIntl_dom_loc,
    };
    const response = await dispatch(hanldePinCodeUpdate(form));
    console.log("response.", response);
    if (response?.meta?.requestStatus === "fulfilled") {
      toast.success(response?.payload?.message);
      setLoader(false);
      setTimeout(() => {
        navigate("/managePincode");
      }, 2000);
      setPinSet({
        enterPincode: "",
        enterDestination: "",
        enterIntl_dom_loc: "",
        enterState: "",
      });
    } else {
      toast.warning(response?.payload?.message);
      console.log("rere", response);
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
        <Title title={getData?.Pincode ? "Update PinCode" : "Add PinCode"} />
      </Row>
      <hr />

      <Row className="mt-3">
        <Col md={3}>
          <CustomInput
            type="text"
            mandatoryIcon={true}
            labelName="Pin Code"
            placeholder="Enter Pin Code"
            // isDisable={getData?.Pincode ? true : false}
            value={pinSet?.enterPincode}
            onChange={(e) => {
              const value = e.target.value;
              const regex = /^[0-9]*$/;
              if (regex.test(value) && value.length <= 6) {
                handlePinChange("enterPincode", value);
              }
            }}
          />
        </Col>
        <Col md={3}>
          <CustomInput
            type="text"
            labelName="State"
            placeholder="Enter State"
            mandatoryIcon={true}
            value={pinSet?.enterState}
            onChange={(e) => handlePinChange("enterState", e.target.value)}
            // isDisable
          />
          {errors.enterState && (
            <small style={{ color: "red" }}>{errors.enterState}</small>
          )}
        </Col>

        <Col md={3}>
          <CustomInput
            mandatoryIcon={true}
            type="text"
            labelName="Destination"
            placeholder="Enter Destination"
            value={pinSet?.enterDestination}
            onChange={(e) =>
              handlePinChange("enterDestination", e.target.value)
            }
            // isDisable
          />
          {errors.enterDestination && (
            <small style={{ color: "red" }}>{errors.enterDestination}</small>
          )}
        </Col>

        <Col md={3}>
          <CustomInput
            type="text"
            labelName="Intl Dom Loc"
            placeholder="Enter Intl Dom Loc"
            mandatoryIcon={true}
            value={pinSet?.enterIntl_dom_loc}
            onChange={(e) => {
              const input = e.target.value.toUpperCase();
              if (["D", "L", "I"].includes(input) || input === "") {
                handlePinChange("enterIntl_dom_loc", input);
              }
            }}
            maxLength="1"
          />
          <small style={{ color: "gray", fontStyle: "italic" }}>
            Allowed values: D (Domestic), L (Local), I (International)
          </small>
        </Col>
      </Row>

      <Col md={12} className="mt-3">
        <Row className="mt-3 mb-3 justify-content-end">
          <Col md={3}>
            <CustomSingleButton
              _ButtonText={getData?.Pincode ? "Update" : "Save"}
              height={40}
              onPress={
                getData?.Pincode ? handlePinCodeUpdate : handlePinCodeAdd
              }
              // onPress={handlePinCodeAdd}
              disabled={!isFormValid()}
            />
          </Col>
          <Col md={3}>
            <CustomSingleButton
              _ButtonText="Close"
              height={40}
              backgroundColor="#dc3545"
              onPress={() => {
                navigate("/managePincode");
              }}
            />
          </Col>
        </Row>
      </Col>
      {loader && <CommonLoader />}
    </div>
  );
};

export default EditPinCode;
