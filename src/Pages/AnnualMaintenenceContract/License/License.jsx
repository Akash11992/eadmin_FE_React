import React, { useEffect, useCallback, useState } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { Card, Col, Row } from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { FaEdit, FaFileDownload, FaTrash } from "react-icons/fa";
import {
  deleteLicense,
  fetchDropdownData,
  getLicenses,
} from "../../../Slices/AMC/AMCSlice";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import DeleteAlert from "../../../Components/Validations/DeleteAlert";

const License = () => {
  const [filter, setFilter] = useState({
    fromDate: null,
    toDate: null,
    licenseType: null,
    regionWard: null,
    period: null,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.AMC.status === "loading");
  const { licenses, licenseType, regionWard, licensePeriod } = useSelector(
    (state) => state.AMC
  );
  const data = licenses?.data?.data;
  const filteredData = data?.map(({ Document_URL, Document, ...rest }) => rest);
  useEffect(() => {
    fetchDetails();
  }, [filter]);

  useEffect(() => {
    dispatch(
      fetchDropdownData({ id: "LICENSE_TYPE", type: "AMC", key: "licenseType" })
    );
    dispatch(
      fetchDropdownData({
        id: "REGION_WARD",
        type: "AMC",
        key: "regionWard",
      })
    );
    dispatch(
      fetchDropdownData({
        id: "LICENSE_PERIOD",
        type: "AMC",
        key: "licensePeriod",
      })
    );
  }, [dispatch]);
  const fetchDetails = async () => {
    if (filter.fromDate && !filter.toDate) {
      toast.warning("Please enter To Date");
      return;
    }
    if (filter.toDate && !filter.fromDate) {
      toast.warning("Please enter From Date");
      return;
    }
    await dispatch(getLicenses(filter));
  };
  const actions = [
    {
      label: "Edit",
      icon: <FaEdit />,
      onClick: (item) => handleEdit(item),
    },
    {
      label: "Delete",
      icon: <FaTrash />,
      onClick: (item) => handleDelete(item),
    },
    {
      label: "View Document",
      icon: <FaFileDownload />,
      onClick: (item) => handleDownload(item),
    },
  ];

  const handleFormChange = useCallback((name, value) => {
    setFilter((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const handleEdit = async (item) => {
    const id = item["ID"];
    const data = {
      id: id,
      type: "editMode",
    };
    await navigate("/addlicense", { state: data });
  };
  const handleDelete = async (item) => {
    const id = item["ID"];
    DeleteAlert({
      onDelete: async () => {
        const response = await dispatch(deleteLicense(id));
        if (response.payload.statusCode === 200) {
          toast.success(response.payload.data.data[0].result);
          fetchDetails();
        }
      },
    });
  };

  const handleDownload = (item) => {
    const file = data?.find((d) => d.ID === item.ID);
    if (file.Document_URL) {
      window.open(file.Document_URL, "_blank");
    } else {
      toast.info("Document Not Available");
    }
  };
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { License } = permissionDetailData.data || {};

  const handleAddNewClick = () => {
    navigate("/addlicense");
  };

  const handleExport = () => {
    if (filteredData?.length > 0) {
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      ExportToXLSX(filteredData, `License Details -${formattedDate}`);
    } else {
      toast.warning("No data available to export");
    }
  };
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      {loading && <CommonLoader />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Card className="border-0">
        <Title title="License" />
        <Row className="mt-4 justify-content-around">
          <Col md={2} className="p-0">
            <CustomInput
              labelName="From Date"
              type="date"
              isMax={filter.toDate}
              value={filter.fromDate}
              onChange={(e) => handleFormChange("fromDate", e.target.value)}
            />
          </Col>
          <Col md={2}>
            <CustomInput
              labelName="To Date"
              type="date"
              isMin={filter.fromDate}
              value={filter.toDate}
              onChange={(e) => handleFormChange("toDate", e.target.value)}
            />
          </Col>
          <Col md={2}>
            <CustomDropdown
              dropdownLabelName="License Type"
              labelKey="label"
              valueKey="value"
              options={[{ label: "Select", value: "" }, ...(licenseType || [])]}
              selectedValue={filter.licenseType}
              onChange={(e) => handleFormChange("licenseType", e.target.value)}
            />
          </Col>
          <Col md={2}>
            <CustomDropdown
              dropdownLabelName="Region and Ward"
              labelKey="label"
              valueKey="value"
              options={[{ label: "Select", value: "" }, ...(regionWard || [])]}
              selectedValue={filter.regionWard}
              onChange={(e) => handleFormChange("regionWard", e.target.value)}
            />
          </Col>
          <Col md={2} className="p-0">
            <CustomDropdown
              dropdownLabelName="Period"
              labelKey="label"
              valueKey="value"
              options={[
                { label: "Select", value: "" },
                ...(licensePeriod || []),
              ]}
              selectedValue={filter.period}
              onChange={(e) => handleFormChange("period", e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Row className="justify-content-between">
            <Col md={2} className="mt-4">
              <CustomSingleButton
                _ButtonText="Export To Excel"
                height={40}
                onPress={handleExport}
              />
            </Col>
            <Col md={2} className="mt-4" style={{ marginLeft: "244px" }}>
              <CustomSingleButton
                _ButtonText="Add New"
                height={40}
                onPress={handleAddNewClick}
              />
            </Col>
          </Row>
        </Row>
        <CustomTable
          data={filteredData}
          paginationDropDown={false}
          dataContained={filteredData?.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          actionVisibility={true}
          actions={actions}
          onColumnClick={(id) => handleEdit(id)}
          marginTopTable={true}
          lineVisibility={true}
          specialColumns={["License Type",'Name Of Govt. Agency','License Number','Remark',"ID"]}
        />
      </Card>
    </div>
  );
};
export default License;