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
import Swal from "sweetalert2";
import { hanldePinCodeDelete } from "../../../../Slices/CourierSevices/CourierSevicesSlice";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";

const ManagePinCode = () => {
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

  useEffect(() => {
    getAllPinCode();
  }, []);

  const getAllPinCode = async () => {
    setLoading(true);
    await dispatch(getPinCodes());
    setLoading(false);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const mappedPinCodeData = pinCodeData?.map((user, index) => ({
    "S no": index + 1,
    Pincode: user?.Pincode,
    Destination: user.destination,
    State: user?.State,
    IntlDomLoc: user?.Product,
    Id:user?.pincode_id
    // "Created Date": new Date(user.createdAt).toLocaleString(),
  }));

  const filteredData = mappedPinCodeData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  
  // handle delete function code here....
  const handlePinCodeeDelete = async (Pincode) => {

    const payload = {
      Pincode: Pincode,
    };
    const response = await dispatch(hanldePinCodeDelete(payload));
    console.log("response", response);
    if (hanldePinCodeDelete.fulfilled.match(response)) {
      if (response?.payload?.StatusCode === 200) {
        console.log('response?.payload?.message',response?.payload?.message)
        toast?.success(response?.payload?.message);
        getAllPinCode();
      }
    } else if (hanldePinCodeDelete.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleDelete = (Pincode) => {
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
        handlePinCodeeDelete(Pincode);
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
      onClick: (item) => handleDelete(item.Pincode),
    },
  ];

  const handleEdit = (item) => {
    // alert(JSON.stringify(item));
    navigate("/editPinCode", { state: { pinData: item } });
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Pincode");
      const currentDate = new Date().toISOString().split("T")[0];
      const fileName = `Pincode Master - ${currentDate}.xlsx`;

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
        <Title title="PinCode Master" />
      </Row>
      {loading ? (
        <CommonLoader />
      ) : (
        <CustomTable
          data={filteredData || []}
          // titleName="User Management"
          exportIconVisibility="true"
          // headingText={true}
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
          buttonTitle={"+ Add New Pincode"}
          actionVisibility={true}
          onRowCheckboxChange={() => {}}
          // clickableColumns={["id"]}
          // isClickable={true}
          // onColumnClick={(key) => console.log(`Column clicked: ${key}`)}
          actions={actions}
          onPress={() => {
            navigate("/editPinCode");
          }}
          action_Style={true}
          // exportIconVisiblity={true}
          exportToExcelBtnVisiblity={true}
          handleExportExcel={() => handleExportExcel(filteredData)}
        />
      )}
    </div>
  );
};

export default ManagePinCode;
