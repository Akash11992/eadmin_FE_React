import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  finalHodApproval,
  getTravelDetailsByUser_Id,
  getTravelMode,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import FromDate from "../../../Components/DatePicker/FromDate";
import EndDate from "../../../Components/DatePicker/EndDate";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { Col, Form, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import { Title } from "../../../Components/Title/Title";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { FaEdit, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import DeleteAlert from "../../../Components/Validations/DeleteAlert";

const CarTravelRequest = () => {
  const [searchFilter, setSearchFilter] = useState({
    travelerName: "",
    travelRequestNo: "",
    fromDate: null,
    endDate: null,
    status: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Car_Hire_Request } = permissionDetailData.data || {};

  const { getTravelDetailsByUserId, travelModeData } = useSelector(
    (state) => state.TravelManagement
  );
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const loading = useSelector(
    (state) => state.TravelManagement.status === "loading"
  );

  useEffect(() => {
    dispatch(getTravelMode("TRAVEL_MODE"));
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchFilter.fromDate && !searchFilter.endDate) {
        toast.warning("Please enter End Date");
        return;
      }
      if (searchFilter.endDate && !searchFilter.fromDate) {
        toast.warning("Please enter From Date");
        return;
      }
      await fetchTravelDetailsByUser_Id();
    };

    handleSearch();
  }, [searchFilter.fromDate, searchFilter.endDate, searchFilter.travelMode]);

  const fetchTravelDetailsByUser_Id = async () => {
    await dispatch(
      getTravelDetailsByUser_Id({
        p_user_id: savedUserData?.data?.userId,
        p_limit: 1000,
        from_date: searchFilter.fromDate,
        to_date: searchFilter.endDate,
        travelMode: 2,
      })
    );
  };

  const formatDateOrTime = (value) => {
    if (!value) return "-";
    if (/^\d{2}:\d{2}$/.test(value)) {
      return value;
    }

    try {
      return format(new Date(value), "dd-MM-yyyy");
    } catch (error) {
      return "-";
    }
  };
  const mappedOlaUberFileDetails = getTravelDetailsByUserId?.data?.map(
    (file, index) => ({
      "S.No": index + 1,
      "Travel Request No": file?.TRF_REFERENCE_ID || "-",
      "Booked by": file?.TRF_CREATED_BY || "-",
      "Traveler Name": file?.TRF_TRAVELLER_NAME || "-",
      //   "Travel Mode": file?.TRF_TRAVEL_MODE_ID == 2 && "Car",
      "Travel Reason": file?.TRF_TRAVEL_REASON || "-",
      "From Place": file?.journey_details?.TRJM_FROM_PLACE || "-",
      "To Place": file?.journey_details?.TRJM_TO_PLACE || "-",
      "Date Of Journey": formatDateOrTime(
        file?.journey_details?.TRJM_DATE_OF_JOURNEY
      ),
      "Created Date": formatDateOrTime(file?.TRF_CREATED_DATE),
      Status:
        file?.final_status?.TJDAS_STATUS === "CANCEL"
          ? "Cancel"
          : file?.TRF_SAVE_LATER == 1
          ? "Save As Draft"
          : "Sent To Vendor",
    })
  );

  const filtered = mappedOlaUberFileDetails?.filter((item) => {
    const matchesTravelerName = searchFilter.travelerName
      ? item["Traveler Name"]
          .toLowerCase()
          .includes(searchFilter.travelerName.toLowerCase())
      : true;

    const matchesTravelRequestNo = searchFilter.travelRequestNo
      ? item["Travel Request No"]
          .toString()
          .toLowerCase()
          .includes(searchFilter.travelRequestNo.toLowerCase())
      : true;

    const matchesStatus =
      searchFilter.status && searchFilter.status !== "SelectStatus"
        ? item.Status.toLowerCase() === searchFilter.status.toLowerCase()
        : true;
    return matchesTravelerName && matchesTravelRequestNo && matchesStatus;
  });

  const handleExportExcel = () => {
    if (filtered?.length > 0) {
      ExportToXLSX(filtered, "Travel Request Details");
    } else {
      toast.warning("No Records Found");
    }
  };
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleSearchChange = useCallback((name, value) => {
    setSearchFilter((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const actions = [
    {
      label: "Edit",
      icon: <FaEdit />,
      onClick: (item) => handleEdit(item),
    },
    {
      label: "Cancel",
      icon: <FaTrash />,
      onClick: (item) => handleCancelTravelRequest(item),
    },
  ];

  const handleCancelTravelRequest = async (item) => {
    const payload = {
      p_reference_id: item["Travel Request No"],
      p_STATUS: "CANCEL",
      p_remarks: "",
      p_user_id: savedUserData?.data?.userId,
    };
    DeleteAlert({
      onDelete: async () => {
        try {
          const response = await dispatch(finalHodApproval(payload));
          if (response?.payload?.statusCode === 200) {
            toast.success(response?.payload?.data);
            fetchTravelDetailsByUser_Id();
          } else {
            toast.error(
              "An unexpected error occurred. Please try again later."
            );
          }
        } catch (error) {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      },
      btntext: "Yes Cancel Journey!",
    });
  };
  const handleEdit = (item) => {
    navigate("/carHireRequestForm", {
      state: { editMode: "editMode", reference_id: item["Travel Request No"] },
    });
  };

  return (
    <>
      {" "}
      <Row className="dashboard me-1 ms-1">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <Title title="Car Hire Request" />

        <Row className="mt-4 justify-content-around">
          <Col md={3}>
            <CustomInput
              labelName="Traveler Name"
              type="text"
              placeholder="Enter traveler name"
              value={searchFilter?.travelerName}
              onChange={(e) =>
                handleSearchChange("travelerName", e.target.value)
              }
            />
          </Col>
          <Col md={3}>
            <FromDate
              fromDate={searchFilter.fromDate}
              endDate={searchFilter.endDate}
              handleChange={(date) => handleSearchChange("fromDate", date)}
              Label="From Date"
            />
          </Col>
          <Col md={3}>
            <EndDate
              fromDate={searchFilter.fromDate}
              endDate={searchFilter.endDate}
              handleChange={(date) => handleSearchChange("endDate", date)}
              Label="End Date"
            />
          </Col>
          <Col md={3}>
            <CustomInput
              labelName="Travel request No."
              type="text"
              placeholder="Travele request No"
              value={searchFilter?.travelRequestNo}
              onChange={(e) =>
                handleSearchChange("travelRequestNo", e.target.value)
              }
            />
          </Col>
        </Row>
        <Row className="mt-2 ms-2 me-2">
          <Col md={2} className="mt-4">
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height={40}
              width={140}
              onPress={handleExportExcel}
            />
          </Col>
          <Col md={8} />
          <Col md={2} className="mt-4">
            {Car_Hire_Request?.create && (
              <CustomSingleButton
                _ButtonText="Add New"
                height={40}
                onPress={() => navigate("/carHireRequestForm")}
              />
            )}
          </Col>
        </Row>
        <CustomTable
          data={filtered}
          firstColumnVisibility={true}
          dataContained={filtered?.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          clickableColumns={["Travel Request No"]}
          isClickable={true}
          onColumnClick={(key) => {
            navigate("/carHireRequestForm", {
              state: { editMode: "editMode", reference_id: key },
            });
          }}
          actionVisibility={true}
          actions={actions}
          marginTopTable={true}
          lineVisibility={true}
        />
        {loading && <CommonLoader />}
      </Row>
    </>
  );
};

export default CarTravelRequest;
