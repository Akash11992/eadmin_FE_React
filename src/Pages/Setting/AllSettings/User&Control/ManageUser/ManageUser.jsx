import React, { useState, useEffect } from "react";
import CustomTable from "../../../../../Components/CustomeTable/CustomTable";
import { useNavigate } from "react-router-dom";
import {
  getUserList,
  deleteUserDetails,
} from "../../../../../Slices/ManageUserSlice/ManageUserSlice";
import CommonLoader from "../../../../../Components/CommonLoader/CommonLoader";
import { useDispatch, useSelector } from "react-redux";
import { ExportToXLSX } from "../../../../../Components/Excel-JS/ExportToXLSX";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { getUserById } from "../../../../../Slices/ManageUserSlice/ManageUserSlice";

const ManageUser = () => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userListData = useSelector((state) => state?.ManageUser?.UserList);
  const allUserData = userListData?.data || [];
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Manage_User } = permissionDetailData.data || {};

  // useEffect code here ..
  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    setLoading(true);
    await dispatch(getUserList());
    setLoading(false);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const actions = [
    Manage_User?.update
      ? {
          label: "Edit",
          icon: <FaEdit />,
          onClick: (item) => handleEdit(item),
        }
      : null,
    Manage_User?.delete
      ? {
          label: "Delete",
          icon: <FaTrash />,
          onClick: (item) => handleTypeDelete(item.id),
        }
      : null,
  ];

  // handle update to user code here...
  const handleUserByIdUpdate = async (userId) => {
    const payload = {
      userId: userId,
    };
    const response = await dispatch(getUserById(payload));
    if (getUserById?.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        return response.payload.data;
      }
    } else if (getUserById?.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
    }
    return null;
  };

  // handle edit code here...
  const handleEdit = async (item) => {
    const userId = item.id;
    const response = await handleUserByIdUpdate(userId);
    const userData = response?.data;
    if (Array.isArray(userData) && userData.length > 0) {
      const userDetails = userData[0];
      navigate("/addUserForm", { state: { manageUserData: userDetails } });
    } else {
    }
  };

  const handleDelete = async (userId) => {
    const payload = {
      userId: userId,
    };
    const response = await dispatch(deleteUserDetails(payload));
    fetchUserList();
    if (deleteUserDetails.fulfilled.match(response)) {
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.message);
      }
    } else if (deleteUserDetails.rejected.match(response)) {
      const errorMessage =
        response.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleTypeDelete = (userId) => {
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
        handleDelete(userId);
      }
    });
  };

  const mappedUserData = allUserData.map((user) => ({
    id: user.userId,
    Username: user.username,
    Role: user.roleName,
    Designation: user.designation,
    Company: user.company,
    Department: user.department,
    Business: user.business,
    "Reporting Manager": user.rmName,
    "Created Date": new Date(user.createdAt).toLocaleString(),
  }));
  const filteredData = mappedUserData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
    const handleExportExcel = () => {
      if (filteredData?.length > 0) {
        ExportToXLSX(filteredData, "Manage User Details");
      } else {
        toast.warning("No Records Found");
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
      {loading ? (
        <CommonLoader />
      ) : (
        <CustomTable
          data={filteredData || []}
          titleName="User Management"
          exportToExcelBtnVisiblity="true"
          handleExportExcel={handleExportExcel}
          headingText={true}
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
          buttonTitle={Manage_User?.create ? "+ Add New User" : null}
          actionVisibility={true}
          onRowCheckboxChange={() => {}}
          clickableColumns={["id"]}
          isClickable={true}
          onColumnClick={(key) => console.log(`Column clicked: ${key}`)}
          actions={actions}
          onPress={() => {
            navigate("/addUserForm");
          }}
        />
      )}
    </div>
  );
};

export default ManageUser;
