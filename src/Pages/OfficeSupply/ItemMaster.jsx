import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form } from "react-bootstrap";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../Components/Title/Title";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ExportToXLSX } from "../../Components/Excel-JS/ExportToXLSX";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  officesuppliceCategory,
  officesuppliceItem,
  addOfficeSupplyItem,
  getOfficeSupplyItemsList,
  updateOfficeSupply,
  deleteOfficeSupplyItem,
} from "../../Slices/OfficeSupply/OfficeSupplySlice";
import { ToastContainer, toast } from "react-toastify";
import CancelAlert from "../../Components/Validations/CancelAlert";
import { Autocomplete, TextField } from "@mui/material";
import { ItemModal } from "../../Components/OfficeSupply/ItemModal";

const ItemMaster = () => {
  const dispatch = useDispatch();

  // State Management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);

  const [formData, setFormData] = useState({
    selectedCategory: "",
    selectedItem: "",
    itemDescription: "",
    rate: "",
    itemId: "",
    gst: null,
    totalAmount: null,
  });

  // Redux Selectors
  const { officesupplice, officesuppliceItems, getItemList } = useSelector(
    (state) => state.OfficeSupply
  );
  const loader = useSelector(
    (state) => state.OfficeSupply.status === "loading"
  );
  // Reusable function to handle form changes
  const handleChange = useCallback((name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(officesuppliceCategory({ type: "Category" }));
  }, [dispatch]);

  // Fetch items when a category is selected
  useEffect(() => {
    if (formData.selectedCategory) {
      const payload = {
        type: "Item Name",
        category_id: formData.selectedCategory,
      };
      dispatch(officesuppliceItem(payload));
    }
  }, [formData.selectedCategory, dispatch]);

  // Calculate total amount when rate or gst changes
  useEffect(() => {
    const rate = parseFloat(formData.rate) || 0;
    const gst = parseFloat(formData.gst) || 0;
    const totalAmount = rate + (rate * gst) / 100;
    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount.toFixed(2),
    }));
  }, [formData.rate, formData.gst]);

  // Fetch the list of office supply items
  useEffect(() => {
    dispatch(getOfficeSupplyItemsList());
  }, [dispatch]);
  console.log(formData?.totalAmount, "totalAmount");

  // Handle Add or Update Items
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.selectedCategory ||
      !formData.selectedItem ||
      !formData.rate ||
      !formData.itemDescription ||
      !formData.gst ||
      !formData.totalAmount
    ) {
      toast.warning("Please fill in all required fields before proceeding.");
      return;
    }
    const payload = {
      category_id: formData.selectedCategory,
      item_id: formData.selectedItem,
      rate: parseFloat(formData.rate),
      item_description: formData.itemDescription,
      c_item_id: formData?.itemId || null,
      gst: parseFloat(formData.gst),
      totalAmount: parseFloat(formData.totalAmount),
    };
    if (isEditMode) {
      await handleUpdate();
    } else {
      await handleAddItems(payload);
    }
  };

  // Add Item
  const handleAddItems = async (payload) => {
    try {
      const response = await dispatch(addOfficeSupplyItem(payload));
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.message || "Item added successfully");
        setTimeout(() => {
          resetForm();
          dispatch(getOfficeSupplyItemsList());
        }, 2000);
      } else {
        toast.warning("Item already exists");
      }
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  // Update Item
  const handleUpdate = async () => {
    const payload = {
      category_id: formData.selectedCategory,
      c_item_id: formData.selectedItem,
      rate: parseFloat(formData.rate),
      item_description: formData.itemDescription,
      item_id: formData?.itemId || null,
      gst: parseFloat(formData.gst),
      totalAmount: parseFloat(formData.totalAmount),
    };
    try {
      const response = await dispatch(updateOfficeSupply(payload));
      if (response.payload.statusCode === 200) {
        toast.success("Item updated successfully");
        setTimeout(() => {
          resetForm();
          dispatch(getOfficeSupplyItemsList());
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      selectedCategory: "",
      selectedItem: "",
      itemDescription: "",
      rate: "",
      itemId: "",
      gst: "",
      totalAmount: "",
    });
    setIsEditMode(false);
  };

  // Handle Delete
  const handleDelete = async (itemId) => {
    try {
      const response = await dispatch(
        deleteOfficeSupplyItem({ TOSIM_ITEM_ID: itemId })
      );
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.message);
        setTimeout(() => {
          dispatch(getOfficeSupplyItemsList());
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  // Confirm Delete
  const handleTypeDelete = (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "black",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(itemId);
      }
    });
  };

  // Handle Edit
  const handleEdit = async (item) => {
    const category = officesupplice.find(
      (cat) =>
        cat.TOSCM_CATEGORY_NAME.trim().toLowerCase() ===
        item["Category Name"].trim().toLowerCase()
    )?.TOSCM_CATEGORY_ID;

    const payload = {
      type: "Item Name",
      category_id: category,
    };
    const response = await dispatch(officesuppliceItem(payload));

    const selectedItem = response?.payload?.find(
      (data) => data.TOSCI_ITEM_NAME === item["Item Name"]
    )?.TOSCI_C_ITEM_ID;
    setFormData({
      selectedCategory: category || "",
      selectedItem: selectedItem || "",
      itemDescription: item["Item Description"] || "",
      rate: item["Rate"] || "",
      itemId: item["Item ID"] || "",
      gst: item["GST"] || "",
      totalAmount: item["Total Amount"] || "",
    });
    setIsEditMode(true);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (filteredData.length > 0) {
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${currentDate.getFullYear()}`;
      const fileName = `Office_Supply_Item_Master_Details_${formattedDate}`;
      ExportToXLSX(filteredData, fileName);
    } else {
      toast.warning("No records found");
    }
  };

  // Filter Data
  const mergedData = getItemList?.data || [];
  const filteredData = mergedData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Actions for Table
  const actions = [
    {
      label: "Edit",
      icon: <FaEdit />,
      onClick: (item) => handleEdit(item),
    },
    {
      label: "Delete",
      icon: <FaTrash />,
      onClick: (item) => handleTypeDelete(item["Item ID"]),
    },
  ];

  const handleCancel = () => {
    CancelAlert({
      onCancel: async () => {
        await resetForm();
        setIsEditMode(false);
      },
    });
  };

  return loader ? (
    <CommonLoader />
  ) : (
    <div className="container-fluid border rounded-3 table-responsive">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="container-fluid mt-3 mb-3">
        <Title title="Item Master" />
        <hr />
        <form onSubmit={handleSubmit}>
          <Row className="mt-4">
            <Col md={3}>
              <CustomDropdown
                dropdownLabelName="Category"
                mandatoryIcon
                options={[
                  { label: "Select Categories", value: "" },
                  ...officesupplice?.map((item) => ({
                    label: item.TOSCM_CATEGORY_NAME,
                    value: item.TOSCM_CATEGORY_ID,
                  })),
                ]}
                labelKey="label"
                valueKey="value"
                selectedValue={formData.selectedCategory}
                onChange={(e) =>
                  handleChange("selectedCategory", e.target.value)
                }
              />
            </Col>
            <Col md={3}>
              {/* <CustomDropdown
                dropdownLabelName="Item Name"
                mandatoryIcon
                options={[
                  { label: "Select Item", value: "" },
                  ...officesuppliceItems.map((item) => ({
                    label: item.TOSCI_ITEM_NAME,
                    value: item.TOSCI_C_ITEM_ID,
                  })),
                ]}
                labelKey="label"
                valueKey="value"
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
            <Col md={3}>
              <CustomInput
                labelName="Rate"
                value={formData.rate}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  handleChange("rate", inputValue);
                }}
                type="number"
                placeholder="Enter Rate"
                mandatoryIcon
              />
            </Col>
            <Col md={3}>
              <CustomInput
                labelName="GST"
                value={formData.gst}
                onChange={(e) => {
                  handleChange("gst", e.target.value);
                }}
                type="number"
                placeholder="Enter GST"
                mandatoryIcon
                isMin={0}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={3}>
              <CustomInput
                labelName="Total Amount"
                value={formData.totalAmount}
                type="text"
                placeholder="Enter Total Amount"
                mandatoryIcon
                isDisable
              />
            </Col>
            <Col md={3}>
              <CustomInput
                labelName="Item Description"
                value={formData.itemDescription}
                onChange={(e) =>
                  handleChange("itemDescription", e.target.value)
                }
                type="text"
                placeholder="Enter Description"
                mandatoryIcon
              />
            </Col>
            <Col
              md={3}
              style={{
                marginTop: "30px",
              }}
            >
              <CustomSingleButton
                onPress={() => setModalShow(true)}
                _ButtonText={"+"}
                backgroundColor="#000"
                Text_Color="#fff"
                height="40px"
                width="auto"
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-start gap-3 mt-4">
            <CustomSingleButton
              onPress={handleSubmit}
              _ButtonText={isEditMode ? "Update" : "Add Items"}
              backgroundColor="#000"
              Text_Color="#fff"
              height="44px"
              width="auto"
            />
            {isEditMode && (
              <CustomSingleButton
                onPress={handleCancel}
                _ButtonText={"Cancel"}
                backgroundColor="#dc3545"
                Text_Color="#fff"
                height="44px"
                width="auto"
              />
            )}
          </div>
        </form>
        <CustomTable
          data={filteredData}
          exportIconVisibility
          headingText
          searchVisibility
          placeholder="Search..."
          exportToExcelBtnVisiblity
          handleExportExcel={handleExportExcel}
          toDateChange={(e) => setSearchTerm(e.target.value)}
          firstColumnVisibility
          dataContained={filteredData.length || 0}
          actionVisibility
          pageCount={page}
          handlePageClick={setPage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={setRowsPerPage}
          actions={actions}
        />
      </div>
      <ItemModal show={modalShow} onHide={() => setModalShow(false)} category = {officesupplice} />
    </div>
  );
};

export default ItemMaster;
