import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCompanyDetail,
  updateByIdCompanyDetail,
} from "../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import CustomTable from "../../../../../Components/CustomeTable/CustomTable";
import CommonLoader from "../../../../../Components/CommonLoader/CommonLoader";
import { getALlCompanyDetail } from "../../../../../Slices/CompanyDetails/CompanyDetailSlice";

const CompanyDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const savedUserData = JSON.parse(localStorage.getItem("userData"));

  const loading = useSelector(
    (state) => state.companyDetail.status === "loading"
  );

  const companyDetailData = useSelector(
    (state) => state.companyDetail.allCompanyDetails || []
  );
  const datacompany = companyDetailData?.data?.data || [];
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Company_Details } = permissionDetailData.data || {};

  // useEffect code are here...
  useEffect(() => {
    fetchCompanytype();
  }, []);

  // fetch all business from get apis...
  const fetchCompanytype = async () => {
    await dispatch(getALlCompanyDetail());
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  // map the data to the response code here..
  const tableData =
    datacompany?.map((company, index) => ({
      "Company Name": company.company_name,
      "Email Id": company.company_email,
      "Office Address": company.address,
      "Group Name": company?.group_name,
      "is Group Company": company?.is_group_company === 1 ? "Yes" : "No",
      company_id: company.company_id,
    })) || [];

  // handle delete function code here....
  const handleCompanyDelete = async (companyId) => {
    const payload = {
      companyId: companyId,
    };
    const response = await dispatch(deleteCompanyDetail(payload));
    if (deleteCompanyDetail.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        toast.success(response.payload.data.message);
        fetchCompanytype();
      }
    } else if (deleteCompanyDetail.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleTypeDelete = (companyId) => {
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
        handleCompanyDelete(companyId);
      }
    });
  };
  
  const actions = [
    Company_Details?.update
      ? {
          label: "Edit",
          icon: <FaEdit />,
          onClick: (item) => handleEdit(item),
        }
      : null,
    Company_Details?.delete
      ? {
          label: "Delete",
          icon: <FaEdit />,
          onClick: (item) => handleTypeDelete(item.company_id),
        }
      : null,
  ];

  // handle edit function by id get data code....
  const handleCompanyByIdUpdate = async (company_id) => {
    const payload = {
      companyId: company_id,
    };
    const response = await dispatch(updateByIdCompanyDetail(payload));
    if (updateByIdCompanyDetail.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 201) {
        return response.payload.data;
      }
    } else if (updateByIdCompanyDetail.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      console.log(errorMessage);
    }
    return null;
  };

  // handle edit function  code....
  const handleEdit = async (item) => {
    const response = await handleCompanyByIdUpdate(item?.company_id);
    const getdata = response?.data;
    console.log("getdata...", getdata);
    if (getdata) {
      navigate("/addCompanyDetails", { state: { sendData: getdata } });
    } else {
      console.log("No company data found.");
    }
  };

  const handleAction = () => {
    alert("Work under Progress...");
  };

  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
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
        data={tableData}
        titleName="Company Details"
        headingText={true}
        setValue={setValue}
        SelectColumnValue={value}
        selectedRows={selectedRows}
        allSelected={allSelected}
        firstColumnVisibility={true}
        dataContained={tableData?.length || []}
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
        morebtnTitle={Company_Details?.create && savedUserData?.data?.is_group_company == true   ? "+ Add Company" : null}
        morebtnVisibility={Company_Details?.create && savedUserData?.data?.is_group_company == true ? true : false}
        buttonTitle={Company_Details?.create && savedUserData?.data?.is_group_company == true ? "+ Add Business" : null}
        actionVisibility={true}
        onRowCheckboxChange={handleAction}
        clickableColumns={["Email Id"]}
        isClickable={true}
        onColumnClick={(key) => console.log(`Column clicked: ${key}`)}
        actions={actions}
        morebtnClick={() => {
          navigate("/addCompanyDetails");
        }}
        onPress={(e) => {
          e.preventDefault();
          navigate("/BusinessDetails");
        }}
        marginTopTable={true}
      />
    )}
    </div>
  );
};

export default CompanyDetails;
