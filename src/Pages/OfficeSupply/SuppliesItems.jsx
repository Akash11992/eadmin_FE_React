import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Alert, Row, Col, Form } from "react-bootstrap";
import CustomInput from "../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import { useSelector, useDispatch } from "react-redux";
import {
  officesuppliceCategory,
  officesuppliceItem,
} from "../../Slices/OfficeSupply/OfficeSupplySlice";
import { v4 as uuidv4 } from "uuid";
import { Autocomplete, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import { FaDownload } from "react-icons/fa6";

const SuppliesItems = (props) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    rows,
    setRows,
    handleInputChange,
    requestStatus,
    isUploadView = false,
    isAllitemrecevied,
  } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(officesuppliceCategory({ type: "Category" }));
  }, [dispatch]);

  const officeSupplyDropdown = useSelector(
    (state) => state.OfficeSupply.officesupplice || []
  );
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const isDisable = savedUserData?.data?.role_name !== "admin";
  const isDisableOther = requestStatus === 3 || requestStatus === 4;

  // Autofill for edit mode (initial load)
  useEffect(() => {
    rows.forEach((row, index) => {
      if (
        row.TOSR_CATEGORY_ID &&
        (!row.itemsList || row.itemsList.length === 0)
      ) {
        fetchItemsForCategory(row.TOSR_CATEGORY_ID, index);
      }
      if (row.TOSR_CATEGORY_ID && row.TOSR_ITEM_ID && !row.TOSR_RATE) {
        fetchForRate(row.TOSR_CATEGORY_ID, row.TOSR_ITEM_ID, index);
      }
    });
  }, []);

  const fetchItemsForCategory = async (categoryId, rowIndex) => {
    if (categoryId) {
      const payload = {
        type: "Item Name",
        category_id: categoryId,
      };
      const response = await dispatch(officesuppliceItem(payload)).unwrap();
      const itemList = response || [];
      setRows((prevRows) =>
        prevRows.map((row, index) =>
          index === rowIndex ? { ...row, itemsList: itemList } : row
        )
      );
    }
  };

  const fetchForRate = async (categoryId, itemId, rowIndex) => {
    if (categoryId && itemId) {
      const payload = {
        type: "Rate",
        category_id: categoryId,
        c_item_id: itemId,
      };
      const response = await dispatch(officesuppliceItem(payload)).unwrap();
      const itemRate = response?.length > 0 ? response[0]?.TOSIM_RATE : "";
      const itemGST = response?.length > 0 ? response[0]?.TOSIM_GST : "";
      setRows((prevRows) =>
        prevRows.map((row, index) =>
          index === rowIndex
            ? { ...row, TOSR_RATE: itemRate, TOSR_GST: itemGST }
            : row
        )
      );
    }
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: uuidv4(),
        TOSR_CATEGORY_ID: null,
        TOSR_ITEM_ID: null,
        TOSR_C_ITEM_ID: null,
        TOSR_QUANTITY: null,
        TOSR_RATE: null,
        TOSR_GST: null,
        TOSR_AMOUNT: null,
        TOSR_RECEIVED_ITEMS: null,
        itemsList: [],
      },
    ]);
  };

  const handleCategoryChange = (index, value) => {
    if (index > 0) {
      const prevCategoryId = rows[index - 1].TOSR_CATEGORY_ID;
      const prev = Number(prevCategoryId);
      const curr = Number(value);
      if (prev && prev !== curr) {
        toast.warning(
          "Please select valid category as mentioned in previous rows."
        );
        return;
      }
    }
    handleInputChange(index, "TOSR_CATEGORY_ID", value);
    fetchItemsForCategory(value, index);
  };
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.warning("Please select a file to upload.");
      return;
    } else if (file.size > 5 * 1024 * 1024) {
      toast.warning("File size exceeds 5 MB limit.");
      return;
    } else if (!file.name.match(/\.(csv|xlsx)$/)) {
      toast.warning("Invalid file format. Please upload a CSV or Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });

      if (!data || data.length === 0) {
        toast.warning("Excel file is empty or invalid.");
        return;
      }
      // Step 2: Process Excel rows
      const updatedRows = [];
      for (let row of data) {
        const categoryName = row["Category"];
        const itemName = row["Item"];
        const quantity = row["Quantity"];

        if (!categoryName || !itemName || !quantity) continue;

        const matchedCategory = officeSupplyDropdown?.find(
          (cat) =>
            cat.TOSCM_CATEGORY_NAME?.toLowerCase().trim() ===
            categoryName.toLowerCase().trim()
        );

        if (!matchedCategory) continue;

        const categoryId = matchedCategory.TOSCM_CATEGORY_ID;

        const itemsList = await dispatch(
          officesuppliceItem({
            type: "Item Name",
            category_id: categoryId,
          })
        );
        const items = itemsList?.payload || [];

        const matchedItem = items?.find(
          (item) =>
            item.TOSCI_ITEM_NAME?.toLowerCase().trim() ===
            itemName.toLowerCase().trim()
        );

        if (!matchedItem) continue;

        const itemId = matchedItem.TOSCI_C_ITEM_ID;
        const response = await dispatch(
          officesuppliceItem({
            type: "Rate",
            category_id: categoryId,
            c_item_id: itemId,
          })
        );
        const rates = response?.payload || [];
        const gst = parseFloat(rates[0]?.TOSIM_GST || 0);
        const rate = parseFloat(rates[0]?.TOSIM_RATE || 0);
        const parsedQty = parseFloat(quantity);
        const rateWithGst = rate + (rate * gst) / 100;
        const amount = (rateWithGst * parsedQty).toFixed(2);

        updatedRows.push({
          id: uuidv4(),
          TOSR_CATEGORY_ID: categoryId,
          TOSR_ITEM_ID: itemId,
          TOSR_C_ITEM_ID: null,
          TOSR_QUANTITY: parsedQty,
          TOSR_RATE: rate,
          TOSR_GST: gst,
          TOSR_AMOUNT: amount,
          TOSR_RECEIVED_ITEMS: null,
          itemsList: items,
        });
      }

      // Step 3: Update state
      if (updatedRows.length > 0) {
        setRows(updatedRows);
        toast.success("Excel data loaded successfully.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFile(null);
      } else {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.warning("No valid rows found in the Excel file.");
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/template/officeSupply/OfficeSupplySampleTemplate.xlsx";
    link.download = "OfficeSupplySampleTemplate.xlsx";
    link.click();
  };
  return (
    <div className="my-4">
      {isUploadView && (
        <Row className="mt-4 d-flex justify-content-between align-items-center">
          <Col md={3} className="" />
          <Col md={6} className="d-flex justify-content-end align-items-center">
            <Col md={6}>
              <Form.Control
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files[0])}
                accept=".xlsx, .xls"
                className={
                  "shadow-none border-secondary-subtle placeholder-right placeholder-left"
                }
              />
              {/* <CustomInput
                type="file"
                // labelName="Requested By"
                placeholder="Enter Name"
                onChange={(e) => setFile(e.target.files[0])}
                accept=".xlsx, .xls"
              /> */}
            </Col>
            <Col
              md={4}
              className="d-flex align-items-center justify-content-around"
            >
              <CustomSingleButton
                _ButtonText="Upload Items"
                backgroundColor="#000"
                Text_Color="#fff"
                height="40px"
                width="auto"
                onPress={handleFileUpload}
                // disabled={!isFormValid}
              />
              <div
                style={{ cursor: "pointer" }}
                onClick={handleDownload}
                data-toggle="tooltip"
                data-placement="top"
                title="Sample Template"
              >
                <FaDownload />
              </div>
            </Col>
          </Col>
        </Row>
      )}
      <div
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "10px",
          overflow: "hidden",
        }}
        className={`${isUploadView ? "mt-2" : ""}`}
      >
        <Table responsive bordered style={{ marginBottom: "0" }}>
          <thead>
            <tr>
              <th
                style={{
                  backgroundColor: "#d90429",
                  color: "white",
                  minWidth: "160px",
                }}
              >
                Category
              </th>
              <th
                style={{
                  backgroundColor: "#d90429",
                  color: "white",
                  minWidth: "250px",
                }}
              >
                Item Name
              </th>
              <th
                style={{
                  backgroundColor: "#d90429",
                  color: "white",
                  minWidth: "160px",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  backgroundColor: "#d90429",
                  color: "white",
                  minWidth: "160px",
                }}
              >
                Rate
              </th>
              <th
                style={{
                  backgroundColor: "#d90429",
                  color: "white",
                  minWidth: "160px",
                }}
              >
                GST(%)
              </th>
              <th
                style={{
                  backgroundColor: "#d90429",
                  color: "white",
                  minWidth: "160px",
                }}
              >
                Amount(Incl. GST)
              </th>
              <th
                style={{
                  backgroundColor: "#d90429",
                  color: "white",
                  minWidth: "160px",
                }}
              >
                Received Qyt
              </th>
              <th style={{ backgroundColor: "#d90429", color: "white" }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rows?.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <CustomDropdown
                    options={[
                      { label: "Select Categories", value: "" },
                      ...officeSupplyDropdown.map((item) => ({
                        label: item.TOSCM_CATEGORY_NAME,
                        value: item.TOSCM_CATEGORY_ID,
                      })),
                    ]}
                    valueKey="value"
                    labelKey="label"
                    selectedValue={row.TOSR_CATEGORY_ID}
                    onChange={(e) =>
                      handleCategoryChange(index, e.target.value)
                    }
                    isDisable={isDisableOther}
                  />
                </td>

                <td>
                  <Autocomplete
                    options={Array.isArray(row?.itemsList) ? row.itemsList : []}
                    getOptionLabel={(option) => option.TOSCI_ITEM_NAME || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.TOSCI_C_ITEM_ID === value?.TOSCI_C_ITEM_ID
                    }
                    value={
                      row?.itemsList?.find(
                        (item) => item.TOSCI_C_ITEM_ID === row.TOSR_ITEM_ID
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      const itemId = newValue ? newValue.TOSCI_C_ITEM_ID : "";
                      handleInputChange(index, "TOSR_ITEM_ID", itemId);
                      if (itemId) {
                        fetchForRate(row.TOSR_CATEGORY_ID, itemId, index);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Item"
                        size="small"
                      />
                    )}
                    size="small"
                    disabled={
                      !row.itemsList ||
                      row.itemsList.length === 0 ||
                      isDisableOther
                    }
                  />

                  {/* <CustomDropdown
                    options={[
                      { label: "Select Item", value: "" },
                      ...(Array.isArray(row?.itemsList)
                        ? row?.itemsList.map((item) => ({
                            label: item.TOSCI_ITEM_NAME,
                            value: item.TOSCI_C_ITEM_ID,
                          }))
                        : []),
                    ]}
                    valueKey="value"
                    labelKey="label"
                    selectedValue={row.TOSR_ITEM_ID}
                    onChange={(e) => {
                      const itemId = e.target.value;
                      handleInputChange(index, "TOSR_ITEM_ID", itemId);
                      fetchForRate(row.TOSR_CATEGORY_ID, itemId, index);
                    }}
                    disabled={!row.itemsList || row.itemsList.length === 0}
                  /> */}
                </td>

                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter Quantity"
                    value={row.TOSR_QUANTITY}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "TOSR_QUANTITY",
                        Math.max(0, e.target.value)
                      )
                    }
                    isDisable={isDisableOther}
                  />
                </td>

                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter Rate"
                    value={row.TOSR_RATE}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        handleInputChange(index, "TOSR_RATE", value);
                      }
                    }}
                    isMin={0}
                    isDisable={isDisable || isDisableOther}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter GST"
                    value={row.TOSR_GST}
                    isDisable
                  />
                </td>
                <td>
                  <CustomInput
                    type="text"
                    placeholder="Enter Amount"
                    value={row.TOSR_AMOUNT}
                    readOnly
                    isDisable={isDisable || isDisableOther}
                  />
                </td>

                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter Received Items"
                    value={row.TOSR_RECEIVED_ITEMS}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "TOSR_RECEIVED_ITEMS",
                        Math.max(0, e.target.value)
                      )
                    }
                    isMax= {row.TOSR_QUANTITY}
                    isDisable={!(requestStatus === 3 || requestStatus === 6)}
                  />
                </td>

                <td>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="danger"
                      className="btn-sm me-1"
                      onClick={() => removeRow(index)}
                      disabled={
                        rows.length === 1 ||
                        requestStatus === 3 ||
                        requestStatus === 4 ||
                        requestStatus === 6
                      }
                    >
                      -
                    </Button>

                    {index === rows.length - 1 && (
                      <Button
                        variant="dark"
                        className="btn-sm"
                        onClick={addRow}
                        disabled={
                          requestStatus === 3 ||
                          requestStatus === 4 ||
                          requestStatus === 6
                        }
                      >
                        +
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Alert
          variant="warning"
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            margin: "0",
            borderRadius: "0",
          }}
        >
          Note: Please click on + button to add rows
        </Alert>
      </div>
    </div>
  );
};

export default SuppliesItems;
