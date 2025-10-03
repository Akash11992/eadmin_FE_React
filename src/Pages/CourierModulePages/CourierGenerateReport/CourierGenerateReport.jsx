import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Title } from "../../../Components/Title/Title";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import "react-toastify/dist/ReactToastify.css";
import { getCourierGenerateReport } from "../../../Slices/CourierSevices/CourierSevicesSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyDetails } from "../../../Slices/Commondropdown/CommondropdownSlice";
import MultiSelectDropdown2 from "../../../Components/CustomDropdown/MultiSelectDropdown2";

const CourierGenerateReport = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchReport, setSearchReport] = useState({
    fromDate: "",
    toDate: "",
    companyName: "",
    vendorName: "",
    reportType: "",
  });
  const permissionDetail = useSelector(
    (state) => state.Role?.permissionDetails || []
  );

  const Generate_Report_permission =
    permissionDetail?.data?.Generate_Report || {};
  const [companyOptions, setCompanyOptions] = useState([
    // { label: "Select Company", value: "" },
  ]);
  const vendorOptions = [
    { label: "Select Vendor", value: "" },
    { label: "Blue Dart", value: "Blue Dart" },
  ];
  const reportTypeOptions = [
    { label: "Select Report Type", value: "" },
    { label: "Reconciled Records", value: "Reconcile_File" },
    { label: "Pending Records", value: "Pending_Record" },
    { label: "Outward Register", value: "OutwardRegister" },
    { label: "Blue Dart Invoices", value: "Bluedart_invoices" },
  ];

  const handleFormChange = (key, value) => {
    setSearchReport((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (companyOptions.length > 0) {
      const allCompanyValues = companyOptions.map((c) => c.value);
      setSearchReport((prev) => ({
        ...prev,
        companyName: allCompanyValues, // Select all by default
      }));
    }
  }, [companyOptions]);
  const handleExportExcel = (data, fileName, downloadLink) => {
    if (data?.length > 0) {
      const { fromDate, toDate } = searchReport;
      const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
      };
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);

      const fullFileName = `${"Courier Consolidated"} ${formattedFromDate} to ${formattedToDate}.xlsx`;
      ExportToXLSX(data, fullFileName);
    } else {
      toast.warning("No Records Found");
    }
  };

  const reportTypeNames = {
    Reconcile_File: "Reconciled Records",
    Pending_Record: "Pending Records",
    OutwardRegister: "Outward Register",
    Bluedart_invoices: "Blue Dart Invoices",
  };
  const validForm = async () => {
    const { fromDate, toDate, companyName, vendorName, reportType } =
      searchReport;
    if (!fromDate || !toDate || !companyName || !vendorName || !reportType) {
      toast.warning("Please fill all mandatory fields marked as *");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      toast.warning("From Date cannot be after To Date.");
      return;
    }
    await fetchAndDownloadReport();
    // fetchReportData();
  };

  const fetchAndDownloadReport = async () => {
    setLoading(true);
    const payload = {
      company_name: searchReport.companyName.join(','),
      from_date: searchReport.fromDate,
      to_date: searchReport.toDate,
      vendor_id: searchReport.vendorName,
      report_type: searchReport.reportType,
    };
    try {
      const response = await dispatch(getCourierGenerateReport(payload));
      if (response?.payload?.statusCode === 200) {
        console.log(response?.payload?.data?.data)
        const reportData = response?.payload?.data?.data || [];
        if (reportData.length > 0) {
          const fileName = reportTypeNames[searchReport.reportType] || "Report";
          const downloadLink = response?.payload?.data.downloadLink;
          if (downloadLink) {
            handleExportExcel(reportData, fileName, downloadLink);
          }
          setSearchReport({
            fromDate: "",
            toDate: "",
            companyName: "",
            vendorName: "",
            reportType: "",
          });
          setLoading(false);
          toast.success(response?.payload?.message);
        } else {
          toast.warning("No data available for the selected criteria.");
          setLoading(false);
        }
      }
      else {
        toast.error(response?.payload?.message);
        setLoading(false);
      }
    } catch (error) {
      const errorMessage =
        error?.message || "Failed to fetch report data. Please try again.";
      toast.error(errorMessage);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const reportData = useSelector(
    (state) => state.CourierService.courierReport
  );
  const data = reportData?.data
  const fetchReportData = async () => {
    const payload = {
      company_name: searchReport.companyName.join(','),
      from_date: searchReport.fromDate,
      to_date: searchReport.toDate,
      vendor_id: searchReport.vendorName,
      report_type: "all_count"
    };

    try {
      const response = await dispatch(getCourierGenerateReport(payload));
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (
      Array.isArray(searchReport.companyName) && searchReport.companyName.length > 0 &&
      searchReport.fromDate &&
      searchReport.toDate &&
      searchReport.vendorName
    ) {
      fetchReportData();
    }
  }, [
    Array.isArray(searchReport.companyName) ? searchReport.companyName.join(',') : '',
    searchReport.fromDate,
    searchReport.toDate,
    searchReport.vendorName
  ]);


  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const response = await dispatch(getCompanyDetails());
      if (response?.payload) {
        const companyList = response.payload?.data.map((company) => ({
          label: company.CompanyName,
          value: company.AccountNo,
        }));
        setCompanyOptions([
          // { label: "Select Company", value: "" },
          ...companyList,
        ]);
      } else {
        toast.error("Failed to fetch company details.");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      toast.error("An error occurred while fetching company details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <CommonLoader />}
      <Container className="border rounded-3 p-4">
        <ToastContainer position="top-right" autoClose={3000} />
        <Title title={"Generate Report"} />
        <hr />
        <Form>
          <Row className="mb-3">
            <Col md={4}>
              <CustomInput
                type="date"
                labelName="From Date"
                mandatoryIcon={true}
                value={searchReport.fromDate}
                onChange={(e) => handleFormChange("fromDate", e.target.value)}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="date"
                labelName="To Date"
                mandatoryIcon={true}
                value={searchReport.toDate}
                onChange={(e) => handleFormChange("toDate", e.target.value)}
              />
            </Col>
            <Col md={4}>
              <CustomDropdown
                dropdownLabelName="Vendor Name"
                mandatoryIcon={true}
                options={vendorOptions}
                valueKey="value"
                labelKey="label"
                selectedValue={searchReport.vendorName}
                onChange={(e) => handleFormChange("vendorName", e.target.value)}
                selectLevel={"Select Vendor"}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <MultiSelectDropdown2
                value={searchReport.companyName}
                onChange={(e) => handleFormChange("companyName", e.target.value)}
                options={companyOptions}
                optionLabel="label"
                placeholder="Select Company"
                label="Company Name"
              />
              {/* <CustomDropdown
                dropdownLabelName="Company Name"
                mandatoryIcon={true}
                options={companyOptions}
                valueKey="value"
                labelKey="label"
                selectedValue={searchReport.companyName}
                onChange={(e) =>
                  handleFormChange("companyName", e.target.value)
                }
                selectLevel={"Select Company"}
              /> */}
            </Col>
            <Col md={4}>
              <CustomDropdown
                dropdownLabelName="Report Type"
                mandatoryIcon={true}
                options={reportTypeOptions}
                valueKey="value"
                labelKey="label"
                selectedValue={searchReport.reportType}
                onChange={(e) => handleFormChange("reportType", e.target.value)}
                selectLevel={"Select Report Type"}
              />
            </Col>
          </Row>
          {Generate_Report_permission?.export ? (
            <CustomSingleButton
              onPress={validForm}
              _ButtonText="Download Excel"
              backgroundColor="#000"
              Text_Color="#fff"
              borderColor="#000"
              height="48px"
              width="200px"
              margin="20px 0"
            />
          ) : null}
        </Form>
        {data?.length > 0 ? (
          <table className="table table-bordered table-striped"
            style={{
              borderRadius: "10px",
              borderCollapse: "separate",
              borderSpacing: "0",
              overflow: "hidden",
            }}>
            <thead>
              <tr>

                <th style={{ backgroundColor: "red", color: "white" }}>From Date</th>
                <th style={{ backgroundColor: "red", color: "white" }}>To Date</th>
                <th style={{ backgroundColor: "red", color: "white" }}>Report Type</th>
                <th style={{ backgroundColor: "red", color: "white" }}>Count</th>
                <th style={{ backgroundColor: "red", color: "white" }}>Vendor Company</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{searchReport.fromDate}</td>
                  <td>{searchReport.toDate}</td>
                  <td>{item.report_type}</td>
                  <td>{item.total_count}</td>
                  <td>{searchReport.vendorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </Container>
    </div>
  );
};

export default CourierGenerateReport;
