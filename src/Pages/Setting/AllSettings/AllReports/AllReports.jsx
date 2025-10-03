import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Title } from "../../../../Components/Title/Title";

const AllReports = () => {
  const reports = [
    {
      path: "/emailAnalytics",
      title: "Email Analytics",
      description: "Summary of the email status(sent, bounced, opened, and clicked) based on date, template, module and user."
    },
    {
      path: "/sentEmailStatus",
      title: "Sent Email Status",
      description: "Emails sent by users to all records and their status."
    },
    {
      path: "/bounceReport",
      title: "Bounce Report",
      description: "Summary of bounced emails, reason for the bounce, date the bounce occurred, the record related to the bounce etc."
    },
    {
      path: "/unsubscribeUser",
      title: "Unsubscribe User",
      description: "Summary of Unsubscribe User, reason for the Unsubscribe User, date the Unsubscribe User occurred, the record related to the Unsubscribe User etc."
    },
    {
      path: "/auditReport",
      title: "Audit Report",
      description: "Summary of all user actions and changes within the system."
    },
    {
      path: "/activityReport",
      title: "Activity Report",
      description: "Summary of all user actions and changes within the system."
    },
    {
      path: "/scheduleReport",
      title: "Schedule Report",
      description: "Summary of all user actions and changes within the system."
    }
  ];

  return (
    <div fluid class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="mt-3 ms-0">
        <Title title="All Reports" />
      </Row>
      <hr />

      <Row className="pt-2 pb-2 bg-light">
        <Col md={12}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td>
                    <Link to={report.path} className="text-decoration-none">
                      {report.title}
                    </Link>
                  </td>
                  <td>{report.description}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default AllReports;
