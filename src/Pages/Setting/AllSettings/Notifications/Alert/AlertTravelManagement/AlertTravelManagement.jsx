import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../../../../../Components/CustomeTable/CustomTable";
import { FaDownload, FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import {
  deleteAlertTravelbyID,
  getAlertTravel,
  getAlertTravelbyID,
  insertAlertTravel,
} from "../../../../../../Slices/Alert/AlertTravelManagement/AlertTravelManagementSlice";
import AlertForm from "./AlertForm";
import DeleteAlert from "../../../../../../Components/Validations/DeleteAlert";

const AlertTravelManagement = () => {
  const [formData, setFormData] = useState({
    company: "",
    department: [],
    subDepartment: "",
    frequency: "",
    vendor: [],
    business: null,
    to: "",
    cc: "",
    id: null,
    action: null,
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useDispatch();
  const { alertTravelDetails, alertTravelDetailsById } = useSelector(
    (state) => state.AlertTravelManagement
  );
  const idDetails =
    Array.isArray(alertTravelDetailsById?.data) &&
    alertTravelDetailsById?.data.length > 0
      ? alertTravelDetailsById.data[0]
      : null;

  console.log(idDetails, "byID");
  useEffect(() => {
    if (idDetails) {
      setFormData({
        company: idDetails.company,
        department: idDetails.department?.split(",")
        .map((id) => id.trim())
        .filter(Boolean) || [],
        subDepartment: '',
        frequency: "",
        vendor: idDetails.vendor?.split(",").map((id) => id.trim()) || [], // Ensure it's an array
        business: idDetails.business,
        to: idDetails.to,
        cc: idDetails.cc,
        id: idDetails.id,
        action: null,
      });
    } else {
      setFormData({
        company: "",
        department: [],
        subDepartment: "",
        frequency: "",
        vendor: [],
        business: "",
        to: "",
        cc: "",
        id: null,
        action: null,
      });
    }
  }, [idDetails]);
  const handleFormChange = useCallback((name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    if (value.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        [type]: checked
          ? [...prev[type], value]
          : prev[type].filter((item) => item !== value),
      }));
    }
  };
  

  const handleSave = async (e) => {
    e.preventDefault();
    const response = await dispatch(insertAlertTravel(formData));
    if (response.payload.statusCode === 400) {
      toast.warning(response.payload.data.message);
      return;
    }
    if (response.payload.statusCode === 200) {
      toast.success(response.payload.data.insertTravelAlert[0].result);
      fetchAlertDetails();
      setFormData({
        company: "",
        department: [],
        subDepartment: "",
        frequency: "",
        vendor: [],
        business: "",
        to: "",
        cc: "",
        id: null,
        action: null,
      });
      return;
    }
    if (response.payload.statusCode === 500) {
      toast.error(response.payload.data.message || "Failed to Insert Details");
      return;
    }
  };

  useEffect(() => {
    fetchAlertDetails();
  }, []);

  const fetchAlertDetails = async () => {
    await dispatch(getAlertTravel());
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
      label: "Attachment",
      icon: <FaDownload />,
      onClick: (item) => handleDelete(item),
    },
  ];

  const handleEdit = async (item) => {
    // alert(`Editing item: ${item["Alert Id"]}`);
    const id = item["Alert Id"];
    const payload = {
      id: id,
    };
    await dispatch(getAlertTravelbyID(payload));
    setFormData((prevState) => ({
      ...prevState,
      action: "edit",
    }));
  };

  const handleDelete = (item) => {
    setFormData((prevState) => ({
      ...prevState,
      action: "delete",
      id: item["Alert Id"],
    }));

    DeleteAlert({
      onDelete: async () => {
        const response = await dispatch(
          deleteAlertTravelbyID(item["Alert Id"])
        );
        if (response.payload.statusCode === 200) {
          toast.success(response.payload.data.data[0].result);
          fetchAlertDetails();
        }
      },
    });
  };

  const handleAction = () => {
    alert("Work under Progress...");
  };

  const download = () => [alert("work in progress..")];
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />

      <AlertForm
        formData={formData}
        handleFormChange={handleFormChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSave={handleSave}
        setFormData={setFormData}
      />

      <CustomTable
        data={alertTravelDetails?.data}
        firstColumnVisibility={true}
        dataContained={alertTravelDetails?.data?.length}
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
        onRowCheckboxChange={handleAction}
        downloadData={download}
        actions={actions}
        actionVisibility={true}
        marginTopTable={true}
        lineVisibility={true}
      />
    </div>
  );
};

export default AlertTravelManagement;
