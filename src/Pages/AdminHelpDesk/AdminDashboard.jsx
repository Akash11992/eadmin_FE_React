import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Title } from "../../Components/Title/Title";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import "../../Assets/css/AdminHelpDesk/AdminHelpDesk.css";
import Chart from "./Chart";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardDetails } from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [group, setGroup] = useState(1);
  const [owner, setOwner] = useState(null);
  const [filterType, setFilterType] = useState("Today");
  const [type, setType] = useState(1)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashboardDetails } = useSelector((state) => state.AdminHelpDesk);
  const loading = useSelector(
    (state) => state.AdminHelpDesk.status === "loading"
  );
  const dashboardData = dashboardDetails?.data;
  const IsActive = dashboardDetails?.ticketOwner;

  const filteredData = {
    Total: dashboardData?.total,
    Open: dashboardData?.Open,
    Close: dashboardData?.Close,
    "Work in Progress": dashboardData?.["Work In Progress"],
    "On Hold": dashboardData?.["On Hold"],
  };

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const payload = {
          group: group,
          owner: owner,
          filter_type: filterType,
        };
        await dispatch(getDashboardDetails(payload));
      } catch (error) {
        console.error("Failed to fetch dashboard details:", error);
      }
    };
    fetchDashboardDetails();
  }, [group, owner, filterType]);

  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    let filterName = "";

    switch (selectedValue) {
      case "1":
        filterName = "Today";
        break;
      case "2":
        filterName = "Weekly";
        break;
      case "3":
        filterName = "Monthly";
        break;
      case "4":
        filterName = "Yearly";
        break;
      default:
        filterName = "All";
    }

    setType(Number(selectedValue));
    setFilterType(filterName);
  };

  return (
    <Row className="dashboard me-1 ms-1">
      <Card className="">
        <Title title="Admin HelpDesk" />
        <Card.Body>
          <Row className="mb-3 d-flex justify-content-end">
            <Col md={3}>
              <select
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "2px solid #bdbdbd",
                  padding: "5px 0",
                  fontSize: "16px",
                  cursor: "pointer",
                  outline: "none",
                }}
                value={type}
                onChange={handleFilterChange}
              >
                <option value="0">All</option>
                <option value="1">Today</option>
                <option value="2">Weekly</option>
                <option value="3">Monthly</option>
                <option value="4">Yearly</option>
              </select>
            </Col>
          </Row>

          <Row className="justify-content-around">
            {Object.entries(filteredData)?.map(([key, count], index) => (
              <Col key={index} md={2} className="p-1">
                <Card className="shadow" id="card-radius">
                  <Card.Body>
                    <Card.Subtitle>{key}</Card.Subtitle> <h3>{count}</h3>
                    <CustomSingleButton
                      _ButtonText="View"
                      height={30}
                      onPress={() =>
                        navigate(
                          key === "Close" || key === "Total"
                            ? "/ticketReport"
                            : "/ticketsManagement"
                        )
                      }
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

export default AdminDashboard;
