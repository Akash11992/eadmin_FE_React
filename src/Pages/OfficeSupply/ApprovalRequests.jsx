import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  approverApproval,
  getstatusDropdown,
  officesupliceRequestgetdata,
} from "../../Slices/OfficeSupply/OfficeSupplySlice";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import { Col, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import ExportOfficeSupplyDetails from "../../Components/Excel-JS/ExportOfficeSupplyDetails";
import { Title } from "../../Components/Title/Title";
import FromDate from "../../Components/DatePicker/FromDate";
import EndDate from "../../Components/DatePicker/EndDate";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";

const ApprovalRequests = () => {
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Approval_Requests } = permissionDetailData.data || {};

  const savedUserData = JSON?.parse(localStorage.getItem("userData"));

  const [formData, setFormData] = useState({
    selectedStatus: null,
    fromDate: null,
    endDate: null,
  });
  const userData = savedUserData?.data || {};
  const navigate = useNavigate();
  const isApproverLogin = tableData?.approver === userData.userEmail || null;

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchTableData = async () => {
    setLoading(true);
    try {
      if (formData.selectedBusiness === "") {
        formData.selectedDepartment = "";
      }
      const payload = {
        request_id: null,
        status: parseInt(formData.selectedStatus),
        fromDate: formData?.fromDate,
        endDate: formData?.endDate,
        requestStatus: 2,
      };
      const response = await dispatch(
        officesupliceRequestgetdata(payload)
      ).unwrap();
      setTableData(response?.data || []);
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error?.message || "Failed to fetch data.");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (formData.fromDate && !formData.endDate) {
      toast.warning("Please enter End Date");
      return;
    }
    if (formData.endDate && !formData.fromDate) {
      toast.warning("Please enter Start Date");
      return;
    }
    fetchTableData(null);
  }, [formData.selectedStatus, formData.fromDate, formData.endDate]);

  const handleNavigate = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/addNewOfficeSupply");
      setLoading(false);
    }, 500);
  };
  const handleEdit = async (item) => {
    try {
      const response = await dispatch(
        officesupliceRequestgetdata({ request_id: item["Request ID"] })
      ).unwrap();
      console.log("API Response:", response);
      if (response?.data) {
        navigate("/addNewOfficeSupply", {
          state: {
            editData: response.data,
            isApproverLogin: isApproverLogin,
            isApproverRequestEdit: true,
          },
        });
      } else {
        toast.error("Data not found for editing.");
      }
    } catch (error) {
      console.error("Error fetching edit data:", error);
      toast.error("Failed to fetch data for editing.");
    }
  };

  const { statusDropdown } = useSelector((state) => state.OfficeSupply);
  useEffect(() => {
    dispatch(getstatusDropdown("VENDOR_STATUS"));
  }, []);

  let actions = [];

  // Edit
  actions.push({
    label: "Edit",
    icon: <FaEdit />,
    onClick: (item) => handleEdit(item),
  });

  // Approve & Reject if approver login
  if (isApproverLogin) {
    actions.push(
      {
        label: "Approve",
        icon: <FaCheck />,
        onClick: (item) => handleAprover(item, "APPROVED"),
      },
      {
        label: "Reject",
        icon: <FaTimes />,
        onClick: (item) => handleAprover(item, "REJECTED"),
      }
    );
  }

  const handleAprover = async (item, status) => {
    const payload = {
      id: item["Request ID"],
      type: status,
    };
    console.log(item, "item");
    if (item["Request Status"] !== "Sent To Approver") {
      toast.warning(
        `Only requests with status "Sent To Approver" can be ${status?.toLowerCase()}.`
      );
      return;
    }
    try {
      const response = await dispatch(approverApproval(payload));
      console.log(response, "response");
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data[0].message);
        fetchTableData(null);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error("Failed to update approval status.");
    }
  };
  const handleExportExcel = () => {
    if (formattedData?.length > 0) {
      const currentDate = new Date()
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
      const fileName = `Office_Supply_Request_Details_${currentDate}`;
      ExportOfficeSupplyDetails(tableData, fileName);
    } else {
      toast.warning("No Records Found");
    }
  };
  const formattedData = tableData?.data?.map((item, index) => ({
    "S.No": index + 1,
    "Request ID": item.TOSR_REQUEST_ID,
    "Request Date": item.TOSR_REQUEST_DATE,
    "Requested By": item.TOSR_REQUESTED_BY,
    Entity: item.TOSR_ENTITY || "N/A",
    Business: item.TOSR_BUSINESS_ID || "",
    Department: item.TOSR_DEPARTMENT_ID || "",
    Location: item.TOSR_LOCATION_ID || "",
    Floor: item.TOSR_FLOOR_ID || "",
    "Category Name": item.TOSR_ITEMS_DETAILS?.[0]?.TOSCM_CATEGORY_NAME || "N/A",
    "Item Name": item.TOSR_ITEMS_DETAILS?.[0]?.TOSR_ITEM_NAME || "N/A",
    Quantity: item.TOSR_ITEMS_DETAILS?.[0]?.TOSR_QUANTITY || 0,
    "Request Status": item.TOSR_REQUEST_STATUS || "",
    "Approver Status": item.STATUS || "Pending",
    "Approver Remark": item.TOSR_APPROVER_REMARK || "",
  }));
  const filteredData = (formattedData || []).filter((item) =>
    Object.values(item || {}).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <div className="mt-4 justify-content-around">
        <Title title="Approval Requests" />
        <hr />
        <Row>
          <Col md={3}>
            <FromDate
              fromDate={formData.fromDate}
              endDate={formData.endDate}
              handleChange={(date) => handleFormChange("fromDate", date)}
              Label="Start Date"
            />
          </Col>
          <Col md={3}>
            <EndDate
              fromDate={formData.fromDate}
              endDate={formData.endDate}
              handleChange={(date) => handleFormChange("endDate", date)}
              Label="End Date"
            />
          </Col>{" "}
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Approval Status"
              options={[
                { label: "Select", value: "" },
                ...(statusDropdown || []),
              ]}
              valueKey="value"
              labelKey="label"
              selectedValue={formData.selectedStatus}
              onChange={(e) =>
                handleFormChange("selectedStatus", e.target.value)
              }
            />
          </Col>{" "}
          <Col md={3} />
        </Row>
      </div>
      <div className="mt-2">
        {loading ? (
          <CommonLoader />
        ) : (
          <CustomTable
            data={filteredData}
            headingText={false}
            paginationDropDown={false}
            paginationvalueName="Show"
            paginationDataValue={[]}
            searchVisibility={false}
            placeholder={"Search..."}
            toDateChange={(e) => setSearchTerm(e.target.value)}
            exportToExcelBtnVisiblity={Approval_Requests?.export && true}
            handleExportExcel={handleExportExcel}
            dataContained={filteredData?.length}
            buttonTitle={false}
            onPress={handleNavigate}
            firstColumnVisibility={true}
            actions={actions}
            actionVisibility={Approval_Requests?.update && isApproverLogin}
            marginTopTable={true}
            lineVisibility={true}
            pageCount={page}
            handlePageClick={handleChangePage}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={handleChangeRowsPerPage}
            isRightSideButtonVisible={false}
            specialColumns={[
              "Department",
              "Entity",
              "Location",
              "Floor",
              "Business",
              "Status",
            ]}
          />
        )}
      </div>
    </div>
  );
};
export default ApprovalRequests;
