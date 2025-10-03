import React, { useState } from "react";
import { Row, Col, Container, ToastContainer, Button } from "react-bootstrap";
import CustomInput from "../../../../../../Components/CustomInput/CustomInput";
import { Card } from "@mui/material";
// import CustomSingleButton from "../../../../../../Components/CustomSingleButton/CustomSingleButton";
import { useNavigate } from "react-router-dom";
import { Title } from "../../../../../../Components/Title/Title";
import CustomTable from "../../../../../../Components/CustomeTable/CustomTable";
import CustomSingleButton from "../../../../../../Components/CustomSingleButton/CustomSingleButton";
import AddNewApproval from "./AddNewApproval";

const ApprovalWorkflow = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const data = [
    {
      SrNo: 1,
      Module: "AUTO56789",
      Page: "Ambit Office Lease",
      LevelOfApproval: 2,
    },
    {
      SrNo: 2,
      ContractWise: "AUTO56789",
      Pages: "License",
      LevelofApprovalRequired: 2,
    },
  ];

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const actions = [
    {
      label: "Edit",
      // onClick: (item) => handleAllocate(item),
    },
    {
      label: "Delete",
      // onClick: (item) => handleDelete(item),
    },
  ].filter((action) => action !== null);

  return (
    <Card className="dashboard me-1 ms-1">
      <AddNewApproval />{" "}
      <Row className="">
        {/* <Col md={3}>
          <CustomInput type="input" placeholder="Search" />
        </Col> */}
        <Col md={12} className="">
          <Button variant="dark" type="submit">
            Save
          </Button>{" "}
          <Button variant="danger" type="reset">
            Cancel
          </Button>{" "}
        </Col>
      </Row>
      <CustomTable
        data={data}
        paginationDropDown={false}
        dataContained={data?.length}
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
        actionVisibility={true}
        actions={actions}
        marginTopTable={true}
        lineVisibility={true}
      />
    </Card>
  );
};

export default ApprovalWorkflow;
