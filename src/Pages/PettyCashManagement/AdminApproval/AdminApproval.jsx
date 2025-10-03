import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Table,
  Form,
  Dropdown,
  Button,
  Modal,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { Title } from "../../../Components/Title/Title";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import {
  createVoucherCreation,
  getVoucherList,
} from "../../../Slices/PettyCashManagement/PettyCashSlice";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import { Autocomplete, TablePagination, TextField } from "@mui/material";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import {
  getCreatedByList,
  getPettyCashStatus,
  getVoucherDetails,
} from "../../../Slices/PettyCashManagement/PettyCashDropdownSlice";
import { addScheduler } from "../../../Slices/Scheduler/schedulerSlice";

const VoucherMail = (voucherDetails, remarks, modalType) => {
  const detailsArray = Array.isArray(voucherDetails)
    ? voucherDetails
    : [voucherDetails];

  return `
    <html>
      <body>
        <div style="font-family: Arial, sans-serif;">
          <p>Dear User,</p>          
          <p>This is to inform you that Petty Cash Voucher has been ${modalType} :</p>
          <p>Remarks: ${remarks}</p>
          <table border="1" style="border-collapse: collapse; width: 100%; text-align: center; margin-top: 20px;">
            <thead>
              <tr style="background-color:rgb(219, 52, 52); color: rgb(250, 246, 246);">
                <th>Voucher Id</th>
                <th>Voucher Type</th>
                <th>Date</th>
                <th>User Name</th>
                <th>Email</th>
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
                    <td>${voucher["Voucher type"] || ""}</td>
                    <td>${voucher["Date"] || ""}</td>
                    <td>${voucher["User Name"] || ""}</td>
                    <td>${voucher["Email"] || ""}</td>
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
          
          <p style="margin-top: 20px;">If you have any questions, feel free to contact us.</p>
          <p>Best regards,</p>
          <p>Admin Team</p>
        </div>
      </body>
    </html>
  `;
};

