import React, { useState, useEffect } from "react";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import CustomDropdown from "../../../../Components/CustomDropdown/CustomDropdown";
import CustomTable from "../../../../Components/CustomeTable/CustomTable";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import { Title } from "../../../../Components/Title/Title";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../Main.css";
import { ToastContainer, toast } from "react-toastify";
import {
  createVoucherCreation,
  getVoucherList,
  getVoucherListById,
} from "../../../../Slices/PettyCashManagement/PettyCashSlice";
import { ExportToXLSX } from "../../../../Components/Excel-JS/ExportToXLSX";
import {
  getCreatedByList,
  getPettyCashStatus,
  getVoucherDetails,
} from "../../../../Slices/PettyCashManagement/PettyCashDropdownSlice";
import { getCompanyList } from "../../../../Slices/Commondropdown/CommondropdownSlice";
import Encryption from "../../../../Components/Decryption/Encryption";
import { Autocomplete, TextField } from "@mui/material";

const UserApproval = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [remark, setRemark] = useState("");
  const [modalType, setModalType] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filter, setFilter] = useState({
    fromDate: null,
    toDate: null,
    status: "2",
    voucherType: "1",
    companyName: null,
    createdBy: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const voucherListData = useSelector((state) => state?.PettyCash?.voucherList);
  const voucherData = (voucherListData?.data && voucherListData?.data) || [];

  const PettyCashStatusData = useSelector(
    (state) => state?.PettyCashDropdown?.PettyCashStatus
  );
  const voucherTypeData = useSelector(
    (state) => state?.PettyCashDropdown?.voucherDetailsData
  );
  const createdByList = useSelector(
    (state) => state.PettyCashDropdown.createdByList
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
    dispatch(getCreatedByList("OFFICE_BOY"));
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    fetchVoucherList();
    fetchCompanyListData();
    dispatch(getPettyCashStatus("STATUS"));
    dispatch(getVoucherDetails("VOUCHER_TYPE"));
  }, [dispatch]);

  const fetchVoucherList = async () => {
    setLoading(true);
    await dispatch(getVoucherList(filter));
    setLoading(false);
    setPage(0);
  };

  const filteredData = voucherData
    ?.filter(
      (item) =>
        (item.Status === "Pending" ||
          item.Status === "Approved by User" ||
          item.Status === "Raise Query" ||
          item.Status === "Approved by Admin" ||
          item.Status === "Payment Done" ||
          item.Status === "Reject") &&
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
    )
    .map((item) => {
      const {
        ["Voucher Type Id"]: _,
        ["user_id"]: __,
        ["travel_id"]: ___,
        //["Document"]: ____,
        ["Document_URL"]: _____,
        ["Email"]: ______,
        ["compant_id"]: _______,
        ["status_id"]: ________,
        ["Created_by_Email"]: _________,
        ["travel_details"]: ____,
        ["amounts"]: __________,
        ["department"]: ___________,
        ...rest
      } = item;
      return rest;
    });

  const handleApproval = async (voucherId) => {
    const item = voucherData.find((data) => data["Voucher ID"] === voucherId);

    if (!item) {
      console.error("Voucher not found");
      return;
    }
    const createdDataName = createdByList?.find(
      (item2) => item2.label === item["Created By"]
    )?.code;

    let formattedVoucherData;

    switch (filter.voucherType) {
      case "1":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"],
            travel_mode: item["travel_id"],
            travel_details: item["travel_details"],
            amount: item["amounts"],
            remark: item["Remark"],
            file: item["Document"] || "",
            company_details: item["company_id"],
            user_details: item["department"],
          },
        ];
        break;

      case "2":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"],
            particular: item["Particular"] || "",
            quantity: item["Quantity"] || "",
            rate: item["Rate"] || "",
            amount: item["Amount"] || "",
            remark: item["Remark"] || "",
            file: item["Document"] || "",
            company_details: item["company_id"],
            user_details: item["department"],
          },
        ];
        break;

      case "3":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"],
            areaName: item["Area"] || "",
            service: item["Service"] || "",
            rate: Number(item["Rate"]) || 0,
            amount: item["Amount"] || "",
            remark: item["Remark"] || "",
            file: item["Document"] || "",
            company_details: item["company_id"],
            user_details: item["department"],
          },
        ];
        break;

      case "4":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            duration: item["Duration"] || "",
            user_id: item["user_id"] || "",
            service: item["Service"] || "",
            amount: item["Amount"] || "",
            remark: item["Remark"] || "",
            file: item["Document"] || "",
            company_details: item["company_id"],
            user_details: item["department"],
          },
        ];
        break;

      case "5":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"] || "",
            service: item["Service"] || "",
            expense: Number(item["Expense"]) || 0,
            remark: item["Remark"] || "",
            file: item["Document"] || "",
            company_details: item["company_id"],
            user_details: item["department"],
          },
        ];
        break;

      case "6":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"] || "",
            service: item["Service"] || "",
            amount: item["Amount"] || "",
            remark: item["Remark"] || "",
            file: item["Document"] || "",
            company_details: item["company_id"],
            user_details: item["department"],
          },
        ];
        break;

      default:
        console.error("Unknown voucher type");
        return;
    }

    const payload = {
      voucherData: JSON.stringify(formattedVoucherData),
      voucherType: filter.voucherType,
      status: "3",
      id: item["Voucher ID"],
      createdBy: createdDataName,
    };

    const dataResult = await dispatch(createVoucherCreation(payload));
    if (dataResult?.meta?.requestStatus === "fulfilled") {
      const successMsg = "Approved Successfully";
      toast.success(successMsg);
    }
    fetchVoucherList(voucherId);
  };

  const handleTypeReject = async (voucherId) => {
    const item = voucherData.find((data) => data["Voucher ID"] === voucherId);

    if (!item) {
      console.error("Voucher not found");
      return;
    }
    const createdDataName = createdByList?.find(
      (item2) => item2.label === item["Created By"]
    )?.code;

    let formattedVoucherData;
    console.log(item, "item");
    switch (filter.voucherType) {
      case "1":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"],
            travel_mode: item["travel_id"],
            travel_details: item["travel_details"],
            amount: item["amounts"],
            remark: item["Remark"] || remark || "",
            file: item["Document"] || "",
          },
        ];
        break;

      case "2":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"],
            particular: item["Particular"] || "",
            quantity: item["Quantity"] || "",
            rate: item["Rate"] || "",
            amount: item["Amount"] || "",
            remark: item["Remark"] || remark || "",
            file: item["Document"] || "",
          },
        ];
        break;

      case "3":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"],
            areaName: item["Area"] || "",
            service: item["Service"] || "",
            rate: Number(item["Rate"]) || 0,
            amount: item["Amount"] || "",
            remark: item["Remark"] || remark || "",
            file: item["Document"] || "",
          },
        ];
        break;

      case "4":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            duration: item["Duration"] || "",
            user_id: item["user_id"] || "",
            service: item["Service"] || "",
            amount: item["Amount"] || "",
            remark: item["Remark"] || remark || "",
            file: item["Document"] || "",
          },
        ];
        break;

      case "5":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"] || "",
            service: item["Service"] || "",
            expense: Number(item["Expense"]) || 0,
            remark: item["Remark"] || remark || "",
            file: item["Document"] || "",
          },
        ];
        break;

      case "6":
        formattedVoucherData = [
          {
            date: formatDate(item["Expense_Date"]),
            user_id: item["user_id"] || "",
            service: item["Service"] || "",
            amount: item["Amount"] || "",
            remark: item["Remark"] || remark || "",
            file: item["Document"] || "",
          },
        ];
        break;

      default:
        console.error("Unknown voucher type");
        return;
    }

    const payload = {
      voucherData: JSON.stringify(formattedVoucherData),
      voucherType: filter.voucherType,
      status: "7",
      id: item["Voucher ID"],
      createdBy: createdDataName,
    };

    const dataResult = await dispatch(createVoucherCreation(payload));
    if (dataResult?.meta?.requestStatus === "fulfilled") {
      const successMsg = "Reject Successfully";
      toast.success(successMsg);
      setModalType(false);
    }
    fetchVoucherList(voucherId);
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const actions = [
    {
      label: "Sent To Approval",
      onClick: (item) => handleApproval(item["Voucher ID"]),
    },
    {
      label: "Reject",
      onClick: (item) => {
        setSelectedRows(item["Voucher ID"]);
        setModalType(true);
      },
    },
    {
      label: "View Document",
      onClick: (item) => handleDownload(item["Voucher ID"]),
    },
  ].filter((action) => action !== null);

  const handleDownload = (item) => {
    const file = voucherData?.find((d) => d["Voucher ID"] === item);
    if (file.Document_URL) {
      window.open(file.Document_URL, "_blank");
    } else {
      toast.info("Document Not Available");
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleExport = () => {
    if (filteredData?.length > 0) {
      const filteredExcelData = filteredData?.map(
        ({ modeId, ...rest }) => rest
      );
      ExportToXLSX(filteredExcelData, "Petty cash Voucher Details");
    } else {
      toast.warning("No Records Found");
    }
  };

  const handleSearchChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value === "" ? null : value,
    }));
    setPage(0);
  };

  const fetchCompanyListData = async () => {
    await dispatch(getCompanyList());
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
            path: "/userApproval",
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
  const companyListData =
    useSelector((state) => state.CommonDropdownData.companyList) || [];

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
          <Title title="User Approval" />
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
              <CustomDropdown
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
                    : []),
                ]}
                selectedValue={filter.voucherType}
                onChange={(e) => {
                  const selectedOption = e.target.value;
                  const value =
                    selectedOption === "Select Type" ? null : selectedOption;
                  handleSearchChange("voucherType", value);
                }}
                height="43px"
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
                  const selectedOption = e.target.value;
                  const value =
                    selectedOption === "Select Status" ? null : selectedOption;
                  handleSearchChange("status", value);
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

          {/* API Data Table */}
          <CustomTable
            data={filteredData}
            paginationDropDown={false}
            dataContained={filteredData?.length}
            pageCount={page}
            handlePageClick={handleChangePage}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={handleChangeRowsPerPage}
            actionVisibility={filter.status == 2 && true}
            actions={actions}
            lineVisibility={true}
            firstColumnVisibility={true}
            exportToExcelBtnVisiblity={true}
            handleExportExcel={handleExport}
            searchVisibility={true}
            placeholder="Search.."
            fromDateValue={search}
            toDateChange={(e) => setSearch(e.target.value)}
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
              "Area",
              "Voucher Type",
              "Rate",
            ]}
          />
        </Card>
        <Modal show={modalType} onHide={() => setModalType(false)} centered>
          <Modal.Header closeButton />

          <Modal.Body>
            <Form.Group controlId="remarksInput">
              <Form.Control
                as="textarea"
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={`Enter rejection reason`}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() => {
                if (remark.trim() === "") {
                  toast.warning("Please enter remarks before submitting.");
                  return;
                } else {
                  handleTypeReject(selectedRows);
                }
                setRemark("");
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
      {loading && <CommonLoader />}
    </div>
  );
};

export default UserApproval;
