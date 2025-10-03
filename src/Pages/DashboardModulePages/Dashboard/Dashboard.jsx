import React from "react";
import { Card, Row } from "react-bootstrap";
import Cards from "./Cards";
import "../../../Assets/css/Dashboard/Dashboard.css";
import { MdOutlineCardTravel } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { Title } from "../../../Components/Title/Title";
import { useSelector } from "react-redux";
import { FaHeadset } from "react-icons/fa";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";

const Dashboard = () => {
  const loading = useSelector((state) => state.Role.status === "loading");
  const permissionDetailData = useSelector((state) => state.Role?.permissionDetails || []);
  const {Courier_Service, Travel_Management, Admin_Helpdesk} = permissionDetailData.data || {};
  // const {Courier_Service, Travel_Management} = permissionDetailData.data || {};
  // const savedUserData = localStorage.getItem("userData");
  // console.log('savedUserData dashboard..',savedUserData)
  const scheduleItems = [
    "Routine Checkup and maintenance of AC on 01 Sep 2024",
    "Routine Checkup and maintenance of Fire Alarm on 02 Sep 2024",
    "Routine Checkup and maintenance of Fire Alarm on 02 Sep 2024",
  ];

  const courierItems = [
    "Inward Courier-Snkit Soni-45258",
    "Outward Courier-Snkit Soni-45258",
    "Outward Courier-Snkit Soni-45258",
  ];
  const adminHelpdeskItems = [
    "Resolve ticket #123 - Network issue",
    "Close ticket #124 - Software installation",
  ];

  const events = [];
  const procurement = ["stock inventory Approval of month Sep 2024-Pending"];

  const Agreement = [
    "Contract/AMC Renewal Due: Hyginetech India Pvt Ltd on 21 Sep 2024",
  ];

  const travelItems = ["Booked tickets- Neeraj-Maharashtra to Gujrat-ByTrain"];

  const maxItemsToShow = 2;

  return (
    <>
      <Row className="dashboard me-1 ms-1">
        <Card className="">
          {/* <Title title="Dashboard" /> */}
          <Title title="Welcome to Dashboard" />
          <Card.Body>
            {/* <Row className=" justify-content-around">
              <Cards
                title="PPM Schedule"
                icon={BsCalendar2Event}
                items={scheduleItems}
                maxItemsToShow={maxItemsToShow}
                viewAllLink="/view-all-schedule"
              />
               {Courier_Service?.view && (
              <Cards
                title="Courier"
                icon={TbTruckDelivery}
                items={courierItems}
                maxItemsToShow={maxItemsToShow}
                // viewAllLink="/view-all-couriers"
              />
               )}
               {Travel_Management?.view && (
              <Cards
                title="Travel"
                icon={MdOutlineCardTravel}
                items={travelItems}
                maxItemsToShow={maxItemsToShow}
                viewAllLink="/view-all-travel"
              />
               )}
                {Admin_Helpdesk?.view && (
                <Cards
                  title="Admin Helpdesk"
                  icon={FaHeadset}
                  items={adminHelpdeskItems}
                  maxItemsToShow={maxItemsToShow}
                  viewAllLink="/view-all-helpdesk"
                />
              )}
            </Row> */}
            {/* <Row className="mt-3 justify-content-around">
              <Cards
                title="Upcoming Events"
                icon={BsCalendar2Event}
                items={events}
                maxItemsToShow={maxItemsToShow}
                viewAllLink="/view-all-schedule"
              />
              <Cards
                title="Procurement"
                icon={FaWarehouse}
                items={procurement}
                maxItemsToShow={maxItemsToShow}
                viewAllLink="/view-all-couriers"
              />
              <Cards
                title="Agreement"
                icon={FaCheckCircle}
                items={Agreement}
                maxItemsToShow={maxItemsToShow}
                viewAllLink="/view-all-travel"
              />
            </Row> */}
          </Card.Body>
        </Card>
      </Row>
      {loading && <CommonLoader />}

    </>
  );
};

export default Dashboard;
