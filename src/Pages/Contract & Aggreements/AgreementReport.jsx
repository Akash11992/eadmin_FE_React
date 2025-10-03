import React, { useState } from "react";
import { Dropdown, Row, Form, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import AgreementReportTable from "./AgreementReportTable";
import { Title } from "../../Components/Title/Title";
import CustomTable from "../../Components/CustomeTable/CustomTable";
const AgreementReport = () => {
  const [value, setValue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const data = [
    {
      "S.No": 1,
      "Upload By": "xyz",
      Date: "01/05/2024",
      "Agreement Type": "xyz",
    },
  ];

  const allData = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];
  const allPaginationData = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ];

  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <CustomTable
        data={data}
        titleName="Agreement Report Table"
        headingText={true}
        setValue={setValue}
        SelectColumnData={allData}
        SelectColumnValue={value}
        selectedRows={selectedRows}
        allSelected={allSelected}
        SelectColumnLable="Filter"
        selectColumnData={true}
        paginationDropDown={true}
        paginationvalueName="Show"
        paginationlabelName="rahul"
        paginationDataValue={allPaginationData}
        dataContained={data?.length}
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AgreementReport;
