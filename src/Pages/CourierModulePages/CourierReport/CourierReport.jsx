import React, { useState, useEffect, useRef } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { deleteOlaUberUploadedFile } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { uploadCourierReport } from "../../../Slices/CourierSevices/CourierSevicesSlice";
import { useSelector, useDispatch } from "react-redux";
import { getOla_uber_File_Details } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Encryption from "../../../Components/Decryption/Encryption";

const allCompanyData = [
  { label: "Ambit Private Limited ( BSG ) - 237602", value: "237602" },
  {
    label: "Ambit Private Limited ( Investment Banking ) - 080614",
    value: "080614",
  },
  { label: "Ambit Capital Private Limited - 237580", value: "237580" },
  {
    label: "Ambit Finvest Private Limited ( D-activated ) - 315464",
    value: "315464",
  },
  {
    label: "Ambit Investment Advisors Private Limited - 328823",
    value: "328823",
  },
  {
    label: "Ambit Capital Private Limited ( Private Wealth ) - 377565",
    value: "377565",
  },
  {
    label: "Ambit Wealth Private Limited ( Regular ) - 411471",
    value: "411471",
  },
  { label: "Ambit Pragma Venture Pvt Ltd - 250390", value: "250390" },
  { label: "Ambit Pragma Advisors LLP - 322501", value: "322501" },
  {
    label: "Ambit Wealth Private Limited ( For Reverse Pickup ) - 411482",
    value: "411482",
  },
  {
    label:
      "Ambit Investment Advisors Private Limited (Bangalore Office) - 185415",
    value: "185415",
  },
  {
    label: "Ambit Investment Advisors Private Limited (Delhi Office) - 975656",
    value: "975656",
  },
  {
    label: "Ambit Capital Private Limited ( Import Account ) - 950241669",
    value: "950241669",
  },
];

const allPaginationData = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
];

