import * as XLSX from "xlsx";

const ExportAMCAdmin = (jsonData, fileName) => {
  const flatData = jsonData.map((item) => ({
    ID: item.ID,
    Vendor: item.Vendor,
    "Equipment Details": item["Equipment Details"],
    Entity: item.Entity,
    "AMC Type": item["AMC Type"],
    "Service Schedule": item["Service Schedule"],
    "Payment Term": item["Payment Term"],
    "PO Number": item["PO Number"]
  }));

  // Extract BudgetDetails if available
  const budgetData = jsonData.flatMap((item) =>
    item.BudgetDetails
      ? item.BudgetDetails.map((budget) => ({
          "AMC ID": item.ID,
          "Financial Year": budget["Financial Year"],
          "Actual Amount": budget["Actual Amount"],
          "Budgeted Amount": budget["Budgeted Amount"],
          "Increase %": budget["Increase In %"],
          "Increase Amount": budget["Increase In Amount"],
          "Start Date": budget["Start Date"],
          "End Date": budget["End Date"],
          "AMC Status": budget["AMC Status"],
      
        }))
      : []
  );

  // Creating worksheet
  const ws1 = XLSX.utils.json_to_sheet(flatData);
  const ws2 = XLSX.utils.json_to_sheet(budgetData);

  // Creating a new workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, ws1, "AMC Data");
  XLSX.utils.book_append_sheet(workbook, ws2, "Budget Data");
  // Export file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default ExportAMCAdmin;
