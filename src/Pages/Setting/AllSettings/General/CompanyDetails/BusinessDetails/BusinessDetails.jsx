import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/dist/sweetalert2.min.css";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../../../../../Components/CustomeTable/CustomTable";
import CommonLoader from "../../../../../../Components/CommonLoader/CommonLoader";
import { getALlCompanyDetail } from "../../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import { getBusinessTypes,updateByIdBusiness ,deleteByIdBusiness} from "../../../../../../Slices/CompanyDetails/CompanyDetailSlice";

const BusinessDetails = () => {
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
  const loading = useSelector(
    (state) => state.companyDetail.status === "loading"
  );
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  const businessData = businesstype?.data || [];
  
  // useEffect code are here...
  useEffect(() => {
    fetchCompanytype();
    fetchbusinesstype();
  }, []);

  // fetch all business from get apis...
  const fetchbusinesstype = async () => {
    await dispatch(getBusinessTypes());
  };
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
    businessData?.map((business, index) => ({
      "businessName": business.businessName,
      "Group Name": business?.groupName,
      businessId: business.businessId,
    })) || [];

  // handle delete function code here....
  const handleBusinessDelete = async (businessId) => {
    const payload = {
      businessId: businessId,
    };
    const response = await dispatch(deleteByIdBusiness(payload));
    if (deleteByIdBusiness.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        toast.success(response.payload.data.message);
        fetchbusinesstype();
      }
    } else if (deleteByIdBusiness.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleTypeDelete = (businessId) => {
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
        handleBusinessDelete(businessId);
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
      icon: <FaEdit />,
      onClick: (item) => handleTypeDelete(item.businessId),
    },
  ];

  const handleEdit = (item) => {
      navigate("/AddBusinessDetails", { state:item });
  };

  const handleAction = () => {
    alert("Work under Progress...");
  };
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <CustomTable
        data={tableData.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )}
        titleName="Business Details"
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
        buttonTitle="+ Add Business"
        actionVisibility={true}
        onRowCheckboxChange={handleAction}
        actions={actions}
        onPress={(e) => {
          e.preventDefault();
          navigate("/addBusinessDetails");
        }}
      />
      {loading && <CommonLoader />}
    </div>
  );
};

export default BusinessDetails;
