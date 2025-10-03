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
import {
  deleteMumAdmin,
  fetchDropdownData,
  getMumAdmin,
} from "../../../Slices/AMC/AMCSlice";
import { FaEdit, FaFileDownload, FaTrash } from "react-icons/fa";
import ExportAMCAdmin from "../../../Components/Excel-JS/ExportAMCAdmin";
import DeleteAlert from "../../../Components/Validations/DeleteAlert";
import CustomInput from "../../../Components/CustomInput/CustomInput";

const MumAdminAmc = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({
    type: "",
    service_sch: "",
    startdate: null,
    enddate: null
  });
  const loading = useSelector((state) => state.AMC.status === "loading");
  const { mumAdmin, typeDropdown, serviceSchedule } = useSelector(
    (state) => state.AMC
  );
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = mumAdmin?.data?.data;
  const filteredData = data?.map(
    ({ BudgetDetails, Document_URL, ...rest }) => rest
  );
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
  ];

  const { Mum_Admin_AMC } = permissionDetailData.data || {};

  useEffect(() => {
    fetchDetails();
  }, [filter]);

  useEffect(() => {
    dispatch(
      fetchDropdownData({ id: "AMC_TYPE", type: "AMC", key: "typeDropdown" })
    );
    dispatch(
      fetchDropdownData({
        id: "SERVICE_SCH",
        type: "AMC",
        key: "serviceSchedule",
      })
    );
  }, [dispatch]);

  const handleFormChange = useCallback((name, value) => {
    setFilter((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleAddNewClick = () => {
    navigate("/addMumAdminAmc");
  };

  const handleEdit = async (item) => {
    const id = item["ID"];
    const data = {
      id: id,
      type: "editMode",
    };
    await navigate("/addMumAdminAmc", { state: data });
  };
  const handleDelete = async (item) => {
    const id = item["ID"];
    DeleteAlert({
      onDelete: async () => {
        const response = await dispatch(deleteMumAdmin(id));
        if (response.payload.statusCode === 200) {
          toast.success(response.payload.data.data[0].result);
          fetchDetails();
        }
      },
    });
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const fetchDetails = async () => {
    await dispatch(getMumAdmin(filter));
  };

  const handleExport = () => {
    if (data.length > 0) {
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      ExportAMCAdmin(data, `AMC Mum Admin-${formattedDate}`);
    }
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
      <Card className="border-0">
        <Title title="Admin AMC" />
        <Row className="mt-3 justify-content-around">
          <Col md={3}>
            <CustomInput
              labelName="Start Date"
              type="date"
              value={filter.startdate}
              onChange={(event) =>
                handleFormChange("startdate", event.target.value)
              }
              isMax={filter.enddate}
            />
          </Col>
          <Col md={3}>
            <CustomInput
              labelName="End Date"
              type="date"
              value={filter.enddate}
              onChange={(event) =>
                handleFormChange("enddate", event.target.value)
              }
              isMin={filter.startdate}
            />
          </Col>
          <Col md={3} sm={6} xs={12}>
            <CustomDropdown
              dropdownLabelName="AMC Type"
              labelKey="label"
              valueKey="value"
              options={[
                { label: "Select Type", value: "" },
                ...(typeDropdown || null),
              ]}
              selectedValue={filter.type}
              onChange={(e) => handleFormChange("type", e.target.value)}
            />
          </Col>
          <Col md={3} sm={6} xs={12}>
            <CustomDropdown
              dropdownLabelName="Service Schedule:"
              labelKey="label"
              valueKey="value"
              options={[
                { label: "Select Schedule", value: "" },
                ...(serviceSchedule || []),
              ]}
              selectedValue={filter.service_sch}
              onChange={(e) => handleFormChange("service_sch", e.target.value)}
            />
          </Col>
          <Row className="mt-3 justify-content-between">
            <Col md={2} sm={6} xs={12} style={{ marginTop: "30px" }}>
              <CustomSingleButton
                _ButtonText="Export To Excel"
                height={40}
                onPress={handleExport}
              />
            </Col>
            <Col md={2} sm={6} xs={12} style={{ marginTop: "30" }}>
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
          dataContained={data?.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          actionVisibility={true}
          actions={actions}
          //   clickableColumns={["Ticket ID"]}
          //   onColumnClick={(id) => handleEdit(id)}
          marginTopTable={true}
          lineVisibility={true}
          specialColumns={["Vendor", "Entity", "AMC Status", "ID"]}
        />
      </Card>
    </Row>
  );
};
export default MumAdminAmc;
