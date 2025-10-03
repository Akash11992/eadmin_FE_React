import React, { useState } from "react";
import Encryption from "../../Decryption/Encryption";

const FinalJourneyDetailsOnMail = ({
  finalHodBookingData,
  referenceId,
  savedUserData,
  vendor,
  flightNameMap,
  journeyClassOption,
  vendorDetailsNameData,
  timeData,
  name,
  currentBaseUrl,
}) => {
  const [remark, setRemark] = useState("");
  const encryptData = Encryption();
  const API = `${process.env.REACT_APP_API}/api`;
  // Generate the Reject Link dynamically with the remark

  const encryptID = encryptData(referenceId);
  const encryptUser = encryptData(savedUserData?.data?.userId);
  const refID = finalHodBookingData[0]?.TRVD_REFERENCE_ID || null;
  const encryptrefID = encryptData(refID);
  const generateRejectLink = () => {
    const baseUrl = `${API}/final_hod_approval/${encryptID}/REJECT/remarks/${encryptUser}`;
    return `${baseUrl.replace(
      "remarks/",
      `remarks/${encodeURIComponent(remark)}`
    )}`;
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h3>Dear Approver,</h3>
      <p style={{ marginTop: "30px" }}>
        The following International Air Travel request: Req. ID:{refID} was
        raised by {finalHodBookingData[0]?.booked_by} and has been sent to you
        for your approval.
      </p>
      <table
        border="1"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "center",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#dc3545", color: "white" }}>
            <th>S No</th>
            <th>Request ID</th>
            <th>Traveler Name</th>
            <th>Vendor Name</th>
            <th>Booked By</th>
            <th>Date Of Journey</th>
            <th>From Place</th>
            <th>To Place</th>
            <th>Flight Name</th>
            <th>Journey Class</th>
            <th>Time</th>
            <th>Amount</th>
            <th>Document File</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {finalHodBookingData?.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.TRVD_REFERENCE_ID || ""}</td>
                <td>{name?.username || ""}</td>
                <td>{item.TRVD_VENDOR_ID || ""}</td>

                <td>{item.booked_by || ""}</td>
                <td>
                  {item.TRVD_DATE_OF_JOURNEY
                    ? item.TRVD_DATE_OF_JOURNEY.split(" ")[0]
                    : ""}
                </td>
                <td>{item.TRVD_FROM_LOCATION || ""}</td>
                <td>{item.TRVD_TO_LOCATION || ""}</td>
                <td>{item.TRVD_FLIGHT_NAME || ""}</td>
                <td>{item.TRVD_JOURNEY_CLASS || ""}</td>
                <td>{item.TRVD_TIME}</td>
                <td>{item.TRVD_TOTAL_AMOUNT || ""}</td>
                <td>
                  <a href={item.TRVD_DOCUMENT_FILE_URL} target="_blank">
                    {" "}
                    {item.TRVD_DOCUMENT_FILE || ""}
                  </a>
                </td>
                <td
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {item.TRVD_REMARKS || ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: "30px" }}>
        <p>
          Reference (This is just for reference ,quotations received from other
          vendors ){" "}
        </p>
        <table
          border="1"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            textAlign: "center",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#D3D3D3",
                color: "black",
                border: "1px solid black",
              }}
            >
              <th>Sr No.</th>
              <th>Vendor Name</th>
              <th>Date of Journey</th>
              <th>From Place</th>
              <th>To Place</th>
              <th>Flight Name</th>
              <th>Journey Class</th>
              <th>Time</th>
              <th>Total Amount</th>
              <th>Upload Document</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {vendor?.map((item, index) => {
              const flight = flightNameMap?.find(
                (flight) =>
                  flight.value == (item.flightName && item.flightName[0])
              );

              const journeyclass = journeyClassOption?.find(
                (flight) =>
                  flight.value == (item.journeyClass && item.journeyClass[0])
              );
              const vendor = vendorDetailsNameData?.find(
                (flight) =>
                  flight.VENDOR_ID && flight.VENDOR_ID == item.vendorName
              );
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{vendor ? vendor.DESCRIPTION : ""}</td>
                  <td>{item.journeyDate || ""}</td>
                  <td>{item.fromPlace || ""}</td>
                  <td>{item.toPlace || ""}</td>
                  <td>{flight ? flight.label : ""}</td>
                  <td>{journeyclass ? journeyclass.label : ""}</td>
                  <td>{item.stops || ""}</td>
                  <td>{item.totalAmount || ""}</td>
                  <td>
                    <a href={item.docUrl} target="_blank">
                      {item.document || ""}
                    </a>
                  </td>
                  <td>{item.remark || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "20px" }}>
        {/* Approve Link */}
        <a
          href={`${API}/final_hod_approval/${encryptID}/ACCEPT/remark/${encryptUser}`}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#28a745",
            color: "white",
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Approve
        </a>

        {/* Reject Link */}
        <a
          id="rejectLink"
          href={generateRejectLink()}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#dc3545",
            color: "white",
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reject
        </a>
        <a
          style={{
            marginLeft: "10px",
            textDecoration: "none",
            color: "black",
            fontWeight: "0.5px",
            cursor: "pointer",
          }}
          href={`${currentBaseUrl}/remark?remark=${encodeURIComponent(
            encryptrefID
          )}`}
          target="_blank"
        >
          <small>
            {" "}
            To Enter Your remark,{" "}
            <span
              style={{
                textDecoration: "underline",
                color: "blue",
              }}
            >
              Click Here
            </span>
          </small>{" "}
        </a>
      </div>

      <div style={{ marginTop: "40px", fontSize: "14px", color: "#555" }}>
        <p>Best regards,</p>
        <p>Ambit Admin</p>
      </div>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#888" }}>
        <p>This is a system-generated mail. Please do not reply.</p>
      </div>
    </div>
  );
};

export default FinalJourneyDetailsOnMail;
