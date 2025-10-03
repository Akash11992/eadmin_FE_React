import ExcelJS from "exceljs";
 
export const ExportToXLSX = async (
  data,
  filename,
  customHeaders,
  download = true
) => {
  if (!data || data.length === 0) {
    throw new Error("Data is empty or undefined.");
  }
 
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
 
  if (!customHeaders) {
    customHeaders = Object.keys(data[0]);
  }
 
  const headerRow = worksheet.addRow(customHeaders);
  headerRow.eachCell((cell, index) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFC0C0C0" },
    };
    cell.font = {
      bold: true,
      color: { argb: "FF000000" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    worksheet.getColumn(index + 1).width = 20; // Adjust column width
  });
 
  data.forEach((item) => {
    const row = customHeaders.map((header) => {
      const value = item[header];
      return value === null || value === undefined || value === ""
        ? ""
        : !isNaN(value) && value !== null && value !== ""
        ? Number(value)
        : value;
    });
    worksheet.addRow(row);
  });
  
 
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
 
  if (download) {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${filename}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
 
  return blob;
};