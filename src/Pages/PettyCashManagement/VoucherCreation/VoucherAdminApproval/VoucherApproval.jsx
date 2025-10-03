import React, { useState, useEffect } from "react";
import { Alert, Col, Row, Table } from "react-bootstrap";
import { Title } from "../../../../Components/Title/Title";
import CommonRowTable from "../../../../Components/CommonRowTable/CommonRowTable";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import {
  accountPaymentPettyCash,
  balanceSummary,
  getVoucherList,
} from "../../../../Slices/PettyCashManagement/PettyCashSlice";
import { useDispatch, useSelector } from "react-redux";
import { getVoucherDetails } from "../../../../Slices/PettyCashManagement/PettyCashDropdownSlice";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import { getCompanyList } from "../../../../Slices/Commondropdown/CommondropdownSlice";

const headersView = [
  { name: "userName", placeholder: "User Name", type: "text", isDisable: true },
  {
    name: "CompanyDetails",
    placeholder: "Company Details",
    type: "text",
    isDisable: true,
  },
  {
    name: "departmentDetails",
    placeholder: "Department Details",
    type: "text",
    isDisable: true,
  },
  { name: "amount", placeholder: "Amount", type: "text", isDisable: true },
];

const VoucherApproval = () => {
  const [rows, setRows] = useState([]);
  const [checkedRows, setCheckedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [headers, setHeaders] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const getVoucherApprovalData = location.state?.voucherDetailsData;
  const [loading, setLoading] = useState(true);

  const companyListData =
    useSelector((state) => state?.CommonDropdownData?.companyList) || [];
  const companyList = companyListData?.data;

  // useEffect(() => {
  //   if (!getVoucherApprovalData) {
  //     setRows([]);
  //     return;
  //   }

  //   const dataArray = Array.isArray(getVoucherApprovalData)
  //     ? getVoucherApprovalData
  //     : [getVoucherApprovalData];

  //   if (dataArray.length > 0) {
  //     const transformedData = dataArray.map((voucher) => {
  //       const dateValue = voucher.Date || voucher["Voucher Date"];
  //       const formattedDate = dateValue
  //         ? dateValue.split('-').reverse().join('-')
  //         : '';
  //       return {
  //         VoucherNo: voucher["Voucher ID"] || "",
  //         VoucherTypeId: voucher["Voucher Type Id"] || "",
  //         VoucherType: voucher["Voucher Type"] || "",
  //         date: formattedDate,
  //         userName: voucher["User Name"] || "",
  //         CompanyDetails: voucher["Company Details"] || "",
  //         departmentDetails: voucher["User Department"] || "",
  //         travelMode: voucher["Travel Mode"] || "",
  //         travelDetails: voucher["Travel Details"] || "",
  //         amount: voucher.Amount || "0",
  //         file: voucher.Document_URL ? { name: voucher.Document || "Document" } : null,
  //         remark: voucher.Remark || voucher.remarks || "",
  //         dateOfPayment: "",
  //         totalAmtPaid: "",
  //         createdBy: voucher["Created By"] || "",
  //         ApprovedBy: voucher.Status || voucher.status_description || voucher.approved_by_name || "",
  //         userId: voucher.user_id || "",
  //         travelId: voucher.travel_id || ""
  //       };
  //     });

  //     setRows(transformedData);
  //     setCheckedRows(new Array(transformedData.length).fill(true));

  //     if (transformedData.length > 0) {
  //       setFormData(prev => ({
  //         ...prev,
  //         voucherType: transformedData[0]?.VoucherType
  //       }));
  //     }
  //   } else {
  //     setRows([]);
  //   }
  // }, [getVoucherApprovalData]);

  useEffect(() => {
    if (!getVoucherApprovalData) {
      setRows([]);
      setHeaders([]);
      return;
    }

    const dataArray = Array.isArray(getVoucherApprovalData)
      ? getVoucherApprovalData
      : [getVoucherApprovalData];

    if (dataArray.length > 0) {
      const currentDate = new Date().toISOString().split("T")[0];
      // Set dateOfPayment to current date for all rows
      const updatedRows = dataArray.map((row) => ({
        ...row,
        dateOfPayment: currentDate,
      }));
      setRows(updatedRows);

      const keys = Array.from(
        new Set(dataArray.flatMap((item) => Object.keys(item)))
      );
      const excludeFields = [
        "Voucher Type Id",
        "user_id",
        "Email",
        "Document_URL",
        "travel_id",
        "status_id",
        "company_id",
        "travel_details",
        "amounts",
      ];
      const dynamicHeaders = keys
        ?.filter((key) => !excludeFields.includes(key))
        ?.map((key) => ({
          name: key,
          placeholder: key
            .replace(/_/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\s+/g, " ")
            .trim()
            .replace(
              /\w\S*/g,
              (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
            ),
          type: "text",
          isDisable: true,
        }));

      setHeaders(dynamicHeaders);
      setCheckedRows(new Array(dataArray.length).fill(true));
    } else {
      setRows([]);
      setHeaders([]);
    }
  }, [getVoucherApprovalData]);

  useEffect(() => {
    fetchVoucherList();
    dispatch(getCompanyList());
    dispatch(getVoucherDetails("VOUCHER_TYPE"));
  }, [dispatch]);

  const fetchVoucherList = async () => {
    setLoading(true);
    const payload = {
      status: 3,
      voucher_no: null,
      fromDate: null,
      toDate: null,
      mode_id: null,
    };
    await dispatch(getVoucherList(payload));
    setLoading(false);
  };

  const handleInput = (e, index) => {
    const { name, value } = e.target;
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = { ...newRows[index], [name]: value };
      return newRows;
    });
  };

  const handleFileChange = (e, index, name) => {
    const file = e.target.files[0];
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = { ...newRows[index], [name]: file };
      return newRows;
    });
  };

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        VoucherNo: "",
        VoucherType: "",
        date: "",
        userName: "",
        CompanyDetails: "",
        departmentDetails: "",
        travelMode: "",
        travelDetails: "",
        amount: "",
        file: null,
        remark: "",
        dateOfPayment: "",
        totalAmtPaid: "",
        createdBy: "",
        ApprovedBy: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      if (!checkedRows.some((checked) => checked)) {
        toast.error("Please select at least one voucher to approve");
        return;
      }
      const expenseData = rows
        .filter((_, index) => checkedRows[index])
        .map((row) => {
          const matchedCompany = companyList.find(
            (company) =>
              company.company_name?.trim().toLowerCase() ===
              row["Company Details"]?.trim().toLowerCase()
          );
          console.log(matchedCompany, "row");
          return {
            company_id: matchedCompany?.company_id,
            expense_amount: parseFloat(row.Amount) || 0,
            expense_date:
              row.dateOfPayment?.trim() ||
              new Date().toISOString().slice(0, 19).replace("T", " "),
            voucher_id: row["Voucher ID"] || row["VoucherNo"],
            voucher_type_id: row["Voucher Type Id"] || row["VoucherTypeId"],
          };
        });
      const response = await dispatch(balanceSummary(expenseData));
      if (response.payload?.statusCode === 200) {
        paymentStatus();
        toast.success("Vouchers approved and balances updated successfully");
        setTimeout(() => {
          navigate("/adminVouchers");
        }, 2000);
      } else {
        const errorMsg =
          response.payload?.message || "Failed to update company balances";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error in voucher approval:", error);
      toast.error(error.response?.data?.message || "Error approving vouchers");
    }
  };

  const paymentStatus = async () => {
    const filteredRows = rows
      .filter((_, index) => checkedRows[index])
      .map((row) => ({
        refId: row["Voucher ID"],
        refType: row["Voucher Type Id"],
        remark: row?.remark || "",
      }));
    for (const row of filteredRows) {
      await dispatch(accountPaymentPettyCash(row));
    }
  };

  const handleCancle = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      width: "400px",
      customClass: {
        popup: "custom-popup",
      },
    });

    if (result.isConfirmed) {
      navigate("/adminVouchers");
    }
  };

  const handleRowCheckboxChange = (index) => {
    setCheckedRows((prevCheckedRows) => {
      const newCheckedRows = [...prevCheckedRows];
      newCheckedRows[index] = !newCheckedRows[index];
      return newCheckedRows;
    });
    setSelectAll(checkedRows.every((checked) => checked));
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCheckedRows(new Array(rows.length).fill(newSelectAll));
  };

  const filteredRows = rows.filter((_, index) => checkedRows[index]);
  const mergedRows = filteredRows.reduce((acc, row) => {
    const existingRow = acc.find((r) => r.userName === row["User Name"]);
    if (existingRow) {
      existingRow.amount = (
        parseFloat(existingRow.amount) + parseFloat(row.Amount || 0)
      ).toString();
    } else {
      acc.push({
        userName: row["User Name"],
        CompanyDetails: row["Company Details"],
        departmentDetails: row["User Department"],
        amount: row.Amount || "0",
      });
    }
    return acc;
  }, []);
