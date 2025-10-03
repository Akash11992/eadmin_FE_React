import React, { useCallback, useEffect, useState } from "react";
import InvoiceForm from "./InvoiceForm";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReconcileTravelfile,
  getReconcileTravelfile,
  insertReconcileTravel,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { toast, ToastContainer } from "react-toastify";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import DeleteAlert from "../../../Components/Validations/DeleteAlert";
import useDownloader from "react-use-downloader";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";

const UploadInvoice = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [form, setForm] = useState({
    type: "",
    vendor: "",
    fromDate: "",
    endDate: "",
    file: null,
    reportType:""
  });

  const dispatch = useDispatch();
  const { download } = useDownloader();

  const { reconcileFileDetails } = useSelector(
    (state) => state.TravelManagement
  );
  const loading = useSelector(
    (state) => state.TravelManagement.status === "loading"
  );
  const data = reconcileFileDetails?.data?.data;

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    await dispatch(getReconcileTravelfile(null));
  };

  const handleForm = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const actions = [];

  actions.push({
    label: "Download File",
    onClick: (item) => handleDownload(item),
  });

  actions.push({
    label: "Delete",
    onClick: (item) => handleDelete(item),
  });

  const handleDownload = async (item) => {
    download(item.Document_URL, item.Document);
  };

  const handleDelete = (item) => {
    DeleteAlert({
      onDelete: async () => {
        const response = await dispatch(deleteReconcileTravelfile(item.ID));
        if (response.payload.statusCode === 200) {
          toast.success(response.payload.data.data[0].result);
          getDetails();
        }
      },
    });
  };

  const HandleUpload = async () => {
    const formData = new FormData();
    formData.append("attachment", form.file);
    formData.append("type", form.type);
    formData.append("vendor", form.vendor);
    formData.append("fromDate", form.fromDate);
    formData.append("endDate", form.endDate);
    try {
      const response = await dispatch(insertReconcileTravel(formData));
      if (response.payload.statusCode === 400) {
        toast.warning(response.payload.data.message);
      }
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.result.result);
        setForm({
          type: "",
          vendor: "",
          fromDate: "",
          endDate: "",
          file: null,
        });
        getDetails();
      }
      if (response.payload.statusCode === 500) {
        toast.error("Error While Uploading File..");
      }
    } catch (error) {}
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <InvoiceForm
        form={form}
        handleForm={handleForm}
        HandleUpload={HandleUpload}
      />
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
      {loading && <CommonLoader />}
    </>
  );
};

export default UploadInvoice;
