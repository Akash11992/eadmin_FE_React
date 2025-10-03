import React, { useEffect, useState } from "react";
import CustomInput from "../../../../../Components/CustomInput/CustomInput";
import { Col, Container, Row, Table } from "react-bootstrap";
import CustomDropdown from "../../../../../Components/CustomDropdown/CustomDropdown";
import CustomSingleButton from "../../../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../../../Components/Title/Title";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmailData,
  getEmailStatusData,
} from "../../../../../Slices/Emails/EmailSlice";
import { ExportToXLSX } from "../../../../../Components/Excel-JS/ExportToXLSX";
import TablePagination from "@mui/material/TablePagination";
import {
  getModuleList,
  getPageList,
} from "../../../../../Slices/Role/RoleSlice";

const SentEmailStatus = () => {
  const [filter, setFilter] = useState({
    startdate: null,
    enddate: null,
    module: null,
    moduleId: null,
    subModule: null,
    staus: null,
  });
  const [error, setError] = useState({ startdate: "", enddate: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const emailDetails = useSelector(
    (state) => state.EmailService.emailGetDetails
  );
  const emailData = emailDetails?.data || [];
  const emailStatus = useSelector((state) => state.EmailService.emailGetStatus);
  const StatusData = emailStatus?.data || [];

  const moduleListData = useSelector((state) => state.Role.moduleList);
  const moduleList = moduleListData?.data || [];

  const pageListData = useSelector((state) => state.Role?.pageList);
  const pageList = pageListData?.data || [];
  useEffect(() => {
    fetchModuletype();
  }, []);

  const fetchModuletype = async () => {
    await dispatch(getModuleList());
  };
  useEffect(() => {
    fetchEmailStatusDetails();
  }, []);
  const fetchEmailStatusDetails = async () => {
    await dispatch(getEmailStatusData());
  };
  useEffect(() => {
    if (filter?.module !== null) {
      fetchpageDetails(filter?.moduleId);
    } else {
      setFilter((prev) => ({ ...prev, subModule: null }));
    }
  }, [filter?.module]);

  const fetchpageDetails = async (module_Id) => {
    const payload = {
      module_ids: [module_Id],
    };
    await dispatch(getPageList(payload));
  };

  const handleSearchChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value === "" ? null : value,
    }));
    if (key === "startdate" || key === "enddate") {
      validateDates(key, value);
    }
  };
  const validateDates = (key, value) => {
    const { startdate, enddate } = { ...filter, [key]: value };
    let errors = { startdate: "", enddate: "" };

    if (key === "startdate" && value && enddate && value > enddate) {
      errors.startdate = "Start date cannot be after End date.";
    }

    if (key === "enddate" && value && startdate && value < startdate) {
      errors.enddate = "End date cannot be before Start date.";
    }

    setError(errors);
  };

  const fetchEmailDetails = async () => {
    const payload = {
      startdate: filter.startdate,
      enddate: filter.enddate,
      module: filter.module,
      subModule: filter.subModule,
      staus: filter.staus,
    };
    await dispatch(getEmailData(payload));
  };

  const handleExportExcel = () => {
    const data = emailData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    ExportToXLSX(data, "Email Details");
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchEmailDetails();
  }, [
    filter.startdate,
    filter.enddate,
    filter.module,
    filter.subModule,
    filter.staus,
  ]);

  const paginatedData = emailData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="mt-3 ms-0">
        <Title title="Sent Email Status" />
      </Row>
      <hr />
      <Row>
        <Col md={2} style={{ marginTop: "-7px" }}>
          <CustomInput
            labelName="From Date"
            type="date"
            value={filter.startdate}
            onChange={(event) =>
              handleSearchChange("startdate", event.target.value)
            }
          />
          {error.startdate && (
            <small className="text-danger">{error.startdate}</small>
          )}
        </Col>
        <Col md={2} style={{ marginTop: "-7px" }}>
          <CustomInput
            labelName="To Date"
            type="date"
            value={filter.enddate}
            onChange={(event) =>
              handleSearchChange("enddate", event.target.value)
            }
          />
          {error.enddate && (
            <small className="text-danger">{error.enddate}</small>
          )}
        </Col>
        <Col md={2} className="mt-4">
          <CustomDropdown
            labelKey="module_name"
            valueKey="module_id"
            options={[
              {
                module_id: null,
                module_name: "Filter By Module",
              },
              ...moduleList,
            ]}
            selectedValue={filter.moduleId || null}
            onChange={(e) => {
              const selectedModuleId =
                e.target.value === null || e.target.value === "Filter By Module"
                  ? null
                  : e.target.value;

              const selectedModuleName =
                moduleList.find(
                  (module) => module.module_id === Number(selectedModuleId)
                )?.module_name || null;

              setFilter((prev) => ({
                ...prev,
                moduleId: selectedModuleId,
              }));

              handleSearchChange("module", selectedModuleName);
            }}
          />
        </Col>

        <Col md={2} className="mt-4">
          <CustomDropdown
            labelKey="form_name"
            valueKey="form_name"
            options={[
              {
                form_name: null,
                form_name: "Filter By SubModule",
              },
              ...pageList,
            ]}
            selectedValue={filter.subModule || null}
            onChange={(e) => {
              const value =
                e.target.value === null ||
                e.target.value === "Filter By SubModule"
                  ? null
                  : e.target.value;
              handleSearchChange("subModule", value);
            }}
          />
        </Col>
        <Col md={2} className="mt-4">
          <CustomDropdown
            labelKey="email_status"
            valueKey="email_status"
            options={[
              {
                email_status: null,
                email_status: "Filter By Status",
              },
              ...StatusData,
            ]}
            selectedValue={filter.staus || null}
            onChange={(e) => {
              const Values =
                e.target.value === null || e.target.value === "Filter By Status"
                  ? null
                  : e.target.value;
              handleSearchChange("staus", Values);
            }}
          />
        </Col>
        <Col md={2} className="mt-4">
          <CustomSingleButton
            _ButtonText="Export To Excel"
            height={40}
            onPress={handleExportExcel}
          />
        </Col>
      </Row>
      <Row className="mt-4">
        {paginatedData.length > 0 ? (
          <Container>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#DC3545", color: "white" }}>
                    Sl No.
                  </th>
                  <th style={{ backgroundColor: "#DC3545", color: "white" }}>
                    Receiver Mail
                  </th>
                  <th style={{ backgroundColor: "#DC3545", color: "white" }}>
                    Module
                  </th>
                  <th style={{ backgroundColor: "#DC3545", color: "white" }}>
                    SubModule
                  </th>
                  <th style={{ backgroundColor: "#DC3545", color: "white" }}>
                    Status
                  </th>
                  <th style={{ backgroundColor: "#DC3545", color: "white" }}>
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr key={index}>
                      <td>{page * rowsPerPage + index + 1}</td>
                      <td>{row["Receiver Mail"]}</td>
                      <td>{row["Module"]}</td>
                      <td>{row["Sub Module"]}</td>
                      <td>{row["Status"]}</td>
                      <td>{row["Date & Time"]}</td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </Table>
            <TablePagination
              component="div"
              count={emailData.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              classes={{
                selectLabel: "custom-select-label",
                displayedRows: "custom-select-label",
              }}
            />
          </Container>
        ) : (
          <b colSpan="6" className="text-center mb-3 mt-5">
            No Records Found
          </b>
        )}
      </Row>
    </div>
  );
};

export default SentEmailStatus;
