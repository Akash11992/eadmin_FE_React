import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupDropdown,
  getPriorityDropdown,
  getStatusDropdown,
  getTicketDetailsData,
  getTicketDetailsDataExport,
  getticketOwnerDropdown,
} from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import { Card, Row, Col, Form } from "react-bootstrap";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import { toast, ToastContainer } from "react-toastify";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import { ExportToXLSX } from "../../Components/Excel-JS/ExportToXLSX";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import CustomInput from "../../Components/CustomInput/CustomInput";
import { Title } from "../../Components/Title/Title";
import FromDate from "../../Components/DatePicker/FromDate";
import EndDate from "../../Components/DatePicker/EndDate";
import { useNavigate } from "react-router-dom";
import { green } from "@mui/material/colors";

const Reports = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState({
    priority: null,
    status: null,
    id: null,
    owner: null,
    fromDate: null,
    endDate: null,
    hide: false,
    page: "reports",
    group: null,
    mode: "view",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    ticketDetails,
    priorityDropdown,
    statusDropdown,
    employeeDropdown,
    groupDropdown,
  } = useSelector((state) => state.AdminHelpDesk);

  const loading = useSelector(
    (state) => state.AdminHelpDesk.status === "loading"
  );

  const data = ticketDetails?.data?.getTicketDetails;

  const ticketOwnerPayload = {
    type: "TicketOwner",
    id: 0,
  };

  useEffect(() => {
    dispatch(getPriorityDropdown("PRIORITY"));
    dispatch(getStatusDropdown("STATUS"));
    dispatch(getticketOwnerDropdown(ticketOwnerPayload));
    dispatch(getGroupDropdown({ type: "group", id: 0 }));

    handleSearchDetais();
  }, [dispatch]);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  // tester demand function put temp....
  const handleSearchDetais = async () => {
    const response = await dispatch(getTicketDetailsData(searchFilter));
    if (response.payload.statusCode === 200) {
      setSearchFilter((prevState) => ({
        ...prevState,
        hide: true,
      }));
      setPage(0);
    }
  };

  const fetchTicketDetails = async () => {
    if (searchFilter.fromDate && !searchFilter.endDate) {
      toast.warning("Please enter End Date");
      return;
    }
    if (searchFilter.endDate && !searchFilter.fromDate) {
      toast.warning("Please enter From Date");
      return;
    }
    const response = await dispatch(getTicketDetailsData(searchFilter));
    if (response.payload.statusCode === 200) {
      setSearchFilter((prevState) => ({
        ...prevState,
        hide: true,
      }));
      setPage(0);
    }
  };

  const handleSearchChange = useCallback((name, value) => {
    setSearchFilter((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };
  const handleExportExcel = async () => {
    const exportFilter = { ...searchFilter, mode: "export" };
    const response = await dispatch(getTicketDetailsDataExport(exportFilter));
    const exportData = response?.payload?.data?.getTicketDetails;
    const exportData1 = exportData?.map((row) => {
      const obj = { ...row };
      if (row.Replies) {
        obj.Replies = stripHtml(row.Replies);
      }
      return obj;
    });
    if (exportData1?.length > 0 && searchFilter.hide) {
      ExportToXLSX(exportData1, "Ticket Details");
    } else {
      toast.error("No Records Available");
    }
  };
  const handleEdit = async (item) => {
    const isType = item.Group === "Repair & Maintenance" ? "Repair" : "Reply";

    const data = {
      id: item["Ticket ID"],
      type: isType,
      view: true,
    };

    await navigate("/ticketsEdit", { state: data });
  };
  return (
    <Row className="dashboard me-1 ms-1">
      {loading && <CommonLoader />}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Card>
        <Title title="All Tickets" />
        <Row className="mt-4 justify-content-around">
          <Col md={2}>
            <FromDate
              fromDate={searchFilter.fromDate}
              endDate={searchFilter.endDate}
              handleChange={(date) => handleSearchChange("fromDate", date)}
              Label="From Date"
            />
          </Col>
          <Col md={2}>
            <EndDate
              fromDate={searchFilter.fromDate}
              endDate={searchFilter.endDate}
              handleChange={(date) => handleSearchChange("endDate", date)}
              Label="End Date"
            />
          </Col>
          <Col md={2}>
            <CustomDropdown
              dropdownLabelName="Priority"
              labelKey="label"
              valueKey="value"
              options={[{ label: "Select", value: "" }, ...priorityDropdown]}
              selectedValue={searchFilter.priority}
              onChange={(e) => handleSearchChange("priority", e.target.value)}
            />
          </Col>
          <Col md={2}>
            <CustomDropdown
              dropdownLabelName="Status"
              labelKey="label"
              valueKey="value"
              options={[{ label: "Select", value: "" }, ...statusDropdown]}
              selectedValue={searchFilter.status}
              onChange={(e) => handleSearchChange("status", e.target.value)}
            />
          </Col>
          {ticketDetails?.data?.allocate === true && (
            <Col md={2}>
              <CustomDropdown
                dropdownLabelName="Ticket Owner"
                labelKey="Employee"
                valueKey="Emp_id"
                options={[
                  { Employee: "Select", Emp_id: "" },
                  ...employeeDropdown,
                ]}
                selectedValue={searchFilter.owner}
                onChange={(e) => handleSearchChange("owner", e.target.value)}
              />
            </Col>
          )}
          <Col md={2}>
            <CustomInput
              labelName="Ticket ID"
              type="text"
              placeholder="Enter ID"
              value={searchFilter?.id}
              onChange={(e) => handleSearchChange("id", e.target.value)}
            />
          </Col>
        </Row>
        <Row className={`mt-4 ${!searchFilter.hide ? "mb-2" : ""}`}>
          <Col md={2}>
            <CustomDropdown
              dropdownLabelName="Service Group"
              labelKey="label"
              valueKey="value"
              options={[{ label: "Select Group", value: "" }, ...groupDropdown]}
              selectedValue={searchFilter.group}
              onChange={(e) => handleSearchChange("group", e.target.value)}
            />
          </Col>
          <Col md={1} style={{ marginTop: "29px" }}>
            <CustomSingleButton
              _ButtonText="Search"
              height={40}
              onPress={fetchTicketDetails}
            />
          </Col>
          <Col md={2} style={{ marginTop: "29px" }}>
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height={40}
              onPress={handleExportExcel}
            />
          </Col>
          <Col md={9} />
        </Row>

        {searchFilter.hide && (
          <CustomTable
            data={data}
            // paginationDropDown={false}
            dataContained={data?.length || 0}
            pageCount={page}
            handlePageClick={handleChangePage}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={handleChangeRowsPerPage}
            marginTopTable={true}
            lineVisibility={true}
            clickableColumns={["Ticket ID"]}
            onColumnClick={(id) => handleEdit(id)}
            isEntireRowData={true}
          />
        )}
      </Card>
    </Row>
  );
};

export default Reports;
