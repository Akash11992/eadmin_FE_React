import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, Row, Col, Form } from "react-bootstrap";
import CustomInput from "../../../../../Components/CustomInput/CustomInput";
import { Title } from "../../../../../Components/Title/Title";
import "react-toastify/dist/ReactToastify.css";
import AutosizeTextarea from "../../../../../Components/AutosizeTextarea/AutosizeTextarea";
import CustomSingleButton from "../../../../../Components/CustomSingleButton/CustomSingleButton";
import {
  getProfile,
  updateProfileDetails,
} from "../../../../../Slices/Profile/ProfileSlice";
import CommonLoader from "../../../../../Components/CommonLoader/CommonLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Profile = () => {
  const dispatch = useDispatch();
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const loading = useSelector((state) => state.profile.status === "loading");
  const profileDetailsdata = useSelector(
    (state) => state?.profile?.profileData
  );
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { My_Profile } = permissionDetailData.data || {};

  const profileDataDetail =
    profileDetailsdata?.data?.length > 0 ? profileDetailsdata.data[0] : {};

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    roleName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    // if (profileDataDetail) {
    if (Object.keys(profileDataDetail).length > 0) {
      setFormData({
        name: profileDataDetail.name || "",
        company: profileDataDetail.companyName || "",
        roleName: profileDataDetail.roleName || "",
        email: profileDataDetail.email || "",
        phone: profileDataDetail.phone || "",
      });
    }
  }, [profileDataDetail]);

  // fetch all type module Name from get apis...
  const fetchProfile = async () => {
    await dispatch(getProfile());
  };

  // handle input field code here...
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validation .......
    if (name === "name" || name === "phone") {
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

  // handle save code here...
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(updateProfileDetails(formData));

    if (response.meta.requestStatus === "fulfilled") {
      if (response.payload) {
        if (response.payload.statusCode === 200) {
          toast.success(response.payload.message || "updated successfully!");
          fetchProfile();
          setFormData({
            name: response.payload.data.name,
            company: response.payload.data.companyName,
            roleName: response.payload.data.roleName,
            email: response.payload.data.email,
            phone: response.payload.data.phone,
          });
        } else {
          toast.success("updated successfully! " + response.payload.statusCode);
        }
      } else {
        toast.success("updated successfully!");
      }
    } else if (response.meta.requestStatus === "rejected") {
      const errorMessage =
        response.error?.message || "An unknown error occurred.";
      toast.success(errorMessage);
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
      <div className="mt-3">
        <Title title="Profile" />
      </div>
      <hr />
      <Tabs
        defaultActiveKey="Overview"
        id="reverse-pickup-tabs"
        className="mb-3 my-2"
      >
        <Tab eventKey="Overview" title="Overview" className="pb-3">
          <h5 className="card-title mb-2">Profile Details</h5>
          <div className="row my-1">
            <div className="col-lg-3 col-md-4 label">Full Name</div>
            <div className="col-lg-9 col-md-8">{profileDataDetail?.name}</div>
          </div>
          {savedUserData?.data?.is_individual == 0 && (
            <div className="row my-2">
              <div className="col-lg-3 col-md-4 label">Company</div>
              <div className="col-lg-9 col-md-8">
                {profileDataDetail?.companyName}
              </div>
            </div>
          )}
          <div className="row my-2">
            <div className="col-lg-3 col-md-4 label">Phone</div>
            <div className="col-lg-9 col-md-8">{profileDataDetail?.phone}</div>
          </div>
          <div className="row my-2">
            <div className="col-lg-3 col-md-4 label">Email</div>
            <div className="col-lg-9 col-md-8">{profileDataDetail?.email}</div>
          </div>
        </Tab>

        <Tab eventKey="Edit Profile" title="Edit Profile" className="pb-3">
          <div>
            <Col
              md={5}
              className="my-2 flex-wrap d-flex justify-content-between align-items-end"
            >
              <Form.Label md={1}>{"Name"}</Form.Label>
              <div md={3}>
                <CustomInput
                  type="text"
                  // labelName="Name"
                  value={formData.name || ""}
                  name="name"
                  placeholder="Name"
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <small small className="text-danger">
                    {errors.name}
                  </small>
                )}
              </div>
            </Col>
            {savedUserData?.data?.is_individual == 0 && (
              <>
                <Col
                  md={5}
                  className="my-2 flex-wrap d-flex justify-content-between align-items-end"
                >
                  <Form.Label md={1}>{"Company Name "}</Form.Label>
                  <div md={3}>
                    <CustomInput
                      type="text"
                      // labelName="Company Name"
                      placeholder="Company Name"
                      value={formData.company || ""}
                      name="company"
                      onChange={handleInputChange}
                      isDisable={true}
                    />
                  </div>
                </Col>
                <Col
                  md={5}
                  className="my-2 flex-wrap d-flex justify-content-between align-items-end"
                >
                  <Form.Label md={1}>{"Role"}</Form.Label>
                  <div md={3}>
                    <CustomInput
                      type="text"
                      // labelName="Role"
                      placeholder="Role"
                      value={formData.roleName || ""}
                      name="roleName"
                      onChange={handleInputChange}
                      isDisable={true}
                    />
                  </div>
                </Col>
              </>
            )}
          </div>
          <div>
            <Col
              md={5}
              className="my-2 flex-wrap d-flex justify-content-between align-items-end"
            >
              <Form.Label md={1}>{"Phone"}</Form.Label>
              <div md={3}>
                <CustomInput
                  type="text"
                  // labelName="Phone"
                  placeholder="Phone"
                  value={formData.phone || ""}
                  name="phone"
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <small small className="text-danger">
                    {errors.phone}
                  </small>
                )}
              </div>
            </Col>
            <Col
              md={5}
              className="my-2 flex-wrap d-flex justify-content-between align-items-end"
            >
              <Form.Label md={1}>{"Email"}</Form.Label>
              <div md={3}>
                <CustomInput
                  type="email"
                  // labelName="Email"
                  placeholder="Email"
                  value={formData.email || ""}
                  name="email"
                  onChange={handleInputChange}
                  isDisable={true}
                />
              </div>
            </Col>
          </div>

          {My_Profile?.view && My_Profile?.update ? (
            <div className="justify-content-center row mt-3">
              <CustomSingleButton
                _ButtonText="Save Changes"
                height={40}
                width={"16%"}
                onPress={handleSubmit}
              />
            </div>
          ) : null}
        </Tab>
      </Tabs>
      {loading && <CommonLoader />}
    </div>
  );
};

export default Profile;
