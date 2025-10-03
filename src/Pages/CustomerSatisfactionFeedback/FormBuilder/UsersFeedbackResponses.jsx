// import React, { useState, useEffect } from "react";
// import CustomTable from "../../../Components/CustomeTable/CustomTable";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import { getCustomerFeedbackData, deleteCustomerSatisfactionData, deleteFormDetails } from "../../../Slices/CustomerSatisfactionfeedback/CSFSevicesSlice"
// import { useDispatch, useSelector } from "react-redux";
// const UsersFeedbackResponses = () => {
//     const dispatch = useDispatch();
//     const location = useLocation();
//     const { JsonData } = location.state || {};
//     const [value, setValue] = useState(null);
//     const [customerSatisfactionData, setcustomerSatisfactionData] = useState([]);
//     const [selectedRows, setSelectedRows] = useState([]);
//     const [allSelected, setAllSelected] = useState(false);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);

//     const allformsDetails = useSelector(
//         (state) => state?.CSFSevices?.customerSatisfactionGetDetails
//     );

//     const tableData =
//         allformsDetails?.map((_data, index) => ({
//             "Form Id": _data.FormID,
//             "Form Name": _data.FormName,
//             "Category": _data.category,
//             "Response count": _data["response count"],
//             "Status": _data?.status,
//             "Publish Url": _data?.publishURL,
//             "created_at": _data?.created_at,
//             "FormJson": JSON.parse(_data?.FormJson),
//             // "Preview": "View"
//         })) || [];

//     console.log('____________')
//     console.log(JSON.stringify(allformsDetails))
//     // alert(JSON.stringify(JsonData))
//     const handleChangePage = (newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event, 10));
//         setPage(0);
//     };
//     const navigate = useNavigate();
//     const data = [
//         {
//             "Category": "Hiring",
//             "Forms Name": "Job Application",
//             "Response count": "100",
//             "Preview": "Eye Icon",
//         },
//         {
//             "Category": "Washroom",
//             "Forms Name": "Eashroom cleaning",
//             "Response count": "89",
//             "Preview": "Eye Icon",
//         },
//     ];
//     const allData = [
//         { label: "Option 1", value: "option1" },
//         { label: "Option 2", value: "option2" },
//     ];
//     const allPaginationData = [
//         { label: "1", value: "1" },
//         { label: "2", value: "2" },
//         { label: "3", value: "3" },
//         { label: "4", value: "4" },
//     ];
//     const actions = [
//         {
//             label: "Edit",
//             icon: <FaEdit />,
//             onClick: (item) => handleEdit(item),
//         },
//         {
//             label: "Delete",
//             icon: <FaTrash />,
//             onClick: (item) => handleDelete(item),
//         },
//     ];

//     const handleEdit = (item) => {
//         alert(`Editing item: ${JSON.stringify(item)}`);
//         //navigate("/addformbuilder",{ state: { _Data: item } })
//     };

//     const handleDelete = async (item) => {
//         alert(JSON.stringify(item))
//         // alert(`Deleting item: ${item["Form Id"]}`);
//         // try {

//         // let data={
//         //     "formID": item["Form Id"]
//         // }
//         // let _data=  await dispatch(deleteFormDetails(data));
//         // console.log(JSON.stringify(_data))
//         // if(_data?.payload?.data?.statusCode==200){
//         //   toast.success(_data?.payload?.data?.message);
//         //   fetchAllUsersFeedbackDetails();
//         // }
//         // } catch (error) {
//         //   toast.error(error);
//         // }
//     };

//     useEffect(() => {
//         fetchAllUsersFeedbackDetails();
//     }, []);

//     const fetchAllUsersFeedbackDetails = async () => {
//         try {
//             let _data = await dispatch(getCustomerFeedbackData(JsonData?.["Form Id"]));

//             console.log('customerSatisfactionData----', JSON.stringify(_data.payload?.data?.data[0]))
//             let final_response = _data.payload?.data?.data[0]
//             setcustomerSatisfactionData(final_response)
//         } catch (error) {
//             console.log(error)
//         }

//     };

