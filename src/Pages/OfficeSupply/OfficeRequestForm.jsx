// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Row, Col } from "react-bootstrap";
// import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
// import CustomInput from "../../Components/CustomInput/CustomInput";
// import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
// import { Title } from "../../Components/Title/Title";
// import SuppliesItems from "./SuppliesItems";
// import { toast, ToastContainer } from "react-toastify";
// import CommonLoader from "../../Components/CommonLoader/CommonLoader";
// import { v4 as uuidv4 } from "uuid";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getBuildingDropdown,
//   getLocationDropdown,
//   getPriorityDropdown,
//   officesupliceRequest,
// } from "../../Slices/OfficeSupply/OfficeSupplySlice";
// import { useNavigate } from "react-router-dom";
// import { getBusinessTypes } from "../../Slices/CompanyDetails/CompanyDetailSlice";
// import {
//   fetchDepartment_SubDepartments,
//   fetchEmpDropDownData,
// } from "../../Slices/TravelManagementSlice/TravelManagementsSlice";
// import { getCompanyList } from "../../Slices/Commondropdown/CommondropdownSlice";
// import Swal from "sweetalert2";

// const OfficeRequestForm = () => {
//   const today = new Date().toISOString().split("T")[0];

//   const [loading, setLoading] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [formData, setFormData] = useState({
//     TOSR_REQUESTED_BY: null,
//     TOSR_REQUEST_DATE: today,
//     TOSR_LOCATION_ID: null,
//     TOSR_FLOOR_ID: null,
//     TOSR_DEPARTMENT_ID: null,
//     TOSR_PRIORITY: "2",
//     TOSR_BUSINESS_ID: null,
//     TOSR_ENTITY: null,
//   });
//   const [rows, setRows] = useState([
//     {
//       id: uuidv4(),
//       TOSR_CATEGORY_ID: null,
//       TOSR_ITEM_ID: null,
//       TOSR_C_ITEM_ID: null,
//       TOSR_QUANTITY: null,
//       TOSR_RATE: null,
//       TOSR_AMOUNT: null,
//       TOSR_RECEIVED_ITEMS: null,
//       itemsList: [],
//       TOSR_GST: null,
//     },
//   ]);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const savedUserData = JSON.parse(localStorage.getItem("userData")) || [];

//   console.log(savedUserData, "savedUserData");
//   const businesstype = useSelector(
//     (state) => state.companyDetail.bussinessData
//   );
//   const { priorityDropdown, building, locationDropdown, officesupplice } =
//     useSelector((state) => state.OfficeSupply);
//   const { companyList } = useSelector((state) => state.CommonDropdownData);

//   const { getEmpDropData, getDepartment_subDepartment } = useSelector(
//     (state) => state.TravelManagement
//   );
//   const handleChange = useCallback((name, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   }, []);

//   const defaultId = useMemo(() => {
//     const matchedUser = getEmpDropData?.find(
//       (emp) => emp.userId === savedUserData?.data?.userId
//     );
//     return matchedUser || null;
//   }, [getEmpDropData, savedUserData]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       TOSR_ENTITY: defaultId?.company_id,
//     }));
//   }, [defaultId?.company_id]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       TOSR_BUSINESS_ID: defaultId?.business,
//     }));
//   }, [defaultId?.business]);

//   // Validate form
//   useEffect(() => {
//     const isValid =
//       formData.TOSR_BUSINESS_ID &&
//       formData.TOSR_LOCATION_ID &&
//       formData.TOSR_ENTITY &&
//       rows.some(
//         (row) => row.TOSR_CATEGORY_ID && row.TOSR_ITEM_ID && row.TOSR_QUANTITY
//       );
//     setIsFormValid(isValid);
//   }, [formData.TOSR_BUSINESS_ID, formData.TOSR_LOCATION_ID, rows]);

