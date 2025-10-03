import React, { useState, useEffect, useMemo, useRef } from "react";
import { Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import CustomInput from "../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../Components/Title/Title";
import { FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import {
  officesuppliceCategory,
  officesuppliceItem,
  addinventory,
  updateinventory,
  getinventory,
  deleteInventoryRecords,
  getBuildingDropdown,
  getLocationDropdown,
  getStock,
  bulkUploadInventory,
  checkStock,
} from "../../Slices/OfficeSupply/OfficeSupplySlice";
import { getCompanyList } from "../../Slices/Commondropdown/CommondropdownSlice";
import { ExportToXLSX } from "../../Components/Excel-JS/ExportToXLSX";
import { fetchDepartment_SubDepartments } from "../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { Autocomplete, TextField } from "@mui/material";
import { getBusinessTypes } from "../../Slices/CompanyDetails/CompanyDetailSlice";
import CustomAutoComplete from "../../Components/CustomAutoComplete/CustomAutoComplete";
import MultiSelectDropdown from "../../Components/CustomDropdown/MultiSelectDropdown";

const InventoryManagement = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    selectedCategory: "",
    selectedItem: "",
    stockId: "",
    itemDescription: "",
    officeLocation: "",
    floor: [],
    currentStock: "",
    inUsedStock: "",
    employeeName: "",
    department: "",
    business: "",
    file: null,
    entity: "",
  });

  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);

  const { building, locationDropdown, officesupplice, officesuppliceItems } =
    useSelector((state) => state.OfficeSupply);
  const { companyList } = useSelector((state) => state.CommonDropdownData);

  const { getDepartment_subDepartment } = useSelector(
    (state) => state.TravelManagement
  );
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  const isFormValid = useMemo(() => {
    return (
      formData.employeeName &&
      formData.entity &&
      formData.officeLocation &&
      formData.selectedCategory &&
      formData.selectedItem &&
      formData.currentStock &&
      formData.inUsedStock &&
      formData.floor
    );
  }, [formData]);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        dispatch(officesuppliceCategory({ type: "Category" }));
        dispatch(getBuildingDropdown({ type: "building", id: 0 }));
        fetchInventory();
        dispatch(getBusinessTypes());
        fetchDepartmentsDetails();
        dispatch(getCompanyList());
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, [dispatch, formData.business]);

  const fetchDepartmentsDetails = async () => {
    const payload = {
      busineesId: formData.business || 0,
    };

    try {
      await dispatch(fetchDepartment_SubDepartments(payload));
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  const fetchInventory = async () => {
    try {
      const response = await dispatch(getinventory(null));
      setInventoryData(response?.payload?.data || []);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    }
  };
  useEffect(() => {
    if (formData.selectedCategory) {
      dispatch(
        officesuppliceItem({
          type: "Item Name",
          category_id: formData.selectedCategory,
        })
      );
    }
  }, [formData.selectedCategory, dispatch]);

  useEffect(() => {
    if (!formData.selectedItem) return;
    const fetchStock = async () => {
      try {
        if (
          formData.selectedCategory == 3 &&
          (!formData.entity || formData.floor?.length === 0)
        ) {
          return toast.warning(
            "Please select entity/Floor to get current stock"
          );
        }

        const res = await dispatch(
          getStock({
            type: "stock",
            c_item_id: formData.selectedItem,
            category_id: formData.selectedCategory,
            company_id: formData.entity,
            floor_id:
              formData.selectedCategory == "3"
                ? formData.floor.join(",")
                : null,
          })
        );

        setFormData((prevData) => ({
          ...prevData,
          currentStock: res?.payload?.[0]?.current_stock || 0,
        }));
      } catch (error) {
        console.error("Error fetching stock:", error);
      }
    };

    fetchStock();
  }, [formData.selectedItem, formData.entity, formData.floor, dispatch]);

  useEffect(() => {
    if (formData.officeLocation) {
      dispatch(
        getLocationDropdown({ type: "location", id: formData.officeLocation })
      );
    }
  }, [formData.officeLocation, dispatch]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "selectedCategory") {
      setFormData((prevData) => ({
        ...prevData,
        selectedItem: "",
        stockId: "",
      }));
    }
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], value]?.sort((a, b) => a - b),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file: file || null,
    }));
  };
  const handleEdit = async (item) => {
    const response = await dispatch(updateinventory(item["Stock Id"]));
    const inventoryData = response?.payload?.data[0];
    if (inventoryData) {
      setIsEditMode(true);
      setFormData({
        selectedCategory: inventoryData.category_id || "",
        selectedItem: inventoryData.item_id || "",
        stockId: inventoryData.stock_id || "",
        itemDescription: inventoryData.item_description || "",
        officeLocation: inventoryData.office_location_id || "",
        floor: JSON.parse(inventoryData.floor_id) || [],
        currentStock: inventoryData?.current_stock || "",
        inUsedStock: inventoryData.in_used_stock || "",
        employeeName: inventoryData?.employee_id || "",
        department: inventoryData.department_id || "",
        business: inventoryData.business_id || "",
        entity: inventoryData.entity_id || "",
      });
    } else {
      toast.error("Data not found.");
    }
  };

  const handleDelete = async (item) => {
    const payload = { stock_id: item["Stock Id"] };
    try {
      const response = await dispatch(deleteInventoryRecords(payload));
      console.log(response,"response")
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.message);
        fetchInventory();
      }
    } catch (error) {
      toast.error("Failed to delete item.");
    }
  };

  const handleExportExcel = () => {
    if (filteredData.length > 0) {
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      ExportToXLSX(
        filteredData,
        `Inventory Management Details-${formattedDate}`
      );
    } else {
      toast.warning("No Records Found");
    }
  };
  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (formData.selectedCategory == "3" && formData?.floor?.length > 1) {
      toast.warning("Please Select Only one floor for selected category.");
      return;
    }
    const payload = {
      employee_id: formData.employeeName,
      department_id: Number(formData.department) || null,
      office_location_id: Number(formData.officeLocation) || null,
      floor_id: formData.floor || [],
      category_id: Number(formData.selectedCategory) || null,
      item_id: Number(formData.selectedItem) || null,
      current_stock: Number(formData.currentStock) || 0,
      in_used_stock: Number(formData.inUsedStock) || 0,
      item_description: formData.itemDescription || "",
      stock_id: formData?.stockId || null,
      business_id: formData?.business || null,
      entity_id: formData?.entity || null,
    };

    try {
      const res = await dispatch(addinventory(payload));
      if (res.success === true || res.payload.success === true) {
        toast.success(res.message || "Inventory Updated Successfully!");
        setFormData({
          selectedCategory: "",
          selectedItem: "",
          stockId: "",
          itemDescription: "",
          officeLocation: "",
          floor: "",
          currentStock: "",
          inUsedStock: "",
          employeeName: "",
          department: "",
          business: "",
          entity: "",
        });
        fetchInventory();
      }
    } catch (error) {
      toast.error("Failed to save item.");
    }
  };

  const handleUpload = async () => {
    if (!formData.file) {
      toast.error("Please select a file first.");
      return;
    }

    setLoading(true);
    const payload = new FormData();
    payload.append("files", formData.file);

    try {
      const response = await dispatch(bulkUploadInventory(payload));
      const result = response?.payload;

      if (result.statusCode === 400) {
        toast.warning(result.message);
      } else if (result.statusCode === 200) {
        console.log(result?.data);
        setLogs(result?.data?.logs || []);
        if (result?.data?.inserted === 0) {
          toast.error(result.data?.message);
        } else {
          toast.success(
            result.data?.message || "Inventory Uploaded Successfully"
          );
        }
        fetchInventory();
      } else {
        toast.error("Failed to Upload file, Please Try Again.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFormData((prev) => ({
        ...prev,
        file: null,
      }));
    }
  };

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.replace(/\s+/g, "").toLowerCase();

    return inventoryData.filter((item) =>
      Object.values(item || {}).some((value) =>
        String(value)
          .replace(/\s+/g, "")
          .toLowerCase()
          .includes(normalizedSearch)
      )
    );
  }, [inventoryData, searchTerm]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/template/officeSupply/inventorySampleTemplate.xlsx";
    link.download = "inventorySampleTemplate.xlsx";
    link.click();
  };
  const handleCheckStock = async () => {
    const payload = {
      entity: formData.entity || null,
      category: formData.selectedCategory || null,
      item: formData.selectedItem || null,
    };
    const result = await dispatch(checkStock(payload));
    const data = result?.payload?.data || [];
    if (data.length > 0) {
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      ExportToXLSX(data, `Inventory Stock Details-${formattedDate}`);
    }
  };
  return (
    <div className="container-fluid">
      {loading ? <CommonLoader /> : null}
      <ToastContainer position="top-right" autoClose={5000} />
      <Title title="Inventory Management" />
      <form>
        <Row>
          <Col md={3}>
            <CustomInput
              labelName="Employee Name"
              value={formData.employeeName}
              onChange={(e) => handleChange("employeeName", e.target.value)}
              type="text"
              placeholder="Enter Employee Name"
              mandatoryIcon
            />
          </Col>
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Entity"
              valueKey="company_id"
              labelKey="company_name"
              options={[
                { company_name: "Select", company_id: "" },
                ...(companyList?.data || []),
              ]}
              selectedValue={formData.entity}
              onChange={(e) => handleChange("entity", e.target.value)}
              mandatoryIcon
            />
          </Col>
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Business"
              labelKey="businessName"
              valueKey="businessId"
              options={[
                { businessName: "Select", businessId: "" },
                ...(businesstype?.data || []),
              ]}
              selectedValue={formData?.business}
              onChange={(e) => handleChange("business", e.target.value)}
            />
          </Col>
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Department"
              options={[
                { value: "", label: "Select Department" },
                ...getDepartment_subDepartment.map((department) => ({
                  value: department.dept_code,
                  label: department.department_desc,
                })),
              ]}
              valueKey="value"
              labelKey="label"
              onChange={(e) => handleChange("department", e.target.value)}
              selectedValue={formData.department}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Office Location"
              options={[{ label: "Select", value: "" }, ...(building || [])]}
              selectedValue={formData.officeLocation}
              valueKey="value"
              labelKey="label"
              onChange={(e) => handleChange("officeLocation", e.target.value)}
              mandatoryIcon
            />
          </Col>
          <Col md={3}>
            <MultiSelectDropdown
              data={locationDropdown}
              valueKey="value"
              labelKey="label"
              value={formData.floor}
              label="Floor"
              handleCheckboxChange={(e) => handleCheckboxChange(e, "floor")}
              selectLabel="Select"
              mandatoryIcon
            />
            {/* <CustomDropdown
              dropdownLabelName="Floor"
              options={[
                { label: "Select", value: "" },
                ...(locationDropdown || []),
              ]}
              valueKey="value"
              labelKey="label"
              selectedValue={formData.floor}
              onChange={(e) => handleChange("floor", e.target.value)}
            /> */}
          </Col>
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Category"
              options={[
                { label: "Select Categories", value: "" },
                ...officesupplice?.map((item) => ({
                  label: item.TOSCM_CATEGORY_NAME,
                  value: item.TOSCM_CATEGORY_ID,
                })),
              ]}
              valueKey="value"
              labelKey="label"
              selectedValue={formData.selectedCategory}
              onChange={(e) => handleChange("selectedCategory", e.target.value)}
              mandatoryIcon
            />
          </Col>
          <Col md={3}>
            {/* <CustomDropdown
              dropdownLabelName="Item Name"
              options={[
                { label: "Select Item", value: "" },
                ...officesuppliceItems.map((item) => ({
                  label: item.TOSCI_ITEM_NAME,
                  value: item.TOSCI_C_ITEM_ID,
                })),
              ]}
              valueKey="value"
              labelKey="label"
              selectedValue={formData.selectedItem}
              onChange={(e) => handleChange("selectedItem", e.target.value)}
            /> */}

            <Form.Label>
              Item Name <span className="text-danger">*</span>
            </Form.Label>
            <Autocomplete
              options={
                Array.isArray(officesuppliceItems) ? officesuppliceItems : []
              }
              getOptionLabel={(option) => option.TOSCI_ITEM_NAME || ""}
              isOptionEqualToValue={(option, value) =>
                option.TOSCI_C_ITEM_ID === value?.TOSCI_C_ITEM_ID
              }
              value={
                officesuppliceItems?.find(
                  (item) => item.TOSCI_C_ITEM_ID === formData.selectedItem
                ) || null
              }
              onChange={(event, newValue) => {
                const itemId = newValue ? newValue.TOSCI_C_ITEM_ID : "";
                handleChange("selectedItem", itemId);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Item"
                  size="small"
                  required // behaves like mandatoryIcon
                />
              )}
              size="small"
              disabled={
                !officesuppliceItems || officesuppliceItems.length === 0
              }
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={3}>
            <CustomInput
              labelName="Current Stock"
              value={formData.currentStock}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0) handleChange("currentStock", value);
              }}
              type="number"
              placeholder="Enter Current Stock"
              isDisable
              mandatoryIcon
            />
          </Col>
          <Col md={3}>
            <CustomInput
              labelName="In Used Stock"
              value={formData.inUsedStock}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 0) return;
                if (value > Number(formData.currentStock)) {
                  toast.warning(
                    "In Used Stock should not be more than Current Stock."
                  );
                  return;
                }
                handleChange("inUsedStock", value);
              }}
              type="number"
              placeholder="Enter In Used Stock"
              isMin={0}
              mandatoryIcon
            />
          </Col>
          <Col md={3}>
            <CustomInput
              labelName="Item Description"
              value={formData.itemDescription}
              onChange={(e) => handleChange("itemDescription", e.target.value)}
              type="text"
              placeholder="Enter Description"
            />
          </Col>
          <Col md={3} className="mt-4">
            {" "}
            <CustomSingleButton
              onPress={handleSubmit}
              _ButtonText={isEditMode ? "Update" : "Save"}
              backgroundColor="#dc3545"
              Text_Color="#fff"
              height="44px"
              width="auto"
              disabled={!isFormValid}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md={6} className="d-flex">
            <Form.Control
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={
                "shadow-none border-secondary-subtle placeholder-right placeholder-left"
              }
            />

            {/* <CustomInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
            /> */}
            <CustomSingleButton
              onPress={handleUpload}
              _ButtonText={"Bulk Upload"}
              backgroundColor="#dc3545"
              Text_Color="#fff"
              height="40px"
              width="160px"
              disabled={!formData.file}
            />
            {/* <div
              style={{ cursor: "pointer", marginLeft: 10, marginTop: 5 }}
              // onClick={handleDownload}
              data-toggle="tooltip"
              data-placement="top"
              title="Sample Template"
            >
              <FaDownload />
            </div>  */}
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip
                  style={{
                    backgroundColor: "#d90429",
                    color: "white",
                    borderRadius: "9%",
                  }}
                >
                  Click to download sample template
                </Tooltip>
              }
            >
              <div
                style={{ cursor: "pointer", marginLeft: 10, marginTop: 5 }}
                onClick={handleDownload}
              >
                <FaDownload />
              </div>
            </OverlayTrigger>
          </Col>
        </Row>
        <div className="d-flex justify-content-start gap-3 mt-4 mb-3">
          {logs?.length > 0 ? (
            <CustomSingleButton
              onPress={() =>
                ExportToXLSX(
                  logs,
                  `Inventory_Error_Log_${new Date().toISOString().slice(0, 10)}`
                )
              }
              _ButtonText={"Download Error Log"}
              backgroundColor="#dc3545"
              Text_Color="#fff"
              height="40px"
              width="auto"
            />
          ) : null}
        </div>
      </form>
      <CustomTable
        data={filteredData}
        headingText="Inventory Management"
        firstColumnVisibility={true}
        dataContained={filteredData.length}
        pageCount={page}
        searchVisibility={true}
        placeholder={"Search..."}
        toDateChange={(e) => setSearchTerm(e.target.value)}
        handlePageClick={(newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={(event) =>
          setRowsPerPage(parseInt(event, 10))
        }
        exportToExcelBtnVisiblity={true}
        handleExportExcel={handleExportExcel}
        morebtnVisibility={true}
        morebtnTitle="View Stock"
        morebtnClick={handleCheckStock}
        marginTopTable={true}
        lineVisibility={true}
        actionVisibility={true}
        specialColumns={[
          "Entity",
          "Category",
          "Business",
          "Item Name",
          "Floor",
        ]}
        actions={[
          {
            label: "Edit",
            icon: <FaEdit />,
            onClick: (item) => handleEdit(item),
          },
          {
            label: "Delete",
            icon: <FaTrash />,
            onClick: (item) => {
              Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "black",
                confirmButtonText: "Yes, delete it!",
              }).then((result) => {
                if (result.isConfirmed) handleDelete(item);
              });
            },
          },
        ]}
      />
    </div>
  );
};

export default InventoryManagement;
