import React, { useEffect, useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Title } from "../../../Components/Title/Title";
import SearchForm from "../../../Components/TravelManegementComponets/Reports/ReportSearchForm/SearchForm";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import {
  getMappedId,
  getolaUberAmounts,
  getOlaUberMailMapping,
  ola_Uber_File_Summary,
  updateOlaUberMailMapping,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { useDispatch, useSelector } from "react-redux";
import { get_ola_uber_VendorName } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { addScheduler } from "../../../Slices/Scheduler/schedulerSlice";
import SummaryTemplate from "../../../Components/TravelManegementComponets/Reports/ReportSearchForm/SummaryTemplate";
import ReactDOMServer from "react-dom/server";

const Report = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [searchReport, setSearchReport] = useState({
    fromMonth: "",
    toMonth: "",
    vendorName: [],
    companyName: "",
    reportType: null,
    file: null,
    checkboxrow: [],
    type: "",
    total_amount: "",
  });

  const dispatch = useDispatch();
  const savedUserData = JSON.parse(localStorage.getItem("userData"));

  const {
    ola_uber_vendorNameData,
    getOlaUberMailDetails,
    mappedId,
    olaUberAmount,
  } = useSelector((state) => state.TravelManagement);

  const mappedData = mappedId?.data?.data[0];
  const uberAmount = olaUberAmount?.data?.uberAmount;
  const olaAmount = olaUberAmount?.data?.olaAmount;
  const fileNameOla = `${searchReport.companyName}-${searchReport.reportType}-${searchReport.fromMonth}-${searchReport.toMonth}-Ola`;
  const fileNameUber = `${searchReport.companyName}-${searchReport.reportType}-${searchReport.fromMonth}-${searchReport.toMonth}-Uber`;
  const hasOla = olaAmount != null && olaAmount !== "" && olaAmount !== "0.00";
  const hasUber =
    uberAmount != null && uberAmount !== "" && uberAmount !== "0.00";

  const handleFormChange = (key, value) => {
    setSearchReport((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const payload = {
    company_name: searchReport?.companyName,
    from_date: searchReport?.fromMonth,
    to_date: searchReport?.toMonth,
    vendor_id: searchReport?.vendorName,
    report_type: searchReport?.reportType,
  };

  useEffect(() => {
    dispatch(get_ola_uber_VendorName("VENDOR_NAMES"));
    getAmountData();
  }, [
    dispatch,
    searchReport.vendorName,
    searchReport.reportType,
    searchReport.companyName,
    searchReport?.reportType,
  ]);

  const getAmountData = async () => {
    if (
      searchReport.reportType ||
      searchReport.vendorName ||
      searchReport.companyName ||
      searchReport?.reportType
    ) {
      await dispatch(getolaUberAmounts(payload));
    }
  };

  useEffect(() => {
    const payload = {
      company_name: searchReport?.companyName,
      from_date: searchReport?.fromMonth,
      to_date: searchReport?.toMonth,
      vendor_id: searchReport?.type,
      report_type: searchReport?.reportType,
    };
    dispatch(getMappedId(payload));
  }, [
    searchReport.type,
    searchReport.reportType,
    searchReport.companyName,
    searchReport?.reportType,
  ]);

  useEffect(() => {
    if (searchReport.vendorName == 1) {
      setSearchReport((prevForm) => ({
        ...prevForm,
        type: "Ola",
      }));
    } else if (searchReport.vendorName == 2) {
      setSearchReport((prevForm) => ({
        ...prevForm,
        type: "Uber",
      }));
    } else {
      setSearchReport((prevForm) => ({
        ...prevForm,
        type: "Ola,Uber",
      }));
    }
  }, [searchReport.vendorName]);

  const getOlaUberFileSummary = async () => {
    try {
      const response = await dispatch(ola_Uber_File_Summary(payload));
      const { data, statusCode } = response?.payload || {};
      if (statusCode === 400) {
        toast.warning(data.message);
        return;
      }
      if (statusCode === 200) {
        if (data.olaData?.length > 0) {
          await ExportToXLSX(data.olaData, fileNameOla, null);
        }
        if (data.uberData?.length > 0) {
          await ExportToXLSX(data.uberData, fileNameUber, null);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const lastReportID =
    getOlaUberMailDetails?.data?.length > 0 &&
    Array.isArray(getOlaUberMailDetails.data)
      ? Math.max(...getOlaUberMailDetails.data.map((item) => item["Report ID"]))
      : 0;

      console.log(lastReportID,"lastReportID")
  const date = new Date(searchReport?.toMonth);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getOlaUberLabel = () => {
    if (hasOla && hasUber) return "Ola/Uber";
    if (hasOla) return "Ola";
    if (hasUber) return "Uber";
    return "";
  };

  const emailBodyForHod = ReactDOMServer.renderToStaticMarkup(
    <SummaryTemplate
      name={mappedData?.name}
      month={formattedDate}
      vendor={searchReport?.vendorName}
      OlaAmount={olaAmount}
      UberAmount={uberAmount}
      business={searchReport?.reportType}
      id={lastReportID + 1}
      createdBy={savedUserData?.data?.userId}
      fromName={savedUserData?.data?.name}
      currentBaseUrl={new URL(window.location.href).origin}
    />
  );

  const handleExportExcel = async () => {
    const response = await dispatch(ola_Uber_File_Summary(payload));
    const { data, statusCode } = response?.payload || {};
    if (statusCode === 400) {
      toast.warning(data.message);
      return;
    }

    const formData = new FormData();

    if (data.olaData?.length > 0) {
      const workbookBlobOla = await ExportToXLSX(
        data.olaData,
        fileNameOla,
        null,
        false
      );
      const olaFile = new File([workbookBlobOla], `${fileNameOla}.xlsx`, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      formData.append("attachment", olaFile);
    }

    if (data.uberData?.length > 0) {
      const workbookBlobUber = await ExportToXLSX(
        data.uberData,
        fileNameUber,
        null,
        false
      );
      const uberFile = new File([workbookBlobUber], `${fileNameUber}.xlsx`, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      formData.append("attachment", uberFile); // Append to "attachment"
    }
    if (mappedData) {
      // Append other fields
      formData.append("to", mappedData.to);
      formData.append(
        "subject",
        `${
          searchReport?.reportType
        }- ${getOlaUberLabel()} Ride-${formattedDate}-${
          searchReport.companyName
        }`
      );
      formData.append("content", emailBodyForHod);
      formData.append("is_file_upload", 1);
      formData.append("cc", mappedData.cc);

      const res = await dispatch(addScheduler(formData));
      if (res?.payload?.success === true) {
        toast.success("Your request has been sent for approval.");
        await dispatch(
          updateOlaUberMailMapping({
            scheduler_id: res.payload.result[0][0].id,
            id: mappedData.atm_mapping_id,
            summary_id: null,
            total_amount_ola: olaAmount,
            total_amount_uber: uberAmount,
          })
        );
        await dispatch(getOlaUberMailMapping());
      }
    } else {
      toast.warn("Please Add HOD in Alerts for this department");
    }
  };

  return (
    <Row className="dashboard me-1 ms-1">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />{" "}
      <Card>
        <Title title={"Generate Report"} />
        <SearchForm
          searchReport={searchReport}
          handleFormChange={handleFormChange}
          handleDownload={getOlaUberFileSummary}
          vendorOptions={ola_uber_vendorNameData}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          allSelected={allSelected}
          setAllSelected={setAllSelected}
          setSearchReport={setSearchReport}
          ApprovalHandle={handleExportExcel}
        />
      </Card>
    </Row>
  );
};

export default Report;
