import React, { useState, useEffect } from "react";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { getMainCategoryLists, deleteCustomerSatisfactionData, deleteCategoryDetails, getFormDataById } from "../../../Slices/CustomerSatisfactionfeedback/CSFSevicesSlice"
import { useDispatch, useSelector } from "react-redux";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
const CategoryList = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);
  const [categoryData, setcategoryData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");




  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };
  const navigate = useNavigate();
  const data = [
    {
      "Category": "Hiring",
      "Forms Name": "Job Application",
      "Response count": "100",
      "Preview": "Eye Icon",
    },
    {
      "Category": "Washroom",
      "Forms Name": "Eashroom cleaning",
      "Response count": "89",
      "Preview": "Eye Icon",
    },
  ];
  const allData = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];
  const allPaginationData = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
  ];
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

  const handleEdit = async (item) => {
    // alert(`Editing item: ${JSON.stringify(item)}`);

      navigate("/addcategory", { state: { _Data: item } })
   
  };

  const handleDelete = async (item) => {
    setLoading(true)
    try {
      let data = {
        "category_id": item["Category Id"]
      }
      let _data = await dispatch(deleteCategoryDetails(data));
      console.log(JSON.stringify(_data))
      if (_data?.payload?.data?.statusCode == 200) {
        toast.success(_data?.payload?.data?.message);
       fetchMainCategoryListsDetails();
       setLoading(false)
      }
    } catch (error) {
        setLoading(false)
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchMainCategoryListsDetails();
  }, []);

  const fetchMainCategoryListsDetails = async () => {
    setLoading(true)
    try {
      let _dataresponse = await dispatch(getMainCategoryLists());
      console.log("_dataresponse",_dataresponse)
      let FinalOutput=_dataresponse?.payload

      const tableData =
      FinalOutput?.map((_data, index) => ({
      "Category Id": _data.category_id,
      "Category Name": _data.category_name,
      "Category description": _data.category_description,
      "Status": _data?.category_status==0?"InActive":"Active",
      //"created_at": _data?.created_at,
      // "FormJson": JSON.parse(_data?.FormJson),
    })) || [];
console.log("tableData",tableData)
      setcategoryData(tableData)
      setLoading(false)
    } catch (error) {
      toast.error(error);
      setLoading(false)
    }

  };
  const filteredData = categoryData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const fetchDynamicFormsDetails = async (_formID) => {
    // let _response = await dispatch(getFormDataById(_formID?.["Form Id"]))
    // let finalres = _response?.payload?.data?.data[0]
    // let extractedData = {
    //   "Form Id": finalres.FormID,
    //   "Form Name": finalres.FormName,
    //   "Category": finalres.category,
    //   //"Response count": finalres["response count"],
    //   "Status": finalres?.status,
    //   // "Publish Url": finalres?.publishURL,
    //   "created_at": finalres?.created_at,
    //   "FormJson": JSON.parse(finalres?.FormJson),
    // }
    navigate("/dynamicformrender")
  }
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
        data={filteredData}
        titleName="All Category"
        headingText={true}
        setValue={setValue}
        searchVisibility={true}
        placeholder={"Search..."}
        toDateChange={(e) => setSearchTerm(e.target.value)}
        //SelectColumnData={allData}
        SelectColumnValue={value}
        selectedRows={selectedRows}
        allSelected={allSelected}
        //  selectColumnData={true}
        paginationDropDown={false}
        paginationvalueName="Show"
        paginationDataValue={allPaginationData}
        dataContained={filteredData?.length}
        pageCount={page}
        handlePageClick={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={handleChangeRowsPerPage}
        onPress={() => navigate("/addcategory")}
        buttonTitle="+Add Category"
        firstColumnVisibility={true}
       // exportIconVisiblity={true}
        isClickable={true}
        isEntireRowData={true}
        // onColumnClick={(key, index) => {
        //   if (index == 0) {
        //     fetchDynamicFormsDetails(key);
        //     console.log('column clicked :', JSON.stringify(key) + index)
        //   }
        //   else {
        //     navigate("/usersfeedbackresponses", { state: { JsonData: key } })
        //     console.log('column clicked :', JSON.stringify(key) + index)
        //   }
        // }}
        //clickableColumns={["Form Id", "Response count"]}
       // clickableColumns={[ "Response count"]}
        actions={actions}
        actionVisibility={true}
      />
    )}
    </div>
  );
};

export default CategoryList;
