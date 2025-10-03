import React from "react";

const JourneyDetailsToVendorOnMail = ({
  journeys,
  stopsData,
  timeData,
  mealOptions,
  flightNameMap,
  journeyClassOption,
  name,
  bookerName
}) => {
  // Helper functions
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h4>Dear Travel Partner,</h4>
      <p style={{ marginTop: "30px" }}>
        Please find below the international travel request details:
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
            <th>S No.</th>
            <th>Traveler Name</th>
            <th>Date of Journey</th>
            <th>From Place</th>
            <th>To Place</th>
            <th>Flight Name</th>
            <th>Journey Class</th>
            <th>Stops</th>
            <th>Time</th>
            <th>Date Range From</th>
            <th>Date Range To</th>
            <th>Meal Option</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {journeys.map((journey, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{name?.username || ""}</td>
              <td>{formatDate(journey.date_of_journey)}</td>
              <td>{journey.from_place || ""}</td>
              <td>{journey.to_place || ""}</td>
              <td>
                {journey.flight_name
                  ? journey.flight_name
                    .map(
                      (flight) =>
                        flightNameMap.find((item) => item.value == flight)
                          ?.label || ""
                    )
                    .join(", ")
                  : ""}
              </td>
              <td>
                {journey.journey_class
                  ? journey.journey_class
                    .map(
                      (jclass) =>
                        journeyClassOption.find(
                          (item) => item.value == jclass
                        )?.label || ""
                    )
                    .join(", ")
                  : ""}
              </td>
              <td>
                {journey.stops
                  ? journey.stops
                    .map(
                      (stop) =>
                        stopsData.find((item) => item.value == stop)?.label ||
                        ""
                    )
                    .join(", ")
                  : ""}
              </td>
              <td>
                {journey.time
                  ? journey.time
                    .map(
                      (time) =>
                        timeData.find((item) => item.value == time)?.label ||
                        ""
                    )
                    .join(", ")
                  : ""}
              </td>
              <td>{formatDate(journey.travel_date_from)}</td>
              <td>{formatDate(journey.travel_date_to)}</td>
              <td>
                {journey.meal
                  ? mealOptions.find((item) => item.value == journey.meal)
                    ?.label || ""
                  : ""}
              </td>
              <td>{journey.remarks || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p  style={{ marginTop: "30px" }}>You are requested to submit the best  proposal at the earliest.</p>
      {/* Signature Section */}
      <div style={{ marginTop: "40px", fontSize: "14px", color: "#555" }}>
        <p>Best regards,</p>
        <p>{bookerName}</p>
      </div>

      <div
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "#aaa",
        }}
      >
        <p>This is a system-generated mail. Please do not reply.</p>
      </div>
    </div>
  );
};

export default JourneyDetailsToVendorOnMail;
