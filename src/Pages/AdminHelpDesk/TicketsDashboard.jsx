import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupDropdown,
  getPriorityDropdown,
  getStatusDropdown,
  getTicketDetailsData,
  getTicketDetailsDataExport,
  getticketOwnerDropdown,
} from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import { ExportToXLSX } from "../../Components/Excel-JS/ExportToXLSX";
import { toast, ToastContainer } from "react-toastify";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../Components/Title/Title";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import FromDate from "../../Components/DatePicker/FromDate";
import EndDate from "../../Components/DatePicker/EndDate";

const TicketsDashboard = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState({
    priority: null,
    status: 1,
    id: null,
    owner: null,
    fromDate: null,
    endDate: null,
    group: null,
    mode: "view",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );

  const { All_Tickets } = permissionDetailData.data || {};
  const {
    ticketDetails,
    priorityDropdown,
    statusDropdown,
    employeeDropdown,
    groupDropdown,
  } = useSelector((state) => state.AdminHelpDesk);
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
  }, [dispatch]);
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const loading = useSelector(
    (state) => state.AdminHelpDesk.status === "loading"
  );
  const updatedStatus = statusDropdown?.filter(
    (item) => item.label !== "Close"
  );

  const actions = [];

  if (ticketDetails?.data?.allocate === true) {
    actions.push({
      label: "Allocate",
      onClick: (item) => handleAllocate(item),
    });
  }

  actions.push({
    label: "Reply",
    onClick: (item) => handleReply(item),
  });

  const handleAllocate = (item) => {
    const data = {
      id: item["Ticket ID"],
      type: "Allocate",
      view: false,
    };
    navigate("/ticketsEdit", { state: data });
  };

  const handleReply = (item) => {
    const isType = item.Group === "Repair & Maintenance" ? "Repair" : "Reply";
    const data = {
      id: item["Ticket ID"],
      type: isType,
      view: false,
    };
    navigate("/ticketsEdit", { state: data });
  };

  const handleEdit = async (item) => {
    const data = {
      id: item,
      type: "TicketID",
      view: false,
    };
    if (All_Tickets?.update) {
      await navigate("/ticketsEdit", { state: data });
    }
  };

  const handleSearchChange = useCallback((name, value) => {
    setSearchFilter((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchFilter.fromDate && !searchFilter.endDate) {
        toast.warning("Please enter End Date");
        return;
      }
      if (searchFilter.endDate && !searchFilter.fromDate) {
        toast.warning("Please enter From Date");
        return;
      }
      await dispatch(getTicketDetailsData(searchFilter));
      setPage(0);
    };
    handleSearch();
  }, [
    searchFilter.fromDate,
    searchFilter.endDate,
    searchFilter.id,
    searchFilter.owner,
    searchFilter.status,
    searchFilter.priority,
    searchFilter.group,
  ]);

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
    if (exportData1?.length > 0) {
      ExportToXLSX(exportData1, "Ticket Details");
    } else {
      toast.warning("No Records Found");
    }
  };

  const handleNewTicket = async () => {
    const data = {
      view: false,
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
        <Title title="Tickets" />
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
              options={updatedStatus}
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
        <Row className="mt-3 ">
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
        </Row>
        <Row className={`mt-4 ${!searchFilter.hide ? "mb-2" : ""}`}>
          {/* <Col md={1}>
            <CustomSingleButton
              _ButtonText="Search"
              height={40}
              onPress={handleSearch}
            />
          </Col> */}
          <Col md={2}>
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height={40}
              onPress={handleExportExcel}
            />
          </Col>
          <Col md={8} />
          {All_Tickets?.create && (
            <Col md={2}>
              <CustomSingleButton
                _ButtonText="Add New Ticket"
                height={40}
                onPress={handleNewTicket}
              />
            </Col>
          )}
        </Row>
        <CustomTable
          data={data}
          paginationDropDown={false}
          dataContained={data?.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          actionVisibility={All_Tickets?.update ? true : false}
          actions={actions}
          clickableColumns={["Ticket ID"]}
          onColumnClick={(id) => handleEdit(id)}
          marginTopTable={true}
          lineVisibility={true}
        />
      </Card>
    </Row>
  );
};

export default TicketsDashboard;
