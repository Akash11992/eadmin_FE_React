import React from "react";
import {
  Table,
  Dropdown,
  Form,
  Row,
  Col,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import "./CustomStyle.css";
import CustomSingleButton from "../CustomSingleButton/CustomSingleButton";
import { TablePagination } from "@mui/material";
import CustomInput from "../CustomInput/CustomInput";
import Divider from "@mui/material/Divider";
import FeedbackReports from "../FeedbackReports/FeedbackReports";
import { FaDownload } from "react-icons/fa";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import MultiSelectDropdown from "../CustomDropdown/MultiSelectDropdown";

const CustomTable = (props) => {
  const {
    data = [],
    setValue,
    pageCount,
    handleItemsPerPageChange,
    rowsPerPage,
    clickableColumns = [],
    onColumnClick,
    isRightSideButtonVisible,
    isEntireRowData,
    specialColumns,
  } = props;

  // format heading name code here......
  const formatHeader = (header) => {
    return header
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      );
  };

  //  Render status code here...........
  const renderStatus = (status) => {
    const color = status === "active" ? "green" : "red";
    return (
      <span
        style={{
          display: "inline-block",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
    );
  };

  //   Render each table row code here...........
  const renderRow = (item, index) => (
    <tr key={index}>
      {/* Checkbox code here ....*/}
      {props?.enableCheckbox && (
        <td className="text-white bg-danger">
          <Form.Check
            type="checkbox"
            checked={props?.selectedRows.includes(item)}
            onChange={() => props?.onRowCheckboxChange(item)}
          />
        </td>
      )}

      {Object.keys(item)
        .filter(
          (key) =>
            key !== "businessId" &&
            key !== "company_id" &&
            key !== "Id" &&
            key !== "S.No" &&
            key !== "vendorId" &&
            key !== "modeId" &&
            key !== "userId" &&
            key !== "pettycashId"&&
            key !== "Voucher Type Id" &&
            key !== "compant_id" &&
            key !== "status_id" &&
            key !== "travel_id" &&
            key !== "user_id" && 
            key !== "Email" &&
            key !== "Document" &&
            key !== "Document_URL" &&
            key !== "travel_details" &&
            key !== "amounts" &&
            key !== "department"
        )
        .map((key, idx) => {
          const isClickable = clickableColumns.includes(key);
          const cellValue = item[key];
          const cellEntireValue = item;
          // const specialColumns = ["CC"];
          const cellClass = specialColumns?.includes(key) ? "name" : "";

          const renderTooltip = (text) => (
            <Tooltip
              id="tooltip"
              style={{ maxWidth: "300px", whiteSpace: "normal" }}
            >
              {text}
            </Tooltip>
          );

          return (
            <td
              key={idx}
              className={`p-2 ${cellClass} ${
                isClickable ? "clickable-column" : ""
              }`}
              onClick={() => {
                if (isClickable && onColumnClick) {
                  if (isEntireRowData) {
                    onColumnClick(cellEntireValue, idx);
                  } else {
                    onColumnClick(cellValue, idx);
                  }
                }
              }}
              style={{
                color: isClickable ? "#0d6efd" : "",
                wordBreak: "break-word",
                whiteSpace: cellClass ? "" : "normal",
              }}
            >
              {cellClass ? (
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip(cellValue)}
                >
                  <span
                    className="text-truncate"
                    style={{
                      maxWidth: "150px",
                      display: "inline-block",
                    }}
                  >
                    {cellValue}
                  </span>
                </OverlayTrigger>
              ) : typeof cellValue === "object" ? (
                JSON.stringify(cellValue)
              ) : (
                cellValue
              )}
            </td>
          );
        })}

      {/* Render Status Code are here.... */}
      {props?.showStatusColumn && <td>{renderStatus(item.status)}</td>}

      {/* download with icon code here.. */}
      {props?.attachmentVisibality && (
        <td className="text-white text-center fixed-action-column"></td>
      )}
      {props?.Visibality && (
        <td className="text-white text-center fixed-action-column">
          {props.downloadData && props.downloadData.length > 0 ? (
            props.downloadData.map((downloadFile, index) => (
              <div key={index} onClick={() => downloadFile.onClick(item)}>
                <FaDownload size={20} color="#9d9d9c" />
              </div>
            ))
          ) : (
            <FaDownload size={20} color="#9d9d9c" />
          )}
        </td>
      )}
      {/* Actions Column code here ....*/}
      {props?.actionVisibility && (
        <td className="fixed-action-column ps-2 pe-2 pb-1">
          <Dropdown drop="end" align="end">
            <Dropdown.Toggle
              id="dropdown-basic"
              style={{
                display: "flex",
                alignItems: "center",
                background: "#000",
                borderColor: "#000",
                padding: 5,
                fontSize: 14,
                // position: "relative"
              }}
            >
              Action
            </Dropdown.Toggle>

            <Dropdown.Menu className="fixed-column">
              {props.actions.map((action, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => action.onClick(item)}
                  className="select-dropdown"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d3d3d3";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                  }}
                >
                  <span style={{ marginRight: "5px", fontSize: "12px" }}>
                    {action?.icon}
                  </span>
                  <span style={{ fontSize: "16px" }}>{action?.label}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      )}
    </tr>
  );

  return (
    <div>
      {props?.headingText && (
        <Row className="align-items-end mb-3 mt-3">
          <Col xs="auto mb-3">
            <h5 className="fw-bold text-danger">{props?.titleName}</h5>
          </Col>
        </Row>
      )}
      <Divider
        style={{
          borderColor: "cadetblue",
          display: props?.lineVisibility ? "none" : "",
        }}
      />
      {props?.feedBackReportVisibility && (
        <div className="mt-3">
          <FeedbackReports
            reportsCategory={props?.reportsCategory}
            reportsStatus={props?.reportsStatus}
          />
        </div>
      )}

      <div
        className="d-flex align-items-end justify-content-between me-3 flex-wrap"
        style={{
          marginBottom: props.dateVisibility ? "30px" : "10px",
          marginTop: props?.marginTopTable ? "0px" : "24px",
        }}
      >
        {props?.DropdownVisibility && (
          <div className="mb-4 align-items-center row">
            <div className="col-md-6">
              <CustomDropdown
                dropdownLabelName={props.dropdown1LabelName || "Vendor Name"}
                options={props.allvendordata}
                valueKey="value"
                labelKey="label"
                selectedValue={props.selectedvendordata || ""}
                onChange={(e) => props.setselectedvendordata(e.target.value)}
                selectLevel={"Select Vendor"}
                Dropdownlable
                isDisable={false}
                mandatoryIcon={true}
              />
            </div>
            <div className="col-md-6">
              <CustomDropdown
                dropdownLabelName={props.dropdown2LabelName || "Company Name"}
                options={props.allcompanydata}
                valueKey="value"
                labelKey="label"
                selectedValue={props.selectedcompanydata || ""}
                onChange={(e) => props.setselectedcompanydata(e.target.value)}
                selectLevel={"Select Company"}
                Dropdownlable
                isDisable={false}
                mandatoryIcon={true}
              />
            </div>
          </div>
        )}

        {/* firstColumnVisibility code are start to here.. */}
        {props?.firstColumnVisibility && (
          <div className="d-flex align-items-end gap-2 flex-wrap">
            {/* select column Dropdown code here..... */}
            {props?.selectColumnData && (
              <MultiSelectDropdown
                data={props?.SelectData}
                valueKey="value"
                labelKey="label"
                // label="Pages"
                selectLabel={props?.SelectColumnValue || "Select Column"}
                value={props?.selectDataValue}
                handleCheckboxChange={props?.handleSelectBox}
              />
            )}

            {/* from and to date code here....... */}
            {props?.dateVisibility && (
              <div
                className="d-flex gap-2"
                style={{ marginBottom: props.dateVisibility ? "0px" : "0" }}
              >
                <div className="w-50">
                  <CustomInput
                    labelName="From Date"
                    type="date"
                    value={props?.fromDatesValue}
                    onChange={props?.formDatesChange}
                    mandatoryIcon
                  />
                </div>
                <div className="w-50">
                  <CustomInput
                    labelName="To Date"
                    type="date"
                    value={props?.toDatesValue}
                    onChange={props?.toDatesChange}
                    mandatoryIcon
                  />
                </div>
              </div>
            )}

            {props?.importIconVisiblity && (
              <div
                onClick={props?.excelupload}
                className="d-flex align-items-end gap-3"
              >
                <div className="w-50">
                  <CustomInput
                    type="file"
                    labelName="Upload Document"
                    value={props?.tofileValue}
                    ref={props?.ref}
                    mandatoryIcon
                    onChange={props?.tofileOnchange}
                  />
                </div>
                <div style={{ width: "20%" }}>
                  <CustomSingleButton
                    _ButtonText="Upload"
                    height={40}
                    width="100%"
                    onPress={props?.uploadOnpress}
                  />
                </div>
                { props.sampleTemplateVisibility && 
                (<div
                  style={{ cursor: "pointer" }}
                  onClick={props.handleSampleDownload}
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Sample Template"
                >
                  <FaDownload />
                </div>)}
              </div>
            )}
            {props?.exportIconVisiblity && (
              <div onClick={props?.exceldownload}>
                <img src="/images/download.svg" alt="" />
              </div>
            )}
            {/* Export To Excel button code here....... */}
            {props?.exportToExcelBtnVisiblity && (
              <div>
                <CustomSingleButton
                  _ButtonText="Export To Excel"
                  height={40}
                  // width="50%"
                  onPress={props?.handleExportExcel}
                />
              </div>
            )}
          </div>
        )}

        {/* search field code here....... */}
        <div className="d-flex gap-4 align-items-end flex-wrap mt-2">
          {props?.searchVisibility && (
            <div>
              <CustomInput
                type="text"
                placeholder={props?.placeholder}
                value={props?.fromDateValue}
                onChange={props?.toDateChange}
              />
            </div>
          )}
          {props?.morebtnVisibility && (
            <div>
              <CustomSingleButton
                _ButtonText={props.morebtnTitle}
                height={40}
                // width="50%"
                onPress={props?.morebtnClick}
              />
            </div>
          )}
          {/* add new button code here....... */}
          {props.buttonTitle ? (
            <div>
              {isRightSideButtonVisible ? (
                <CustomSingleButton
                  _ButtonText={props.buttonTitle}
                  height={40}
                  // width="50%"
                  onPress={props?.onPress}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {/* Table code here.....*/}
      {data?.length === 0 ? (
        <p className="text-center mt-5">
          {" "}
          <b>No Records Found</b>
        </p>
      ) : (
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
                {props?.enableCheckbox && (
                  <th className="text-white bg-danger">
                    <Form.Check
                      type="checkbox"
                      checked={props?.allSelected}
                      onChange={props?.MenuonHeaderCheckboxChange}
                    />
                  </th>
                )}
                {Object.keys(data[0])
                  .filter(
                    (key) =>
                      key !== "businessId" &&
                      key !== "company_id" &&
                      key !== "Id" &&
                      key !== "S.No" &&
                      key !== "vendorId" &&
                      key !== "modeId" &&
                      key !== "userId" &&
                      key !== "pettycashId" &&
                      key !== "Voucher Type Id" &&
                      key !== "compant_id" &&
                      key !== "status_id" &&
                      key !== "travel_id" &&
                      key !== "user_id" && 
                      key !== "Email" &&
                      key !== "Document" &&
                      key !== "Document_URL" &&
                      key !== "travel_details" &&
                      key !== "amounts" &&
                      key !== "department"
                  )
                  .map((key, index) => (
                    <th key={index} className="bg-danger p-2 text-white">
                      {formatHeader(key)}
                    </th>
                  ))}
                {props?.showStatusColumn && (
                  <th className="text-white bg-danger p-2">Status</th>
                )}
                {props?.downloadHeader && (
                  <th className="text-white bg-danger fixed-action-column p-2">
                    Download
                  </th>
                )}
                {props?.attachment && (
                  <th className="text-white bg-danger fixed-action-column p-2">
                    Attachment
                  </th>
                )}
                {props?.actionVisibility && (
                  <th
                    className={
                      props?.action_Style
                        ? "col-1 text-white bg-danger p-2"
                        : "text-white bg-danger fixed-action-column p-2"
                    }
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data
                ?.slice(
                  pageCount * rowsPerPage,
                  pageCount * rowsPerPage + rowsPerPage
                )
                .map((item, index) => renderRow(item, index))}
            </tbody>
          </Table>

          {/* Pagination controls */}
          <TablePagination
            component="div"
            count={props?.dataContained}
            page={pageCount}
            onPageChange={(event, newPage) => props.handlePageClick(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) =>
              handleItemsPerPageChange(event.target.value)
            }
            classes={{
              selectLabel: "custom-select-label",
              displayedRows: "custom-select-label",
            }}
          />
        </div>
      )}
    </div>
  );
};

CustomTable.defaultProps = {
  headingText: false,
  selectColumnData: false,
  enableCheckbox: false,
  dateVisibility: false,
  searchVisibility: false,
  exportToExcelBtnVisiblity: false,
  exportIconVisiblity: false,
  firstColumnVisibility: false,
  actionVisibility: false,
  morebtnVisibility: false,
  showStatusColumn: false,
  isRightSideButtonVisible: true,
  isEntireRowData: false,
  sampleTemplateVisibility: false
};

export default CustomTable;
