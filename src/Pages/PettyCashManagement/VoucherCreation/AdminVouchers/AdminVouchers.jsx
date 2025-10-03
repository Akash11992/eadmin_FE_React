import { useState, useEffect } from "react";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import CustomDropdown from "../../../../Components/CustomDropdown/CustomDropdown";
import CustomTable from "../../../../Components/CustomeTable/CustomTable";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import { Title } from "../../../../Components/Title/Title";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Main.css";
import { ToastContainer, toast } from "react-toastify";
import {
  deleteVoucherCreation,
  getVoucherList,
  getVoucherListById,
} from "../../../../Slices/PettyCashManagement/PettyCashSlice";
import { ExportToXLSX } from "../../../../Components/Excel-JS/ExportToXLSX";
import {
  getPettyCashStatus,
  getVoucherDetails,
  getCreatedByList,
} from "../../../../Slices/PettyCashManagement/PettyCashDropdownSlice";
import Swal from "sweetalert2";

import { getCompanyList } from "../../../../Slices/Commondropdown/CommondropdownSlice";
import MultiSelectDropdown2 from "../../../../Components/CustomDropdown/MultiSelectDropdown2";
import { Autocomplete, TextField } from "@mui/material";

const AdminVouchers = (props) => {
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const [filter, setFilter] = useState({
    fromDate: null,
    toDate: null,
    status: "4",
    voucherType: [1, 2, 3, 4, 5, 6],
    companyName: null,
    createdBy: null,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const voucherListData = useSelector((state) => state?.PettyCash?.voucherList);
  const voucherData = (voucherListData?.data && voucherListData?.data) || [];
  const PettyCashStatusData = useSelector(
    (state) => state?.PettyCashDropdown?.PettyCashStatus
  );
  const voucherTypeData = useSelector(
    (state) => state?.PettyCashDropdown?.voucherDetailsData
  );
  const createdByList = useSelector(
    (state) => state?.PettyCashDropdown?.createdByList
  );
  useEffect(() => {
    fetchVoucherList();
  }, [
    filter.fromDate,
    filter.toDate,
    filter.status,
    filter.voucherType,
    filter.companyName,
    filter.createdBy,
  ]);

  useEffect(() => {
    fetchVoucherList();
    fetchCompanyListData();
    dispatch(getPettyCashStatus("STATUS"));
    return () => {};
  }, []);
  const fetchCompanyListData = async () => {
    await dispatch(getCompanyList());
  };
  const companyListData =
    useSelector((state) => state.CommonDropdownData.companyList) || [];
  useEffect(() => {
    dispatch(getVoucherDetails("VOUCHER_TYPE"));
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCreatedByList("OFFICE_BOY"));
    return () => {};
  }, []);
  const fetchVoucherList = async () => {
    setLoading(true);
    const payload = {
      voucherType: filter.voucherType,
      status: filter.status,
      company: filter.companyName,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
      createdBy: filter.createdBy,
    };
    await dispatch(getVoucherList(payload));
    setLoading(false);
    setPage(0);
  };

  const handleSearchChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value === "" ? null : value,
    }));
    setPage(0);
  };
  const handleFilterSubmit = () => {
    fetchVoucherList();
  };

  // const filteredData = voucherData?.filter((item) =>
  //   Object.values(item).some((value) =>
  //     String(value).toLowerCase().includes(search.toLowerCase())
  //   )
  // );
  // const filteredData = voucherData
  //   ?.filter(
  //     (item) =>
  //       (item.Status === "Approved by Admin" ||
  //         item.Status === "Payment Done") &&
  //       Object.values(item).some((value) =>
  //         String(value).toLowerCase().includes(search.toLowerCase())
  //       )
  //   )
  //   .map((item) => {
  //     const {
  //       ["Voucher Type Id"]: _,
  //       ["user_id"]: __,
  //       ["travel_id"]: ___,
  //       ["Document"]: ____,
  //       ["Document_URL"]: _____,
  //       ["Email"]: ______,
  //       ["compant_id"]: _______,
  //       ["status_id"]: ________,
  //       ["Created_by_Email"]: _________,
  //       ...rest
  //     } = item;
  //     return rest;
  //   });

  const filteredData = voucherData?.filter(
    (item) =>
      (item.Status === "Approved by Admin" || item.Status === "Payment Done") &&
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
  );
  console.log(filteredData, "filteredData");
  const hiddenKeys = [
    "Voucher Type Id",
    "user_id",
    "travel_id",
    "Document_URL",
    "Email",
    "Created_by_Email",
    "Date",
    "company_id",
    "status_id",
    "travel_details",
    "amounts",
    "department",
  ];

  const allColumns = Array.from(
    new Set(
      filteredData.flatMap((item) =>
        Object.keys(item).filter((key) => !hiddenKeys.includes(key))
      )
    )
  );

  const cleanedTableData = filteredData.map((item) => {
    const row = {};
    allColumns.forEach((key) => {
      row[key] = item[key];
    });
    return row;
  });

  const actions = [
    {
      label: "Pay",
      onClick: (item) => handleEdit(item),
    },
    {
      label: "Delete",
      onClick: (item) => handleTypeDelete(item["Voucher ID"]),
    },
  ].filter((action) => action !== null);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleDelete = async (voucherId) => {
    const item = voucherData.find((v) => v["Voucher ID"] === voucherId);
    if (!item) {
      toast.warn("Voucher data not found.");
      return;
    }

    const payload = {
      voucherType: item["Voucher Type Id"],
      id: item["Voucher ID"],
    };

    const response = await dispatch(deleteVoucherCreation(payload));
    fetchVoucherList();

    if (deleteVoucherCreation?.fulfilled?.match(response)) {
      if (response?.payload?.statusCode === 200) {
        toast.success(response?.payload?.data?.[0]?.result);
      }
    } else if (deleteVoucherCreation?.rejected?.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleTypeDelete = (pettycashId) => {
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
        handleDelete(pettycashId);
      }
    });
  };
  const handleEdit = (voucherNumber) => {
    setIsEditMode(true);
    if (voucherNumber) {
      // Find the selected voucher from voucherData
      const selectedVoucher = voucherData.find(
        (voucher) => voucher["Voucher ID"] === voucherNumber["Voucher ID"]
      );

      navigate("/voucherApproval", {
        state: {
          voucherDetailsData: selectedVoucher,
          isEditMode: true,
          voucherType: selectedVoucher?.voucher_type || filter.voucherType,
        },
      });
    } else {
      toast.error("Voucher data not found");
    }
  };

  const handlePayAll = () => {
    if (filteredData && filteredData.length > 0) {
      const selectedVouchers =
        selectedRows?.length > 0
          ? selectedRows
          : filteredData
              .map((filteredItem) => {
                return voucherData.find(
                  (voucher) =>
                    voucher["Voucher ID"] === filteredItem["Voucher ID"]
                );
              })
              .filter(Boolean);

      navigate("/voucherApproval", {
        state: {
          voucherDetailsData: selectedVouchers,
          isEditMode: true,
          voucherType: filter.voucherType,
        },
      });
    } else {
      toast.error("No vouchers available to pay");
    }
  };

  const handleExport = () => {
    if (filteredData?.length > 0) {
      const filteredExcelData = cleanedTableData?.map(
        ({ modeId, ...rest }) => rest
      );
      ExportToXLSX(filteredExcelData, "Petty cash Vousher Details");
    } else {
      toast.warning("No Records Found");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      // setSelectedRows([...filteredData]);
      const allRowIndexes = filteredData?.map((item) => item);

      setSelectedRows(allRowIndexes);
    }
    setAllSelected(!allSelected);
  };

  const handleRowCheckboxChange = (row) => {
    const rowId = row["Voucher ID"];
    const newSelectedRows = [...selectedRows];
    const index = newSelectedRows.findIndex(
      (selectedRow) => selectedRow["Voucher ID"] === rowId
    );
    if (index > -1) {
      newSelectedRows.splice(index, 1); // Deselect
    } else {
      newSelectedRows.push(row); // Select
    }

    setSelectedRows(newSelectedRows);
  };
  const handleView = async (voucher) => {
    console.log(voucher, "v");
    if (voucher) {
      const type = voucherData?.find(
        (v) => v["Voucher ID"] === String(voucher)
      )?.["Voucher Type Id"];
      console.log(type, "type");
      const payload = {
        voucherType: type,
        voucherId: voucher,
      };
      const selectedVoucher = await dispatch(getVoucherListById(payload));
      const data = selectedVoucher?.payload?.data[0];
      if (data) {
        navigate("/addVoucherCreation", {
          state: {
            voucherData: data,
            isEditMode: true,
            isViewMode: true,
            path: "/adminVouchers",
            voucherType: data?.["Voucher Type Id"] || filter.voucherType,
            createdBy: data?.["Created By"],
          },
        });
      } else {
        toast.error("Voucher data not found");
      }
    } else {
      toast.error("Invalid voucher number");
    }
  };
  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <Card className="border-0">
          <Title title="Account Vouchers Approval" />
          <Row className="mt-4 main_row">
            <Col md={2}>
              <CustomInput
                labelName="From Date"
                type="date"
                value={filter.fromDate}
                onChange={(event) =>
                  handleSearchChange("fromDate", event.target.value)
                }
                height="44px"
              />
            </Col>
            <Col md={2}>
              <CustomInput
                labelName="To Date"
                type="date"
                value={filter.toDate}
                onChange={(event) =>
                  handleSearchChange("toDate", event.target.value)
                }
                height="44px"
              />
            </Col>
            <Col md={2}>
              {/* <CustomDropdown
                dropdownLabelName="Voucher Type"
                labelKey="label"
                valueKey="value"
                options={[
                  { value: null, label: "Select Type" },
                  ...(Array.isArray(voucherTypeData?.data)
                    ? voucherTypeData?.data?.map((e) => ({
                        value: e.value,
                        label: e.label,
                      }))
                    : []),            company_id: item["company_id"],
            department: item["department"],
                ]}
                selectedValue={filter.voucherType}
                onChange={(e) => {
                  const selectedOption = e.target.value;
                  const value =
                    selectedOption === "Select Type" ? null : selectedOption;
                  handleSearchChange("voucherType", value);
                }}
                height="43px"
              /> */}
              <MultiSelectDropdown2
                value={filter?.voucherType}
                onChange={(e) => handleSearchChange("voucherType", e.value)}
                options={[
                  ...(Array.isArray(voucherTypeData?.data)
                    ? voucherTypeData?.data?.map((e) => ({
                        value: e.value,
                        label: e.label,
                      }))
                    : []),
                ]}
                optionLabel="label"
                placeholder="Select Voucher Type"
                label="Voucher Type"
                height="42px"
                mandatoryIcon={true}
              />
            </Col>
            <Col md={2}>
              <CustomDropdown
                dropdownLabelName="Status"
                labelKey="label"
                valueKey="value"
                options={[
                  { value: null, label: "Select Status" },
                  ...(Array.isArray(PettyCashStatusData?.data)
                    ? PettyCashStatusData?.data?.map((e) => ({
                        value: e.value,
                        label: e.label,
                      }))
                    : []),
                ]}
                selectedValue={filter.status}
                onChange={(e) => {
                  handleSearchChange("status", e.target.value);
                }}
                height="43px"
              />
            </Col>

            <Col md={2}>
              <CustomDropdown
                dropdownLabelName="Company Name"
                labelKey="label"
                valueKey="value"
                options={[
                  { value: null, label: "Select Company" },
                  ...(Array.isArray(companyListData?.data)
                    ? companyListData?.data?.map((e) => ({
                        value: e.company_id,
                        label: e.company_name,
                      }))
                    : []),
                ]}
                selectedValue={filter.companyName}
                onChange={(e) => {
                  const selectedOption = e.target.value;
                  const value =
                    selectedOption === "Select Company" ? null : selectedOption;
                  handleSearchChange("companyName", value);
                }}
                height="43px"
              />
            </Col>
            <Col md={2}>
              <Form.Label>Created By</Form.Label>
              <Autocomplete
                options={
                  Array.isArray(createdByList)
                    ? createdByList?.map((e) => ({
                        label: e.label,
                        value: e.code,
                      }))
                    : []
                }
                getOptionLabel={(option) => option.label || ""}
                isOptionEqualToValue={(option, value) =>
                  option.value === value?.value
                }
                value={
                  createdByList
                    ? createdByList.find(
                        (item) => item.code == filter?.createdBy
                      ) || null
                    : null
                }
                onChange={(event, newValue) => {
                  handleSearchChange(
                    "createdBy",
                    newValue ? newValue.value : ""
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Name"
                    size="small"
                  />
                )}
              />
            </Col>
          </Row>
          <CustomTable
            data={filteredData}
            paginationDropDown={false}
            selectedRows={selectedRows}
            allSelected={allSelected}
            dataContained={filteredData?.length}
            pageCount={page}
            handlePageClick={handleChangePage}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={handleChangeRowsPerPage}
            actionVisibility={filter.status == 4 ? true : false}
            actions={actions}
            // clickableColumns={["VoucherNo"]}
            // onColumnClick={(item) => handleEdit(item)}
            isClickable={true}
            lineVisibility={true}
            firstColumnVisibility={true}
            exportToExcelBtnVisiblity={true}
            handleExportExcel={handleExport}
            searchVisibility={true}
            placeholder="Search.."
            fromDateValue={search}
            toDateChange={handleSearch}
            buttonTitle={filter.status == 4 ? "Pay All" : null}
            onPress={() => handlePayAll()}
            clickableColumns={["Voucher ID"]}
            onColumnClick={(item) => handleView(item)}
            specialColumns={[
              "Date",
              "User Name",
              "User Department",
              "Status",
              "Travel Mode",
              "Created By",
              "Remark",
              "VoucherDate",
            ]}
            enableCheckbox={true}
            MenuonHeaderCheckboxChange={handleSelectAll}
            onRowCheckboxChange={(index) => handleRowCheckboxChange(index)}
          />
        </Card>
      </Row>
      {loading && <CommonLoader />}
    </div>
  );
};

export default AdminVouchers;
