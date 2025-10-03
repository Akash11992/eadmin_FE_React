import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import {
  deleteOlaUberUploadedFile,
  getVendorName,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import OlaUberFileUploadForm from "../../../Components/TravelManegementComponets/OlaUberFileUploadForm/OlaUberFileUploadForm";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import {
  upload_ola_uber_File,
  getOla_uber_File_Details,
  get_ola_uber_VendorName,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";

const OlaUberFileUpload = () => {
  const savedUserData = JSON.parse(localStorage.getItem("userData"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { olaUberFileDetails, ola_uber_vendorNameData } = useSelector(
    (state) => state.TravelManagement
  );
  const loading = useSelector(
    (state) => state.TravelManagement.status === "loading"
  );
  // const [loading, setLoading] = useState(false); 
  const [showTabel, setShowTabel] = useState(false);
  const [value, setValue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [form, setForm] = useState({
    vendorName: "",
    companyName: "",
    fromDate: "",
    toDate: "",
    fileUpload: null,
  });


  useEffect(() => {
    dispatch(getVendorName("VENDOR_NAME"));
    dispatch(get_ola_uber_VendorName("VENDOR_NAMES"));
    dispatch(getOla_uber_File_Details({
      module_type: "Travel_Management",
      user_id: savedUserData?.data?.userId,
    }));
  }, [dispatch]);

  // const companyOptions = [
  //   { label: "Select", value: "" },
  //   { label: "Ambit Capital Private Ltd", value: 1 },
  //   { label: "Ambit Investment Advisors Private Ltd", value: 2 },
  //   { label: "Ambit Private Ltd", value: 3 },
  //   { label: "Ambit Finvest Private Ltd", value: 4 },
  //   { label: "Ambit Investment Managers Private Ltd", value: 5 },
  //   { label: "Ambit Singapore Pte. Ltd", value: 6 },
  // ];

  const companyOptions = [
    { label: "Ambit Capital Private Ltd", value: "Ambit Capital Private Ltd" },
    { label: "Ambit Investment Advisors Private Ltd", value: "Ambit Investment Advisors Private Ltd" },
    { label: "Ambit Private Ltd", value: "Ambit Private Ltd" },
    { label: "Ambit Finvest Private Ltd", value: "Ambit Finvest Private Ltd" },
    { label: "Ambit Investment Managers Private Ltd", value: "Ambit Investment Managers Private Ltd" },
  ];


  // Helper function to get the company name label from value
  // const getCompanyNameLabel = (value) => {
  //   // Parse to ensure type matching if necessary
  //   const parsedValue = parseInt(value, 10);
  //   const company = companyOptions.find(
  //     (option) => option.value === parsedValue
  //   );
  //   if (!company) {
  //     console.log(`No matching company found for value: ${value}`);
  //   }
  //   return company ? company.label : "Unknown Company";
  // };

  const mappedOlaUberFileDetails = olaUberFileDetails?.data?.map((file, index) => ({
    "S No": index + 1,
    "S.No": file["S.No"],
    VendorName: file.vendor_name,
    // CompanyName: getCompanyNameLabel(file.company_name),
    CompanyName: file.company_name,
    AttachmentName: file.attachment_name,
    FromDate: file.from_date,
    ToDate: file.to_date,
    File_uploaded_by: file.File_uploaded_by,
    file_uploaded_on: file.file_uploaded_on,
    AttachmentURL: file.attachment_urls?.[0] || "",
  }));

  console.log("mappedOlaUberFileDetails..", mappedOlaUberFileDetails)

  const handleFormChange = (key, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type or extension for validation
      const fileType = file.type; // MIME type
      const fileExtension = file.name.split('.').pop().toLowerCase(); // File extension

      if (fileType === "text/csv" || fileExtension === "csv" ||
        fileType === "application/vnd.ms-excel" || fileExtension === "xls" ||
        fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileExtension === "xlsx") {
        setForm((prevForm) => ({
          ...prevForm,
          fileUpload: file, // Assign the valid file object
        }));
        console.log("Selected file:", file);
      } else {
        toast.warning("Please upload a valid CSV and xlsx file.");
        e.target.value = ""; // Clear the input field
      }
    } else {
      toast.warning("Please select a file.");
    }
  };

  const handleFileUpload = async () => {
    setShowTabel(true);
    const payload = new FormData();
    payload.append("vendor_name", form.vendorName);
    payload.append("company_name", form.companyName);
    payload.append("from_date", form.fromDate);
    payload.append("to_date", form.toDate);

    if (form.fileUpload) {
      payload.append("files", form.fileUpload); // Add file to payload
    }

    try {
      const response = await dispatch(upload_ola_uber_File(payload));
       if(response.payload.statusCode === 409){
        toast.warning(response?.payload?.data.message);
       }
      if (response?.payload?.success === true) {
        toast.success(response?.payload?.message);
        setForm({
          vendorName: "",
          companyName: "",
          fromDate: "",
          toDate: "",
          fileUpload: null,
        });
        dispatch(getOla_uber_File_Details({
          module_type: "Travel_Management",
          user_id: savedUserData?.data?.userId,
        }));
      } 
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const handleDeleteFile = async (sNo) => {
    try {
      const payload = { sNo }; // Send S.No as payload
      const response = await dispatch(deleteOlaUberUploadedFile(payload));

      if (response?.payload?.success === true) {
        toast.success(
          response?.payload?.message || "File deleted successfully."
        );
        dispatch(getOla_uber_File_Details({
          module_type: "Travel_Management",
          user_id: savedUserData?.data?.userId,
        }));
      } else {
        toast.error("File deletion failed. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };


  const handleDelete = (sNo) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "black",
      confirmButtonText: "Yes, delete it!",
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

  const handleisValidForm = () => {
    if (
      !form?.vendorName ||
      !form?.companyName ||
      !form?.fromDate ||
      !form?.fileUpload
    ) {
      return toast.warning("Please fill all mandatory fields marked as *");
    } else {
      handleFileUpload();
    }
  };
  const handleToDateChange = (e) => {
    const selectedToDate = e.target.value;
    if (form.fromDate && new Date(selectedToDate) < new Date(form.fromDate)) {
      return toast.warning("You can not select a date before the From Date.");
    }
    handleFormChange("toDate", selectedToDate);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  // const handleFormAction = (item) => {
  //   alert("FormAction pressed");
  // };

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


  const handleAction = () => {
    alert("Work under Progress...");
  };

  const allData = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];
  const actions = [
    // {
    //   label: "Action",
    //   onClick: (item) => handleFormAction(item),
    // },
    {
      label: "Download",
      onClick: (item) => handleDownload(item.AttachmentURL),
    },
    {
      label: "Delete",
      onClick: (item) => handleDelete(item["S.No"]),
    },
  ];

  const handleExportExcel = (data) => {
    if (data?.length > 0) {
      ExportToXLSX(data, "Ola/Uber Documents");
    } else {
      toast.warning("No Records Found");
    }
  };
  return (
    <Container className="border rounded-3 p-3">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Title title={"Ola/Uber File Upload"} />
      <hr />

      <OlaUberFileUploadForm
        form={form}
        vendorNameDataOptions={ola_uber_vendorNameData}
        onFormChange={handleFormChange}
        onFileChange={handleFileChange}
        onFileUpload={handleisValidForm}
        handleToDateChange={handleToDateChange}
      />

      {/* Table */}
      {
        // showTabel &&
        <CustomTable
          data={mappedOlaUberFileDetails}
          headingText={true}
          setValue={setValue}
          SelectColumnData={allData}
          SelectColumnValue={value}
          selectedRows={selectedRows}
          allSelected={allSelected}
          selectColumnData={false}
          firstColumnVisibility={true}
          // selectColumnData={true}
          dataContained={mappedOlaUberFileDetails?.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          clickableColumns={["Travel Request No."]}
          // isClickable={true}
          // onColumnClick={(key) =>handleEdit()}
          exportIconVisiblity={true}
          exceldownload={() => {
            handleExportExcel(olaUberFileDetails?.data);
          }}
          // exportToExcelBtnVisiblity={true}
          // buttonTitle='Add New'
          onPress={(e) => {
            e.preventDefault();
            navigate("/travelRequestForm");
          }}
          actionVisibility={true}
          onRowCheckboxChange={handleAction}
          actions={actions}
        />
      }
      {loading && <CommonLoader />}
    </Container>
  );
};

export default OlaUberFileUpload;