console.log(mergedRows,"mergedRows")
  const calculateTotalAmount = () => {
    return mergedRows
      .reduce((acc, row) => acc + parseFloat(row.amount || 0), 0)
      .toFixed(2);
  };

  const hasData = Array.isArray(getVoucherApprovalData)
    ? getVoucherApprovalData.length > 0
    : getVoucherApprovalData && Object.keys(getVoucherApprovalData).length > 0;

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="m-1 mt-2">
        <Title title="Voucher Approval" />
      </Row>
      <hr />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      {hasData ? (
        <>
          {loading ? (
            <CommonLoader />
          ) : (
            <>
              <div className="mt-3">
                <CommonRowTable
                  rows={rows}
                  headers={headers}
                  handleInput={handleInput}
                  handleFileChange={handleFileChange}
                  addRow={addRow}
                  removeRow={removeRow}
                  handleSelectAllChange={handleSelectAllChange}
                  selectAll={selectAll}
                  handleRowCheckboxChange={handleRowCheckboxChange}
                  checkedRows={checkedRows}
                  checkbox_view={true}
                />
              </div>
              <Row className="mt-3">
                <Col md={12} className="align-content-end">
                  <Alert
                    variant="warning"
                    style={{
                      backgroundColor: "#fff3cd",
                      color: "#856404",
                      margin: "0",
                      padding: "8px",
                    }}
                  >
                    Note: The table below provides a brief overview of the user
                    details.
                  </Alert>
                </Col>
              </Row>
              <div className="mt-3">
                <Table bordered hover responsive style={{ whiteSpace: "pre" }}>
                  <thead>
                    <tr>
                      {headersView.map((header, index) => (
                        <th
                          key={index}
                          style={{
                            backgroundColor: "#d90429",
                            color: "white",
                            minWidth: "160px",
                          }}
                        >
                          {header.placeholder}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mergedRows.map((row, index) => (
                      <tr key={index}>
                        <td>{row.userName}</td>
                        <td>{row.CompanyDetails}</td>
                        <td>{row.departmentDetails}</td>
                        <td>{row.amount}</td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: "right",
                          fontWeight: "bold",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        Total Amount
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        {calculateTotalAmount()}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <Row className="gap-3 mb-3 mt-3">
                <Col md={8} className="row">
                  <Col md={4}>
                    <CustomInput
                      type="date"
                      labelName="Date Of Payment"
                      value={rows[0]?.dateOfPayment || ""}
                      onChange={(e) => {
                        setRows((prevRows) =>
                          prevRows.map((row) => ({
                            ...row,
                            dateOfPayment: e.target.value,
                          }))
                        );
                      }}
                      isMax={new Date().toISOString().split("T")[0]}
                    />
                  </Col>
                  <Col md={4}>
                    <CustomInput
                      type="number"
                      labelName="Total Amt Paid"
                      value={calculateTotalAmount()}
                      placeholder="Total Amount"
                      isDisable={true}
                    />
                  </Col>
                  <Col md={4}>
                    <CustomInput
                      type="text"
                      labelName="Remark"
                      value={rows?.remark}
                      placeholder="Enter Remark"
                      onChange={(e) => {
                        setRows((prevRows) =>
                          prevRows.map((row) => ({
                            ...row,
                            remark: e.target.value,
                          }))
                        );
                      }}
                    />
                  </Col>
                </Col>
                <Col md={4} className="justify-content-end gap-3 mb-3 mt-4 row">
                  <CustomSingleButton
                    onPress={handleSave}
                    _ButtonText="Approve"
                    backgroundColor="#000"
                    height="44px"
                    width="auto"
                  />
                  <CustomSingleButton
                    onPress={handleCancle}
                    _ButtonText="Cancel"
                    backgroundColor="#000"
                    height="44px"
                    width="auto"
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "25px", fontWeight: 700 }}>
            No Data Found...
          </span>
        </div>
      )}
    </div>
  );
};

export default VoucherApproval;
