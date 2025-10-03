import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FaCheck, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Title } from "../../Components/Title/Title";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { ExportToXLSX } from "../../Components/Excel-JS/ExportToXLSX";
import {
  getPriorityDropdown,
  deleteOfficeReq,
  officesupliceRequestgetdata,
  officesuppliceCategory,
  officesuppliceItem,
  getstatusDropdown,
  approverApproval,
} from "../../Slices/OfficeSupply/OfficeSupplySlice";
import { useDispatch, useSelector } from "react-redux";
import { getBusinessTypes } from "../../Slices/CompanyDetails/CompanyDetailSlice";
import { fetchDepartment_SubDepartments } from "../../Slices/TravelManagementSlice/TravelManagementsSlice";
import EndDate from "../../Components/DatePicker/EndDate";
import FromDate from "../../Components/DatePicker/FromDate";
import ExportOfficeSupplyDetails from "../../Components/Excel-JS/ExportOfficeSupplyDetails";

const OfficeSupplyRequest = () => {
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Office_Supply_Request } = permissionDetailData.data || {};

  const savedUserData = JSON?.parse(localStorage.getItem("userData"));

  const [formData, setFormData] = useState({
    selectedCategory: null,
    selectedDepartment: null,
    selectedPriority: null,
    selectedItemName: null,
    selectedStatus: null,
    selectedBusiness: null,
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
  const { getDepartment_subDepartment } = useSelector(
    (state) => state.TravelManagement
  );
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  const officeSupplyDropdown = useSelector(
    (state) => state.OfficeSupply.officesupplice
  );
  useEffect(() => {
    dispatch(officesuppliceCategory({ type: "Category" }));
    dispatch(getBusinessTypes());
    dispatch(getPriorityDropdown("PRIORITY"));
  }, [dispatch]);

  useEffect(() => {
    fetchDepartmentsDetails();
  }, [formData.selectedBusiness]);

  const fetchDepartmentsDetails = async () => {
    const payload = {
      busineesId: formData.selectedBusiness || 0,
    };
    try {
      await dispatch(fetchDepartment_SubDepartments(payload));
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  const officeSupplyItemDropdown = useSelector(
    (state) => state.OfficeSupply.officesuppliceItems
  );
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
        department: formData.selectedDepartment,
        category: formData.selectedCategory,
        item_name: formData.selectedItemName,
        status: parseInt(formData.selectedStatus),
        business: formData.selectedBusiness,
        fromDate: formData?.fromDate,
        endDate: formData?.endDate,
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
  }, [
    formData.selectedDepartment,
    formData.selectedCategory,
    formData.selectedItemName,
    formData.selectedStatus,
    formData.selectedBusiness,
    formData.fromDate,
    formData.endDate,
  ]);
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
            isApproverRequestEdit: false,
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

  const handleDelete = async (item) => {
    if (item["Request Status"] === "Delivered") {
      toast.info(
        "This request has already been delivered and cannot be deleted."
      );
      return;
    }
    const payload = {
      request_id: item["Request ID"],
    };

    const response = await dispatch(deleteOfficeReq(payload));
    if (deleteOfficeReq.fulfilled.match(response)) {
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.message);
        fetchTableData();
      }
    } else if (deleteOfficeReq.rejected.match(response)) {
      const errorMessage =
        response.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };
  const { statusDropdown } = useSelector((state) => state.OfficeSupply);
  useEffect(() => {
    dispatch(getstatusDropdown("VENDOR_STATUS"));
  }, []);

  const handleTypeDelete = (item) => {
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
        handleDelete(item);
      }
    });
  };

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

  // Delete if allowed
  if (Office_Supply_Request?.delete) {
    actions.push({
      label: "Delete",
      icon: <FaTrash />,
      onClick: (item) => handleTypeDelete(item),
    });
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

  useEffect(() => {
    if (formData.selectedCategory) {
      fetchItemsForCategory();
    }
  }, [formData.selectedCategory]);

  const fetchItemsForCategory = () => {
    console.log(formData.selectedCategory, "formData.selectedCategory");
    const payload = {
      type: "Item Name",
      category_id: formData.selectedCategory,
    };

    dispatch(officesuppliceItem(payload));
  };

  console.log(tableData?.data,"tableData?.data")
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
    String(value)
      .replace(/\s/g, "")
      .toLowerCase()
      .includes(searchTerm.replace(/\s/g, "").toLowerCase())
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
        <Title title="Office Supplies Request" />
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
              dropdownLabelName="Business"
              labelKey="businessName"
              valueKey="businessId"
              options={[
                { businessName: "Select", businessId: "" },
                ...(businesstype?.data || []),
              ]}
              selectedValue={formData?.selectedBusiness}
              onChange={(e) =>
                handleFormChange("selectedBusiness", e.target.value)
              }
              mandatoryIcon={true}
            />
          </Col>{" "}
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Department"
              options={[
                { value: null, label: "Select Department" },
                ...(Array.isArray(getDepartment_subDepartment)
                  ? getDepartment_subDepartment.map((department) => ({
                      value: department.department_desc,
                      label: department.department_desc,
                    }))
                  : []),
              ]}
              onChange={(e) =>
                handleFormChange(
                  "selectedDepartment",
                  e.target.value === "Select Department" ? null : e.target.value
                )
              }
              selectedValue={formData.selectedDepartment}
              valueKey="value"
              labelKey="label"
            />
          </Col>{" "}
        </Row>
        <Row className="mt-4 justify-content-around">
          {" "}
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Category"
              options={[
                { label: "Select Categories", value: "" },
                ...officeSupplyDropdown.map((item) => ({
                  label: item.TOSCM_CATEGORY_NAME,
                  value: item.TOSCM_CATEGORY_ID,
                })),
              ]}
              valueKey="value"
              labelKey="label"
              selectedValue={formData.selectedCategory}
              onChange={(e) => {
                handleFormChange("selectedCategory", e.target.value);
              }}
              selectLevel="Select Categories"
            />
          </Col>
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Item Name"
              options={[
                { label: "Select Item", value: "" },
                ...officeSupplyItemDropdown.map((item) => ({
                  label: item.TOSCI_ITEM_NAME,
                  value: item.TOSCI_C_ITEM_ID,
                })),
              ]}
              valueKey="value"
              labelKey="label"
              selectedValue={formData.selectedItemName}
              onChange={(e) => {
                handleFormChange("selectedItemName", e.target.value);
              }}
              selectLevel="Select Item"
            />
          </Col>
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
          </Col>
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
            searchVisibility={true}
            placeholder={"Search..."}
            toDateChange={(e) => setSearchTerm(e.target.value)}
            exportToExcelBtnVisiblity={Office_Supply_Request?.export && true}
            handleExportExcel={handleExportExcel}
            dataContained={filteredData?.length}
            buttonTitle="Add New"
            onPress={handleNavigate}
            firstColumnVisibility={true}
            actions={actions}
            actionVisibility={Office_Supply_Request?.update && true}
            marginTopTable={true}
            lineVisibility={true}
            pageCount={page}
            handlePageClick={handleChangePage}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={handleChangeRowsPerPage}
            isRightSideButtonVisible={Office_Supply_Request?.create && true}
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

export default OfficeSupplyRequest;
