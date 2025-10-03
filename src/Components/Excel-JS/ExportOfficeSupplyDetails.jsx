import * as XLSX from "xlsx";

const ExportOfficeSupplyDetails = (jsonData, fileName) => {
  console.log(jsonData, "jhh");
  const flatData = jsonData?.data.map((item, index) => ({
    "S.No": index + 1,
    "Request ID": item.TOSR_REQUEST_ID,
    "Request Date": new Date(item.TOSR_REQUEST_DATE).toLocaleDateString(),
    "Requested By": item.TOSR_REQUESTED_BY,
    Entity: item.TOSR_ENTITY || "N/A",
    Business: item.TOSR_BUSINESS_ID || "",
    Department: item.TOSR_DEPARTMENT_ID || "",
    Location: item.TOSR_LOCATION_ID || "",
    Floor: item.TOSR_FLOOR_ID || "",
    Priority: item.TOSR_PRIORITY || "",
    "Request Status": item.TOSR_REQUEST_STATUS || "",
    "Approval Status": item.STATUS || "Pending",
    "Approval Date": item.TOSR_APPROVER_DATE || "",
    "Approver Remark": item.TOSR_APPROVER_REMARK || "",
    // "Delivery Date": item.TOSR_DELIVERY_DATE || "",
    // "Received By": item.TOSR_RECEIVED_BY || "",
    // "Checked By": item.TOSR_CHECKED_BY || "",
    // "Challan No": item.TOSR_CHALLAN_NO || "",
    // Remark: item.TOSR_REMARK || "",
  }));

  // Extract BudgetDetails if available
  const ItemDetails = jsonData?.data?.flatMap((item) =>
    item.TOSR_ITEMS_DETAILS
      ? item.TOSR_ITEMS_DETAILS.map((item2) => ({
          "Request ID": item.TOSR_REQUEST_ID,
          Category: item2?.TOSCM_CATEGORY_NAME,
          Item: item2?.TOSR_ITEM_NAME,
          Quantity: item2?.TOSR_QUANTITY,
          Rate: item2.TOSR_RATE,
          GST: item2.TOSCM_GST,
          Amount: item2.TOSR_AMOUNT,
          "Received Quantity": item2.TOSR_RECEIVED_ITEMS,
        }))
      : []
  );

  const vendorDetails = jsonData?.data?.flatMap((item) => {
    const vendorInfo = item.TOSR_VENDOR_INFORMATION;
    return vendorInfo?.map((item2) => ({
      "Request ID": item.TOSR_REQUEST_ID,
      Vendor: item2?.VENDOR_NAME || "Others",
      "Vendor Email": item2?.TOSR_VENDOR_EMAILID || "",
    }));
  });

  const deliveryDetails = jsonData?.data?.flatMap((item) => {
    const deliveryInfo = JSON.parse(item.TOSR_DELIVERY_DETAILS) || [];
    return deliveryInfo?.map((item2) => ({
      "Request ID": item.TOSR_REQUEST_ID,
      "Delivery Date": item2?.TOSR_DELIVERY_DATE || "",
      "Received By": item2?.TOSR_RECEIVED_BY || "",
      "Checked By": item2?.TOSR_CHECKED_BY || "",
      "Challan No": item2?.TOSR_CHALLAN_NO || "",
      Remark: item2?.TOSR_REMARK || "",
    }));
  });

  // Creating worksheet
  const ws1 = XLSX.utils.json_to_sheet(flatData);
  const ws2 = XLSX.utils.json_to_sheet(ItemDetails);
  const ws3 = XLSX.utils.json_to_sheet(vendorDetails);
  const ws4 = XLSX.utils.json_to_sheet(deliveryDetails);
  // Creating a new workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, ws1, "OfficeSupplyList");
  XLSX.utils.book_append_sheet(workbook, ws2, "ItemDetails");
  XLSX.utils.book_append_sheet(workbook, ws3, "VendorDetails");
  XLSX.utils.book_append_sheet(workbook, ws4, "DeliveryDetails");
  // Export file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default ExportOfficeSupplyDetails;
