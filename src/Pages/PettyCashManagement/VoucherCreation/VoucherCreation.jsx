import React, { useState, useEffect } from "react";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { Title } from "../../../Components/Title/Title";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Main.css";
import { ToastContainer, toast } from "react-toastify";
import {
  createVoucherCreation,
  deleteVoucherCreation,
  getVoucherList,
  getVoucherListById,
} from "../../../Slices/PettyCashManagement/PettyCashSlice";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import {
  getCreatedByList,
  getPettyCashStatus,
  getVoucherDetails,
} from "../../../Slices/PettyCashManagement/PettyCashDropdownSlice";
import Swal from "sweetalert2";
import { getCompanyList } from "../../../Slices/Commondropdown/CommondropdownSlice";
import MultiSelectDropdown from "../../../Components/CustomDropdown/MultiSelectDropdown";
import { Autocomplete, TextField } from "@mui/material";

const VoucherMail = (voucherDetails) => {
  const detailsArray = Array.isArray(voucherDetails)
    ? voucherDetails
    : [voucherDetails];
  const firstRow = detailsArray[0] || {};
  const voucherId = firstRow["Voucher Id"] || "";
  const voucherType = firstRow["Voucher Type Id"] || "";
  const currentBaseUrl = new URL(window.location.href).origin;
  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif;">
          <p>Dear ${firstRow["User Name"]},</p>
          <p>Your petty cash vouchers have been submitted for approval with the following details:</p>

          <table border="1" style="border-collapse: collapse; width: 100%; text-align: center; margin-top: 20px;">
            <thead>
              <tr style="background-color:rgb(219, 52, 52); color: rgb(250, 246, 246);">
                <th>Voucher Id</th>
                <th>Date</th>
                <th>Voucher Type</th>
                <th>User Name</th>
                <th>Company Details</th>
                <th>Department</th>
                <th>Amount</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              ${detailsArray
                .map(
                  (voucher) => `
                  <tr>
                    <td>${voucher["Voucher Id"] || ""}</td>
                    <td>${voucher["Date"] || ""}</td>
                    <td>${voucher["voucher type"] || ""}</td>
                    <td>${voucher["User Name"] || ""}</td>
                    <td>${voucher["Company Details"] || ""}</td>
                    <td>${voucher["User Department"] || ""}</td>
                    <td>${voucher["Amount"] || ""}</td>
                    <td>${voucher["Remark"] || ""}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>

          <div style="margin-top: 20px;">
            <p>Total Amount: ${detailsArray.reduce(
              (total, row) => total + (parseFloat(row["Amount"]) || 0),
              0
            )}</p>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <a href="${
              process.env.REACT_APP_API
            }/api/approve/${voucherId}/${voucherType}" 
            style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; margin-right: 20px; display: inline-block;">
            Approve Voucher
            </a>

            <a href="${currentBaseUrl}/reject-remarks?refId=${voucherId}&vouchertype=${voucherType}" 
            style="padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; display: inline-block;">
            Reject with Remarks
            </a>
          </div>

          <p style="margin-top: 20px;">If you have any questions, feel free to contact us.</p>
          <p>Best regards,</p>
          <p>${firstRow["CreatedBy"]}</p>
        </div>
      </body>
    </html>
  `;
};

const VoucherCreation = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [amounts, setAmounts] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    fromDate: null,
    toDate: null,
    status: null,
    voucherType: "1",
    companyName: null,
    createdBy: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const savedUserData = JSON.parse(localStorage.getItem("userData"));
  // const createdBy = savedUserData?.data?.userId;

  const voucherListData =
    useSelector((state) => state?.PettyCash?.voucherList) || [];
  const PettyCashStatusData = useSelector(
    (state) => state?.PettyCashDropdown?.PettyCashStatus
  );
  const voucherTypeData = useSelector(
    (state) => state?.PettyCashDropdown?.voucherDetailsData
  );

  const voucherData = (voucherListData?.data && voucherListData?.data) || [];
  const createdByList = useSelector(
    (state) => state.PettyCashDropdown.createdByList
  );
  const companyListData =
    useSelector((state) => state.CommonDropdownData.companyList) || [];
  useEffect(() => {
    fetchVoucherList();
    fetchCompanyListData();
    dispatch(getPettyCashStatus("STATUS"));
    return () => {};
  }, []);
  const fetchCompanyListData = async () => {
    await dispatch(getCompanyList());
  };

  useEffect(() => {
    dispatch(getVoucherDetails("VOUCHER_TYPE"));
    return () => {};
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCreatedByList("OFFICE_BOY"));
    return () => {};
  }, [dispatch]);
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

  const fetchVoucherList = async (id) => {
    setLoading(true);
    const payload = {
      voucherType: filter.voucherType,
      status: filter.status,
      company: filter.companyName,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
      createdBy: filter.createdBy,
      voucherId: id || null,
    };
    await dispatch(getVoucherList(payload));
    setLoading(false);
  };

  const handleSearchChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value === "" ? null : value,
    }));
    setPage(0);
  };

  const handleAllocate = async (voucherDetails) => {
    setIsEditMode(true);
    const voucher = voucherDetails["Voucher ID"];
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
            path: "/voucherCreation",
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
  const handleView = async (voucher) => {
    setIsEditMode(true);
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
            path: "/voucherCreation",
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

  const actions = [
    {
      label: "Sent To Approval",
      onClick: (item) => handleApproval(item["Voucher ID"]),
    },
    {
      label: "Edit",
      onClick: (item) => handleAllocate(item),
    },
    {
      label: "Delete",
      onClick: (item) => handleTypeDelete(item["Voucher ID"]),
    },
    {
      label: "View Document",
      onClick: (item) => handleDownload(item["Voucher ID"]),
    },
  ].filter((action) => action !== null);

  const handleAddNewClick = () => {
    navigate("/addVoucherCreation");
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const filteredData = voucherData
    ?.filter(
      (item) =>
        (item.Status === "Open" ||
          item.Status === "Pending" ||
          item.Status === "Raise Query" ||
          item.Status === "Approved by User" ||
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

  const handleDownload = (item) => {
    const file = voucherData?.find((d) => d["Voucher ID"] === item);
    if (file.Document_URL) {
      window.open(file.Document_URL, "_blank");
    } else {
      toast.info("Document Not Available");
    }
  };

  const handleApproval = async (voucherId) => {
    setLoading(true);
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
      status: "2",
      id: item["Voucher ID"],
      createdBy: createdDataName,
    };

    const dataResult = await dispatch(createVoucherCreation(payload));
    if (dataResult?.meta?.requestStatus === "fulfilled") {
      const successMsg = "Sent To Approval Successfully";
      toast.success(successMsg);
    }
    fetchVoucherList();
    setLoading(false);
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleDelete = async (voucherId) => {
    const item = voucherData.find((v) => v["Voucher ID"] === voucherId);
    if (!item) {
      toast.warn("Voucher data not found.");
      return;
    }

    const payload = {
      voucherType: filter.voucherType,
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

  const handleExport = () => {
    if (filteredData?.length > 0) {
      const data = filteredData[0]?.["Voucher Type"] || "Petty Cash";
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      const fileName = `${data} Voucher Details - ${formattedDate}`;
      ExportToXLSX(filteredData, fileName);
    } else {
      toast.warning("No Records Found");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleAmount = () => {
    setAmounts("");
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    if (checked) {
      setFilter((prev) => ({
        ...prev,
        [type]: [...prev[type], value]?.sort((a, b) => a - b),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
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
          <Title title="Voucher Creation Form" />
          <Row className="mt-4 main_row justify-content-around">
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
              {/* <MultiSelectDropdown
                data={voucherTypeData?.data}
                valueKey="value"
                labelKey="label"
                value={filter.voucherType}
                label="Vendor Name"
                handleCheckboxChange={(e) =>
                  handleCheckboxChange(e, "voucherType")
                }
                selectLabel="Select"
                mandatoryIcon
              /> */}
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
            actionVisibility={true}
            actions={actions}
            onPress={handleAddNewClick}
            buttonTitle={"Add New"}
            clickableColumns={["Voucher ID"]}
            onColumnClick={(item) => handleView(item)}
            isClickable={true}
            lineVisibility={true}
            firstColumnVisibility={true}
            exportToExcelBtnVisiblity={true}
            handleExportExcel={handleExport}
            searchVisibility={true}
            placeholder="Search.."
            fromDateValue={search}
            toDateChange={handleSearch}
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
              "Service",
            ]}
          />
        </Card>
      </Row>
      {loading && <CommonLoader />}
    </div>
  );
};

export default VoucherCreation;
