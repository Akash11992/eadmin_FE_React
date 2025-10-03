import React, { useCallback, useEffect, useState } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { Col, Card, Row } from "react-bootstrap";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../Components/Title/Title";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaFileDownload, FaTrash } from "react-icons/fa";
import {
  deleteOfficeLease,
  fetchDropdownData,
  getOfficeLease,
} from "../../../Slices/AMC/AMCSlice";
import { getCompanyList } from "../../../Slices/Commondropdown/CommondropdownSlice";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import ExportAMCOfficeLease from "../../../Components/Excel-JS/ExportAMCOfficeLease";
import { toast, ToastContainer } from "react-toastify";
import DeleteAlert from "../../../Components/Validations/DeleteAlert";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";

const AmbitOfficeLease = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState({
    entity: null,
    propType: null,
  });
  const loading = useSelector((state) => state.AMC.status === "loading");
  const { officeLease, propertyType } = useSelector((state) => state.AMC);
  const { companyList } = useSelector((state) => state.CommonDropdownData);

  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = officeLease?.data?.data;
  const filteredData = data?.map(({ rentDetails, Document_URL, Document, ...rest }) => rest);
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

  useEffect(() => {
    dispatch(
      fetchDropdownData({
        id: "PROPERTY_TYPE",
        type: "AMC",
        key: "propertyType",
      })
    );
    dispatch(getCompanyList());
  }, [dispatch]);

  useEffect(() => {
    fetchDetails();
  }, [filter]);

  const fetchDetails = async () => {
    await dispatch(getOfficeLease(filter));
  };

  const handleFormChange = useCallback((name, value) => {
    setFilter((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleAddNewClick = () => {
    navigate("/addambitOfficeLease"); // Navigate to the desired path
  };
  const handleEdit = async (item) => {
    const id = item["ID"];
    const data = {
      id: id,
      type: "editMode",
    };
    await navigate("/addambitOfficeLease", { state: data });
  };
  const handleDownload = (item) => {
    const file = data?.find((d) => d.ID === item.ID);
    if (file.Document_URL) {
      window.open(file.Document_URL, "_blank");
    } else {
      toast.info("Document Not Available");
    }
  };
  const handleDelete = async (item) => {
    const id = item["ID"];
    DeleteAlert({
      onDelete: async () => {
        const response = await dispatch(deleteOfficeLease(id));
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
  const companyData = companyList?.data || [];

  const handleExport = async () => {
    if (data?.length > 0) {
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      await ExportAMCOfficeLease(data, `Office Lease-${formattedDate}`);
    } else {
      toast.warning("Record Not Found");
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
        <Title title="Ambit Office Lease" />
        <Row className="mt-4 justify-content-around">
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Property Type:"
              labelKey="label"
              valueKey="value"
              options={[
                { label: "Select Property Type", value: "" },
                ...(propertyType || []),
              ]}
              selectedValue={filter.propType}
              onChange={(e) => handleFormChange("propType", e.target.value)}
            />{" "}
          </Col>
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Entity"
              labelKey="company_name"
              valueKey="company_id"
              options={[
                { company_id: "", company_name: "Select company" },
                ...companyData,
              ]}
              selectedValue={filter.entity}
              onChange={(e) => handleFormChange("entity", e.target.value)}
            />
          </Col>
          <Col md={2} className="mt-4 p-2">
            <CustomSingleButton
              _ButtonText="Export To Excel"
              height={40}
              onPress={handleExport}
            />
          </Col>
          <Col md={2} className="mt-4 p-2">
            <CustomSingleButton
              _ButtonText="Add New"
              height={40}
              onPress={handleAddNewClick}
            />
          </Col>
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
          clickableColumns={["Ticket ID"]}
          onColumnClick={(id) => handleEdit(id)}
          marginTopTable={true}
          lineVisibility={true}
          specialColumns={["Address", "Entity", "ID"]}
        />
      </Card>
    </Row>
  );
};
export default AmbitOfficeLease;
