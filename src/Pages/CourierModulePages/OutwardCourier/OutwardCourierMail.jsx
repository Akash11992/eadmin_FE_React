const OutwardCourierMail = (courierDetails) => {
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif;">
          <p>Dear ${courierDetails.sender_name || "Valued Customer"},</p>
          <p>We would like to share the details of your outward courier:</p>
          
          <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
            <thead>
              <tr style="background-color: #dc3545; color: white;">
                <th>Ref Unique No</th>
                <th>Employee Code</th>
                <th>Sender Name</th>
                <th>Department</th>
                <th>Pickup Date</th>
                <th>Delivery Date</th>
                <th>Delivery Time</th>
                <th>Consignee Name</th>
                <th>Consignees Company Name</th>
                <th>Air Way Bill No.</th>
                <th>Courier Co. Name</th>
                <th>Official Or Personal</th>
                <th>Courier Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${courierDetails.reference_no || ""}</td>
                <td>${courierDetails.emp_code || ""}</td>
                <td>${courierDetails.sender_name || ""}</td>
                <td>${courierDetails.sender_department || ""}</td>
                <td>${courierDetails.shipping_date || ""}</td>
                <td>${courierDetails.delivery_date || ""}</td>
                <td>${courierDetails.delivery_time || ""}</td>
                <td>${courierDetails.consignee_name || ""}</td>
                <td>${courierDetails.consignee_company_name || ""}</td>
                <td>${courierDetails.Air_way_bill_no || ""}</td>
                <td>${courierDetails.courier_co_name || ""}</td>
                <td>${courierDetails.official_or_personal || ""}</td>
                <td>${courierDetails.courier_status || ""}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 40px; font-size: 14px; color: #555;">
            <p>Best regards,</p>
            <p>Dispatch Team</p>
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #888;">
            <p><i>This is a system-generated mail.</i></p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default OutwardCourierMail;
