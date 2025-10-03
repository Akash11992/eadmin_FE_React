import React, { useState } from "react";
import { Title } from "../../../../../../Components/Title/Title";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomSingleButton from "../../../../../../Components/CustomSingleButton/CustomSingleButton";
import { useNavigate } from "react-router-dom";
import { createBussiness } from "../../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import CommonLoader from "../../../../../../Components/CommonLoader/CommonLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import CustomInput from "../../../../../../Components/CustomInput/CustomInput";
import { useLocation } from "react-router-dom";
import { updateByIdBusiness } from "../../../../../../Slices/CompanyDetails/CompanyDetailSlice";

const AddBusinessDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const businessData = location.state || null;

  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const [formData, setFormData] = useState({
    groupName: savedUserData?.data?.group_name || "",
    businessName: businessData ? businessData?.businessName : "",
  });
  const [errors, setErrors] = useState({
    businessName: "",
  });
  const loading = useSelector(
    (state) => state.companyDetail.status === "loading"
  );

  // handleInputChnage code are here...
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation .......
    if (name === "businessName") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only spaces or dots are not allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = () => {
    const { businessName } = formData;
    return businessName && !errors.businessName;
  };

  // handle business update function code here....
  const handleBisinessUpdate = async () => {
    const payload = {
      businessId: businessData?.businessId,
      businessName: formData?.businessName,
    };
    const response = await dispatch(updateByIdBusiness(payload));
    if (updateByIdBusiness.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        toast.success(response.payload.data.message);
        setTimeout(() => {
          navigate("/businessDetails");
        }, 2000);
      }
    } else if (updateByIdBusiness.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
    return null;
  };

  // handle submit code here....
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      businessName: formData.businessName,
    };
    const response = await dispatch(createBussiness(payload));
    if (createBussiness.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        toast.success(response.payload.data.message);
        setTimeout(() => {
          navigate("/businessDetails");
        }, 2000);
      }
    } else if (createBussiness.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row className="mt-3 ms-0">
        <Title title="AddBusinessDetails" />
      </Row>
      <hr />

      <Container>
        <section className="section register flex-column align-items-center justify-content-center m-4">
          <Row className="justify-content-center">
            <Col md={5} className="d-flex flex-column">
              <Card
                style={{
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                }}
              >
                <Card.Body>
                  <h5 className="card-title text-center">Add Business</h5>
                  <hr />
                  {savedUserData?.data?.is_individual == 0 ? (
                    <Col md={12} className="mb-3">
                      <CustomInput
                        labelName="Group Name"
                        type="text"
                        name="groupName"
                        placeholder="Your Group Name"
                        value={formData?.groupName}
                        onChange={handleInputChange}
                        isDisable={true}
                      />
                    </Col>
                  ) : null}

                  <Col className="mb-3" md={12}>
                    <CustomInput
                      labelName="Business Name"
                      type="text"
                      value={formData?.businessName}
                      name="businessName"
                      placeholder="Your Business Name"
                      onChange={handleInputChange}
                    />
                    {errors?.businessName && (
                      <small className="text-danger">
                        {errors?.businessName}
                      </small>
                    )}
                  </Col>
                  {loading && <CommonLoader />}

                  <Row className="mt-3 mb-3 justify-content-end">
                    <Col md={3}>
                      <CustomSingleButton
                        _ButtonText="Close"
                        height={40}
                        backgroundColor="#dc3545"
                        onPress={() => {
                          navigate("/businessDetails");
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <CustomSingleButton
                        _ButtonText={businessData ? "Update" : "Add"}
                        height={40}
                        onPress={
                          businessData ? handleBisinessUpdate : handleSubmit
                        }
                        disabled={!isFormValid()}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default AddBusinessDetails;
