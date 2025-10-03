import React, { useEffect, useState } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import {
  bulkUploadFile,
  deleteOutwardCourier,
  getCompanyDetailsByAccount,
  getCourierStatusDropdown,
  getOutwardCourierData,
  getPersonalOfficialDropdown,
} from "../../../Slices/CourierSevices/CourierSevicesSlice";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { Card, Col, Row } from "react-bootstrap";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import { Title } from "../../../Components/Title/Title";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { getFile } from "../../../Slices/Attachment/attachmentSlice";
import useDownloader from "react-use-downloader";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";

const OutwardCourier = () => {
  const { download } = useDownloader();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState([]);
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState({
    uniqueNo: null,
    courieracccode: null,
    status: null,
    personalorofficial: null,
    startdate: null,
    enddate: null,
  });
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const { courierStatusDropdown, personalOfficialDropdown } = useSelector(
    (state) => state?.CourierService
  );

  const permissionDetail = useSelector(
    (state) => state?.Role?.permissionDetails || []
  );

  const inwardpermission = permissionDetail?.data?.["Outward_Courier"] || {};

  const CourierComName = useSelector(
    (state) => state?.CourierService?.companybyaccount?.data || []
  );

  useEffect(() => {
    dispatch(getCompanyDetailsByAccount());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCourierStatusDropdown("COURIER_STATUS"));
    dispatch(getPersonalOfficialDropdown("O_OR_P"));
  }, [dispatch]);

  useEffect(() => {
    fetchOutwardDetails(null);
  }, [
    filter.uniqueNo,
    filter.courieracccode,
    filter.status,
    filter.personalorofficial,
    filter.startdate,
    filter.enddate,
  ]);
  const fetchOutwardDetails = async () => {
    if (filter.startdate && !filter.enddate) {
      toast.warning("Please enter End Date");
      return;
    }
    if (filter.enddate && !filter.startdate) {
      toast.warning("Please enter From Date");
      return;
    }
    const payload = {
      uniqueNo: filter.uniqueNo,
      courieracccode: filter.courieracccode,
      status: filter.status,
      personalorofficial: filter.personalorofficial,
      startdate: filter.startdate,
      enddate: filter.enddate,
    };
    console.log(payload, "payload.................");
    await dispatch(getOutwardCourierData(payload));
  };

  const handleSearchChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value === "" ? null : value,
    }));
    setPage(0);
  };
  const loading = useSelector(
    (state) => state.CourierService.status === "loading"
  );
  const navigate = useNavigate();
  const outwardDetails = useSelector(
    (state) => state?.CourierService?.outwardGetDetails?.data || []
  );
  const handleExportExcel = () => {
    const data = searchFilter?.length > 0 ? searchFilter : outwardDetails;

    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${currentDate.getFullYear()}`;

    const fileName = `Outward Courier Details - ${formattedDate}`;
    ExportToXLSX(data, fileName);
  };
  const Attachment = useSelector((state) => state.Attachment.attachment);
  const fetchOutwardDetailsFiles = (item) => {
    const Payload = {
      referenceName: "Courier Service",
      referenceKey: item["Ref Unique No"],
      referenceSubName: "Outward Courier",
    };
    dispatch(getFile(Payload)).then(() => {
      if (Attachment && Attachment.length > 0) {
        const attach = Attachment[0];
        if (attach.attachment_path && attach.attachment) {
          download(attach.attachment_path, attach.attachment);
        }
      }
    });
  };

  const actions = [
    inwardpermission?.update
      ? {
          label: "Edit",
          onClick: (item) => handleAllocate(item),
        }
      : null,
    inwardpermission?.delete
      ? {
          label: "Delete",
          onClick: (item) => handleDelete(item),
        }
      : null,
    {
      label: "View Attachment",
      onClick: (item) => fetchOutwardDetailsFiles(item),
    },
  ].filter((action) => action !== null);

  const handleAllocate = (item) => {
    setIsEditMode(true);
    navigate("/addoutwardcourier", { state: { item, isEditMode: true } });
  };

  const handleDelete = async (item) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      width: "400px",
      customClass: {
        popup: "custom-popup",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteOutwardCourier(item["Ref Unique No"]));
          toast.success("Record deleted successfully");
          fetchOutwardDetails();
        } catch (error) {
          toast.error("Error deleting item");
        }
      }
    });
  };
  const handleAddNew = () => {
    const uniqueNo = generateUniqueReferenceNo();
    setIsEditMode(false);
    navigate("/addoutwardcourier", {
      state: { reference_no: uniqueNo, isEditMode: false },
    });
  };

  const generateUniqueReferenceNo = () => {
    return Math.floor(Math.random() * 1000000).toString();
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const validExtensions = ["xlsx", "csv"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (validExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        toast.success("File selected successfully!");
      } else {
        toast.error("Invalid file format. Please upload .xlsx or .csv files.");
        event.target.value = ""; // Clear the file input
      }
    } else {
      toast.error("No file selected. Please choose a file.");
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("files", file); // Ensure the file is appended to FormData

    try {
      const response = await dispatch(bulkUploadFile(formData)); // Assuming `dispatch` triggers an action
      console.log(response, "response");
      if (response?.payload?.statusCode === 200) {
        toast.success(response?.payload?.data?.message);
        setFile(null);
        fetchOutwardDetails();
      } else {
        toast.error(
          response?.payload?.message ||
            "File upload failed. Please choose valid file & data."
        );
      }
    } catch (error) {
      console.error("Error occurred during file upload:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

    const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/template/CourierService/Outward_Courier_Sample_Template.xlsx";
    link.download = "Outward_Courier_Sample_Template.xlsx";
    link.click();
  };
  return (
    <Row className="dashboard me-1 ms-1">
      <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        {loading && <CommonLoader />}
        <Card className="border-0">
          <Title title="Outward Courier" />
          <Row className="mt-4">
            <Col md={2} style={{ marginTop: "-7px" }}>
              <CustomInput
                labelName="From Date"
                type="date"
                value={filter.startdate}
                onChange={(event) =>
                  handleSearchChange("startdate", event.target.value)
                }
              />
            </Col>
            <Col md={2} style={{ marginTop: "-7px" }}>
              <CustomInput
                labelName="To Date"
                type="date"
                value={filter.enddate}
                onChange={(event) =>
                  handleSearchChange("enddate", event.target.value)
                }
              />
            </Col>
            <Col md={2} className="mt-4">
              <CustomDropdown
                labelKey="label"
                valueKey="label"
                options={[
                  { label: "Filter By Status", value: null },
                  // ...courierStatusDropdown,
                  ...(Array.isArray(courierStatusDropdown)
                    ? courierStatusDropdown
                    : []),
                ]}
                selectedValue={filter.status}
                onChange={(e) => {
                  const selectedValue =
                    e.target.value === "Filter By Status"
                      ? null
                      : e.target.value;
                  handleSearchChange("status", selectedValue);
                }}
              />
            </Col>

            <Col md={2} className="mt-4">
              <CustomDropdown
                labelKey="displayText"
                valueKey="AccountNo"
                options={[
                  {
                    AccountNo: "",
                    displayText: "Filter By Courier Account Code",
                  },
                  ...(Array.isArray(CourierComName)
                    ? CourierComName.map((item) => ({
                        ...item,
                        displayText: `${item.AccountNo} - ${item.CompanyName}`,
                      }))
                    : []),
                ]}
                selectedValue={filter.courieracccode || ""}
                onChange={(e) => {
                  const value =
                    e?.target?.value === "" ||
                    e?.target?.value === "Filter By Courier Account Code"
                      ? null
                      : e.target.value;
                  handleSearchChange("courieracccode", value);
                }}
              />
            </Col>
            <Col md={2} className="mt-4">
              <CustomDropdown
                labelKey="label"
                valueKey="label"
                options={[
                  {
                    label: "",
                    label: "Filter By Official & Presonal",
                  },
                  // ...personalOfficialDropdown,
                  ...(Array.isArray(personalOfficialDropdown)
                    ? personalOfficialDropdown
                    : []),
                ]}
                selectedValue={filter.personalorofficial || null}
                onChange={(e) => {
                  const Values =
                    e.target.value === null ||
                    e.target.value === "Filter By Official & Presonal"
                      ? null
                      : e.target.value;
                  handleSearchChange("personalorofficial", Values);
                }}
              />
            </Col>
            {inwardpermission?.import && (
              <Col md={2} className="mt-4">
                <CustomSingleButton
                  _ButtonText="Export To Excel"
                  height={40}
                  onPress={handleExportExcel}
                />
              </Col>
            )}
          </Row>
        </Card>
        <CustomTable
          data={outwardDetails}
          titleName="Outward Courier"
          paginationDropDown={false}
          paginationvalueName="Show"
          dataContained={outwardDetails.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          onPress={handleAddNew}
          buttonTitle={inwardpermission?.create ? "Add New" : ""}
          firstColumnVisibility={inwardpermission?.export ? true : false}
          searchVisibility={true}
          placeholder="Search by Ref Unique No"
          toDateChange={(e) => {
            const uniqueNoValue = e.target.value === "" ? null : e.target.value;
            handleSearchChange("uniqueNo", uniqueNoValue);
          }}
          importIconVisiblity={inwardpermission?.import ? true : false}
          // tofileValue={file?.name || ""}
          tofileOnchange={handleFileChange}
          uploadOnpress={handleFileUpload}
          actions={actions}
          actionVisibility={true}
          sampleTemplateVisibility={true}
          handleSampleDownload={handleDownload}
          specialColumns={[
            "Sender Name",
            "State",
            "Email",
            "Created By",
            "Destination",
            "Department",
            "Reason",
            "File Name",
            "Description",
          ]}
        />
      </div>
    </Row>
  );
};

export default OutwardCourier;
