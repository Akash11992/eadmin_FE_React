import React from "react";
import { Table } from "react-bootstrap";

const BookingCommonTravel = ({ data, heading }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>; // Handle empty data gracefully
  }

  // Dynamically extract columns from the first object in the data array
  const columns = Object.keys(data[0]);
  return (
    <div className="overflow-auto mt-3">
      <h4>{heading}</h4>
      <Table id="tblJourneyDetails" bordered striped responsive>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="text-nowrap bg-danger text-white">
                {col.replace(/_/g, " ")} {/* Replace underscores with spaces */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-center">
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    wordBreak: colIndex === 12 ? "break-word" : "normal",
                    whiteSpace: "normal",
                  }}
                >
                  {row[col] !== null && row[col] !== undefined ? row[col] : "-"}{" "}
                  {/* Handle null or undefined */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingCommonTravel;
