import React, { useState } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
const tableData = [
  {
    "Company Name": "Ambit Capital Private Ltd",
    "Department Name": "HR,IT",
    "	Date/Time": "	12/10/2024 10:15am",
    "Hod-To": "Raman Johar",
    Cc: "Nitin Bhasin,Ruchita",
    "Upload File": "APL-Ola.xlxs",
    Status: "Pending",
  },
  {
    "Company Name": "Ambit Private Ltd",
    "Department Name": "Group Corporate Office",
    "	Date/Time": "	12/10/2024 10:15am",
    "Hod-To": "Dhipu",
    Cc: "Pillai",
    "Upload File": "AWPL-Uber.xlxs",
    Status: "Send",
  },
];
const columns = [
  { label: "S.No", value: "sNo" },
  { label: "HOD-To", value: "hodTo" },
  { label: "Cc", value: "cc" },
  { label: "Ola", value: "ola" },
  { label: "Uber", value: "uber" },
  { label: "Action", value: "action" },
];
const OlaUberSummaryReport = () => {
  const [value, setValue] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    column: [],
  });
  const [loading, seLoding] = useState(false);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const download = (id) => {
    alert("work in progress..");
    // const data = JSON.stringify(id)
    //  alert(data)
  };
  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      const allRowIndexes = tableData.map((_, index) => index);
      setSelectedRows(allRowIndexes);
    }
    setAllSelected(!allSelected);
  };

  // Handle individual row checkbox click
  const handleRowCheckboxChange = (index) => {
    const newSelectedRows = [...selectedRows];
    if (newSelectedRows.includes(index)) {
      newSelectedRows.splice(newSelectedRows.indexOf(index), 1);
    } else {
      newSelectedRows.push(index);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle "Resend Mail" button click
  const handleResendMail = () => {
    alert("Work in progress...");
    setSelectedRows([])
    setAllSelected(false)
  };
  // Handle Select All checkbox
  const handlePageChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const columnType = checked
        ? [...prev.columnType, value]
        : prev.columnType.filter((owner) => owner !== value);
      return { ...prev, columnType };
    });
  };

  // Function to export the table data to Excel
  const exportToExcel = (data) => {
    seLoding(true);
    if (!data || data.length === 0) {
      toast.warning("No Records Found");
      return;
    }
    try {
      setTimeout(()=>{
        const sheetName = "Ola/Uber Summary Report".replace(
          /[\\\/\*\?\[\]:]/g,
          "_"
        );
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, "Ola_Uber_Summary_Report.xlsx");
        toast.success("Excel file downloaded successfully!");
      },2000)
      
      seLoding(false);
    } catch {
      toast.error("Failed to export Excel file. Please try again.");
      seLoding(false);
    }
  };
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <CustomTable
        data={tableData.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )}
        titleName="Ola/Uber Summary Report"
        headingText={true}
        setValue={setValue}
        SelectColumnValue={value}
        selectedRows={selectedRows}
        allSelected={allSelected}
        firstColumnVisibility={true}
        selectColumnData={true}
        SelectData={columns}
        exportIconVisiblity={true}
        dataContained={tableData?.length || []}
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
        buttonTitle={"Resend Mail"}
        downloadHeader={true}
        downloadVisibality={true}
        downloadData={[{ onClick: download }]}
        onPress={(e) => {
          e.preventDefault();
          handleResendMail();
        }}
        selectDataValue={formData?.column}
        handleSelectBox={handlePageChange}
        enableCheckbox={true}
        MenuonHeaderCheckboxChange={handleSelectAll}
        onRowCheckboxChange={handleRowCheckboxChange}
        exceldownload={exportToExcel}
      />
      {loading && <CommonLoader />}
    </div>
  );
};

export default OlaUberSummaryReport;
