import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Nav, Navbar, Row } from "react-bootstrap";
import "../../Assets/css/Navbar/Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleShow } from "./NavbarSlice";
import { getPermissionByIdDetails } from "../../Slices/Role/RoleSlice";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import { logoutCookie } from "../../Slices/Authentication/AuthenticationSlice";
import { toast } from "react-toastify";

const Navbars = ({ handleSideBar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const loading = useSelector((state) => state.Role.status === "loading");
  const savedUserData = localStorage.getItem("userData");
  // console.log('savedUserData',savedUserData)
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Setting } = permissionDetailData.data || {};
  const [showSidebar, setShowSidebar] = useState(false);
  // useEffect code here...
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(
        (prevDateTime) => new Date(prevDateTime.getTime() + 1000)
      );
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // handle logout code here...
  const handleLogout = async () => {
    const response = await dispatch(logoutCookie());
    console.log(response, "response");
    if (response?.payload?.code === 200) {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      toast.success(response.payload.message);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  useEffect(() => {
    const savedUserDataParsed = JSON.parse(savedUserData);
    if (savedUserDataParsed) {
      setUserData(savedUserDataParsed);
      if (savedUserDataParsed.data && savedUserDataParsed.data.roleId) {
        handleGetPermissionDetailsId(savedUserDataParsed.data.roleId);
      }
    }
  }, []);

  // const show = useSelector((state) => state.Navbar.show);
  const handleGetPermissionDetailsId = async (roleId) => {
    const payload = {
      role_id: roleId,
    };
    const response = await dispatch(getPermissionByIdDetails(payload));
    if (getPermissionByIdDetails.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        // console.log("get permission by details data..", response.payload.data);
      }
    } else if (getPermissionByIdDetails.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      // toast.warn(errorMessage);
      console.log(errorMessage);
    }
  };
  // const handleMenu = (e) => {
  //   e.preventDefault();
  //   setShowSidebar(!showSidebar);
  // };
  const handleMenu = (e) => {
    e.preventDefault();
    setShowSidebar((prev) => {
      console.log(prev, 'click');
      return !prev;
    });
  };
  return (
    <>
      <Row className="bg-body-tertiary shadow navbar navbar-light sticky-top">
        <Col
          md={2}
          className="d-flex justify-content-between align-content-center align-items-center"
          id="main_logo_div"
        >
          <span onClick={() => navigate("/dashboard")}>
            <img
              src="/images/logo.svg"
              alt="Logo"
              className="ms-2 image_logo"
            />
          </span>
          <div className="mt-2" id="user_details_info">
            {/* Admin User */}
            <b>{userData?.data?.name || "Admin User"}</b>
            <p className="nav_p">
              {currentDateTime.toLocaleString(undefined, options)}
            </p>
          </div>

          {/* <span onClick={() => dispatch(handleShow())}> */}
          <span onClick={handleSideBar}>
            <img
              src="/images/hamburger.svg"
              alt="Logo"
              className="image_toggle"
            />
          </span>
        </Col>

        {/* <Col md={1}></Col>
        <Col md={2}></Col> */}
        <Col
          md={2}
          className="align-content-center align-items-center setting_icon"
        >
          {Setting?.view && (
            <span
              className="ms-md-5 ms-0"
              onClick={() => navigate("/allSettings")}
            >
              <img src="/images/settings.svg" alt="Logo" className="me-2" />
              Setting
            </span>
          )}
        </Col>
        <Col md={0} id="vecent_div"></Col>
        <Col md={2} className="text-center"><b>Role:<span className="ms-2">{userData?.data?.role_name}</span></b></Col>
        <Col
          md={2}
          className="d-flex justify-content-between align-content-center align-items-center p-0"
          id="user_info_div"
        >
          <div className="mt-2 user_details">
            {/* Admin User */}
            <b>{userData?.data?.name || "Admin User"}</b>
            <p className="nav_p">
              {currentDateTime.toLocaleString(undefined, options)}
            </p>
          </div>

          <span onClick={handleLogout} className="me-3 logout_image_navbar">
            <img src="/images/logout.svg" alt="Logo" />
          </span>
        </Col>
      </Row>
      {loading && <CommonLoader />}
    </>
  );
};

export default Navbars;
