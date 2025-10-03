import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import "../../../Assets/css/AdminHelpDesk/AdminHelpDesk.css";
import Chart from "../Chart/Chart.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCompanyList } from "../../../Slices/Commondropdown/CommondropdownSlice.js";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown.jsx";
import MonthSelect from "../../../Components/DatePicker/MonthSelect.jsx";
import { getDashboardData } from "../../../Slices/PettyCashManagement/PettyCashSlice.js";
import { getVoucherDetails } from "../../../Slices/PettyCashManagement/PettyCashDropdownSlice.js";
import MultiSelectDropdown2 from "../../../Components/CustomDropdown/MultiSelectDropdown2.jsx";

const PettyCashDashboard = () => {
  const dispatch = useDispatch();
  const [group, setGroup] = useState(1);
  const [owner, setOwner] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [type, setType] = useState("1,2,3,4,5,6");
  const [filteredData, setFilteredData] = useState({});
  const companyListData =
    useSelector((state) => state.CommonDropdownData.companyList) || [];

  const apiData = useSelector((state) => state?.PettyCash?.dashBoardData) || [];
  const voucherTypeData = useSelector(
    (state) => state?.PettyCashDropdown?.voucherDetailsData
  );
  useEffect(() => {
    dispatch(getCompanyList());
    dispatch(getVoucherDetails("VOUCHER_TYPE"));
  }, [dispatch]);
  useEffect(() => {
    fetchDashboardData();
  }, [selectedCompany, selectedMonthYear, type]);

  const voucherTypeRecords = apiData?.data ? apiData?.data[1] : [];

  console.log(voucherTypeRecords, "apiData");
  useEffect(() => {
    const allRows = apiData?.data ? apiData?.data[0] : [];
    const data = {
      "Available Balance": allRows.reduce(
        (sum, row) => sum + (Number(row.available_balance) || 0),
        0
      ),
      Expense: allRows.reduce(
        (sum, row) => sum + (Number(row.expenses) || 0),
        0
      ),
      "Opening Balance": allRows.reduce(
        (sum, row) => sum + (Number(row.opening_balance) || 0),
        0
      ),
    };
    setFilteredData(data);
  }, [apiData]);

  const handleMonthChange = (formattedDate) => {
    if (formattedDate) {
      const [year, month] = formattedDate.split("-");
      setSelectedMonthYear({
        month: parseInt(month),
        year: parseInt(year),
      });
    }
  };

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setSelectedCompany(value ? parseInt(value) : null);
  };

  const fetchDashboardData = async () => {
    try {
      const payload = {
        companyId: selectedCompany,
        month: selectedMonthYear.month,
        year: selectedMonthYear.year,
        type: type,
      };
      await dispatch(getDashboardData(payload));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
    }
  };

  return (
    <Row className="dashboard me-1 ms-1">
      <Card>
        <Title title="Petty Cash Dashboard" />
        <Card.Body>
          <Row>
            <Col md={3}>
              <MonthSelect
                selectedDate={
                  selectedMonthYear?.year && selectedMonthYear?.month
                    ? new Date(
                        selectedMonthYear.year,
                        selectedMonthYear.month - 1
                      )
                    : null
                }
                handleChange={handleMonthChange}
              />
            </Col>
            <Col md={3}>
              <CustomDropdown
                labelKey="company_name"
                valueKey="company_id"
                options={[
                  { company_name: "Select Entity", company_id: "" },
                  ...(companyListData?.data || []),
                ]}
                selectedValue={selectedCompany || ""}
                onChange={handleCompanyChange}
              />
            </Col>
            <Col md={3}>
              <CustomDropdown
                labelKey="label"
                valueKey="value"
                options={[
                  { label: "Select Voucher Type", value: "1,2,3,4,5,6" },
                  ...(voucherTypeData?.data || []),
                ]}
                selectedValue={type || ""}
                onChange={(e) => setType(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="justify-content-around mt-3">
            {Object.entries(filteredData)?.map(([key, count], index) => (
              <Col key={index} md={4} className="p-1">
                <Card className="shadow h-100" id="card-radius">
                  <Card.Body>
                    <Card.Subtitle>{key}</Card.Subtitle>
                    <h3 className="mt-2">
                      ₹{Number(count).toLocaleString("en-IN")}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="mt-5">
            <Chart
              filteredData={filteredData}
              allData={apiData?.data ? apiData?.data[0] : []}
              setGroup={setGroup}
              group={group}
              owner={owner}
              setOwner={setOwner}
              voucherTypeRecords={voucherTypeRecords}
            />
          </Row>
        </Card.Body>
      </Card>
    </Row>
  );
};

export default PettyCashDashboard;
