import React, { useEffect, useCallback, useState } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { useNavigate } from "react-router-dom";
import {
  getInwardCourierData,
  deleteInwardCourier,
  getDepartmentDropdown,
  getCourierModeDropdown,
  getCourierStatusDropdown,
  bulkUploadFileInward,
  updateStatusIntwardCourier,
} from "../../../Slices/CourierSevices/CourierSevicesSlice";
import { useDispatch, useSelector } from "react-redux";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { getPinCodes } from "../../../Slices/CompanyDetails/CompanyDetailSlice";
import { getFile } from "../../../Slices/Attachment/attachmentSlice";
import useDownloader from "react-use-downloader";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";

const InwardCourier = () => {
  const { download } = useDownloader();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState([]);
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState({
    uniqueNo: null,
    pincode: null,
    department: null,
    couriertype: null,
    startdate: null,
    enddate: null,
    status: null,
  });

  const permissionDetail = useSelector(
    (state) => state.Role?.permissionDetails || []
  );

  const inwardpermission = permissionDetail?.data?.Inward_Courier || {};
  const loading = useSelector(
    (state) => state.CourierService.status === "loading"
  );
  const PinCode = useSelector((state) => state.companyDetail.pinCodeList);
  const { courierModeDropdown } = useSelector((state) => state.CourierService);
  const inwardDetails = useSelector(
    (state) => state?.CourierService?.inwardGetDetails?.data || []
  );

  useEffect(() => {
   return ()=> dispatch(getCourierModeDropdown("COURIER_MODE"));
  }, [dispatch]);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getDepartmentDropdown());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getPinCodes());
  }, [dispatch]);

  const { courierStatusDropdown } = useSelector(
    (state) => state.CourierService
  );
  useEffect(() => {
    dispatch(getCourierStatusDropdown("COURIER_STATUS"));
  }, [dispatch]);
  const departmentDropdown = useSelector(
    (state) => state?.CourierService?.departmentDropdown?.data || []
  );
  useEffect(() => {
    fetchInwardDetails(null);
  }, [
    filter.uniqueNo,
    filter.pincode,
    filter.department,
    filter.couriertype,
    filter.startdate,
    filter.enddate,
    filter.status,
  ]);

  const fetchInwardDetails = async (value) => {
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
      empcode: filter.pincode,
      department: filter.department,
      couriertype: filter.couriertype,
      startdate: filter.startdate,
      enddate: filter.enddate,
      status: filter.status,
    };

    await dispatch(getInwardCourierData(payload));
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const AttachmentDetails = useSelector((state) => state.Attachment.attachment);
  const fetchInwardDetailsFiles = (item) => {
    const Payload = {
      referenceName: "Courier Service",
      referenceKey: item["Unique No."],
      referenceSubName: "Inward Courier",
    };
    dispatch(getFile(Payload)).then(() => {
      if (AttachmentDetails && AttachmentDetails.length > 0) {
        const attach = AttachmentDetails[0];
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
      label: "Acknowledge",
      onClick: (item) => handleUpdate(item),
    },
    {
      label: "View Attachment",
      onClick: (item) => fetchInwardDetailsFiles(item),
    },
  ].filter((action) => action !== null);

  const handleUpdate = async (item) => {
    try {
      await dispatch(updateStatusIntwardCourier(item["Unique No."]));
      toast.success("Item Acknowledged successfully");
      fetchInwardDetails();
    } catch (error) {
      toast.error("Error deleting item");
    }
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
          await dispatch(deleteInwardCourier(item["Unique No."]));
          toast.success("Item deleted successfully");
          fetchInwardDetails();
        } catch (error) {
          toast.error("Error deleting item");
        }
      }
    });
  };
  const handleAllocate = (item) => {
    setIsEditMode(true);
    navigate("/addinwardcourier", { state: { item, isEditMode: true } });
  };

  const handleExportExcel = () => {
    const data = searchFilter?.length > 0 ? searchFilter : inwardDetails;
  
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
  
    const fileName = `Inward Courier Details - ${formattedDate}`;
    ExportToXLSX(data, fileName);
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    navigate("/addinwardcourier", {
      state: { isEditMode: false },
    });
  };

  const handleSearchChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value === "" ? null : value,
    }));
    setPage(0);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const validExtensions = ["xlsx", "csv"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (validExtensions.includes(fileExtension)) {
        setFile(selectedFile);
      } else {
        toast.error("Invalid file format. Please upload .xlsx or .csv files.");
        event.target.value = "";
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    if (file) {
      formData.append("files", file);
    }
    try {
      const response = await dispatch(bulkUploadFileInward(formData));
      if (response?.payload?.success === true) {
        toast.success(response?.payload?.message);
        setFile(null);
        fetchInwardDetails();
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
          <Title title="Inward Courier" />
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
                  { label: "Filter By Status" },
                  { label: "Pending" },
                  { label: "Delivered" },
                ]}
                selectedValue={filter.status || null}
                onChange={(e) => {
                  const Values =
                    e.target.value === null ||
                    e.target.value === "Filter By Status"
                      ? null
                      : e.target.value;
                  handleSearchChange("status", Values);
                }}
              />
            </Col>
            <Col md={2} className="mt-4">
              <CustomDropdown
                labelKey="label"
                valueKey="label"
                options={[
                  {
                    label: null,
                    label: "Filter By Courier Type",
                  },
                  // ...courierModeDropdown,
                  ...(Array.isArray(courierModeDropdown) ? courierModeDropdown : []),

                ]}
                selectedValue={filter.couriertype || null}
                onChange={(e) => {
                  const Values =
                    e.target.value === null ||
                    e.target.value === "Filter By Courier Type"
                      ? null
                      : e.target.value;
                  handleSearchChange("couriertype", Values);
                }}
              />
            </Col>
            <Col md={2} className="mt-4">
              <CustomDropdown
                labelKey="department_desc"
                valueKey="department_desc"
                options={[
                  {
                    department_desc: null,
                    department_desc: "Filter By Department",
                  },
                  // ...departmentDropdown,
                  ...(Array.isArray(departmentDropdown) ? departmentDropdown : []),
                ]}
                selectedValue={filter.department || null}
                onChange={(e) => {
                  const Values =
                    e.target.value === null ||
                    e.target.value === "Filter By Department"
                      ? null
                      : e.target.value;
                  handleSearchChange("department", Values);
                }}
              />
            </Col>
            {inwardpermission?.export && (
              <Col md={2} className="mt-4 p-0">
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
          data={inwardDetails}
          paginationDropDown={false}
          paginationvalueName="Show"
          dataContained={inwardDetails.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          onPress={handleAddNew}
          buttonTitle={inwardpermission?.create ? "Add New" : ""}
          firstColumnVisibility={true}
          searchVisibility={inwardDetails}
          placeholder="Search by Unique No."
          toDateChange={(e) => {
            const uniqueNoValue = e.target.value === "" ? null : e.target.value;
            handleSearchChange("uniqueNo", uniqueNoValue);
          }}
          tofileOnchange={handleFileChange}
          uploadOnpress={handleFileUpload}
          importIconVisiblity={inwardpermission?.export ? true : false}
          actions={actions}
          actionVisibility={true}
          specialColumns={[
            "Date",
            "Time",
            "Status",
            "Department",
            "Location Name",
            "Courier Type",
            "Mobile No.",
            "Created By",
            "File Name",
            "Dispatch Team",
          ]}
        />
      </div>
    </Row>
  );
};

export default InwardCourier;