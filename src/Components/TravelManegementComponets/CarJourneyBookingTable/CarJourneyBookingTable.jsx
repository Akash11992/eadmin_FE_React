import React from "react";
import { Collapse, Button, Table, Alert, Form } from "react-bootstrap";
import CustomInput from "../../CustomInput/CustomInput";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import { FaCarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import AutosizeTextarea from "../../AutosizeTextarea/AutosizeTextarea";

const CarJourneyBookingTable = (props) => {
  const { open, carType, packageData, carJourneys, setCarJourneys } = props;

  const addCarJourney = () => {
    setCarJourneys([
      ...carJourneys,
      {
        date_of_journey: "",
        from_place: "",
        to_place: "",
        flight_name: [],
        journey_class: [],
        frequenct_flyer_no: 0,
        stops: [],
        time: [],
        travel_date_from: "",
        travel_date_to: "",
        meal: 0,
        showMealOptions: false,
        seat_preference: "",
        remarks: "",
        pick_details: [],
      },
    ]);
  };

  const handleCarJourneyChange = (index, field, value) => {
    setCarJourneys(
      carJourneys.map((j, i) => (i === index ? { ...j, [field]: value } : j))
    );
  };
  const removeCarJourney = (index) => {
    if (carJourneys.length > 1) {
      setCarJourneys(carJourneys.filter((_, idx) => idx !== index));
    }
  };

  const handleCarCheckboxChange = (index, field, e) => {
    const { value, checked } = e.target;
    const currentFieldValues = carJourneys[index][field] || [];

    handleCarJourneyChange(
      index,
      field,
      checked
        ? [...currentFieldValues, value]
        : currentFieldValues.filter((item) => item !== value)
    );
  };
  return (
    <div>
      <div className="header mb-3 mt-3">
        <FaCarAlt className="me-2" />
        <span>Car Journey Booking Details</span>
      </div>

      <Collapse in={open}>
        <div id="bookingTable">
          <div className="table-responsive rounded-3 border bookmakerTable">
            <Table style={{ whiteSpace: "pre" }}>
              <thead>
                <tr>
                  <th
                    style={{ width: "10rem", padding: "0.5rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Date of Journey *
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.5rem 5rem" }}
                    className="text-nowrap bg-danger text-white col-6"
                  >
                    Pickup Location*
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.5rem 5rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Drop Location *
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.6rem 6rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Car type
                  </th>
                  <th
                    style={{ width: "8rem", padding: "0.6rem 6rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Package
                  </th>
                  <th className="text-nowrap bg-danger text-white">
                    Pickup Time *
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Remark
                  </th>
                  <th className="text-nowrap bg-danger text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {carJourneys?.map((carJourney, index) => (
                  <tr key={carJourneys.id}>
                    <td>
                      <DatePicker
                        selected={carJourney.date_of_journey}
                        onChange={(date) =>
                          handleCarJourneyChange(index, "date_of_journey", date)
                        }
                        minDate={carJourney.minDate || new Date()}
                        placeholderText="Select a Date"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={15}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <CustomInput
                        type="text"
                        value={carJourney.from_place}
                        placeholder="Please enter from place"
                        onChange={(e) =>
                          handleCarJourneyChange(
                            index,
                            "from_place",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <CustomInput
                        type="text"
                        value={carJourney.to_place}
                        placeholder="Please enter to place"
                        onChange={(e) =>
                          handleCarJourneyChange(
                            index,
                            "to_place",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <CustomDropdown
                        labelKey="label"
                        valueKey="value"
                        Dropdownlable
                        options={carType}
                        selectedValue={carJourney.flight_name}
                        onChange={(e) =>
                          handleCarJourneyChange(
                            index,
                            "flight_name",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <CustomDropdown
                        labelKey="label"
                        valueKey="value"
                        Dropdownlable
                        options={packageData}
                        selectedValue={carJourney.journey_class}
                        onChange={(e) =>
                          handleCarJourneyChange(
                            index,
                            "journey_class",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <CustomInput
                        type="time"
                        value={carJourney.travel_date_from}
                        onChange={(e) =>
                          handleCarJourneyChange(
                            index,
                            "travel_date_from",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      {/* <CustomInput
                        type="text"
                        value={carJourney.remarks}
                        placeholder="Enter remark"
                        onChange={(e) =>
                          handleCarJourneyChange(
                            index,
                            "remarks",
                            e.target.value
                          )
                        }
                      /> */}
                      <AutosizeTextarea
                        value={carJourney.remarks}
                        onChnage={(e) =>
                          handleCarJourneyChange(
                            index,
                            "remarks",
                            e.target.value
                          )
                        }
                        rows={1}
                      />
                    </td>
                    <td>
                      {index === carJourneys.length - 1 ? (
                        <>
                          <Button variant="dark" onClick={addCarJourney}>
                            +
                          </Button>
                          <Button
                            className="ms-2"
                            variant="danger"
                            onClick={() => removeCarJourney(index)}
                          >
                            -
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="danger"
                          onClick={() => removeCarJourney(index)}
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

export default CarJourneyBookingTable;
