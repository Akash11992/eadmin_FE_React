import React, { useState, useEffect } from "react";
import CustomInput from "../../../../../Components/CustomInput/CustomInput";
import CustomTable from "../../../../../Components/CustomeTable/CustomTable";
import { Col, Row, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomSingleButton from "../../../../../Components/CustomSingleButton/CustomSingleButton";
import MultiSelectDropdown2 from "../../../../../Components/CustomDropdown/MultiSelectDropdown2";
import { Title } from "../../../../../Components/Title/Title";
import { getActivityLog } from "../../../../../Slices/ActivityReport/ActivityReportSlice";
import {
  getPageList,
  getModuleList,
} from "../../../../../Slices/Role/RoleSlice";

const ActivityReport = () => {
  const [formData, setFormData] = useState({
    formDate: "",
    toDate: "",
    moduleType: [],
    pageType: [],
  });
  const [value, setValue] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableContent, setTableContent] = useState([]);
  const [title, setTitle] = useState("Templates Audit Report");
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const dispatch = useDispatch();

  const moduleListData = useSelector(
    (state) => state.Role.moduleList?.data || []
  );
  const pageListData = useSelector((state) => state.Role.pageList?.data || []);

  useEffect(() => {
    dispatch(getModuleList());
  }, [dispatch]);

  useEffect(() => {
    if (formData.moduleType.length > 0) {
      dispatch(getPageList({ module_ids: formData.moduleType }));
    }
  }, [formData.moduleType, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChangeModules = (e) => {
    setFormData((prev) => ({
      ...prev,
      moduleType: e.value,
    }));
  };

  const handleCheckboxChangePages = (e) => {
    setFormData((prev) => ({
      ...prev,
      pageType: e.value,
    }));
  };

  const modules = moduleListData.map((module) => ({
    value: module.module_id,
    label: module.module_name,
  }));

  const pages =
    formData.moduleType.length > 0
      ? pageListData.map((page) => ({
          value: page.form_id,
          label: page.form_name,
        }))
      : [];

  const handleSearch = () => {
    const payload = {
      from_date: formData.formDate,
      to_date: formData.toDate,
      module_ids: formData.moduleType,
      page_ids: formData.pageType,
    };

    dispatch(getActivityLog(payload))
      .unwrap()
      .then((response) => {
        setTableContent(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching activity log:", error);
      });
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row className="mt-3 ms-0">
        <Title title="Activity Report" />
      </Row>
      <hr />
      <Row>
        <Col md={2}>
          <CustomInput
            labelName="From Date"
            type="date"
            value={formData.formDate}
            name="formDate"
            onChange={handleInputChange}
          />
        </Col>
        <Col md={2}>
          <CustomInput
            labelName="To Date"
            type="date"
            value={formData.toDate}
            name="toDate"
            onChange={handleInputChange}
          />
        </Col>
        <Col md={4}>
          <MultiSelectDropdown2
            label="Module"
            value={formData.moduleType}
            onChange={handleCheckboxChangeModules}
            options={modules}
            optionLabel="label"
            placeholder="Select Module"
          />
        </Col>
        <Col md={4}>
          <MultiSelectDropdown2
            label="Pages"
            value={formData.pageType}
            onChange={handleCheckboxChangePages}
            options={pages}
            optionLabel="label"
            placeholder="Select Pages"
          />
        </Col>
        <Col md={2} className="align-content-end mb-4 mt-4">
          <CustomSingleButton
            _ButtonText={"Search"}
            height={40}
            onPress={handleSearch}
          />
        </Col>
      </Row>
      <Row className="m-0">
        {tableContent.length === 0 ? (
          <Container className="border text-center">No Records Found</Container>
        ) : (
          <CustomTable
            data={tableContent.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )}
            setValue={setValue}
            SelectColumnValue={value}
            selectedRows={selectedRows}
            allSelected={allSelected}
            firstColumnVisibility={true}
            dataContained={tableContent?.length || []}
            pageCount={page}
            handlePageClick={handleChangePage}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Row>
    </div>
  );
};

export default ActivityReport;
