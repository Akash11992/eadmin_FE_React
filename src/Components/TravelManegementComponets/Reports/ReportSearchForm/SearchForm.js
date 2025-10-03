import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CustomDropdown from "../../../CustomDropdown/CustomDropdown";
import CustomInput from "../../../CustomInput/CustomInput";
import CustomSingleButton from "../../../CustomSingleButton/CustomSingleButton";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../../CustomeTable/CustomTable";
import {
  getOlaUberMailMapping,
  getReportType,
  updateOlaUberMailMapping,
} from "../../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { addScheduler } from "../../../../Slices/Scheduler/schedulerSlice";
import { toast } from "react-toastify";
import {
  getCompanyList,
  getDepartments,
} from "../../../../Slices/Commondropdown/CommondropdownSlice";
import { ExportToXLSX } from "../../../Excel-JS/ExportToXLSX";
import MultiSelectDropdown from "../../../CustomDropdown/MultiSelectDropdown";
import DatePicker from "react-datepicker";
import MonthSelect from "../../../DatePicker/MonthSelect";
const SearchForm = (props) => {
  const {
    searchReport,
    handleFormChange,
    handleDownload,
    vendorOptions,
    selectedRows,
    setSelectedRows,
    allSelected,
    setAllSelected,
    setSearchReport,
    ApprovalHandle,
  } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const formData = new FormData();
  const dispatch = useDispatch();
  const { vendorName, companyName, fromMonth, toMonth } = searchReport;
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Report } = permissionDetailData.data || {};
  useEffect(() => {
    dispatch(getCompanyList());
  }, [dispatch]);

  useEffect(() => {
    fetchAlertDetails();
  }, []);

  useEffect(() => {
    const payload = {
      type: vendorName,
      code: companyName,
      fromDate: fromMonth,
      endDate: toMonth,
    };
    dispatch(getReportType(payload));
  }, [vendorName, companyName, fromMonth, toMonth]);

  const { companyList } = useSelector((state) => state.CommonDropdownData);
  const { getOlaUberMailDetails, reportType } = useSelector(
    (state) => state.TravelManagement
  );

  const fetchAlertDetails = async () => {
    await dispatch(getOlaUberMailMapping());
  };

  const handleFilter = async () => {
    const { vendorName, companyName, reportType } = searchReport;
    const payload = {
      report_type: reportType,
      vendor_id: vendorName,
      company_name: companyName,
    };
    await dispatch(getOlaUberMailMapping(payload));
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const download = (id) => {
    const data = [id];
    ExportToXLSX(data, "Summary Report", null, true);
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      const allRowIndexes = getOlaUberMailDetails?.data.map((item) => item);
      setSelectedRows(allRowIndexes);
    }
    setAllSelected(!allSelected);
  };

  const handleRowCheckboxChange = (index) => {
    const newSelectedRows = [...selectedRows];
    if (newSelectedRows.includes(index)) {
      newSelectedRows.splice(newSelectedRows.indexOf(index), 1);
    } else {
      newSelectedRows.push(index);
    }
    setSearchReport((prev) => ({
      ...prev,
      checkboxrow: newSelectedRows,
    }));
    setSelectedRows(newSelectedRows);
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    if (checked) {
      setSearchReport((prev) => ({
        ...prev,
        [type]: [...prev[type], value]?.sort((a, b) => a - b),
      }));
    } else {
      setSearchReport((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
    }
  };

  // const handlevendorCheckboxChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     handleFormChange("vendorName", [...searchReport?.vendorName, value]);
  //   } else {
  //     handleFormChange(
  //       "vendorName",
  //       searchReport?.vendorName.filter((owner) => owner !== value)
  //     );
  //   }
  // };
  const handleResendMail = async () => {
    if (searchReport?.checkboxrow?.length > 0) {
      const res = await dispatch(
        updateOlaUberMailMapping({
          scheduler_id: null,
          id: null,
          summary_id: searchReport?.checkboxrow,
        })
      );
      if (res.payload.statusCode === 200) {
        await dispatch(getOlaUberMailMapping());
        setSearchReport((prev) => ({
          ...prev,
          checkboxrow: [],
        }));
        setSelectedRows([]);
      }
    } else {
      toast.warning("Please Select  Checkbox");
    }
  };
  const handleExportMail = () => {
    if (getOlaUberMailDetails?.data?.length > 0) {
      ExportToXLSX(
        getOlaUberMailDetails?.data,
        "Ola/Uber Email Summary Report"
      );
    } else {
      toast.warning("No Record Found");
    }
  };
  return (
    <div>
      <Row className="mt-3">
        <Col md="3">
          <MonthSelect
            selectedDate={searchReport.fromMonth}
            handleChange={(fromMonth) =>
              handleFormChange("fromMonth", fromMonth)
            }
            Label="From Month"
            mandatoryIcon={true}
          />
        </Col>
        <Col md="3">
          <MonthSelect
            selectedDate={searchReport.toMonth}
            handleChange={(toMonth) => handleFormChange("toMonth", toMonth)}
            Label="To Month"
            mandatoryIcon={true}
          />
        </Col>
        <Col md="3">
          <MultiSelectDropdown
            data={vendorOptions}
            valueKey="value"
            labelKey="label"
            value={searchReport.vendorName}
            label="Vendor Name"
            handleCheckboxChange={(e) => handleCheckboxChange(e, "vendorName")}
            selectLabel="Select"
            mandatoryIcon
          />
          {/* <CustomDropdown
            dropdownLabelName="Vendor Name"
            valueKey="value"
            labelKey="label"
            options={[{ label: "Select", value: "" }, ...vendorOptions]}
            selectedValue={searchReport.vendorName}
            onChange={(e) => handleFormChange("vendorName", e.target.value)}
            mandatoryIcon
          /> */}
        </Col>
        <Col md="3">
          <CustomDropdown
            dropdownLabelName="Company Name"
            valueKey="company_name"
            labelKey="company_name"
            selectLevel={"Select"}
            Dropdownlable={true}
            options={companyList?.data || []}
            selectedValue={searchReport.companyName}
            onChange={(e) => handleFormChange("companyName", e.target.value)}
            mandatoryIcon
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="3">
          <CustomDropdown
            dropdownLabelName="Report Type"
            valueKey="type"
            labelKey="type"
            options={[{ type: "Select" }, ...(reportType?.data?.data || [])]} // Fallback to an empty array
            selectedValue={searchReport.reportType}
            onChange={(e) => handleFormChange("reportType", e.target.value)}
            mandatoryIcon
            matchDepartments={getOlaUberMailDetails?.data?.map(
              (item) => item.Department
            )}
          />
        </Col>
        <Col md={2} className="mt-4 p-1">
          <CustomSingleButton
            _ButtonText="Generate & Review"
            height="45px"
            onPress={handleDownload}
          />
        </Col>
        <Col md={2} className="mt-4 p-1">
          <CustomSingleButton
            _ButtonText="Send for Approval"
            height="45px"
            onPress={ApprovalHandle}
          />
        </Col>
      </Row>
      <Row className="justify-content-end mt-2">
        <Col md={3} className="P-0">
          <CustomSingleButton
            _ButtonText="Filter by Company"
            height="45px"
            onPress={handleFilter}
          />
        </Col>
        <Col md={2}>
          <CustomSingleButton
            _ButtonText="Resend Email"
            height="45px"
            onPress={handleResendMail}
          />
        </Col>
        {Report?.export && (
          <Col md={2}>
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height="45px"
              onPress={handleExportMail}
            />
          </Col>
        )}
      </Row>
      <Row>
        <CustomTable
          data={getOlaUberMailDetails?.data}
          headingText={false}
          selectedRows={selectedRows}
          allSelected={allSelected}
          firstColumnVisibility={true}
          dataContained={getOlaUberMailDetails?.data?.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          downloadHeader={true}
          downloadVisibality={true}
          downloadData={[{ onClick: download }]}
          onPress={(e) => {
            e.preventDefault();
            handleResendMail();
          }}
          selectDataValue={formData?.column}
          enableCheckbox={true}
          MenuonHeaderCheckboxChange={handleSelectAll}
          onRowCheckboxChange={(index) => handleRowCheckboxChange(index)}
          marginTopTable={true}
          lineVisibility={true}
          Visibality={true}
          specialColumns={["CC", "Status", "HOD-To","Remark"]}
        />
      </Row>
    </div>
  );
};

export default SearchForm;
