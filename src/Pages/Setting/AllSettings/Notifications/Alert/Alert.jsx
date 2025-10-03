import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row } from "react-bootstrap";
import { Title } from "../../../../../Components/Title/Title";
import { useNavigate } from "react-router-dom";
import AlertTravelManagement from "./AlertTravelManagement/AlertTravelManagement";
import AlertCourierServices from "./AlertCourierServices/AlertCourierServices";
import '../Alert/Alert.css';
import ApprovalWorkflow from "./ApprovalWorkflow/ApprovalWorkflow";
import AlertFormBalanceSummary from "./AlertBalanceSummary/AlertFormBalanceSummary";

const DefaultError = ({ errorMessage }) => <div>{errorMessage}</div>;

const sections = [
  // { id: "London", title: "Vendor Management" },
  // { id: "Courier_Services", title: "Courier Services" },
  { id: "Travel_Management", title: "Travel Management" },
  { id: "balance_summary", title: "Balance Summary" },
  // { id: "London1", title: "PPM Schedule Management" },
  // { id: "Paris1", title: "Admin Helpdesk" },
  // { id: "Tokyo1", title: "Customer Satisfaction Feedback" },
  // { id: "approvalWorkflow", title: "Approval Workflow" },
  // { id: "London2", title: "Attendance of Support Staff" },
  // { id: "Paris2", title: "Petty Cash Management" },
  // { id: "Tokyo2", title: "Repair & Maintenance Works" },
];

const Alert = () => {
  const [activeSection, setActiveSection] = useState("Travel_Management");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const handleSave = (sectionTitle) => {
    setErrorMessage(
      `Something went wrong in ${sectionTitle}. Please try again or contact support.`
    );
  };

  const handleSectionClick = (section) => {
    // Update the state for active section
    setActiveSection(section.id);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "London":
        return <DefaultError errorMessage={errorMessage} />;
      case "Paris":
        return <DefaultError errorMessage={errorMessage} />;
      case "Travel_Management":
        return <AlertTravelManagement />;
      case "Courier_Services":
        return <AlertCourierServices />;
      case "approvalWorkflow":
        return <ApprovalWorkflow />;
      case "balance_summary":
        return <AlertFormBalanceSummary />
      default:
        return <DefaultError errorMessage={errorMessage} />;
    }
  };

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="mt-3 ms-0">
        <Title title="Alert" />
      </Row>
      <hr />
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 p-0">
          <div className="list-group ms-2">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`list-group-item list-group-item-action no-border ${activeSection === section.id ? "active-tab" : ""
                  }`}
                onClick={() => handleSectionClick(section)}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9 border content-area">
          <Row className="mt-2 ms-0">
            <h3>{sections.find((s) => s.id === activeSection)?.title}</h3>
          </Row>
          <hr />
          <div className="row p-2 scrollable-content">
            {/* Render the content based on the active section */}
            {renderContent()}
            {/* <a
              className="btn btn-dark mt-4 mb-3 col-md-3"
              href="#"
              onClick={() => handleSave(sections.find((s) => s.id === activeSection)?.title)}
            >
              Save
            </a> */}
          </div>
        </div>
      </div>

      {/* <style jsx>{`
        .list-group {
          background-color: #f1f1f1 !important;
          border-radius: 0 !important;
        }

        .list-group-item {
          background-color: transparent !important;
          border-radius: 0 !important;
          border: 1 !important;
        }

        .active-tab {
          background-color: #ff9a9a !important;
          color: black !important;
        }
          .content-area {
          margin-left: 25%;
          padding-top: 60px;
          overflow-y: auto;
        }

        .scrollable-content {
          max-height: 75vh;
          overflow-y: auto;
        }
      `}</style> */}
    </div>
  );
};

export default Alert;
