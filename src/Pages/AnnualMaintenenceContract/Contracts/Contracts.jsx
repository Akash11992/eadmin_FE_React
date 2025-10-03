import React, { useEffect, useCallback, useState } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import {
  deleteContract,
  fetchDropdownData,
  getContract,
} from "../../../Slices/AMC/AMCSlice";
import { FaEdit, FaFileDownload } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import DeleteAlert from "../../../Components/Validations/DeleteAlert";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";

const Contracts = () => {
  const [filter, setFilter] = useState({
    vendor: null,
    serviceType: null,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.AMC.status === "loading");
  const { contract, vendor, serviceType } = useSelector((state) => state.AMC);
  const data = contract?.data?.data;

  const filteredData = data?.map(
    ({ Document_URL, Document, ...rest }) => rest
  );
  useEffect(() => {
    fetchDetails();
  }, [filter]);

  useEffect(() => {
    dispatch(
      fetchDropdownData({ id: "VENDOR", type: "VENDOR", key: "vendor" })
    );
    dispatch(
      fetchDropdownData({ id: "SERVICE_TYPE", type: "AMC", key: "serviceType" })
    );
  }, [dispatch]);

  const fetchDetails = async () => {
    await dispatch(getContract(filter));
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
    await navigate("/addContracts", { state: data });
  };
  const handleDelete = async (item) => {
    const id = item["ID"];
    DeleteAlert({
      onDelete: async () => {
        const response = await dispatch(deleteContract(id));
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
  const { Contracts } = permissionDetailData.data || {};

  const handleAddNewClick = () => {
    navigate("/addContracts");
  };

  const handleExport = () => {
    if (filteredData?.length > 0) {
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      ExportToXLSX(filteredData, `Contract Details -${formattedDate}`);
    } else {
      toast.warning("No data available to export");
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
        <Title title="Contracts" />
        <Row className="mt-4 justify-content-around">
          <Col md={3} className=" ">
            <CustomDropdown
              dropdownLabelName="Vendor Name"
              labelKey="label"
              valueKey="value"
              options={[{ label: "Select", value: "" }, ...(vendor || [])]}
              selectedValue={filter.vendor}
              onChange={(e) => handleFormChange("vendor", e.target.value)}
            />
          </Col>
          <Col md={3} className="">
            <CustomDropdown
              dropdownLabelName="Type of Service:"
              labelKey="label"
              valueKey="value"
              options={[{ label: "Select", value: "" }, ...(serviceType || [])]}
              selectedValue={filter.serviceType}
              onChange={(e) => handleFormChange("serviceType", e.target.value)}
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
          dataContained={filteredData?.length}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          actionVisibility={true}
          actions={actions}
          //   clickableColumns={["Ticket ID"]}
          onColumnClick={(id) => handleEdit(id)}
          marginTopTable={true}
          lineVisibility={true}
          // onPress={handleAddNew}
          // buttonTitle={"Add New"}
        />
      </Card>
    </Row>
  );
};
export default Contracts;
