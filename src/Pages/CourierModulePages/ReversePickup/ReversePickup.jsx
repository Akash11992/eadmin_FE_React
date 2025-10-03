import React, { useEffect, useState } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { useNavigate } from "react-router-dom";
import { Title } from "../../../Components/Title/Title";
import { Form, Col, InputGroup, Row } from "react-bootstrap";
import {
  GetReversePickupDetail,
  deleteReversePickupById,
} from "../../../Slices/ReversePickup/ReversePickupSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
const ReversePickup = () => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [AllData, setAllData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formType, setFormType] = useState("0");
  const [filteredData, setFilteredData] = useState([]);
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const dispatch = useDispatch();
  console.log(fromDate);
  const handleFormTypeChange = (e) => {
    const selectedFormType = e.target.value;
    setFormType(selectedFormType);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const permissionDetail = useSelector(
    (state) => state.Role?.permissionDetails || []
  );

  const Reverse_Pickup_permission =
    permissionDetail?.data?.Reverse_Pickup || {};
  const navigate = useNavigate();
  const allPaginationData = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ];
  useEffect(() => {
    if (formType) {
      GetDetails();
    }
  }, [formType]);
  const formatDateToYYYYMMDD = (dateString) => {
    const [day, month, year] = dateString.split("-"); // Split by '/'
    return `${year}-${month}-${day}`; // Rearrange the parts
  };
  const GetDetails = async () => {
    if (fromDate && !toDate) {
      toast.warn("Please enter To Date");
      return;
    }

    if (!fromDate && toDate) {
      toast.warn("Please enter From Date");
      return;
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.warn("From Date should be earlier than or equal to To Date");
      return;
    }
    const payload = {
      p_rolewise: savedUserData.data.role_name === "admin" ? "ADMIN" : "",
      p_user_id: savedUserData.data.userId,
      p_filter: formType,
      p_from_date: fromDate,
      p_to_date: toDate,
      // page_no: null,
    };
    try {
      const response = await dispatch(GetReversePickupDetail(payload));
      if (response?.payload?.success === true) {
        setAllData(response.payload.data);
        setPage(0);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    // Extract day, month, year, hours, and minutes
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Return formatted string
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };
  const DomtransformedData = AllData.map((item, index) => {
    const { user_id, Domestic_international, ...rest } = item;
    return {
      S_No: index + 1,
      Id: rest.travel_id,
      "Date/Time": formatDate(rest.created_date),
      token_no: rest.token_no,
      official_personal:
        rest?.official_personal === 1
          ? "Personal"
          : rest?.official_personal === 0
          ? "Official"
          : null,
      "Behalf of": rest?.behalf,
      "Account No.": rest?.account_no,
      weight_of_shipment: rest?.weight_of_shipment,
    };
  });
  const IntertransformedData = AllData.map((item, index) => {
    const { RPID_USER_ID, RPID_COMPANY_ID, ...rest } = item;
    return {
      S_No: index + 1,
      Id: rest.RPID_ID,
      "Date/Time": formatDate(rest.RPID_CREATED_DATE),
      token_no: rest.RPID_TOKEN_NO,
      official_personal:
        rest?.RPID_OFFICIAL_PERSONAL === "1" ? "Official" : "Personal",
      // rest?.RPID_OFFICIAL_PERSONAL === 1 ? "Personal" : "Official",
      "Behalf of": rest.RPID_BEHALF_OF,
      "PickUp account No.": rest.RPID_PICKUP_ACCOUNT_DETAILS,
      "Shipper Address": `${rest?.shipper_details?.[0]?.RIMD_ADDRESS},${rest?.shipper_details?.[0]?.RIMD_CITY},${rest?.shipper_details?.[0]?.RIMD_COUNTRY},${rest?.shipper_details?.[0]?.RIMD_ZIP_CODE}`,
      "Shipper MOBILE NO": rest?.shipper_details?.[0]?.RIMD_MOBILE_NO,
      "Shipper EMAIL ADDRESS": rest?.shipper_details?.[0]?.RIMD_EMAIL_ADDRESS,
      "Consignee Address": `${rest?.ca_details?.[0]?.RIMD_ADDRESS},${rest?.ca_details?.[0]?.RIMD_CITY},${rest?.ca_details?.[0]?.RIMD_COUNTRY},${rest?.ca_details?.[0]?.RIMD_ZIP_CODE}`,
      "Consignee MOBILE NO": rest?.ca_details?.[0]?.RIMD_MOBILE_NO,
      "Consignee EMAIL ADDRESS": rest?.ca_details?.[0]?.RIMD_EMAIL_ADDRESS,
    };
  });

  const handleDelete = async (item) => {
    const payload = {
      token_id: item?.token_no,
    };
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
          const response = await dispatch(deleteReversePickupById(payload));
          toast.success(response?.payload?.data);
          GetDetails();
        } catch (error) {
          toast.error("Error deleting item");
        }
      }
    });
  };
  const actions = [
    Reverse_Pickup_permission?.update && {
      label: "Edit",
      onClick: (item) => handleAllocate(item),
    },
    Reverse_Pickup_permission?.delete && {
      label: "Delete",
      onClick: (item) => handleDelete(item),
    },
  ];
  const handleAllocate = (item) => {
    console.log("handleAllocate", item);
    // navigate("/reversepickuprequestForm", {
    navigate("/requestForm", {
      state: {
        token_no: item.token_no,
        isEditMode: true,
        reversePick: true,
        DomInter: formType,
        Id: item.Id,
      },
    });
  };

  const handleExportExcel = () => {
    if (IntertransformedData?.length > 0) {
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      const fileName = `International Reversepickup Details - ${formattedDate}`;
      ExportToXLSX(IntertransformedData, fileName);
    } else {
      toast.warning("No Records Found");
    }
  };

  const handleExport = () => {
    if (DomtransformedData?.length > 0) {
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;

      const fileName = `Domestic Reversepickup Details - ${formattedDate}`;
      ExportToXLSX(DomtransformedData, fileName);
    } else {
      toast.warning("No Records Found");
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
      {loading && <CommonLoader />}
      <div className="mt-4 mb-4">
        <Title title={"ReversePickup Courier"} />
      </div>
      <Row>
        <Col md={3}>
          <Form.Group>
            <Form.Label htmlFor="officialOrPersonal">
              Domestic or International
            </Form.Label>
            <InputGroup>
              <Form.Control
                as="select"
                id="officialOrPersonal"
                aria-label="Official Or Personal"
                onChange={handleFormTypeChange}
                value={formType}
              >
                <option value="">Select</option>
                <option value="0">Domestic</option>
                <option value="1">International</option>
              </Form.Control>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={7}>
          <Row>
            <Col md={6}>
              <Row>
                <div className="w-50">
                  <CustomInput
                    labelName="From Date"
                    type="date"
                    value={fromDate}
                    onChange={(date) => setFromDate(date.target.value)}
                    // mandatoryIcon
                  />
                </div>

                <div className="w-50">
                  <CustomInput
                    labelName="To Date"
                    type="date"
                    value={toDate}
                    onChange={(date) => setToDate(date.target.value)}
                    // mandatoryIcon
                  />
                </div>
              </Row>
            </Col>
            <Col md={2} className="align-content-end">
              <CustomSingleButton
                _ButtonText="Search"
                height={40}
                width="100%"
                onPress={GetDetails}
              />
            </Col>
          </Row>
        </Col>

        <Col md={2} className="align-content-end">
          <CustomSingleButton
            _ButtonText="Export To Excel"
            height={40}
            // width="100%"
            onPress={formType === "1" ? handleExportExcel : handleExport}
          />
        </Col>
      </Row>

      <CustomTable
        data={formType === "1" ? IntertransformedData : DomtransformedData}
        setValue={setValue}
        SelectColumnValue={value}
        // exportToExcelBtnVisiblity="true"
        // handleExportExcel={formType === "1" ? handleExportExcel : handleExport}
        allSelected={allSelected}
        paginationDropDown={false}
        paginationvalueName="Show"
        paginationDataValue={allPaginationData}
        dataContained={
          filteredData?.length > 0
            ? filteredData?.length
            : DomtransformedData.length
        }
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
        onPress={() => navigate("/reversepickuprequestForm")}
        buttonTitle={Reverse_Pickup_permission?.create ? "Add New" : ""}
        firstColumnVisibility={true}
        // exportIconVisiblity={Reverse_Pickup_permission?.export ? true : false}
        importIconVisiblity={Reverse_Pickup_permission?.import ? true : false}
        actions={actions}
        actionVisibility={true}
        specialColumns={[
          "Date/Time",
          "Behalf of",
          "Shipper Address",
          "Consignee Address",
          "Shipper EMAIL ADDRESS",
          "Consignee EMAIL ADDRESS",
        ]}
      />
    </div>
  );
};

export default ReversePickup;