//     return (
//         <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
//             <ToastContainer
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 closeOnClick={true}
//             />
//             <CustomTable
//                 data={customerSatisfactionData}
//                 titleName="Users Feedback List"
//                 headingText={true}
//                 setValue={setValue}
//                 //SelectColumnData={allData}
//                 SelectColumnValue={value}
//                 selectedRows={selectedRows}
//                 allSelected={allSelected}
//                 //  selectColumnData={true}
//                 paginationDropDown={false}
//                 paginationvalueName="Show"
//                 paginationDataValue={allPaginationData}
//                 dataContained={customerSatisfactionData?.length}
//                 pageCount={page}
//                 handlePageClick={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 handleItemsPerPageChange={handleChangeRowsPerPage}
//                 isRightSideButtonVisible={false}
//                 // onPress={() => navigate("/addformbuilder")}
//                 //buttonTitle="+Add Form"
//                 firstColumnVisibility={true}
//                 exportIconVisiblity={true}
//                 isClickable={true}
//                 // onColumnClick={(key) => {
//                 //   navigate("/dynamicformrender",{ state: { JsonData: key } })
//                 //   console.log('column clicked :',JSON.stringify(key))}}
//                 // clickableColumns={["Form Id","Response count"]}
//                 actions={actions}
//                 actionVisibility={true}
//             />
//         </div>
//     );
// };

// export default UsersFeedbackResponses;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";
import { toast, ToastContainer } from "react-toastify";
import { getCustomerFeedbackData } from "../../../Slices/CustomerSatisfactionfeedback/CSFSevicesSlice";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { useDispatch } from "react-redux";
import "./UsersFeedbackResponses.css";
import * as XLSX from "xlsx";
const DynamicTable = ({ data }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { JsonData } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [customerSatisfactionData, setcustomerSatisfactionData] = useState([]);

  useEffect(() => {
    //alert(JSON.stringify(JsonData))
    // Parse Datajson and merge all keys for dynamic headers
    fetchAllUsersFeedbackDetails();
    // Set processed data with parsed JSON
  }, [data]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months 0-based hote hain
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const fetchAllUsersFeedbackDetails = async () => {
    setLoading(true);
    try {
      let _data = await dispatch(
        getCustomerFeedbackData(JsonData?.["Form Id"])
      );

      console.log(
        "customerSatisfactionData----",
        JSON.stringify(_data.payload?.data?.data[0])
      );
      let final_response = _data.payload?.data?.data[0];
      const allData = final_response.map((item) => {
        const parsedData = JSON.parse(item.Datajson)[0];
        return {
          "Response Date": formatDateTime(item.created_date),
          ...parsedData,
        };
      });

      const headers = new Set();
      allData.forEach((item) => {
        Object.keys(item).forEach((key) => headers.add(key));
      });

      setTableHeaders([...headers]);
      setTableData(allData);
      setLoading(false);
      setcustomerSatisfactionData(final_response);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  // const exportToExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(tableData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Feedback Data");
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const file = new Blob([excelBuffer], {
  //     bookType: "xlsx",
  //     type: "application/octet-stream",
  //   });
  // };
  console.log(tableData, "data");
  const handleExportExcel = () => {
    if (tableData?.length > 0) {
      ExportToXLSX(tableData, "User Feedback Responses");
    } else {
      toast.warning("No Records Found");
    }
  };
  return (
    <>
      {loading ? (
        <CommonLoader />
      ) : (
        <div>
          <div className="d-flex justify-content-end">
            <button onClick={handleExportExcel} className="btn btn-dark mb-3">
              Export to Excel
            </button>
          </div>

          <table className="table custom-table">
            <thead>
              <tr>
                <th
                  className="text-white bg-danger"
                  style={{ whiteSpace: "nowrap" }}
                >
                  S.No
                </th>
                {tableHeaders.map((header) => (
                  <th
                    style={{ whiteSpace: "nowrap" }}
                    className="text-white bg-danger"
                    key={header}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {tableHeaders.map((header) => (
                    <td key={header}>{row[header] || "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

// Sample data for testing
const sampleData = [
  {
    created_date: "2024-10-29T06:49:42.000Z",
    Datajson: '[{"Car-Number":"6042","Car-Name":"Aura"}]',
  },
  {
    created_date: "2024-10-29T06:49:52.000Z",
    Datajson: '[{"Car-Number":"6048","parking-floor":"Floor-2"}]',
  },
];

const UsersFeedbackResponses = () => {
  return (
    <div className="mt-4">
      <h2>User Feedback Responses</h2>

      <DynamicTable data={sampleData} />
    </div>
  );
};

export default UsersFeedbackResponses;