const CourierReport = () => {
  const navigate = useNavigate();
  const currentFile = useRef(null);
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [vendorData, setvendorData] = useState("");
  const [companyData, setCompanyData] = useState("");
  const [showTabel, setShowTabel] = useState(false);
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Upload_Invoices } = permissionDetailData.data || {};
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const { olaUberFileDetails } = useSelector((state) => state.TravelManagement);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const [fromDates, setFromDates] = useState("");
  const [toDates, setToDates] = useState("");
  const [filesUpload, setfilesUpload] = useState(null);
  const [form, setForm] = useState({
    vendorData: "",
    companyData: "",
  });
  const encrypt = Encryption();

  const handleFileChange = (e) => {
    setfilesUpload(e.target.files[0]);
  };
  const getCompanyNameLabel = (value) => {
    const parsedValue = parseInt(value, 10);
    const company = allCompanyData.find(
      (option) => option.value === parsedValue
    );
    if (!company) {
      console.log(`No matching company found for value: ${value}`);
    }
    return company ? company.label : "Unknown Company";
  };
  const getVendorLabel = (value) => {
    const vendor = allVendorData.find((option) => option.value === value);
    return vendor ? vendor.label : "";
  };

  const getCompanyLabel = (value) => {
    const company = allCompanyData.find((option) => option.value === value);
    return company ? company.label : "";
  };

  const mappedOlaUberFileDetails = olaUberFileDetails?.data?.map(
    (file, index) => ({
      "S No": index + 1,
      "S.No": file["S.No"],
      VendorName: file.vendor_name,
      CompanyName: file.company_name,
      AttachmentName: file.attachment_name,
      FromDate: file.from_date,
      ToDate: file.to_date,
      File_uploaded_by: file.File_uploaded_by,
      file_uploaded_on: file.file_uploaded_on,
      AttachmentURL: file.attachment_urls?.[0] || "",
    })
  );

  const handleDownload = (url) => {
    if (!url) {
      toast.warning("Invalid URL. Please provide a valid download link.");
      return;
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteFile = async (sNo) => {
    try {
      const payload = { sNo };
      const response = await dispatch(deleteOlaUberUploadedFile(payload));

      if (response?.payload?.success) {
        toast.success(
          response?.payload?.message || "File deleted successfully."
        );
        dispatch(
          getOla_uber_File_Details({
            module_type: "Courier_Report",
            user_id: savedUserData?.data?.userId,
          })
        );
      } else {
        toast.error("File deletion failed. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const handleTypeDelete = (sNo) => {
    Swal.fire({
      title: "Are you sure you want to delete this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#000",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-popup",
        title: "custom-title",
        content: "custom-content",
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteFile(sNo);
      }
    });
  };

  const allVendorData = [
    { label: "DHL Express", value: "dhl" },
    { label: "Blue Dart", value: "blueDart" },
  ];

  const actions = [
    Upload_Invoices?.export && {
      label: "Download",
      onClick: (item) => handleDownload(item.AttachmentURL),
    },
    Upload_Invoices?.delete && {
      label: "Delete",
      onClick: (item) => handleTypeDelete(item["S.No"]),
    },
  ];

  const handleExportExcel = (data) => {
    if (!data || data.length === 0) {
      toast.warning("No Records Found");
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Courier Report");

      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(
        2,
        "0"
      )}-${String(today.getMonth() + 1).padStart(
        2,
        "0"
      )}-${today.getFullYear()}`;
      const fileName = `Courier Report Document ${formattedDate}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      toast.error("Failed to export Excel file. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(
      getOla_uber_File_Details({
        module_type: "Courier_Report",
        user_id: savedUserData?.data?.userId,
      })
    );
  }, [dispatch]);

  const handleSearch = () => {
    const filtered = mappedOlaUberFileDetails.filter((item) =>
      item.airWayBillNo.includes(searchInput)
    );
    setFilteredData(filtered);
    setPage(0);
  };
  const fetchFileDetails = async () => {
    setLoading(true);
    try {
      await dispatch(
        getOla_uber_File_Details({
          module_type: "Courier_Report",
          user_id: savedUserData?.data?.userId,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileDetails();
  }, [dispatch]);

  const resetForm = () => {
    setvendorData("");
    setCompanyData("");
    setFromDates("");
    setToDates("");
    setfilesUpload(null);
    if (currentFile.current) currentFile.current.value = null;
  };

  // file upload code here...
  const handleFileUpload = async () => {
    setLoading(true);
    const vendorLabel = getVendorLabel(vendorData);
    const companyLabel = getCompanyLabel(companyData);

    // Check mandatory fields
    if (!vendorLabel || !companyLabel || !fromDates || !toDates) {
      toast.warning("Please fill all mandatory fields");
      setLoading(false); // 🔁 Stop the loader here
      return;
    }

    const payload = new FormData();
    const beforeEncryption = {
      vendor_name: vendorLabel,
      company_name: companyLabel,
      from_date: fromDates,
      to_date: toDates,
    };
    payload.append("encryptedData", encrypt(beforeEncryption));

    if (filesUpload) {
      payload.append("files", filesUpload);
    }

    try {
      const response = await dispatch(uploadCourierReport(payload));
      console.log("Full Response:", response);

      if (response?.payload?.statusCode === 200) {
        toast.success(
          response?.payload?.data?.message || "File uploaded successfully."
        );
        resetForm();
        await dispatch(
          getOla_uber_File_Details({
            module_type: "Courier_Report",
            user_id: savedUserData?.data?.userId,
          })
        );
      } else {
        toast.error(response?.payload?.message || "File upload failed.");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      {loading ? (
        <CommonLoader />
      ) : (
        <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
          <CustomTable
            data={mappedOlaUberFileDetails}
            titleName="Upload Invoices"
            headingText={true}
            setValue={setValue}
            selectedRows={selectedRows}
            allSelected={allSelected}
            paginationDropDown={false}
            paginationvalueName="Show"
            paginationDataValue={allPaginationData}
            dataContained={mappedOlaUberFileDetails?.length || 0}
            pageCount={page}
            handlePageClick={handleChangePage}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={handleChangeRowsPerPage}
            // searchVisibility={true}
            dateVisibility={true}
            // buttonTitle="Search"
            placeholder="Search by AWB no"
            fromDateValue={searchInput}
            toDateChange={(e) => setSearchInput(e.target.value)}
            onPress={handleSearch}
            firstColumnVisibility={true}
            exportToExcelBtnVisiblity={Upload_Invoices?.export ? true : false}
            handleExportExcel={() =>
              handleExportExcel(mappedOlaUberFileDetails)
            }
            importIconVisiblity={true}
            DropdownVisibility={true}
            allvendordata={allVendorData}
            selectedvendordata={vendorData}
            setselectedvendordata={setvendorData}
            allcompanydata={allCompanyData}
            selectedcompanydata={companyData}
            setselectedcompanydata={setCompanyData}
            fromDatesValue={fromDates}
            toDatesValue={toDates}
            formDatesChange={(e) => setFromDates(e.target.value)}
            toDatesChange={(e) => setToDates(e.target.value)}
            // tofileValue={filesUpload}
            ref={currentFile}
            tofileOnchange={handleFileChange}
            uploadOnpress={handleFileUpload}
            actions={actions}
            actionVisibility={
              Upload_Invoices?.export || Upload_Invoices?.delete ? true : false
            }
            specialColumns={[
              "CompanyName",
              "FromDate",
              "ToDate",
              "AttachmentURL",
              "AttachmentName",
            ]}
          />
        </div>
      )}
    </>
  );
};

export default CourierReport;
