import React, { useEffect, useState } from "react";
import { Collapse, Button, Table, Alert, Form } from "react-bootstrap";
import CustomInput from "../../CustomInput/CustomInput";
import MultiSelectDropdown from "../../CustomDropdown/MultiSelectDropdown";
import { BiSolidPlaneAlt } from "react-icons/bi";
import Select from "react-select";
import { AirportLocation } from "../../../JsonData/Airport";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import AutosizeTextarea from "../../AutosizeTextarea/AutosizeTextarea";
const JourneyBooking = ({
  open,
  journeys,
  journeyClassData,
  editMode,
  stops,
  travellerTime,
  flight_name,
  meal,
  HodAction,
  setJourneys,
  setVendor,
  travelID,
  finalBookVenderData,
  existingData,
  reference_id,
  parseValue,
}) => {
  const [selectAllJourney, setSelectAllJourney] = useState(false);

  useEffect(() => {
    if (existingData && Array.isArray(existingData?.journey_details)) {
      const mappedJourneys = existingData?.journey_details?.map((journey) => ({
        TRJM_ID: journey?.TRJM_ID || "",
        TRJM_REFERENCE_ID: journey?.TRJM_REFERENCE_ID || "",
        date_of_journey: journey?.TRJM_DATE_OF_JOURNEY || "",
        from_place: journey?.TRJM_FROM_PLACE || "",
        to_place: journey?.TRJM_TO_PLACE || "",
        flight_name: parseValue(journey?.TRJM_FLIGHT_NAME),
        journey_class: parseValue(journey?.TRJM_TRAVEL_JOURNEY_CLASS),
        frequenct_flyer_no: journey?.TRJM_FREQUENT_FLYER_NO || 0,
        stops: parseValue(journey?.TRJM_STOPS),
        time: parseValue(journey?.TRJM_TIME),
        travel_date_from: journey?.TRJM_DATE_TIME_RANGE_FROM || "",
        travel_date_to: journey?.TRJM_DATE_TIME_RANGE_TO || "",
        meal: journey?.TRJM_MEAL || 0,
        showMealOptions: Boolean(journey?.TRJM_MEAL),
        seat_preference: "",
        remarks: journey?.TRJM_REMARKS || "",
        pick_details: parseValue(journey?.TRJM_PICK_UP_DETAILS),
      }));

      setJourneys(mappedJourneys);
      setSelectAllJourney(false);
    }
  }, [reference_id, existingData]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAllJourney;
    setSelectAllJourney(newSelectAll);

    const updatedJourneys = journeys?.map((journey) => ({
      ...journey,
      selectJourney: newSelectAll,
    }));
    setJourneys(updatedJourneys);

    if (newSelectAll) {
      const newVendorRows = updatedJourneys.map((row) => {
        const fromPlaceOption = AirportLocation.find(
          (option) => option.value === row.from_place
        );
        const toPlaceOption = AirportLocation.find(
          (option) => option.value === row.to_place
        );
        return {
          vendorName: "",
          journeyDate: row?.date_of_journey
            ? new Date(row?.date_of_journey)?.toISOString()
            : "",
          fromPlace: fromPlaceOption ? fromPlaceOption.label : "",
          toPlace: toPlaceOption ? toPlaceOption.label : "",
          flightName: "",
          journeyClass: "",
          stops: "",
          totalAmount: "",
          document: null,
          remark: "",
          reference_id: row.TRJM_REFERENCE_ID || "",
          travel_id: travelID,
          journey_id: row.TRJM_ID || "",
        };
      });
      setVendor((prev) => {
        const existVendor = prev?.filter((item) => item.journey_id == null);
        return [...existVendor, ...newVendorRows];
      });
    } else {
      setVendor([
        {
          vendorName: "",
          journeyDate: "",
          fromPlace: "",
          toPlace: "",
          flightName: "",
          journeyClass: "",
          stops: "",
          totalAmount: "",
          document: null,
          remark: "",
          reference_id: "",
          travel_id: "",
          journey_id: "",
        },
      ]);
    }
  };
  const handleJourneyChange = (index, field, value) => {
    setJourneys((prevJourneys) => {
      const updatedJourneys = [...prevJourneys];
      updatedJourneys[index] = {
        ...updatedJourneys[index],
        [field]: value,
      };

      if (field === "selectJourney") {
        if (value) {
          const selectedRows = [];
          const airportLocationMap = AirportLocation.reduce((acc, option) => {
            acc[option.value] = option.label;
            return acc;
          }, {});

          for (const row of updatedJourneys) {
            if (row?.selectJourney) {
              selectedRows?.push(row);
            }
          }
          console.log(selectedRows, "selectedRows");
          const newVendorRows = selectedRows?.map((row) => ({
            vendorName: "",
            journeyDate: row?.date_of_journey
              ? new Date(row?.date_of_journey)?.toISOString()
              : "",
            fromPlace: airportLocationMap[row?.from_place] || "",
            toPlace: airportLocationMap[row?.to_place] || "",
            flightName: "",
            journeyClass: "",
            stops: "",
            totalAmount: "",
            document: null,
            remark: "",
            reference_id: row.TRJM_REFERENCE_ID || null,
            travel_id: travelID || null,
            journey_id: row.TRJM_ID || null,
          }));
          console.log(newVendorRows, "newVendorRows");
          setVendor((prev) => {
            const existVendor = prev?.filter((item) => item.journey_id == null);
            return [...existVendor, ...newVendorRows]; // Properly update state
          });
        } else {
          const allUnchecked = updatedJourneys.every(
            (journey) => !journey.selectJourney
          );

          if (allUnchecked) {
            // If all are unchecked, reset vendor to default structure
            setVendor([
              {
                vendorName: "",
                journeyDate: "",
                fromPlace: "",
                toPlace: "",
                flightName: "",
                journeyClass: "",
                stops: "",
                totalAmount: "",
                document: null,
                remark: "",
                reference_id: "",
                travel_id: "",
                journey_id: "",
              },
            ]);
          } else {
            // If not all are unchecked, remove the specific vendor related to the unchecked journey
            setVendor((prevVendor) => {
              return prevVendor.filter(
                (vendor) => vendor.journey_id !== updatedJourneys[index].TRJM_ID
              );
            });
          }
        }
      }

      return updatedJourneys; // Return the updated journeys
    });
  };

  const addJourney = () => {
    setJourneys([
      ...journeys,
      {
        // id: journeys.length + 1,
        date_of_journey: "",
        from_place: "",
        to_place: "",
        flight_name: [],
        journey_class: [],
        frequenct_flyer_no: 0,
        stops: ["1"],
        time: [],
        travel_date_from: "",
        travel_date_to: "",
        meal: "1",
        showMealOptions: false,
        seat_preference: "",
        remarks: "",
        pick_details: [],
      },
    ]);
  };

  const handleReturnChange = (index, value) => {
    setJourneys((prevJourneys) => {
      const selectedJourney = prevJourneys[index];

      // Validate if "from_place" or "to_place" is blank
      if (
        value === "yes" &&
        (!selectedJourney.from_place || !selectedJourney.to_place)
      ) {
        toast.warning(
          "Please fill both 'From Place' and 'To Place' before selecting a return journey."
        );
        return prevJourneys; // Exit early to prevent state updates
      }

      // Update the journey's return value
      const updatedJourneys = prevJourneys.map((journey, i) =>
        i === index ? { ...journey, return: value } : journey
      );

      // If "Yes" is selected, create and insert a return journey
      if (value === "yes") {
        const returnJourney = {
          ...selectedJourney,
          from_place: selectedJourney.to_place,
          to_place: selectedJourney.from_place,
          date_of_journey: "", // Clear the date for the new journey
          travel_date_from: "",
          travel_date_to: "",
          id: Date.now(), // Unique identifier
          return: "no", // Default return value for the new row
          minDate: selectedJourney.date_of_journey,
        };

        return [
          ...updatedJourneys.slice(0, index + 1),
          returnJourney,
          ...updatedJourneys.slice(index + 1),
        ];
      }

      return updatedJourneys; // Return updated journeys if "Yes" is not selected
    });
  };

  const removeJourney = (index) => {
    if (journeys.length > 1) {
      setJourneys(journeys.filter((_, idx) => idx !== index));
    }
  };

  const handleCheckboxChange = (index, field, e) => {
    const { value, checked } = e.target;
    const currentMealType = journeys[index][field] || [];

    handleJourneyChange(
      index,
      field,
      checked
        ? [...currentMealType, value]
        : currentMealType.filter((item) => item !== value)
    );
  };

  return (
    <div>
      <div className="header mb-3 mt-3">
        <BiSolidPlaneAlt className="me-2" />
        <span>Journey Booking Details</span>
      </div>

      <Collapse in={open}>
        <div id="bookingTable">
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              whiteSpace: "nowrap",
              scrollbarWidth: "thin",
              borderRadius: "5px",
            }}
          >
            <Table style={{ whiteSpace: "pre" }}>
              <thead>
                <tr>
                  {editMode && (
                    <th className="text-nowrap bg-danger text-white">
                      <Form.Check
                        type="checkbox"
                        checked={selectAllJourney}
                        onChange={handleSelectAll}
                        disabled={HodAction || finalBookVenderData?.length > 0}
                      />
                    </th>
                  )}
                  <th
                    style={{ width: "15rem", padding: "0.5rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Date of Journey *
                  </th>
                  {/* <th className="text-nowrap bg-danger text-white">Ticket Booked By</th> */}
                  <th
                    style={{ width: "15rem", padding: "0.5rem 5rem" }}
                    className="text-nowrap bg-danger text-white col-6"
                  >
                    From Place*
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.5rem 5rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    To Place *
                  </th>
                  <th className="text-nowrap bg-danger text-white">
                    Preferred Airlines
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Journey Class
                  </th>
                  {/* <th className="text-nowrap bg-danger text-white">Frequent Flyer No. *</th> */}
                  <th className="text-nowrap bg-danger text-white">Stops</th>
                  <th className="text-nowrap bg-danger text-white">Time</th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Date Range From
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Date Range To
                  </th>
                  <th className="text-nowrap bg-danger text-white">
                    Meal Preference
                  </th>
                  {/* {!editMode && <th className="text-nowrap bg-danger text-white">Remark</th>} */}
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Remark
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Return Details
                  </th>
                  <th className="text-nowrap bg-danger text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {journeys?.map((journey, index) => (
                  <tr key={journey.id}>
                    {editMode && (
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={journey.selectJourney}
                          onChange={(e) =>
                            handleJourneyChange(
                              index,
                              "selectJourney",
                              e.target.checked
                            )
                          }
                          disabled={
                            HodAction || finalBookVenderData?.length > 0
                          }
                        />
                      </td>
                    )}
                    <td>
                      <DatePicker
                        selected={journey.date_of_journey}
                        onChange={(date) =>
                          handleJourneyChange(index, "date_of_journey", date)
                        }
                        minDate={journey.minDate || new Date()}
                        placeholderText="Select a Date"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        disabled={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>

                    <td>
                      <Select
                        value={AirportLocation.find(
                          (option) => option.value === journey.from_place
                        )}
                        onChange={(option) =>
                          handleJourneyChange(index, "from_place", option.value)
                        }
                        options={AirportLocation.filter(
                          (option) => option.value !== journey.to_place
                        )} // Exclude selected 'to_place'
                        isSearchable
                        placeholder="Select an option..."
                        getOptionLabel={(option) =>
                          `${option?.label} - ${option?.value}`
                        }
                        getOptionValue={(option) => option.value}
                        filterOption={(candidate, input) => {
                          const code = candidate.data["IATA Code"] || "";
                          const label = candidate.data.label || "";
                          return (
                            code.toLowerCase().includes(input.toLowerCase()) ||
                            label.toLowerCase().includes(input.toLowerCase())
                          );
                        }}
                        isDisabled={
                          HodAction || finalBookVenderData?.length > 0
                        }
                        menuPortalTarget={document.body} // Render the menu in a portal
                        menuPosition="fixed" // Position the menu fixed
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }} // Ensure the menu is above other elements
                      />
                    </td>
                    <td>
                      <Select
                        value={AirportLocation.find(
                          (option) => option.value === journey.to_place
                        )}
                        onChange={(option) =>
                          handleJourneyChange(index, "to_place", option.value)
                        }
                        options={AirportLocation.filter(
                          (option) => option.value !== journey.from_place
                        )} // Exclude selected 'from_place'
                        isSearchable
                        placeholder="Select an option..."
                        getOptionLabel={(option) =>
                          `${option?.label} - ${option?.value}`
                        }
                        getOptionValue={(option) => option.value}
                        filterOption={(candidate, input) => {
                          const code = candidate.data["IATA Code"] || "";
                          const label = candidate.data.label || "";
                          return (
                            code.toLowerCase().includes(input.toLowerCase()) ||
                            label.toLowerCase().includes(input.toLowerCase())
                          );
                        }}
                        isDisabled={
                          HodAction || finalBookVenderData?.length > 0
                        }
                        menuPortalTarget={document.body} // Render the menu in a portal
                        menuPosition="fixed" // Position the menu fixed
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }} // Ensure the menu is above other elements
                      />
                    </td>

                    <td>
                      <MultiSelectDropdown
                        data={flight_name}
                        valueKey="value"
                        labelKey="label"
                        value={journey.flight_name}
                        isDisabled={
                          HodAction ||
                          finalBookVenderData?.length > 0 ||
                          journey.disable
                        }
                        selectLabel="Select flight name"
                        handleCheckboxChange={(e) =>
                          handleCheckboxChange(index, "flight_name", e)
                        }
                      />
                    </td>
                    <td>
                      <MultiSelectDropdown
                        data={journeyClassData}
                        valueKey="value"
                        labelKey="label"
                        value={journey.journey_class}
                        isDisabled={
                          HodAction ||
                          finalBookVenderData?.length > 0 ||
                          journey.disable
                        }
                        selectLabel="Select journey class"
                        handleCheckboxChange={(e) =>
                          handleCheckboxChange(index, "journey_class", e)
                        }
                      />
                    </td>

                    <td>
                      <MultiSelectDropdown
                        data={stops}
                        valueKey="value"
                        labelKey="label"
                        value={journey.stops}
                        isDisabled={
                          HodAction ||
                          finalBookVenderData?.length > 0 ||
                          journey.disable
                        }
                        selectLabel="Select stops"
                        handleCheckboxChange={(e) =>
                          handleCheckboxChange(index, "stops", e)
                        }
                      />
                    </td>
                    <td>
                      <MultiSelectDropdown
                        data={travellerTime}
                        valueKey="value"
                        labelKey="label"
                        value={journey.time}
                        isDisabled={
                          HodAction ||
                          finalBookVenderData?.length > 0 ||
                          journey.disable
                        }
                        selectLabel="Select time"
                        handleCheckboxChange={(e) =>
                          handleCheckboxChange(index, "time", e)
                        }
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={journey.travel_date_from}
                        onChange={(date) =>
                          handleJourneyChange(index, "travel_date_from", date)
                        }
                        selectsStart
                        startDate={journey.travel_date_from}
                        endDate={journey.travel_date_to}
                        minDate={new Date()}
                        maxDate={journey.travel_date_toDate}
                        placeholderText="Select From Date"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        disabled={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={journey.travel_date_to}
                        onChange={(date) =>
                          handleJourneyChange(index, "travel_date_to", date)
                        }
                        selectsStart
                        startDate={journey.travel_date_from}
                        endDate={journey.travel_date_to}
                        minDate={journey.travel_date_from}
                        placeholderText="Select From Date"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        disabled={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>

                    <td>
                      <CustomDropdown
                        labelKey="label"
                        valueKey="value"
                        Dropdownlable
                        options={meal}
                        selectedValue={journey.meal}
                        onChange={(e) =>
                          handleJourneyChange(index, "meal", e.target.value)
                        }
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>

                    {/* {!editMode && ( */}
                    <td>
                      {/* <CustomInput
                        type="text"
                        value={journey.remarks}
                        placeholder="Enter remark"
                        onChange={(e) =>
                          handleJourneyChange(index, "remarks", e.target.value)
                        }
                        isDisabled={
                          HodAction || finalBookVenderData?.length > 0
                        }
                      /> */}
                      <AutosizeTextarea
                        value={journey.remarks}
                        onChnage={(e) =>
                          handleJourneyChange(index, "remarks", e.target.value)
                        }
                        rows={1}
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>
                    {/* )} */}

                    <td className="text-center align-middle">
                      <Form.Check
                        inline
                        label="Yes"
                        name={`return-${index}`}
                        type="radio"
                        value="yes"
                        checked={journey.return === "yes"}
                        onChange={(e) =>
                          handleReturnChange(index, e.target.value)
                        }
                        disabled={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>

                    <td>
                      {index === journeys.length - 1 ? (
                        <>
                          <Button
                            variant="dark"
                            onClick={addJourney}
                            disabled={
                              HodAction || finalBookVenderData?.length > 0
                            }
                          >
                            +
                          </Button>
                          <Button
                            className="ms-2"
                            variant="danger"
                            onClick={() => removeJourney(index)}
                            disabled={
                              HodAction || finalBookVenderData?.length > 0
                            }
                          >
                            -
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="danger"
                          onClick={() => removeJourney(index)}
                          disabled={
                            HodAction || finalBookVenderData?.length > 0
                          }
                        >
                          -
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Alert variant="warning">
              <strong>
                Note: Please click the <b>+</b> button to add rows.
              </strong>
            </Alert>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default JourneyBooking;