//   // Fetch dropdown data on component mount
//   useEffect(() => {
//     dispatch(getPriorityDropdown("PRIORITY"));
//     dispatch(getBuildingDropdown({ type: "building", id: 0 }));
//     fetchDepartmentsDetails();
//     dispatch(getBusinessTypes());
//     dispatch(fetchEmpDropDownData());
//     dispatch(getCompanyList());
//   }, [dispatch, formData.TOSR_BUSINESS_ID]);

//   // Fetch location dropdown when location ID changes
//   useEffect(() => {
//     if (formData.TOSR_LOCATION_ID) {
//       const payload = { type: "location", id: formData.TOSR_LOCATION_ID };
//       dispatch(getLocationDropdown(payload));
//     }
//   }, [formData.TOSR_LOCATION_ID, dispatch]);

//   // Set requested by user on component mount
//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       TOSR_REQUESTED_BY: savedUserData?.data?.userId,
//     }));
//   }, []);

//   const isAdminLogin = useMemo(() => {
//     return savedUserData?.data?.role_name === "admin";
//   }, [savedUserData?.data?.role_name]);

//   console.log(isAdminLogin, "isAdminLogin");

//   const fetchDepartmentsDetails = async () => {
//     const payload = {
//       busineesId: formData.TOSR_BUSINESS_ID || 0,
//     };

//     try {
//       await dispatch(fetchDepartment_SubDepartments(payload));
//     } catch (error) {
//       toast.error("An unexpected error occurred. Please try again later.");
//     }
//   };
//   // Handle input changes in rows
//   const handleInputChange = (index, field, value) => {
//     setRows((prevRows) =>
//       prevRows.map((row, rowIndex) =>
//         rowIndex === index ? { ...row, [field]: value } : row
//       )
//     );

