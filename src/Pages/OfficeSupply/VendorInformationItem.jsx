import React, { useEffect, useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import CustomInput from "../../Components/CustomInput/CustomInput";
import { fetchVendorNameDetails } from "../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import { getvendorLists } from "../../Slices/VendorManagement/VendorManagementSlice";
import { officesuppliceCategory } from "../../Slices/OfficeSupply/OfficeSupplySlice";

const VendorInformationItem = (props) => {
  const {
    vendors,
    setVendors,
    emailErrors,
    setEmailErrors,
    vendorData,
    isDisabled,
  } = props;
  const dispatch = useDispatch();

  const vendorDetailsNameData = vendorData?.filter(
    (v) => v["CATEGORY NAME"] === "Office Supply"
  );

  const handleVendorInputChange = (index, field, value) => {
    setVendors((prevVendors) =>
      prevVendors.map((vendor, i) => {
        if (i === index) {
          // Vendor change
          if (field === "TOSR_VENDOR_ID") {
            if (value === "other") {
              return {
                ...vendor,
                TOSR_VENDOR_ID: value,
                TOSR_VENDOR_EMAILID: "",
              };
            } else {
              // Find selected vendor's email
              const selectedVendor = (vendorDetailsNameData || []).find(
                (v) => v.VENDOR_ID === Number(value)
              );
              return {
                ...vendor,
                TOSR_VENDOR_ID: value,
                TOSR_VENDOR_EMAILID: selectedVendor?.EMAIL_ID || "",
              };
            }
          }
          // Email change (only for "Other")
          if (field === "TOSR_VENDOR_EMAILID") {
            return { ...vendor, TOSR_VENDOR_EMAILID: value };
          }
        }
        return vendor;
      })
    );

    // Validate email if the field being updated is TOSR_VENDOR_EMAILID
    if (field === "TOSR_VENDOR_EMAILID") {
      validateEmail(index, value);
    }
  };

  const validateEmail = (index, email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    setEmailErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      if (!email || emailRegex.test(email)) {
        newErrors[index] = ""; // Clear error if email is valid or empty
      } else {
        newErrors[index] = "Invalid email address"; // Set error message
      }
      return newErrors;
    });
  };

  const addVendorRow = () => {
    setVendors((prevVendors) => [
      ...prevVendors,
      {
        TOSR_VENDOR_ID: "",
        TOSR_VENDOR_EMAILID: "",
      },
    ]);
    setEmailErrors((prevErrors) => [...prevErrors, ""]); // Add a blank error for the new row
  };

  const removeVendorRow = (index) => {
    setVendors((prevVendors) => prevVendors.filter((_, i) => i !== index));
    setEmailErrors((prevErrors) => prevErrors.filter((_, i) => i !== index)); // Remove the corresponding error
  };

  return (
    <div className="my-4">
      <div
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <Table bordered>
          <thead>
            <tr>
              <th style={{ backgroundColor: "#d90429", color: "white" }}>
                Vendor ID
              </th>
              <th style={{ backgroundColor: "#d90429", color: "white" }}>
                Email Id
              </th>
              <th style={{ backgroundColor: "#d90429", color: "white" }}>
                Add / Remove
              </th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, index) => (
              <tr key={index}>
                <td>
                  <CustomDropdown
                    options={[
                      { VENDOR_COMPANY: "Select", VENDOR_ID: "" },
                      ...(vendorDetailsNameData || []),
                      { VENDOR_COMPANY: "Other", VENDOR_ID: "other" }, // Add this line
                    ]}
                    valueKey="VENDOR_ID"
                    labelKey="VENDOR_COMPANY"
                    selectedValue={vendor.TOSR_VENDOR_ID}
                    onChange={(e) =>
                      handleVendorInputChange(
                        index,
                        "TOSR_VENDOR_ID",
                        e.target.value
                      )
                    }
                    isDisable={isDisabled}
                  />
                  {/* <CustomInput
                    type="text"
                    placeholder="Enter Vendor ID"
                    value={vendor.TOSR_VENDOR_ID}
                    onChange={(e) =>
                      handleVendorInputChange(
                        index,
                        "TOSR_VENDOR_ID",
                        e.target.value
                      )
                    }
                  /> */}
                </td>
                <td>
                  <CustomInput
                    type="email"
                    placeholder="Enter Email Id"
                    value={vendor.TOSR_VENDOR_EMAILID}
                    onChange={(e) =>
                      handleVendorInputChange(
                        index,
                        "TOSR_VENDOR_EMAILID",
                        e.target.value
                      )
                    }
                    isDisable={isDisabled}
                  />

                  {emailErrors[index] && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {emailErrors[index]}
                    </div>
                  )}
                </td>
                <td>
                  {index === vendors.length - 1 ? (
                    <Button
                      variant="dark"
                      className="btn-sm"
                      onClick={addVendorRow}
                      disabled={isDisabled}
                    >
                      +
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => removeVendorRow(index)}
                      disabled={isDisabled}
                    >
                      -
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Alert
          variant="warning"
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            margin: "0",
          }}
        >
          Note: Please click on + button to add more vendors.
        </Alert>
      </div>
    </div>
  );
};

export default VendorInformationItem;
