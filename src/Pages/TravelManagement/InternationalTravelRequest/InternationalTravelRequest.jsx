import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { json, useNavigate } from "react-router-dom";
import {
  finalHodApproval,
  getTravelDetailsByUser_Id,
  getTravelMode,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Title } from "../../../Components/Title/Title";
import { Col, Form, Row } from "react-bootstrap";
import FromDate from "../../../Components/DatePicker/FromDate";
import EndDate from "../../../Components/DatePicker/EndDate";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { toast, ToastContainer } from "react-toastify";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import { format, isValid } from "date-fns";
import DeleteAlert from "../../../Components/Validations/DeleteAlert";
import ExportTravelDetails from "../../../Components/Excel-JS/ExportTravelDetails";

const StatusOptionsData = [
  { value: "SelectStatus", label: "Select Status" },
  { value: "Pending for Quotation", label: "Pending for Quotation" },
  { value: "Pending for Approval", label: "Pending for Approval" },
  { value: "Approved", label: "Approved" },
  { value: "CANCEL", label: "Cancel" },
  { value: "Reject", label: "Reject" },
];
const InternationalTravelRequest = () => {
  const [searchFilter, setSearchFilter] = useState({
    travelerName: "",
    travelRequestNo: "",
    travelMode: 1,
    fromDate: null,
    endDate: null,
    status: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { getTravelDetailsByUserId } = useSelector(
    (state) => state.TravelManagement
  );
  const savedUserData = JSON?.parse(localStorage.getItem("userData"));
  const loading = useSelector(
    (state) => state.TravelManagement.status === "loading"
  );
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { International_Travel_Request } = permissionDetailData.data || {};
  const handleChangePage = (newPage) => {
    setPage(newPage);
    dispatch(
      getTravelDetailsByUser_Id({
        p_user_id: savedUserData?.data?.userId,
        p_limit: (newPage + 1) * rowsPerPage,
        from_date: searchFilter.fromDate,
        to_date: searchFilter.endDate,
        travelMode: 1,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const handleSearchChange = useCallback((name, value) => {
    setSearchFilter((prevState) => ({ ...prevState, [name]: value }));
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
        p_limit: rowsPerPage,
        from_date: searchFilter.fromDate,
        to_date: searchFilter.endDate,
        travelMode: 1,
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

  const travelDetails = getTravelDetailsByUserId.data || [];
  const count = getTravelDetailsByUserId.count;
  const mappedOlaUberFileDetails = travelDetails.map((file, index) => {
    const status = file.final_status;
    const journeyDetails = file.journey_details || {};

    return {
      "S.No": index + 1,
      "Travel Request No": file?.TRF_REFERENCE_ID || "-",
      "Booked by": file?.TRF_CREATED_BY || "-",
      "Traveler Name": file?.TRF_TRAVELLER_NAME || "-",
      "Travel Reason": file?.TRF_TRAVEL_REASON || "-",
      "From Place": journeyDetails?.TRJM_FROM_PLACE || "-",
      "To Place": journeyDetails?.TRJM_TO_PLACE || "-",
      "Date Of Journey": formatDateOrTime(journeyDetails?.TRJM_DATE_OF_JOURNEY),
      "Created Date": formatDateOrTime(file?.TRF_CREATED_DATE),
      Status: getStatus(status?.TJDAS_STATUS, file?.TRF_SAVE_LATER, file),
      Remark: status?.TJDAS_REMARKS || "-",
    };
  });

  function getStatus(status, saveLater, file) {
    switch (status) {
      case "ACC":
        return "Approved";
      case "REJ":
        return "Reject";
      case "CANCEL":
        return "Cancel";
      default:
        return saveLater == 1
          ? "Save As Draft"
          : "Pending for " +
              (file?.final_vendor_details ? "Approval" : "Quotation");
    }
  }

  const HodAction = getTravelDetailsByUserId.hodAction || false;

  const actions = HodAction
    ? [
        {
          label: "Approve",
          icon: <FaCheck />,
          onClick: (item) => handleHODAction(item, "ACCEPT"),
        },
        {
          label: "Reject",
          icon: <FaTimes />,
          onClick: (item) => handleHODAction(item, "REJECT"),
        },
      ]
    : [
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

  const handleHODAction = async (item, type) => {
    const payload = {
      p_reference_id: item["Travel Request No"],
      p_STATUS: type,
      p_remarks: "",
      p_user_id: savedUserData?.data?.userId,
    };
    try {
      const response = await dispatch(finalHodApproval(payload));
      if (response?.payload?.statusCode === 200) {
        toast.success(response?.payload);
        fetchTravelDetailsByUser_Id();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = async (item) => {
    await navigate("/travelRequestForm", {
      state: { editMode: "editMode", reference_id: item["Travel Request No"] },
    });
  };

  const handleAction = () => {
    alert("Work under Progress...");
  };

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
      const date = new Date();
			const formattedDate = date.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
      ExportTravelDetails(
        travelDetails,
        `travelDetails-${formattedDate}`,
        formatDateOrTime,
        searchFilter
      );
    } else {
      toast.warning("No Records Found");
    }
  };

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

  return (
    <Row className="dashboard me-1 ms-1">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Title title=" International Travel Request" />

      <Row className="mt-4 justify-content-around">
        <Col md={3}>
          <CustomInput
            labelName="Traveler Name"
            type="text"
            placeholder="Enter traveler name"
            value={searchFilter?.travelerName}
            onChange={(e) => handleSearchChange("travelerName", e.target.value)}
          />
        </Col>
        <Col md={2}>
          <FromDate
            fromDate={searchFilter.fromDate}
            endDate={searchFilter.endDate}
            handleChange={(date) => handleSearchChange("fromDate", date)}
            Label="From Date"
          />
        </Col>
        <Col md={2}>
          <EndDate
            fromDate={searchFilter.fromDate}
            endDate={searchFilter.endDate}
            handleChange={(date) => handleSearchChange("endDate", date)}
            Label="End Date"
          />
        </Col>
        <Col md={2}>
          <CustomInput
            labelName="Travel request No."
            type="number"
            placeholder="Travele request No"
            value={searchFilter?.travelRequestNo}
            onChange={(e) =>
              handleSearchChange("travelRequestNo", e.target.value)
            }
            maxlength="10"
            isMin = "0"
          />
        </Col>
        <Col md={2} className="">
          <CustomDropdown
            dropdownLabelName="Status"
            labelKey="label"
            valueKey="value"
            placeholder="Select Status"
            options={StatusOptionsData}
            value={searchFilter.status}
            onChange={(e) => {
              const selectedValue = e.target.value;
              handleSearchChange("status", selectedValue);
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2 ms-2 me-2">
        {International_Travel_Request?.export && (
          <Col md={2} className="mt-4">
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height={40}
              width={140}
              onPress={handleExportExcel}
            />
          </Col>
        )}
        <Col md={8} />
        {International_Travel_Request?.create && (
          <Col md={2} className="mt-4">
            <CustomSingleButton
              _ButtonText="Add New"
              height={40}
              onPress={() => navigate("/travelRequestForm")}
            />
          </Col>
        )}
      </Row>
      <CustomTable
        // data={ filteredData ?.length > 0? filteredData:  mappedOlaUberFileDetails}
        data={filtered}
        firstColumnVisibility={true}
        dataContained={
          filtered.length !== travelDetails.length ? filtered.length : count
        }
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
        clickableColumns={["Travel Request No"]}
        isClickable={true}
        onColumnClick={(key) => {
          navigate("/travelRequestForm", {
            state: {
              editMode: "editMode",
              reference_id: key,
              hodview: HodAction,
            },
          });
        }}
        actionVisibility={true}
        onRowCheckboxChange={handleAction}
        actions={actions}
        marginTopTable={true}
        lineVisibility={true}
        specialColumns={["Status"]}
      />
      {loading && <CommonLoader />}
    </Row>
  );
};

export default InternationalTravelRequest;