//     if (
//       field === "TOSR_QUANTITY" ||
//       field === "TOSR_RATE" ||
//       field === "TOSR_GST"
//     ) {
//       setRows((prevRows) =>
//         prevRows.map((row, rowIndex) => {
//           if (rowIndex === index) {
//             const quantity = parseFloat(row.TOSR_QUANTITY || 0);
//             const rate = parseFloat(row.TOSR_RATE || 0);
//             const gst = parseFloat(row.TOSR_GST || 0);
//             const rateWithGst = rate + (rate * gst) / 100;
//             return { ...row, TOSR_AMOUNT: (rateWithGst * quantity).toFixed(2) };
//           }
//           return row;
//         })
//       );
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (status) => {
//     const payload = {
//       TOSR_REQUESTED_BY: formData.TOSR_REQUESTED_BY || "",
//       TOSR_REQUEST_DATE: formData?.TOSR_REQUEST_DATE,
//       TOSR_DEPARTMENT_ID: formData.TOSR_DEPARTMENT_ID || null,
//       TOSR_LOCATION_ID: formData.TOSR_LOCATION_ID || null,
//       TOSR_FLOOR_ID: formData.TOSR_FLOOR_ID || null,
//       TOSR_PRIORITY: formData.TOSR_PRIORITY,
//       TOSR_ITEMS_DETAILS: rows?.map((row) => ({
//         TOSR_CATEGORY_ID: row.TOSR_CATEGORY_ID
//           ? Number(row.TOSR_CATEGORY_ID)
//           : null,
//         TOSR_ITEM_ID: row.TOSR_ITEM_ID ? Number(row.TOSR_ITEM_ID) : null,
//         TOSR_QUANTITY: row.TOSR_QUANTITY ? Number(row.TOSR_QUANTITY) : 0,
//         TOSR_RATE: row.TOSR_RATE ? parseFloat(row.TOSR_RATE) : 0,
//         TOSR_AMOUNT: row.TOSR_AMOUNT ? parseFloat(row.TOSR_AMOUNT) : 0,
//         TOSR_RECEIVED_ITEMS: row.TOSR_RECEIVED_ITEMS
//           ? Number(row.TOSR_RECEIVED_ITEMS)
//           : 0,
//         TOSR_GST: parseFloat(row.TOSR_GST) || 0,
//       })),
//       TOSR_REQUEST_STATUS: status === 5 ? 5 : isAdminLogin ? 2 : status,
//       TOSR_BUSINESS_ID: formData.TOSR_BUSINESS_ID || null,
//       TOSR_APPROVER_STATUS: 1,
//       TOSR_ENTITY: formData.TOSR_ENTITY || null,
//     };

//     const response = await dispatch(officesupliceRequest(payload));
//     if (response?.payload?.statusCode === 200) {
//       toast.success(
//         response?.data?.message || "Request Submitted Successfully"
//       );
//       resetForm();
//       setTimeout(() => {
//         navigate("/OfficeSupplyRequest");
//       }, 2000);
//     } else if (response?.payload?.statusCode === 400) {
//       console.log(response?.payload, "error message");
//       toast.warning(response?.payload?.message);
//     } else {
//       toast.error(response.message || "Failed to send request.");
//     }
//   };
//   const handleCancel = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes",
//       width: "350px",
//       customClass: { popup: "custom-popup" },
//     });

//     if (result.isConfirmed) {
//       navigate("/officeSupplyRequest");
//     }
//   };
//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       TOSR_REQUESTED_BY: "",
//       TOSR_REQUEST_DATE: "",
//       TOSR_LOCATION_ID: "",
//       TOSR_FLOOR_ID: "",
//       TOSR_DEPARTMENT_ID: "",
//       TOSR_PRIORITY: "",
//       TOSR_BUSINESS_ID: "",
//     });
//     setRows([
//       {
//         id: uuidv4(),
//         TOSR_CATEGORY_ID: null,
//         TOSR_ITEM_ID: null,
//         TOSR_C_ITEM_ID: null,
//         TOSR_QUANTITY: null,
//         TOSR_RATE: null,
//         TOSR_AMOUNT: null,
//         TOSR_RECEIVED_ITEMS: null,
//       },
//     ]);
//   };

//   const totalAmount = useMemo(
//     () => rows.reduce((acc, curr) => acc + Number(curr.TOSR_AMOUNT || 0), 0),
//     [rows]
//   );

//   return (
//     <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
//       <ToastContainer position="top-right" autoClose={5000} />
//       {loading && <CommonLoader />}
//       {!loading && (
//         <div className="row">
//           <div className="col" id="main">
//             <div className="container-fluid mt-3">
//               <Title title="Office Supplies Request Form" />
//               <hr />
//               <form>
//                 <Row>
//                   <Col md={3}>
//                     <CustomInput
//                       type="text"
//                       labelName="Requested By"
//                       placeholder="Enter Name"
//                       value={savedUserData?.data?.name}
//                       isDisable={true}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <CustomInput
//                       type="date"
//                       labelName="Request Date"
//                       value={formData.TOSR_REQUEST_DATE}
//                       onChange={(e) =>
//                         handleChange("TOSR_REQUEST_DATE", e.target.value)
//                       }
//                       isMin={today}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <CustomDropdown
//                       dropdownLabelName="Entity"
//                       valueKey="company_id"
//                       labelKey="company_name"
//                       options={[
//                         { company_name: "Select", company_id: "" },
//                         ...(companyList?.data || []),
//                       ]}
//                       selectedValue={formData.TOSR_ENTITY}
//                       onChange={(e) =>
//                         handleChange("TOSR_ENTITY", e.target.value)
//                       }
//                       mandatoryIcon
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <CustomDropdown
//                       dropdownLabelName="Business"
//                       labelKey="businessName"
//                       valueKey="businessId"
//                       options={[
//                         { businessName: "Select", businessId: "" },
//                         ...(businesstype?.data || []),
//                       ]}
//                       selectedValue={formData?.TOSR_BUSINESS_ID}
//                       onChange={(e) =>
//                         handleChange("TOSR_BUSINESS_ID", e.target.value)
//                       }
//                       mandatoryIcon={true}
//                     />
//                   </Col>
//                 </Row>

//                 <Row className="mt-3">
//                   <Col md={3}>
//                     <CustomDropdown
//                       dropdownLabelName="Department"
//                       options={[
//                         { value: "", label: "Select Department" },
//                         ...(Array.isArray(getDepartment_subDepartment)
//                           ? getDepartment_subDepartment?.map((department) => ({
//                               value: department.dept_code,
//                               label: department.department_desc,
//                             }))
//                           : []),
//                       ]}
//                       labelKey="label"
//                       valueKey="value"
//                       onChange={(e) =>
//                         handleChange("TOSR_DEPARTMENT_ID", e.target.value)
//                       }
//                       selectedValue={formData.TOSR_DEPARTMENT_ID}
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <CustomDropdown
//                       dropdownLabelName="Office Location"
//                       mandatoryIcon={true}
//                       options={[
//                         { label: "Select", value: "" },
//                         ...(building || []),
//                       ]}
//                       labelKey="label"
//                       valueKey="value"
//                       selectedValue={formData.TOSR_LOCATION_ID}
//                       onChange={(e) =>
//                         handleChange("TOSR_LOCATION_ID", e.target.value)
//                       }
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <CustomDropdown
//                       dropdownLabelName="Floor"
//                       options={[
//                         { label: "Select", value: "" },
//                         ...(locationDropdown || []),
//                       ]}
//                       labelKey="label"
//                       valueKey="value"
//                       selectedValue={formData.TOSR_FLOOR_ID}
//                       onChange={(e) =>
//                         handleChange("TOSR_FLOOR_ID", e.target.value)
//                       }
//                     />
//                   </Col>
//                   <Col md={3}>
//                     <CustomDropdown
//                       dropdownLabelName="Priority"
//                       options={[
//                         { label: "Select", value: "" },
//                         ...(priorityDropdown || []),
//                       ]}
//                       labelKey="label"
//                       valueKey="value"
//                       selectedValue={formData.TOSR_PRIORITY}
//                       onChange={(e) =>
//                         handleChange("TOSR_PRIORITY", e.target.value)
//                       }
//                     />
//                   </Col>
//                 </Row>
//                 <Row className="mt-4 d-flex justify-content-between align-items-center">
//                   <span className="me-2">Item Details</span>
//                 </Row>

//                 <SuppliesItems
//                   rows={rows}
//                   setRows={setRows}
//                   handleInputChange={handleInputChange}
//                   isUploadView={true}
//                 />
//                 <Row className="justify-content-end  mb-4">
//                   <Col xs="auto" className="d-flex align-items-center gap-2">
//                     <span style={{ fontWeight: "bold" }}>Total Amount: ₹</span>
//                     <span style={{ fontWeight: "bold" }}>
//                       {totalAmount.toFixed(2)}
//                     </span>
//                   </Col>
//                 </Row>
//                 <Row className="d-flex justify-content-end  mb-3">
//                   <Col md={2}>
//                     <CustomSingleButton
//                       onPress={handleCancel}
//                       _ButtonText="Cancel"
//                       backgroundColor="rgb(217, 4, 41)"
//                       Text_Color="#fff"
//                       height={40}
//                     />{" "}
//                   </Col>{" "}
//                   <Col md={2}>
//                     <CustomSingleButton
//                       _ButtonText={"Save As Draft"}
//                       backgroundColor="#000"
//                       Text_Color="#fff"
//                       height="44px"
//                       onPress={() => handleSubmit(5)}
//                       disabled={!isFormValid}
//                     />{" "}
//                   </Col>{" "}
//                   <Col md={2}>
//                     <CustomSingleButton
//                       _ButtonText={
//                         isAdminLogin ? "Send To Approver" : "Send To Checker"
//                       }
//                       backgroundColor="#000"
//                       Text_Color="#fff"
//                       height="44px"
//                       width="auto"
//                       onPress={() => handleSubmit(1)}
//                       disabled={!isFormValid}
//                     />
//                   </Col>
//                 </Row>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OfficeRequestForm;