const AdminApproval = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState("");
  const [modalType, setModalType] = useState(null);

  const [filter, setFilter] = useState({
    fromDate: null,
    toDate: null,
    status: "3",
    voucherType: "1",
    companyName: null,
    createdBy: null,
  });

  const dispatch = useDispatch();

  const voucherListData = useSelector((state) => state?.PettyCash?.voucherList);
  const voucherData = voucherListData?.data || [];
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
    dispatch(getPettyCashStatus("STATUS"));
    dispatch(getVoucherDetails("VOUCHER_TYPE"));
  }, [dispatch]);

  useEffect(() => {
    return () => dispatch(getCreatedByList("OFFICE_BOY"));
  }, []);

  const fetchVoucherList = async () => {
    setLoading(true);
    await dispatch(getVoucherList(filter));
    setLoading(false);
    setPage(0);
  };

  const filteredData = voucherData?.filter(
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
  );

  const allColumns = Array.from(
    new Set(
      filteredData.flatMap((item) =>
        Object.keys(item).filter(
          (key) =>
            ![
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
            ].includes(key)
        )
      )
    )
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleSelectAll = () => {
    const allIds = paginatedData.map((item) => item["Voucher ID"]);
    setSelectedRows(allSelected ? [] : allIds);
    setAllSelected(!allSelected);
  };

  const handleRowCheckboxChange = (id) => {
    const updated = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(updated);
    setFilter((prev) => ({ ...prev, checkboxrow: updated }));
  };

  const handleExport = () => {
    if (filteredData.length > 0) {
      ExportToXLSX(filteredData, "Petty cash Voucher Details");
    } else {
      toast.warning("No Records Found");
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value === "" ? null : value,
    }));
    setPage(0);
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  const fetchSchedulerApi = async () => {
    for (const voucherId of selectedRows) {
      const voucher = voucherData.find((v) => v["Voucher ID"] === voucherId);
      if (!voucher) continue;

      const formData = new FormData();
      const isFileUpload = 0;
      const emailData = {
        Date: voucher["Expense_Date"],
        "Voucher Id": voucher["Voucher ID"],
        "Voucher type": voucher["Voucher Type"],
        "User Name": voucher["User Name"],
        Email: voucher?.Email,
        "Company Details": voucher["Company Details"],
        "User Department": voucher["User Department"],
        Amount: voucher.Amount,
        Remark: voucher.Remark,
      };

      const emailBodyForVoucher = VoucherMail(emailData, remarks, modalType);

      const emailList = [voucher.Email, voucher.Created_by_Email]
        .filter(Boolean)
        .join(",");

      formData.append("attachment", null);
      formData.append("to", emailList);
      {
        modalType === "rejected"
          ? formData.append(
              "subject",
              `Rejected Voucher ID - ${voucherId} by Admin`
            )
          : formData.append(
              "subject",
              `Raise a Query  for Voucher ID - ${voucherId} by Admin`
            );
      }
      formData.append("content", emailBodyForVoucher);
      formData.append("is_file_upload", isFileUpload);

      await dispatch(addScheduler(formData));
    }
  };

  const handleQuery = async (selectedRows) => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one voucher to Raise Query.");
      return;
    }

    const { successCount, failureCount } = await processVouchers("5");

    if (successCount > 0) fetchSchedulerApi();
    toast.success(`${successCount} voucher(s) Raise Query successfully.`);
    if (failureCount > 0)
      toast.error(`${failureCount} voucher(s) failed to Raise Query.`);

    setSelectedRows([]);
    setAllSelected(false);
    fetchVoucherList();
  };

  const handleDownload = (item) => {
    const file = voucherData?.find((d) => d["Voucher ID"] === item);
    if (file.Document_URL) {
      window.open(file.Document_URL, "_blank");
    } else {
      toast.info("Document Not Available");
    }
  };

  const handleApproval = async () => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one voucher to approve.");
      return;
    }

    const { successCount, failureCount } = await processVouchers("4");

    if (successCount > 0)
      toast.success(`${successCount} voucher(s) approved successfully.`);
    if (failureCount > 0)
      toast.error(`${failureCount} voucher(s) failed to approve.`);

    setSelectedRows([]);
    setAllSelected(false);
    fetchVoucherList();
  };

  const handleRejection = async (selectedRows) => {
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one voucher to reject.");
      return;
    }
    const { successCount, failureCount } = await processVouchers("7");

    if (successCount > 0) fetchSchedulerApi();
    toast.success(`${successCount} voucher(s) rejected successfully.`);
    if (failureCount > 0)
      toast.error(`${failureCount} voucher(s) failed to reject.`);

    setSelectedRows([]);
    setAllSelected(false);
    fetchVoucherList();
  };

  const processVouchers = async (status) => {
    const results = await Promise.all(
      selectedRows.map(async (voucherId) => {
        const item = voucherData.find(
          (data) => data["Voucher ID"] === voucherId
        );
        if (!item) return { voucherId, success: false };

        const createdDataName = createdByList?.find(
          (item2) => item2.label === item["Created By"]
        )?.code;

        let formattedVoucherData;
        try {
          switch (filter.voucherType) {
            case "1":
              formattedVoucherData = [
                {
                  date: formatDate(item["Expense_Date"]),
                  user_id: item["user_id"],
                  travel_mode: item["travel_id"],
                  travel_details: item["travel_details"],
                  amount: item["amounts"],
                  remark: item["Remark"] || remarks || "",
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
                  remark: item["Remark"] || remarks || "",
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
                  remark: item["Remark"] || remarks || "",
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
                  remark: item["Remark"] || remarks || "",
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
                  remark: item["Remark"] || remarks || "",
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
                  remark: item["Remark"] || remarks || "",
                  file: item["Document"] || "",
                  company_details: item["company_id"],
                  user_details: item["department"],
                },
              ];
              break;

            default:
              console.error("Unknown voucher type");
              return { voucherId, success: false };
          }

          const payload = {
            voucherData: JSON.stringify(formattedVoucherData),
            voucherType: filter.voucherType,
            status: status,
            id: item["Voucher ID"],
            createdBy: createdDataName,
          };

          const dataResult = await dispatch(createVoucherCreation(payload));
          return {
            voucherId,
            success: dataResult?.meta?.requestStatus === "fulfilled",
          };
        } catch (err) {
          console.error("Error processing voucher", voucherId, err);
          return { voucherId, success: false };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return { successCount, failureCount };
  };

  return (
    <div className="container-fluid ">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card className="p-2">
        <Title title="Admin Approval" />
        <Row className="mt-4 main_row">
          <Col md={2} className="from_date">
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
          <Col md={2} className="to_date">
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
                handleSearchChange("createdBy", newValue ? newValue.value : "");
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Name" size="small" />
              )}
            />
          </Col>
        </Row>
        <Row className="mb-3 mt-4 justify-content-between d-flex sticky-toolbar">
          <Col md={2}>
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height={40}
              onPress={handleExport}
            />
          </Col>
          {filter.status == 3 && (
            <>
              <Col md={2}>
                <CustomSingleButton
                  _ButtonText="Approve All"
                  height={40}
                  onPress={handleApproval}
                />
              </Col>
              <Col md={2}>
                <CustomSingleButton
                  _ButtonText="Raise a Query"
                  height={40}
                  onPress={() => {
                    if (selectedRows.length === 0) {
                      toast.warning("Please select at least one voucher.");
                    } else {
                      setModalType("raise query");
                    }
                  }}
                />
              </Col>
              <Col md={2}>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (selectedRows.length === 0) {
                      toast.warning(
                        "Please select at least one voucher to reject."
                      );
                    } else {
                      setModalType("rejected");
                    }
                  }}
                >
                  Reject All
                </Button>
              </Col>
            </>
          )}
          <Col md={1} />

          <Col md={3}>
            <CustomInput
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
        </Row>

        {paginatedData.length === 0 ? (
          <p className="text-center mt-5">
            <b>No Records Found</b>
          </p>
        ) : (
          <>
            <div className="table-responsive rounded-3 bookmakerTable">
              <Table
                bordered
                hover
                responsive
                style={{ whiteSpace: "pre" }}
                size="sm"
              >
                <thead>
                  <tr>
                    <th className="bg-danger text-white">
                      <Form.Check
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {allColumns.map((key) => (
                      <th key={key} className="bg-danger p-2 text-white">
                        {key}
                      </th>
                    ))}
                    {filter?.status === "3" ? (
                      <th className="text-white bg-danger fixed-action-column p-2">
                        Action
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="bg-danger text-white">
                        <Form.Check
                          type="checkbox"
                          checked={selectedRows.includes(item["Voucher ID"])}
                          onChange={() =>
                            handleRowCheckboxChange(item["Voucher ID"])
                          }
                        />
                      </td>
                      {allColumns.map((colKey, index) => (
                        <td key={index}>{item[colKey] || ""}</td>
                      ))}
                      {filter?.status === "3" && (
                        <td className="ftext-white fixed-action-column p-2">
                          <Dropdown drop="end">
                            <Dropdown.Toggle size="sm" variant="dark">
                              Action
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => {
                                  if (selectedRows.length > 1) {
                                    toast.warning(
                                      "Please use 'Approve All' button for bulk approval."
                                    );
                                  } else {
                                    handleApproval([item["Voucher ID"]]);
                                  }
                                }}
                              >
                                Approve
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={() => {
                                  setSelectedRows([item["Voucher ID"]]);
                                  setModalType("rejected");
                                }}
                              >
                                {" "}
                                Reject
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => {
                                  handleDownload(item["Voucher ID"]);
                                }}
                              >
                                {" "}
                                View Document
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Modal
                show={modalType !== null}
                onHide={() => setModalType(null)}
                centered
              >
                <Modal.Header closeButton />

                <Modal.Body>
                  <Form.Group controlId="remarksInput">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder={`Enter ${
                        modalType === "rejected" ? "rejection" : "raise query"
                      } reason`}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="success"
                    onClick={() => {
                      if (remarks.trim() === "") {
                        toast.warning(
                          "Please enter remarks before submitting."
                        );
                        return;
                      }
                      if (modalType === "rejected") {
                        handleRejection(selectedRows);
                      } else if (modalType === "raise query") {
                        handleQuery(selectedRows);
                      }

                      setModalType(null);
                      setRemarks("");
                    }}
                  >
                    Submit
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>

            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Card>
      {loading && <CommonLoader />}
    </div>
  );
};

export default AdminApproval;
