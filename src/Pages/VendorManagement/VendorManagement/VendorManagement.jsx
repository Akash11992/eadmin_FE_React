import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import { Title } from "../../../Components/Title/Title";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import {
  getvendorLists,
  getVendorById,
  deleteVendor,
} from "../../../Slices/VendorManagement/VendorManagementSlice";
import {
  getcategorydropdown,
  getSubCategorydropdown,
} from "../../../Slices/Commondropdown/CommondropdownSlice";
import { IoIosEye } from "react-icons/io";

const VendorManagement = () => {
  const [value, setValue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { categorys } = useSelector((state) => state.CommonDropdownData);
  const categoriesData = categorys?.data?.data;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState({
    priority: "",
    status: "",
    id: "",
  });
  const { subcategories } = useSelector((state) => state.CommonDropdownData);
  const subcategoriesFindData = subcategories?.data?.data;

  const [formData, setFormData] = useState({
    selectedCategory: "",
    vendorSubCategory: "",
    enddate: "",
    startdate: "",
  });
  // const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (formData.selectedCategory) {
      dispatch(getSubCategorydropdown(formData.selectedCategory));
    }
  }, [formData.selectedCategory]);

  useEffect(() => {
    fetchvendorLists();
    fetchCategorydropdown();
  }, []);

  useEffect(() => {
    filterVendorData();
  }, [formData.selectedCategory, formData.vendorSubCategory, vendorData]);

  const fetchCategorydropdown = async () => {
    await dispatch(getcategorydropdown());
  };

  const fetchvendorLists = async () => {
    setLoading(true);
    const formattedStartDate = formData.startdate
      ? new Date(formData.startdate).toISOString().split("T")[0]
      : null;
    const formattedEndDate = formData.enddate
      ? new Date(formData.enddate).toISOString().split("T")[0]
      : null;

    const payload = {
      fromDate: formattedStartDate || null,
      toDate: formattedEndDate || null,
    };
    // console.log(payload, "12312");
    const response = await dispatch(getvendorLists(payload));
    // console.log("response", response);
    if (response?.payload?.data) {
      console.log(response?.payload?.data,"response?.payload?.data?.data?")
      const transformedData = response?.payload?.data?.data?.map((item, index) => ({
        "S No": index + 1,
        vendorId: item.VENDOR_ID,
        "Supplier Code": item.SUPPLIER_CODE,
        "Account Code": item.ACCOUNT_CODE,
        Company: item.VENDOR_COMPANY,
        "Account Type": item.ACCOUNT_TYPE,
        NAME: `${item.FIRST_NAME} ${item.LAST_NAME}` || "null",
        EMAIL: item.EMAIL_ID,
        PHONE: item.PHONE_NO || "null",
        Categories: item["CATEGORY NAME"],
        "Sub Categories": item["SUBCATEGORY NAME"],
        Responsibility: item?.Responsibility,
        // "Preferred Vendor": item.PREFERRED_VENDOR === 1 ? "Yes" : "No",
        // STATUS: item.STATUS === 1 ? "Activate" : "Deactivate",
      }));
      setVendorData(transformedData);
    }
    setLoading(false);
    setPage(0)
  };

  useEffect(() => {
    if (formData.startdate && formData.enddate) {
      fetchvendorLists();
    }
  }, [formData.startdate, formData.enddate]);

  const filterVendorData = () => {
    // console.log("formData..", formData);
    if (!formData.selectedCategory && !formData?.vendorSubCategory) {
      setFilteredData(vendorData);
    }
    if (formData?.vendorSubCategory) {
      const filtered = vendorData.filter((item) => {
        const subCategoryMatches = formData.vendorSubCategory
          ? item["Sub Categories"] === formData.vendorSubCategory
          : true;

        return subCategoryMatches;
      });
      setFilteredData(filtered);
    }
  };

  const filterAllData = filteredData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handlegetVendorByIdUpdate = async (vendorId) => {
    const payload = { vendorId };
    const response = await dispatch(getVendorById(payload));
    // console.log('response',response)
    if (getVendorById?.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        return response.payload.data;
      }
    } else if (getVendorById?.rejected.match(response)) {
      toast.error("An unknown error occurred.");
    }
    return null;
  };

  const handleEdit = async (item) => {
    const userId = item.vendorId;
    setLoading(true);
    const response = await handlegetVendorByIdUpdate(userId);
    const userData = response?.data;
    if (Array.isArray(userData) && userData.length > 0) {
      const userDetails = userData[0];
      navigate("/addVendor", { state: { vendorUserData: userDetails } });
    }
    setLoading(false);
  };

  const handleDelete = async (vendorId) => {
    const payload = { vendorId };
    const response = await dispatch(deleteVendor(payload));
    fetchvendorLists();
    if (deleteVendor.fulfilled.match(response)) {
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.message);
      }
    } else if (deleteVendor.rejected.match(response)) {
      toast.warn(response.payload?.message || "An unknown error occurred.");
    }
  };

  const handleTypeDelete = (vendorId) => {
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
        handleDelete(vendorId);
      }
    });
  };

  const actions = [
    {
      label: "Edit",
      icon: <FaEdit />,
      onClick: (item) => handleEdit(item),
    },
    {
      label: "Delete",
      icon: <FaTrash />,
      onClick: (item) => handleTypeDelete(item.vendorId),
    },
  ];

  const handleNavigate = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/AddVendor");
      setLoading(false);
    }, 500);
  };
  const handleExportExcel = (data) => {
    if (!filterAllData || filterAllData.length === 0) {
      toast.warning("No Records Found");
      return;
    }
    try {
      const worksheet = XLSX.utils.json_to_sheet(filterAllData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Management");
      const currentDate = new Date().toISOString().split("T")[0];
      const fileName = `Vendor Management Document - ${currentDate}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      toast.error("Failed to export Excel file. Please try again.");
    }
  };

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <div className="mt-3">
        <Title title="Vendor Management" />
        <hr />
        <Row className="mb-4">
          <Col md={2}>
            <CustomInput
              labelName="From Date"
              type="date"
              value={formData.startdate}
              onChange={(event) =>
                handleFormChange("startdate", event.target.value)
              }
            />
          </Col>
          <Col md={2}>
            <CustomInput
              labelName="To Date"
              type="date"
              value={formData.enddate}
              onChange={(event) =>
                handleFormChange("enddate", event.target.value)
              }
            />
          </Col>
          <Col md={4}>
            <CustomDropdown
              dropdownLabelName="Categories"
              options={[
                { categorie_id: "", categories_name: "Select Categories" },
                ...(categoriesData || []),
              ]}
              valueKey="categorie_id"
              labelKey="categories_name"
              onChange={(e) =>
                handleFormChange("selectedCategory", e.target.value)
              }
              selectedValue={formData.selectedCategory}
              // mandatoryIcon={true}
            />
          </Col>
          <Col sm={4}>
            <CustomDropdown
              dropdownLabelName="Sub Categories"
              options={[
                {
                  subcategory_id: "",
                  subcategory_name: "Select Sub Categories",
                },
                ...(subcategoriesFindData || []),
              ]}
              valueKey="subcategory_name"
              labelKey="subcategory_name"
              onChange={(e) =>
                handleFormChange("vendorSubCategory", e.target.value)
              }
              // onChange={(e) => setSelectedSubCategory(e.target.value)}
              selectedValue={formData?.vendorSubCategory}
              // selectedValue={selectedSubCategory}
              isDisable={!formData.selectedCategory}
            />
          </Col>
        </Row>
      </div>
      <CustomTable
        data={filterAllData}
        titleName="Vendor Management"
        headingText={false}
        setValue={setValue}
        SelectColumnData={[]}
        SelectColumnValue={value}
        selectedRows={selectedRows}
        allSelected={allSelected}
        selectColumnData={false}
        paginationDropDown={false}
        paginationvalueName="Show"
        paginationDataValue={[]}
        dataContained={filterAllData?.length}
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
        onPress={handleNavigate}
        buttonTitle="Add New"
        firstColumnVisibility={true}
        // exportIconVisiblity={true}
        exportToExcelBtnVisiblity={true}
        // exceldownload={() => handleExportExcel(filteredData)}
        handleExportExcel={() => handleExportExcel(filteredData)}
        actions={actions}
        actionVisibility={true}
        marginTopTable={true}
        lineVisibility={true}
        specialColumns={[
          "Company",
          "EMAIL",
          "PHONE",
          "Categories",
          "STATUS",
          "NAME",
          "Responsibility",
        ]}
        searchVisibility={true}
        placeholder="Search.."
        fromDateValue={searchTerm}
        toDateChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <CommonLoader />}
    </div>
  );
};

export default VendorManagement;