const InwardCourierMail = (inwardDetails) => {
  const API = `${process.env.REACT_APP_API}/api`;
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif;">
          <p>Dear ${inwardDetails[0]?.["Shipper Name"] || "Valued Customer"},</p>
          <p>We would like to share the details of your inward courier:</p>
          
          <table border="1" style="border-collapse: collapse; width: 100%; text-align: center; margin-top: 20px;">
            <thead>
              <tr style="background-color: rgb(219, 52, 52); color: white;">
                <th>Unique No.</th>
                <th>Date</th>
                <th>Time</th>
                <th>Recipient Name</th>
                <th>Department</th>
                <th>Sender Name</th>
                <th>Sender Company</th>
                <th>Mobile No.</th>
                <th>Courier Co.</th>
                <th>Dispatch Team</th>
                <th>Received By</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${inwardDetails
                .map(
                  (courier) => `
                    <tr>
                      <td>${courier["UniqueNo"] || ""}</td>
                      <td>${courier["Date"] || ""}</td>
                      <td>${courier["Time"] || ""}</td>
                      <td>${courier["Shipper Name"] || ""}</td>
                      <td>${courier["Department"] || ""}</td>
                      <td>${courier["Consignees Name"] || ""}</td>
                      <td>${courier["Consignees Company Name"] || ""}</td>
                      <td>${courier["Mobile No."] || ""}</td>
                      <td>${courier["Courier Co. Name"] || ""}</td>
                      <td>${courier["Dispatch Team"] || ""}</td>
                      <td>${courier["Received By"] || ""}</td>
                      <td>${courier["Description"] || ""}</td>
                      <td>${courier["Status"] || ""}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>

          <div style="margin-top: 20px; text-align: center;">
            <a href="${API}/courierService/updatestatusinwardcourier/${inwardDetails[0]?.["UniqueNo"] || ""}" 
               style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; margin-right: 20px; display: inline-block;">
               Acknowledge
            </a>
          </div>

          <p style="margin-top: 20px;">If you have any questions, feel free to contact us.</p>
          <p>Best regards,</p>
          <p>Dispatch Team</p>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">
            <i>This is an automated email. Please do not reply.</i>
          </p>
        </div>
      </body>
    </html>
  `;
};

export default InwardCourierMail;
