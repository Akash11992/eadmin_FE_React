import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "./PettyCashbalanceReport.css";
import { ToastContainer, toast } from "react-toastify";
import { Title } from "../../../../Components/Title/Title";
import { Col, Row } from "react-bootstrap";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ExportToXLSX } from "../../../../Components/Excel-JS/ExportToXLSX";
import AddBalanceCompany from "./AddBalanceCompany";
import { useDispatch, useSelector } from "react-redux";
import {
  getSummaryBalanceList,
  statusEmailPettyCash,
  updateBalanceSummary,
} from "../../../../Slices/PettyCashManagement/PettyCashSlice";
import { getCompanyList } from "../../../../Slices/Commondropdown/CommondropdownSlice";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";

const PettyCashbalanceReport = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState("");
  const [currentMonthYear, setCurrentMonthYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAmountPopup, setShowAmountPopup] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [amountToAdd, setAmountToAdd] = useState("");
  const [loading, setLoading] = useState(true);

  // Get data from Redux store
  const voucherListData = useSelector(
    (state) => state?.PettyCash?.summaryBalanceList
  );

  useEffect(() => {
    dispatch(getCompanyList());
  }, [dispatch]);

  const companyListData =
    useSelector((state) => state?.CommonDropdownData?.companyList) || [];

  const companyList = companyListData ? companyListData?.data : null;

  const companyId = companyList?.find(
    (item) =>
      item.company_name?.toLowerCase() === selectedCompany?.toLowerCase()
  )?.company_id;

  // Transform API data to match table structure
  const transformApiData = (apiDataArray) => {
    if (!apiDataArray || !Array.isArray(apiDataArray)) return [];

    return apiDataArray.map((item) => ({
      companyName: item.company_name || "",
      openingBalance: parseFloat(item.opening_balance) || 0,
      receivedAmount: parseFloat(item.received_amount) || 0,
      total: parseFloat(item.total) || 0,
      expensesAmount: parseFloat(item.expenses_amount) || 0,
      totalAvailableBalance: parseFloat(item.total_available_balance) || 0,
      Date: item.last_updated
        ? new Date(item.last_updated).toLocaleString()
        : "N/A",
      RecieveAmountDate: item.received_amount_date
        ? new Date(item.received_amount_date).toLocaleString()
        : "N/A",
    }));
  };

  // State for table data
  const [data, setData] = useState([]);

  // Update data when API response changes
  useEffect(() => {
    if (voucherListData?.data) {
      const transformedData = transformApiData(voucherListData.data);
      setData(transformedData);

      // Check for low balances
      if (transformedData?.length > 0) {
        transformedData?.forEach((item) => {
          if (
            item.companyName !== "Total" &&
            (item.openingBalance <= 0 || item.totalAvailableBalance <= 0)
          ) {
            toast.warning(
              `Low balance Alert! Please add funds to ${item.companyName}`,
              { position: "top-right", autoClose: 5000 }
            );
          }
        });
      }
    }
  }, [voucherListData]);

  useEffect(() => {
    setLoading(true);
    const fetchVoucherList = async () => {
      await dispatch(getSummaryBalanceList());
    };
    setLoading(false);
    fetchVoucherList();
  }, [dispatch,showModal]);

  const handleAddAmountClick = (companyName) => {
    setSelectedCompany(companyName);
    setAmountToAdd("");
    setShowAmountPopup(true);
  };

  const handleAddAmountSave = async () => {
    try {
      if (!amountToAdd || isNaN(amountToAdd)) {
        toast.error("Please enter a valid amount");
        return;
      }

      const updatePayload = {
        companyName: selectedCompany,
        amount: parseFloat(amountToAdd),
      };

      await dispatch(updateBalanceSummary(updatePayload));
      await dispatch(getSummaryBalanceList());

      toast.success("Amount added successfully!");
      statusClosed(selectedCompany);
      setShowAmountPopup(false);
    } catch (error) {
      toast.error("Failed to add amount");
      console.error("Error adding amount:", error);
    }
  };

  const statusClosed = async (item) => {
    const params = {
      companyId: companyId,
    };
    await dispatch(statusEmailPettyCash(params));
  };

  const getCurrentDate = () => {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = date.toLocaleString("default", { month: "short" });
    const yy = date.getFullYear();

    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12;
    const currentTime = `${hour12 === 0 ? 12 : hour12}:${minutes} ${ampm}`;

    setCurrentDate(`${mm} ${dd} ${yy} ${currentTime}`);
    const currentMonth = date.toLocaleString("default", { month: "long" });
    const currentYear = date.getFullYear();
    setCurrentMonthYear(`${currentMonth} ${currentYear}`);
  };

  useEffect(() => {
    getCurrentDate();
  }, []);

  const filteredData = data?.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleExportExcel = () => {
    if (filteredData?.length > 0) {
      ExportToXLSX(filteredData, `Balance Summary- ${currentMonthYear}`);
    } else {
      toast.warning("No Records Found");
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
      <div className="mt-2 mb-2">
        <Row className="p-3">
          <Col md={6}>
            <Title title={`Balance Summary- ${currentMonthYear}`} />
          </Col>
          <Col md={6} className="text-end"></Col>
          <hr />
        </Row>
        <Row>
          <Col md={2}>
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height={40}
              onPress={handleExportExcel}
            />
          </Col>
          <Col md={5}></Col>
          <Col md={3}>
            <CustomInput
              type="text"
              placeholder={"Search..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              height={43}
            />
          </Col>
          <Col md={2} className="justify-content-end d-flex">
            <CustomSingleButton
              onPress={() => setShowModal(true)}
              _ButtonText="+ Add New"
              backgroundColor="#000"
              height="44px"
              width="auto"
            />
          </Col>
        </Row>
        <DataTable
          value={filteredData}
          responsiveLayout="scroll"
          className="bordered hover responsive"
          size="small"
          style={{ whiteSpace: "pre", marginTop: "1rem" }}
        >
          <Column
            header="S.No"
            body={(rowData, { rowIndex }) => rowIndex + 1}
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
          />
          <Column
            field="companyName"
            header="Company Name"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
          />
          <Column
            field="openingBalance"
            header="Opening Balance"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
            body={(rowData) => rowData.openingBalance.toLocaleString()}
          />
          <Column
            field="receivedAmount"
            header="Received Amount"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
            body={(rowData) =>
              rowData.companyName !== "Total" ? (
                <button
                  onClick={() => handleAddAmountClick(rowData.companyName)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Add Amount
                </button>
              ) : (
                "" // Empty string for Total row
              )
            }
          />
          <Column
            field="lastreceivedAmount"
            header="Last Received Amount"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
            body={(rowData) => rowData.receivedAmount.toLocaleString()}
          />
          <Column
            field="Date"
            header="Received Amount Date"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
            body={(rowData) => (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip">{rowData.RecieveAmountDate}</Tooltip>
                }
              >
                <span
                  className="text-truncate"
                  style={{
                    maxWidth: "150px",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                >
                  {rowData.RecieveAmountDate}
                </span>
              </OverlayTrigger>
            )}
          />
          {/* <Column
            field="total"
            header="Total"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
            body={(rowData) => rowData.total.toLocaleString()}
          /> */}
          <Column
            field="expensesAmount"
            header="Expenses Amount"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
            body={(rowData) => rowData.expensesAmount.toLocaleString()}
          />
          <Column
            field="totalAvailableBalance"
            header="Total Available Balance"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
            body={(rowData) => rowData.totalAvailableBalance.toLocaleString()}
          />
          <Column
            field="Date"
            header="Last Updated"
            headerStyle={{ background: "rgb(220 46 69)", color: "white" }}
            body={(rowData) => (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip">{rowData.Date}</Tooltip>}
              >
                <span
                  className="text-truncate"
                  style={{
                    maxWidth: "150px",
                    display: "inline-block",
                    cursor: "pointer",
                  }}
                >
                  {rowData.Date}
                </span>
              </OverlayTrigger>
            )}
          />
        </DataTable>

        {/* Add Company Modal */}
        <AddBalanceCompany
          show={showModal}
          onClose={() => setShowModal(false)}
        />

        {/* Add Amount Popup */}
        {showAmountPopup && (
          <div
            className="modal-backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1050,
            }}
          >
            <div
              className="modal-content"
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                maxWidth: "90%",
              }}
            >
              <h5>Add Amount for {selectedCompany}</h5>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <CustomInput
                  type="text"
                  value={amountToAdd}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Allow only digits (no negative, no decimals, no characters)
                    if (/^\d*$/.test(val)) {
                      setAmountToAdd(val);
                    }
                  }}
                  placeholder="Enter amount ₹"
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <CustomSingleButton
                  _ButtonText="Cancel"
                  onPress={() => setShowAmountPopup(false)}
                  backgroundColor="#6c757d"
                  height="44px"
                  width="auto"
                />
                <CustomSingleButton
                  _ButtonText="Save"
                  onPress={handleAddAmountSave}
                  backgroundColor="#28a745"
                  height="44px"
                  width="auto"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {loading && <CommonLoader />}
    </div>
  );
};

export default PettyCashbalanceReport;
