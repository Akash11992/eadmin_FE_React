const VisitorMeetingMail = (visitor) => {
  return `
      <html>
        <body>
          <div style="font-family: Arial, sans-serif;">
            <h2>Dear ${visitor.meeting_with || ""},</h2>
            <h3 style="margin-top: 30px;">Meeting Notification: Visitor Details</h3>
            <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
              <thead>
                <tr style="background-color: #dc3545; color: white;">
                  <th class="text-nowrap bg-primary text-white">Visitor Name</th>
                  <th class="text-nowrap bg-primary text-white">No of Persons</th>
                  <th class="text-nowrap bg-primary text-white">Company Name</th>
                  <th class="text-nowrap bg-primary text-white">Gender</th>
                  <th class="text-nowrap bg-primary text-white">Meeting With</th>
                  <th class="text-nowrap bg-primary text-white">Department</th>
                  <th class="text-nowrap bg-primary text-white">Purpose Of Visit</th>
                  <th class="text-nowrap bg-primary text-white">Visitor Card No.</th>
                  <th class="text-nowrap bg-primary text-white">Issued By</th>
                  <th class="text-nowrap bg-primary text-white">Appointment Status</th>
                  <th class="text-nowrap bg-primary text-white">Visit Date</th>
                  <th class="text-nowrap bg-primary text-white">In Time</th>
                </tr>
              </thead>
              <tbody>
                    <tr>
                      <td>${visitor.visitor_name || ""}</td>
                      <td>${visitor.no_of_person || ""}</td>
                      <td>${visitor.v_company_name || ""}</td>
                      <td>${visitor.gender || ""}</td>
                      <td>${visitor.meeting_with || ""}</td>
                      <td>${visitor.department_id || ""}</td>
                      <td>${visitor.purpose_of_visit || ""}</td>
                      <td>${visitor.card_no || ""}</td>
                      <td>${visitor.issued_by || ""}</td>
                      <td>${visitor.appointment_status || ""}</td>
                      <td>${visitor.visit_date || ""}</td>
                      <td>${visitor.in_time || ""}</td>
                    </tr>
              </tbody>
            </table>
            <div style="margin-top: 40px; font-size: 14px; color: #555;">
              <p>Should you have any questions or require further assistance, please feel free to reach out.</p>
              <p><strong>Thank you!</strong></p>
              <p>E-Admin Team</p>
            </div>
            <div style="margin-top: 20px; font-size: 12px; color: #888;">
              <p><i>This is a system-generated mail.</i></p>
            </div>
          </div>
        </body>
      </html>
    `;
};

export default VisitorMeetingMail;
