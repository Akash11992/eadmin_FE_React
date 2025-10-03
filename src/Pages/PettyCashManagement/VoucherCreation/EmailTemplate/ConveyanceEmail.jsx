const ConveyanceEmail = (getData) => {
    console.log('getData..23213',getData)
  const API = `${process.env.REACT_APP_API}/api`;
  return `
      <html>
        <body>
          <div style="font-family: Arial, sans-serif;">
            <p>Dear ${getData?.user_name || "Dear User"
            },</p>
            <p>We would like to share the details of your inward item:</p>
            <table border="1" style="border-collapse: collapse; width: 100%; text-align: center; margin-top: 20px;">
              <thead>
                <tr style="background-color:rgb(219, 52, 52); color: rgb(250, 246, 246);">
                <th>Voucher No.</th>
                <th>User Name</th>
                <th>User Details</th>
                <th>Company Details</th>
                <th>Travel Mode</th>
                <th>From Place</th>
                <th>To Place</th>
                <th>Voucher Date</th>
                <th>Voucher Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
              </thead>
              <tbody>
                    <tr>
                      <td>${getData?.voucher_no || ""}</td>
                      <td>${getData?.user_name || ""}</td>
                      <td>${getData?.user_details|| ""}</td>
                      <td>${getData?.company_details || ""}</td>
                      <td>${getData?.travel_mode || ""}</td>
                      <td>${getData?.getData || ""}</td>
                      <td>${getData?.to_place || ""}</td>
                      <td>${getData?.voucher_date || ""}</td>
                      <td>${getData?.voucher_type || ""}</td>
                      <td>${getData?.amount || ""}</td>
                      <td>${getData?.status || ""}</td>
                      <td>${getData?.remarks || ""}</td>
                    </tr>
              </tbody>
            </table>
  
            <!-- Action buttons below the table -->
            <div style="margin-top: 20px; text-align: center;">
              <a href="${API}/itemService/updatestatusinwarditem/${getData?.voucher_no || ""}" 
                 style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; margin-right: 20px; display: inline-block;">
                 Acknowledge
              </a>
            </div>
  
            <p style="margin-top: 20px;">If you have any questions, feel free to contact us.</p>
            <p>Best regards,</p>
            <p>Dispatch Team</p>
            <p style="margin-top: 20px; font-size: 12px; color: #888;"><i>This is an automated email. Please do not reply.</i></p>
          </div>
        </body>
      </html>
    `;
};

export default ConveyanceEmail;
