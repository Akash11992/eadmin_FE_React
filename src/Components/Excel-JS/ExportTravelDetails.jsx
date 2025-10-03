import * as XLSX from "xlsx";

const ExportTravelDetails = (data, fileName, formatDateOrTime, searchFilter) => {
  const workbook = XLSX.utils.book_new();

  const transformStatus = (status, saveLater, file) => {
    switch (status) {
      case "ACC":
        return "Approved";
      case "REJ":
        return "Reject";
      case "CAN":
        return "Cancel";
      default:
        return saveLater == 1
          ? "Save As Draft"
          : "Pending for " + (file ? "Approval" : "Quotation");
    }
  };

  const filteredData = data?.filter((entry) => {
    const transformedStatus = transformStatus(
      entry.final_status?.TJDAS_STATUS || null,
      entry.TRF_SAVE_LATER,
      entry?.final_vendor_details
    )?.toLowerCase();

    // Filter by Traveler Name
    const matchesTravelerName = searchFilter.travelerName
      ? entry.TRF_TRAVELLER_NAME
          .toLowerCase()
          .includes(searchFilter.travelerName.toLowerCase())
      : true;

    // Filter by Travel Request No
    const matchesTravelRequestNo = searchFilter.travelRequestNo
      ? entry.TRF_REFERENCE_ID
          .toString()
          .toLowerCase()
          .includes(searchFilter.travelRequestNo.toLowerCase())
      : true;

    // Filter by Status
    const matchesStatus = searchFilter.status && searchFilter.status !== "SelectStatus"
      ? transformedStatus === searchFilter.status.toLowerCase()
      : true;

    return matchesTravelerName && matchesTravelRequestNo && matchesStatus;
  });

  // Sheet 1: Travel & Final Vendor Details
  const travelFinalVendorSheetData = [
    [
      "Reference ID",
      "Vendor",
      "Traveler Name",
      "Journey Date",
      "Booked By",
      "From",
      "To",
      "Flight Name",
      "Journey Class",
      "Time",
      "Remark",
      "Total Amount",
      "Travel Reason",
      "Created Date",
      "Project Code",
      "Status",
      "HOD Remark",
    ],
  ];

  filteredData?.forEach((entry) => {
    if (entry?.final_vendor_details) {
      entry?.final_vendor_details?.forEach((finalVendor) => {
        travelFinalVendorSheetData?.push([
          entry.TRF_REFERENCE_ID || "",
          finalVendor.TRVD_VENDOR_ID || "",
          entry.TRF_TRAVELLER_NAME || "",
          formatDateOrTime(finalVendor.TRVD_DATE_OF_JOURNEY) || "",
          finalVendor.booked_by || "",
          finalVendor.TRVD_FROM_LOCATION || "",
          finalVendor.TRVD_TO_LOCATION || "",
          finalVendor.TRVD_FLIGHT_NAME || "",
          finalVendor.TRVD_JOURNEY_CLASS || "",
          finalVendor.TRVD_TIME || "",
          finalVendor.TRVD_REMARKS || "",
          finalVendor.TRVD_TOTAL_AMOUNT || "",
          entry.TRF_TRAVEL_REASON || "",
          formatDateOrTime(entry.TRF_CREATED_DATE) || "",
          entry?.TRF_REMARKS || "",
          transformStatus(
            entry.final_status?.TJDAS_STATUS || null,
            entry?.TRF_SAVE_LATER,
            entry?.final_vendor_details
          ) || "",
          entry?.final_status?.TJDAS_REMARKS || "",
        ]);
      });
    } else {
      // If final_vendor_details is null, use journey_details and TRF_CREATED_BY for booked_by
      travelFinalVendorSheetData?.push([
        entry.TRF_REFERENCE_ID || "",
        "", // Vendor is not available in journey_details
        entry.TRF_TRAVELLER_NAME || "",
        formatDateOrTime(entry.journey_details?.TRJM_DATE_OF_JOURNEY) || "",
        entry.TRF_CREATED_BY || "", // Use TRF_CREATED_BY for booked_by
        entry.journey_details?.TRJM_FROM_PLACE || "",
        entry.journey_details?.TRJM_TO_PLACE || "",
        "", // Flight Name is not available in journey_details
        "", // Journey Class is not available in journey_details
        "", // Time is not available in journey_details
        "", // Remark is not available in journey_details
        "", // Total Amount is not available in journey_details
        entry.TRF_TRAVEL_REASON || "",
        formatDateOrTime(entry.TRF_CREATED_DATE) || "",
        entry?.TRF_REMARKS || "",
        transformStatus(
          entry.final_status?.TJDAS_STATUS || null,
          entry?.TRF_SAVE_LATER,
          entry?.final_vendor_details
        ) || "",
        entry?.final_status?.TJDAS_REMARKS || "",
      ]);
    }
  });

  const travelFinalVendorSheet = XLSX.utils.aoa_to_sheet(
    travelFinalVendorSheetData
  );
  XLSX.utils.book_append_sheet(
    workbook,
    travelFinalVendorSheet,
    "Travel Details"
  );

  // Sheet 2: Vendor Details
  const vendorSheetData = [
    [
      "Reference ID",
      "Vendor",
      "Journey Date",
      "From",
      "To",
      "Flight Name",
      "Journey Class",
      "Time",
      "Total Amount",
      "Remark",
    ],
  ];

  filteredData?.forEach((entry) => {
    entry.vendor_details?.forEach((vendor) => {
      vendorSheetData.push([
        vendor.TRVD_REFERENCE_ID,
        vendor.TRVD_VENDOR_ID,
        formatDateOrTime(vendor.TRVD_DATE_OF_JOURNEY),
        vendor.TRVD_FROM_LOCATION,
        vendor.TRVD_TO_LOCATION,
        vendor.TRVD_FLIGHT_NAME,
        vendor.TRVD_JOURNEY_CLASS,
        vendor.TRVD_TIME,
        vendor.TRVD_TOTAL_AMOUNT,
        vendor.TRVD_REMARKS,
      ]);
    });
  });

  const vendorSheet = XLSX.utils.aoa_to_sheet(vendorSheetData);
  XLSX.utils.book_append_sheet(
    workbook,
    vendorSheet,
    "Vendor Quotation Details"
  );

  // Write file and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default ExportTravelDetails;