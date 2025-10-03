import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import "../../../Assets/css/AdminHelpDesk/AdminHelpDesk.css";
import Chart from "../Chart/Chart";
import { useDispatch, useSelector } from "react-redux";
// import { getDashboardDetails } from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader.jsx";
import { useNavigate } from "react-router-dom";

const AmcDashboard = () => {
  const [group, setGroup] = useState(1);
  const [owner, setOwner] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashboardDetails } = useSelector((state) => state.AdminHelpDesk);
  const loading = useSelector(
    (state) => state.AdminHelpDesk.status === "loading"
  );
  const dashboardData = dashboardDetails?.data
  const IsActive  = dashboardDetails?.ticketOwner
  // console.log(IsActive,"IsActive")
  const filteredData = {
    Draft: dashboardData?.Draft,
    Approved: dashboardData?.Approved,
    Negotiated: dashboardData?.Negotiated,
    Signed: dashboardData?.Signed,
    Active: dashboardData?.Active,
    Upcoming: dashboardData?.Upcoming,
  
  };

  return (
    <Row className="dashboard me-1 ms-1">
      <Card className="">
        <Title title="AMC Dashboard" />
        <Card.Body>
          <Row className="justify-content-around">
            {Object.entries(filteredData)?.map(([key, count], index) => (
              <Col key={index} md={2} className="p-1">
                <Card className="shadow" id="card-radius">
                  <Card.Body>
                    <Card.Subtitle>{key}</Card.Subtitle> <h3>{count}</h3>
                    <CustomSingleButton
                      _ButtonText="View"
                      height={30}
              
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {loading && <CommonLoader />}
          <Row className="mt-5">
            <Chart
              filteredData={filteredData}
              data={dashboardData}
              setGroup={setGroup}
              group={group}
              owner={owner}
              setOwner={setOwner}
              IsActive={IsActive}
            />
          </Row>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default AmcDashboard;
