import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import { Title } from "../../Components/Title/Title";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteVisitorManagement,
  getAppointmentStatusDropdown,
  getPurposeOfVisitDropdown,
  getVisitorManagementData,
} from "../../Slices/VisitorManagement/VisitorManagementSlice";
import { ExportToXLSX } from "../../Components/Excel-JS/ExportToXLSX";
import { getDepartmentDropdown } from "../../Slices/CourierSevices/CourierSevicesSlice";

const VisitorManagementSystem = () => {
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [value, setValue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState({
    id: "",
    fromDate: "",
    toDate: "",
  });
  const [filter, setFilter] = useState({
    visitorId: null,
    departmentId: null,
    start_date: null,
    end_date: null,
    appointmentStatus: null,
    purpose_of_visit: null,
  });
  const getVisitorDetails = useSelector(
    (state) => state.VisitorManagement.visitorGetDetails?.data || []
  );
  useEffect(() => {
    fetchVisitorDetails(null);
  }, [
    filter.visitorId,
    filter.departmentId,
    filter.start_date,
    filter.end_date,
    filter.appointmentStatus,
    filter.purpose_of_visit,
  ]);
  const PurposeOfVisitDropdownData = useSelector(
    (state) => state.VisitorManagement.PurposeOfVisitDropdown || []
  );
  const AppointmentStatusDropdownData = useSelector(
    (state) => state.VisitorManagement.appointmentStatusDropdown
  );
  const departmentDropdown = useSelector(
    (state) => state.CourierService.departmentDropdown.data || []
  );
  useEffect(() => {
    dispatch(getPurposeOfVisitDropdown("PURPOSE_OF_VISIT"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getAppointmentStatusDropdown("APPOINTMENT_STATUS"));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getDepartmentDropdown());
  }, [dispatch]);
  const fetchVisitorDetails = async (value) => {
    const payload = {
      visitorId: filter.visitorId,
      departmentId: filter.departmentId,
      start_date: filter.start_date,
      end_date: filter.end_date,
      appointmentStatus: filter.appointmentStatus,
      purpose_of_visit: filter.purpose_of_visit,
    };

    await dispatch(getVisitorManagementData(payload));
  };

  const navigate = useNavigate();

  const handleSearchChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value === "" ? null : value,
    }));
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const handleNavigate = () => {
    setTimeout(() => {
      navigate("/addVisitor");
    }, 500);
  };

  const actions = [
    {
      label: "Edit",
      icon: <FaEdit />,
      onClick: (item) => handleAllocate(item),
    },
    {
      label: "Delete",
      icon: <FaTrash />,
      onClick: (item) => handleDelete(item),
    },
  ];

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
          await dispatch(deleteVisitorManagement(item["Visitor Id"]));
          toast.success("Item deleted successfully");
          fetchVisitorDetails();
        } catch (error) {
          toast.error("Error deleting item");
        }
      }
    });
  };

  const handleAllocate = (item) => {
    setIsEditMode(true);
    navigate("/addVisitor", { state: { item, isEditMode: true } });
  };
  const handleExportExcel = () => {
    const data = searchFilter?.length > 0 ? searchFilter : getVisitorDetails;

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    const fileName = `Visitor Management System - ${formattedDate}`;

    ExportToXLSX(data, fileName);
  };

  const loading = useSelector(
    (state) => state.VisitorManagement.status === "loading"
  );
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
          <Title title="Visitor Management System" />
          <Row className="mt-4">
            <Col md={2} style={{ marginTop: "-7px" }}>
              <CustomInput
                labelName="From Date"
                type="date"
                value={filter.start_date}
                onChange={(event) =>
                  handleSearchChange("start_date", event.target.value)
                }
              />
            </Col>
            <Col md={2} style={{ marginTop: "-7px" }}>
              <CustomInput
                labelName="To Date"
                type="date"
                value={filter.end_date}
                onChange={(event) =>
                  handleSearchChange("end_date", event.target.value)
                }
              />
            </Col>
            {/* <Col md={2} className="mt-4">
              <CustomDropdown
                labelKey="label"
                valueKey="label"
                options={[
                  {
                    label: null,
                    label: "Filter By Appointment Status",
                  },
                  ...AppointmentStatusDropdownData,
                ]}
                selectedValue={filter.appointmentStatus || null}
                onChange={(e) => {
                  const Values =
                    e.target.value === null ||
                    e.target.value === "Filter By Appointment Status"
                      ? null
                      : e.target.value;
                  handleSearchChange("appointmentStatus", Values);
                }}
              />
            </Col> */}
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
                  ...(Array.isArray(departmentDropdown)
                    ? departmentDropdown
                    : []),
                ]}
                selectedValue={filter.departmentId || null}
                onChange={(e) => {
                  const Values =
                    e.target.value === null ||
                    e.target.value === "Filter By Department"
                      ? null
                      : e.target.value;
                  handleSearchChange("departmentId", Values);
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
                    label: "Filter By Purpose of Visit",
                  },
                  // ...PurposeOfVisitDropdownData,
                  ...(Array.isArray(PurposeOfVisitDropdownData)
                    ? PurposeOfVisitDropdownData
                    : []),
                ]}
                selectedValue={filter.purpose_of_visit || null}
                onChange={(e) => {
                  const Values =
                    e.target.value === null ||
                    e.target.value === "Filter By Purpose of Visit"
                      ? null
                      : e.target.value;
                  handleSearchChange("purpose_of_visit", Values);
                }}
              />
            </Col>
            <Col md={2} className="mt-4">
              <CustomSingleButton
                _ButtonText="Export To Excel"
                height={40}
                onPress={handleExportExcel}
              />
            </Col>
          </Row>
        </Card>
        <div className="my-4">
          <CustomTable
            data={getVisitorDetails}
            titleName="Vendor Management"
            headingText={false}
            setValue={setValue}
            SelectColumnData={[]}
            SelectColumnValue={value}
            selectedRows={selectedRows}
            allSelected={allSelected}
            // selectColumnData={true}
            paginationDropDown={false}
            paginationvalueName="Show"
            paginationDataValue={[]}
            dataContained={getVisitorDetails?.length}
            pageCount={page}
            handlePageClick={handleChangePage}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={handleChangeRowsPerPage}
            onPress={handleNavigate}
            buttonTitle="Add New"
            firstColumnVisibility={true}
            // exportIconVisiblity={true}
            exceldownload={() => handleExportExcel(getVisitorDetails)}
            actions={actions}
            actionVisibility={true}
            marginTopTable={true}
            lineVisibility={true}
            searchVisibility={true}
            placeholder="Search by Visitor Id	"
            toDateChange={(e) => {
              const visitorIdValue =
                e.target.value === "" ? null : e.target.value;
              handleSearchChange("visitorId", visitorIdValue);
            }}
            specialColumns={[
              "Email Address",
              "Meeting With",
              "Department",
              "Card Type",
              "Visit Date",
              "Contact Number",
              "File Name",
              "Purpose of Visit",
              "Company Name",
              "Visitor Pic",
              "Remarks",
              "Visitor Name"
            ]}
          />
        </div>
      </div>
    </Row>
  );
};

export default VisitorManagementSystem;
