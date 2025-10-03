import React, { useEffect, useState } from "react";
import { Title } from "../../../../Components/Title/Title";
import { Row } from "react-bootstrap";
import { getPinCodes } from "../../../../Slices/CompanyDetails/CompanyDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../../../Components/CustomeTable/CustomTable";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import {
  deleteCourierAccountCode,
  getCompanyDetailsByAccount,
} from "../../../../Slices/CourierSevices/CourierSevicesSlice";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const AccountCodeMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  const pinCodeData = useSelector(
    (state) => state.companyDetail?.pinCodeList || []
  );
  const CourierAccountCode = useSelector(
    (state) => state.CourierService.companybyaccount?.data || []
  );

  useEffect(() => {
    getAllCode();
  }, []);

  const getAllCode = async () => {
    setLoading(true);
    await dispatch(getCompanyDetailsByAccount());
    setLoading(false);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const mappedAccountCodeData = CourierAccountCode?.map((user, index) => ({
    "id": index + 1,
    CourierAccountCode: user?.AccountNo,
    CompanyName: user?.CompanyName,
    // "createdBy": user?.created_by,
    // "Created Date": new Date(user.createdAt).toLocaleString(),
  }));

  const filteredData = mappedAccountCodeData?.filter((item) =>
    // Object.values(item).some((value) =>
    //   String(value).toLowerCase().includes(searchTerm.toLowerCase())
    // )
    Object.values(item).some((value) => {
      // Convert each value to a string, and handle null/undefined cases.
      const stringValue = value ? String(value).trim().toLowerCase() : '';
      return stringValue.includes(searchTerm.toLowerCase());
    })
  );

  // handle delete function code here....
  const handlePinCodeeDelete = async (item) => {
    console.log("item", item);
    const payload = {
      AccountNo: item.CourierAccountCode,
    };
    const response = await dispatch(deleteCourierAccountCode(payload));
    console.log("response", response);
    if (deleteCourierAccountCode.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        console.log("response?.payload?.message", response?.payload?.message);
        toast?.success(response?.payload?.message);
        getAllCode();
      }
    } else if (deleteCourierAccountCode.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "black",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "custom-popup",
        title: "custom-title",
        content: "custom-content",
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handlePinCodeeDelete(item);
      }
    });
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
  ];

  const handleEdit = (item) => {
    // alert(JSON.stringify(item));
    navigate("/editAccountCodeMaster", { state: { pinData: item } });
  };

  // handle download code...
  const handleExportExcel = (data) => {
    if (!data || data.length === 0) {
      toast.warning("No Records Found");
      return;
    }
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "AccountCode");
      const currentDate = new Date().toISOString().split("T")[0];
      const fileName = `AccountCode Master - ${currentDate}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      toast.error("Failed to export Excel file. Please try again.");
    }
  };
  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row className="mt-3 ms-0">
        <Title title="Courier Account Code Master" />
      </Row>
      {loading ? (
        <CommonLoader />
      ) : (
        <CustomTable
          data={filteredData || []}
          exportIconVisibility="true"
          searchVisibility={true}
          placeholder={"Search..."}
          toDateChange={(e) => setSearchTerm(e.target.value)}
          setValue={setValue}
          SelectColumnValue={value}
          selectedRows={selectedRows}
          firstColumnVisibility={true}
          dataContained={filteredData?.length || 0}
          pageCount={page}
          handlePageClick={handleChangePage}
          rowsPerPage={rowsPerPage}
          handleItemsPerPageChange={handleChangeRowsPerPage}
          buttonTitle={"+ Add New Code"}
          actionVisibility={true}
          onRowCheckboxChange={() => {}}
          actions={actions}
          onPress={() => {
            navigate("/editAccountCodeMaster");
          }}
          action_Style={true}
          exportToExcelBtnVisiblity={true}
          handleExportExcel={() => handleExportExcel(filteredData)}
        />
      )}
    </div>
  );
};

export default AccountCodeMaster;
