import React from "react";

const FinalCarJourneyEmail = ({
  carJourneys,
  form,
  selectedTraveler,
  carType,
  packageData,
  selectedVendor,
  savedUserData
}) => {
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "";
  };
  const name = Array.isArray(selectedTraveler)
    ? selectedTraveler.find((item) => item.userId == form.travelerName)
    : null;

  const refID = carJourneys[0]?.TRJM_REFERENCE_ID;
  console.log(carJourneys,"carJourneys")
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h4>Dear Vendor Partner,</h4>
      <p style={{ marginTop: "30px" }}>
        Please find below the car hire request for your reference:{refID}
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
            <th>Traveler Name</th>
            <th>Vendor Name</th>
            <th>Date of Journey</th>
            <th>Pickup Location</th>
            <th>Drop Location</th>
            <th>Car Type</th>
            <th>Package</th>
            <th>Pickup Time</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {carJourneys.map((carJourney, index) => {
            const type = carType?.find(
              (type) => type.value == carJourney.flight_name
            );
            const packageD = packageData?.find(
              (type) => type.value == carJourney.journey_class
            );
            return (
              <tr key={index}>
                <td>{index + 1}</td>  
                <td>{name?.username || ""}</td>
                <td>{selectedVendor?.DESCRIPTION || ""}</td>
                <td>{formatDate(carJourney?.date_of_journey)}</td>
                <td>{carJourney?.from_place || ""}</td>
                <td>{carJourney?.to_place || ""}</td>
                <td>{type ? type.label : ""}</td>
                <td>{packageD ? packageD.label : ""}</td>
                <td>{carJourney?.travel_date_from || ""}</td>
                <td>{carJourney?.remarks || ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ marginTop: "30px" }}>You are requested to send booking confirmation to the booker.</p>
      {/* Signature Section */}
      <div style={{ marginTop: "40px", fontSize: "14px", color: "#555" }}>
        <p>Best regards,</p>
        <p>{savedUserData?.data?.name}</p>
      </div>

      <div style={{ marginTop: "20px", fontSize: "12px", color: "#888" }}>
        <p>This is a system-generated mail. Please do not reply.</p>
      </div>
    </div>
  );
};

export default FinalCarJourneyEmail;
