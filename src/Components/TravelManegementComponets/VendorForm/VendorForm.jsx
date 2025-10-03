import React, { useEffect, useState } from "react";
import { Button, Collapse, Table, Form, Col, Row } from "react-bootstrap";
import CustomInput from "../../CustomInput/CustomInput";
import CustomDropdown from "../../CustomDropdown/CustomDropdown";
import { BiSolidPlaneAlt } from "react-icons/bi";
import DatePicker from "react-datepicker";
import {
  getTravelDetailsDataById,
  insert_vendor_details,
  insertFinalBooking,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CustomSingleButton from "../../CustomSingleButton/CustomSingleButton";
import Encryption from "../../Decryption/Encryption";
import AutosizeTextarea from "../../AutosizeTextarea/AutosizeTextarea";

const VendorForm = (props) => {
  const {
    vendor,
    setVendor,
    vendorNameData,
    journeyClassData,
    selectJourneyLocation,
    flight_name,
    HodAction,
    setJourneys,
    reference_id,
    finalBookVenderData,
    existingData,
    setExistingData,
  } = props;
  const [showApprovalButton, setShowApprovalButton] = useState(false);
  const [selectedVedorDetails, setSelectedVedorDetails] = useState([]);
  const encrypt = Encryption();

  const dispatch = useDispatch();
  useEffect(() => {
    if (existingData && Array.isArray(existingData?.vendor_details)) {
      const mappedVendors = existingData.vendor_details?.map((vendor) => ({
        vendorName: vendor?.TRVD_VENDOR_ID,
        TRVD_ID: vendor?.TRVD_ID,
        TRVD_REFERENCE_ID: vendor?.TRVD_REFERENCE_ID,
        TRVD_JOURNEY_DETAILS_ID: vendor?.TRVD_JOURNEY_DETAILS_ID,
        journeyDate: vendor?.TRVD_DATE_OF_JOURNEY
          ? vendor.TRVD_DATE_OF_JOURNEY?.split(" ")[0]
          : "",
        fromPlace: vendor?.TRVD_FROM_LOCATION || "",
        toPlace: vendor?.TRVD_TO_LOCATION || "",
        flightName: vendor?.TRVD_FLIGHT_NAME || "",
        journeyClass: vendor?.TRVD_JOURNEY_CLASS || "",
        stops: vendor?.TRVD_TIME || "",
        totalAmount: vendor?.TRVD_TOTAL_AMOUNT || "",
        document: vendor?.TRVD_DOCUMENT_FILE || null,
        remark: vendor?.TRVD_REMARKS || "",
        docUrl: vendor?.TRVD_DOCUMENT_FILE_URL || "",
      }));
      setVendor(mappedVendors);
    }
  }, [reference_id, existingData]);

  const handleVendorChange = (index, field, value) => {
    setVendor((prevVendor) => {
      const updatedVendor = prevVendor.map((vendorItem, i) => {
        if (i === index) {
          return {
            ...vendorItem,
            [field]: field === "selectVendor" ? value : value,
          };
        }
        return vendorItem;
      });
      const selectedVendor = updatedVendor[index];
      const selectedRows = [];
      const isVendorSelected =
        field === "selectVendor" && value && selectedVendor?.vendorName;

      setShowApprovalButton(isVendorSelected);

      for (const row of updatedVendor) {
        if (row.selectVendor) {
          selectedRows.push(row);
        }
      }
      setSelectedVedorDetails(selectedRows);

      return updatedVendor;
    });
  };
  const addVendor = () => {
    setVendor([
      ...vendor,
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
        supervisorName: "",
        supervisorId: "",
        reasonChangingSupervisor: "",
      },
    ]);
  };

  const removeVendor = (index) =>
    setVendor(vendor.filter((_, idx) => idx !== index));

  const onFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size should not exceed 5 MB.");
        e.target.value = "";
        return;
      }
      setVendor((prevVendor) =>
        prevVendor.map((vendorItem, i) =>
          i === index
            ? { ...vendorItem, fileUpload: file, document: file?.name }
            : vendorItem
        )
      );
    } else {
      toast.error("Please select a file.");
    }
  };
  const validateVendors = (vendor) => {
    for (let i = 0; i < vendor.length; i++) {
      // Convert vendorName to a string to ensure .trim() can be safely used
      if (!String(vendor[i]?.vendorName)?.trim()) {
        return `Vendor name is required`;
      }
    }
    return null; // No errors
  };

  const handleInsertVendorDetails = async () => {
    const errorMessage = validateVendors(vendor);
    if (errorMessage) {
      return toast.warning(errorMessage);
    }
    const payload = new FormData();
    payload.append("encryptedData", encrypt(JSON.stringify(vendor))); // Assuming vendor is an object
    vendor.forEach((item) => {
      if (item.fileUpload) {
        payload.append(`p_file_name`, item.fileUpload);
      }
    });
    try {
      const response = await dispatch(insert_vendor_details(payload));
      if (response?.payload?.success) {
        toast.success(
          response?.payload?.data || "Vendor request submitted successfully."
        );
        setJourneys((prevJourneys) =>
          prevJourneys.map((journey) => ({
            ...journey,
            selectJourney: false,
          }))
        );

        await fetchDetailsById();
      } else {
        toast.error(
          response?.payload?.message ||
            "Vendor request form submission failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const handleFinalBookVender = async () => {
    try {
      const response = await dispatch(insertFinalBooking(selectedVedorDetails));
      if (response?.payload?.success) {
        toast.success(
          response?.payload?.data || "Book Vendor submitted successfully."
        );
        await fetchDetailsById();
      } else {
        toast.error(
          response?.payload?.data ||
            "Book Vendor request form submission failed. Please try again."
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const fetchDetailsById = async () => {
    const response = await dispatch(
      getTravelDetailsDataById({
        p_reference_id: reference_id,
        p_limit: "10",
      })
    );
    if (response.payload.success === true) {
      setExistingData(response.payload.data[0]);
    }
  };
  return (
    <>
      <div className="header mb-3 mt-3 d-flex align-items-center">
        <BiSolidPlaneAlt className="me-2" />
        <span>Vendor Quotation Details</span>
      </div>

      <Collapse in={true}>
        <div id="vendorTable">
          <div
            className="table-responsive rounded-3 border bookmakerTable"
            style={{ overflowX: "auto" }}
          >
            <Table
              className="m-0"
              style={{ minWidth: "1000px", tableLayout: "auto" }}
            >
              <thead>
                <tr>
                  <th className="text-nowrap bg-danger text-white"></th>
                  <th className="text-nowrap bg-danger text-white">
                    Vendor Name *
                  </th>
                  <th className="text-nowrap bg-danger text-white">
                    Date of Journey
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    From Place
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    To Place
                  </th>
                  <th className="text-nowrap bg-danger text-white">
                    Flight Name
                  </th>
                  <th className="text-nowrap bg-danger text-white">
                    Journey Class
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Time
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Total Amount
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Upload Document
                  </th>
                  <th
                    style={{ width: "15rem", padding: "0.3rem 3rem" }}
                    className="text-nowrap bg-danger text-white"
                  >
                    Remark
                  </th>
                  <th className="text-nowrap bg-danger text-white">Add</th>
                </tr>
              </thead>
              <tbody>
                {vendor?.map((vendorItem, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={vendorItem.selectVendor}
                        onChange={(e) =>
                          handleVendorChange(
                            index,
                            "selectVendor",
                            e.target.checked
                          )
                        }
                        disabled={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>
                    <td>
                      <CustomDropdown
                        labelKey="DESCRIPTION"
                        valueKey="VENDOR_ID"
                        className="full-width"
                        options={vendorNameData}
                        Dropdownlable
                        selectedValue={vendorItem.vendorName}
                        onChange={(e) =>
                          handleVendorChange(
                            index,
                            "vendorName",
                            e.target.value
                          )
                        }
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>
                    <td>
                      <td>
                        <DatePicker
                          selected={vendorItem.journeyDate}
                          onChange={(date) =>
                            handleVendorChange(index, "journeyDate", date)
                          }
                          minDate={new Date()}
                          placeholderText="Select a Date"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={15}
                          className="form-control"
                          disabled={true}
                          dateFormat="dd-MM-yyyy"
                        />
                      </td>
                    </td>
                    <td>
                      <CustomInput
                        type="text"
                        value={
                          index === vendor.length - 1 // Only for the last row
                            ? `${
                                selectJourneyLocation?.fromPlaceOption?.label ||
                                vendorItem?.fromPlace
                              } - ${
                                selectJourneyLocation?.fromPlaceOption?.value ||
                                vendorItem?.toPlace
                              }`
                            : vendorItem.fromPlace
                        }
                        placeholder="From place"
                        onChange={(e) =>
                          handleVendorChange(index, "fromPlace", e.target.value)
                        }
                        isDisable
                      />
                    </td>
                    <td>
                      <CustomInput
                        type="text"
                        value={
                          index === vendor.length - 1 // Only for the last row
                            ? `${
                                selectJourneyLocation?.toPlaceOption?.label ||
                                vendorItem?.toPlace
                              } - ${
                                selectJourneyLocation?.toPlaceOption?.value ||
                                vendorItem?.toPlace
                              }`
                            : vendorItem.toPlace
                        }
                        placeholder="To place"
                        onChange={(e) =>
                          handleVendorChange(index, "toPlace", e.target.value)
                        }
                        isDisable
                      />
                    </td>
                    <td>
                      <CustomDropdown
                        labelKey="label"
                        valueKey="value"
                        Dropdownlable
                        options={flight_name}
                        selectedValue={vendorItem.flightName}
                        onChange={(e) =>
                          handleVendorChange(
                            index,
                            "flightName",
                            e.target.value
                          )
                        }
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>
                    <td>
                      <CustomDropdown
                        labelKey="label"
                        valueKey="value"
                        Dropdownlable
                        options={journeyClassData}
                        selectedValue={vendorItem.journeyClass}
                        onChange={(e) =>
                          handleVendorChange(
                            index,
                            "journeyClass",
                            e.target.value
                          )
                        }
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>
                    <td>
                      <CustomInput
                        type="time"
                        value={vendorItem.stops}
                        onChange={(e) =>
                          handleVendorChange(index, "stops", e.target.value)
                        }
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>
                    <td>
                      <CustomInput
                        type="text"
                        value={vendorItem.totalAmount}
                        placeholder="Enter Total Amount"
                        onChange={(e) =>
                          handleVendorChange(
                            index,
                            "totalAmount",
                            e.target.value
                          )
                        }
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      />
                    </td>
                    <td>
                      <CustomInput
                        type="file"
                        onChange={(e) => onFileChange(index, e)}
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                        accept=".jpeg,.jpg,.png,.pdf"
                      />
                    </td>
                    <td>
                      <AutosizeTextarea
                        value={vendorItem.remark}
                        onChnage={(e) =>
                          handleVendorChange(index, "remark", e.target.value)
                        }
                        rows={1}
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      />
                      {/* <CustomInput
                        type="text"
                        value={vendorItem.remark}
                        placeholder="Enter Remark"
                        onChange={(e) =>
                          handleVendorChange(index, "remark", e.target.value)
                        }
                        isDisable={HodAction || finalBookVenderData?.length > 0}
                      /> */}
                    </td>
                    <td>
                      {index === vendor.length - 1 ? (
                        <Button
                          variant="dark"
                          onClick={addVendor}
                          disabled={
                            HodAction || finalBookVenderData?.length > 0
                          }
                        >
                          +
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          onClick={() => removeVendor(index)}
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
          </div>
        </div>
      </Collapse>
      <Row className="mt-3">
        <Col md={2}>
          <Button
            variant="dark"
            onClick={handleInsertVendorDetails}
            disabled={HodAction || finalBookVenderData?.length > 0}
            className="w-100"
          >
            Save Vendor
          </Button>
        </Col>
        {/* Final Approval Buttons */}
        {showApprovalButton && finalBookVenderData?.length === 0 && (
          <Col md="2">
            <CustomSingleButton
              _ButtonText={"Final Approval"}
              height="40px"
              onPress={handleFinalBookVender}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default VendorForm;
