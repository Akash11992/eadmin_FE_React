import React from "react";
import { Title } from "../../../Components/Title/Title";
import { Row, Col, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllSettings = () => {
  const navigate = useNavigate();
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Company_Details, Manage_User, Role, My_Profile, Alert } =
    permissionDetailData.data || {};

  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <div className="mt-3">
        <Title title="All Settings" />
      </div>
      <hr />
      <div>
        <Row>
          <Col md={3}>
            <h4>General</h4>
          </Col>
          {Manage_User?.view && Role?.view ? (
            <Col md={3}>
              <h4>User &amp; Control</h4>
            </Col>
          ) : null}
          {/* <Col md={3}>
            <h4>Configurations</h4>
          </Col> */}
          <Col md={3}>
            <h4>Notifications</h4>
          </Col>
          {Role?.view ? (
            <Col md={3}>
              <h4>Reports</h4>
            </Col>
          ) : null}
        </Row>
        <hr />
        <Row>
          <Col md={3} className="p-0">
            <Nav className="flex-column">
              {My_Profile?.view && (
                <Nav.Link
                  onClick={() => navigate("/profile")}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  My Profile
                </Nav.Link>
              )}
              {savedUserData?.data?.is_individual == 0 &&
              Company_Details?.view ? (
                <Nav.Link
                  onClick={() => navigate("/companyDetails")}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Company Details
                </Nav.Link>
              ) : null}
            </Nav>
          </Col>
          {Manage_User?.view || Role?.view ? (
            <Col md={3} className="p-0">
              <Nav className="flex-column">
                {Manage_User?.view ? (
                  <Nav.Link
                    onClick={() => navigate("/manageUser")}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Manage User
                  </Nav.Link>
                ) : null}

                {Role?.view ? (
                  <Nav.Link
                    onClick={() => navigate("/role")}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Role
                  </Nav.Link>
                ) : null}
                <Nav.Link
                 onClick={() => navigate("/managePincode")}
                style={{ textDecoration: "none", color: "black" }}
              >
               PinCode Master
              </Nav.Link>
                <Nav.Link
                 onClick={() => navigate("/accountCodeMaster")}
                style={{ textDecoration: "none", color: "black" }}
              >
               Account Code Master
              </Nav.Link>
               {/* <Nav.Link
                href="link_mailbox.html"
                style={{ textDecoration: "none", color: "black" }}
              >
                Link Mailbox
              </Nav.Link> */}
              </Nav>
            </Col>
          ) : null}
          <Col md={3} className="p-0">
            {/* <Nav className="flex-column mt-3 mt-auto">
              <Nav.Link
                href="integration"
                style={{ textDecoration: "none", color: "black" }}
              >
                Integration
              </Nav.Link>
            </Nav> */}
            {Alert?.view ? (
              <Nav className="flex-column mt-3 mt-auto">
                <Nav.Link
                  onClick={() => navigate("/alert")}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Alert
                </Nav.Link>
              </Nav>
            ) : null}
          </Col>

          {/* reports section code here... */}
          {Role?.view ? (
            <Col md={3} className="p-0">
              <Nav className="flex-column mt-3 mt-auto">
                <Nav.Link
                  onClick={() => navigate("/allReports")}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  All Reports
                </Nav.Link>
              </Nav>
            </Col>
          ) : null}
        </Row>
      </div>
    </div>
  );
};

export default AllSettings;
