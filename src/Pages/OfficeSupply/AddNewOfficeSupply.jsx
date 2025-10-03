import { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import { Title } from "../../Components/Title/Title";
import SuppliesItems from "./SuppliesItems";
import VendorInformationItem from "./VendorInformationItem";
import { getCompanyList } from "../../Slices/Commondropdown/CommondropdownSlice";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import {
  getLocationDropdown,
  getPriorityDropdown,
  getBuildingDropdown,
  officesupliceRequest,
  getstatusDropdown,
  getItemDropdown,
  approverApproval,
  officesuppliceCategory,
} from "../../Slices/OfficeSupply/OfficeSupplySlice";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";
import {
  fetchDepartment_SubDepartments,
  fetchEmpDropDownData,
} from "../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { getBusinessTypes } from "../../Slices/CompanyDetails/CompanyDetailSlice";
import DeliveryDetails from "./DeliveryDetails";
import { getvendorLists } from "../../Slices/VendorManagement/VendorManagementSlice";
import Encryption from "../../Components/Decryption/Encryption";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";

const AddNewOfficeSupply = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const encrypt = Encryption();

  const today = new Date().toISOString().split("T")[0];

  const [emailErrors, setEmailErrors] = useState([]);

  const savedUserData = JSON.parse(localStorage.getItem("userData"));

  const editData = location.state?.editData.data[0] || null;

  const isApproverLogin = location.state?.isApproverLogin || false;
  const isApproverRequestEdit = location.state?.isApproverRequestEdit || false;
  const requestStatus = editData?.TOSR_REQUEST_STATUS || null;

  const {
    priorityDropdown,
    building,
    locationDropdown,
    statusDropdown,
    itemCondition,
    officesupplice,
  } = useSelector((state) => state.OfficeSupply);

  const [formData, setFormData] = useState(() => ({
    requestId: editData?.TOSR_REQUEST_ID || "",
    requestDate: editData?.TOSR_REQUEST_DATE || today,
    requestedBy: editData?.TOSR_REQUESTED_BY || "",
    officeLocation: editData?.TOSR_LOCATION_ID || "",
    floor: editData?.TOSR_FLOOR_ID || "",
    department: editData?.TOSR_DEPARTMENT_ID || "",
    priority:
      priorityDropdown?.find((item2) => item2.label === editData?.TOSR_PRIORITY)
        ?.value || "2",
    approvalStatus: editData?.TOSR_APPROVER_STATUS || "",
    approver: editData?.TOSR_APPROVER_BY || "Paresh kapadia",
    approvalDate: editData?.TOSR_APPROVER_DATE || "",
    business: editData?.TOSR_BUSINESS_ID || "",
    entity: editData?.TOSR_ENTITY || "",
    requestedName: "",
  }));

  const [rows, setRows] = useState(() =>
    editData?.TOSR_ITEMS_DETAILS?.length
      ? editData.TOSR_ITEMS_DETAILS.map((item) => ({
          TOSR_CATEGORY_ID: item?.TOSR_CATEGORY_ID || null,
          TOSR_ITEM_ID: item?.TOSR_ITEM_ID || null,
          TOSR_QUANTITY: item?.TOSR_QUANTITY || null,
          TOSR_RATE: item?.TOSR_RATE || null,
          TOSR_AMOUNT: item?.TOSR_AMOUNT || null,
          TOSR_RECEIVED_ITEMS: item?.TOSR_RECEIVED_ITEMS || null,
          TOSR_GST: item?.TOSR_GST || null,
          itemsList: [],
        }))
      : [
          {
            TOSR_CATEGORY_ID: null,
            TOSR_ITEM_ID: null,
            TOSR_QUANTITY: null,
            TOSR_RATE: null,
            TOSR_AMOUNT: null,
            TOSR_RECEIVED_ITEMS: null,
            TOSR_GST: null,
            itemsList: [],
          },
        ]
  );
  const [vendors, setVendors] = useState(
    editData?.TOSR_VENDOR_INFORMATION?.map((vendor) => ({
      TOSR_VENDOR_ID: vendor?.TOSR_VENDOR_ID || null,
      TOSR_VENDOR_EMAILID: vendor?.TOSR_VENDOR_EMAILID || "",
    })) || []
  );
  const [vendorData, setVendorData] = useState([]);
  console.log(editData, "editData");
  const [deliveries, setDeliveries] = useState(
    editData?.TOSR_DELIVERY_DETAILS?.length
      ? editData.TOSR_DELIVERY_DETAILS.map((item) => ({
          deliveryDate: item?.TOSR_DELIVERY_DATE || "",
          receivedBy: item?.TOSR_RECEIVED_BY || "",
          checkedBy: item?.TOSR_CHECKED_BY || "",
          challanNumber: item?.TOSR_CHALLAN_NO || "",
          remarks: item?.TOSR_REMARK || "",
          itemCondition: item?.TOSR_ITEM_CONDITION || "2",
          fileName: item?.TOSR_CHALLAN_FILE || null,
          fileUrl: item?.file_url || "",
        }))
      : []
  );
  const [input, setInput] = useState({
    deliveryDate: "",
    receivedBy: "",
    checkedBy: "",
    challanNumber: "",
    remarks: "",
    itemCondition: "2",
    challanFile: null,
    fileName: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getEmpDropData, getDepartment_subDepartment } = useSelector(
    (state) => state.TravelManagement
  );
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  const { companyList } = useSelector((state) => state.CommonDropdownData);

  // Fetch Dropdown Data
  useEffect(() => {
    dispatch(getPriorityDropdown("PRIORITY"));
    dispatch(getstatusDropdown("VENDOR_STATUS"));
    dispatch(getItemDropdown("ITEM_CONDITION"));
    dispatch(getBuildingDropdown({ type: "building", id: 0 }));
    dispatch(getCompanyList());
    dispatch(getBusinessTypes());
    dispatch(fetchEmpDropDownData());
    dispatch(officesuppliceCategory({ type: "Category" }));
  }, [dispatch]);

  const defaultId = useMemo(() => {
    const matchedUser = getEmpDropData?.find(
      (emp) => emp?.userId === savedUserData?.data?.userId
    );
    return matchedUser || null;
  }, [getEmpDropData, savedUserData]);

  const isAdminLogin = useMemo(() => {
    return savedUserData?.data?.role_name === "admin";
  }, [savedUserData?.data?.role_name]);

  const isSecurityLogin = useMemo(() => {
    return savedUserData?.data?.role_name === "Security";
  }, [savedUserData?.data?.role_name]);

  const isAllReceived = useMemo(() => {
    return rows.every(
      (row) =>
        row.TOSR_QUANTITY !== null &&
        row.TOSR_RECEIVED_ITEMS !== null &&
        Number(row.TOSR_QUANTITY) === Number(row.TOSR_RECEIVED_ITEMS)
    );
  }, [rows]);

  useEffect(() => {
    if (formData.officeLocation) {
      const payload = { type: "location", id: formData.officeLocation };
      dispatch(getLocationDropdown(payload));
    }
  }, [formData.officeLocation, dispatch]);

  useEffect(() => {
    if (!editData) {
      setFormData((prevData) => ({
        ...prevData,
        requestedBy: defaultId?.userId,
        entity: defaultId?.company_id,
        business: defaultId?.business,
        requestedName: defaultId?.username,
      }));
    }
  }, [
    defaultId?.userId,
    defaultId?.company_id,
    defaultId?.business,
    defaultId?.name,
  ]);

  useEffect(() => {
    fetchDepartmentsDetails();
  }, [formData.business, defaultId?.business]);

  const fetchDepartmentsDetails = async () => {
    const payload = {
      busineesId: formData.business || 0,
    };

    try {
      await dispatch(fetchDepartment_SubDepartments(payload));
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    const isValid =
      formData.business &&
      formData.officeLocation &&
      formData.entity &&
      formData.floor;
    rows.some(
      (row) => row.TOSR_CATEGORY_ID && row.TOSR_ITEM_ID && row.TOSR_QUANTITY
    );
    setIsFormValid(isValid);
  }, [formData.business, formData.officeLocation, formData.entity, rows]);

  useEffect(() => {
    const vendorCategoryName = officesupplice?.find(
      (c) => c.TOSCM_CATEGORY_ID === Number(rows[0]?.TOSR_CATEGORY_ID)
    )?.TOSCM_CATEGORY_NAME;

    const matchedVendor = (vendorData || [])
      .filter((v) => v["CATEGORY NAME"] === "Office Supply")
      .find((v) => v["SUBCATEGORY NAME"] === vendorCategoryName);
    if (vendors.length === 0 && matchedVendor) {
      setVendors([
        {
          TOSR_VENDOR_ID: matchedVendor.VENDOR_ID,
          TOSR_VENDOR_EMAILID: matchedVendor.EMAIL_ID,
        },
      ]);
      setEmailErrors([""]);
    }
  }, [officesupplice, vendorData, rows]);

  useEffect(() => {
    const fetchVendorNames = async () => {
      try {
        const response = await dispatch(getvendorLists());
        setVendorData(response?.payload.data.data);
      } catch (error) {
        console.error("An unexpected error occurred. Please try again later.");
      }
    };
    fetchVendorNames();
  }, []);
  const handleChange = useCallback((name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      width: "350px",
      customClass: { popup: "custom-popup" },
    });

    if (result.isConfirmed) {
      navigate(
        isApproverRequestEdit ? "/approvalRequests" : "/officeSupplyRequest"
      );
    }
  };

  const handleSaveOrUpdate = async (status, approverStatusOverride) => {
    const fullDeliveryList = [...deliveries];
    const isInputFilled =
      input.deliveryDate ||
      input.receivedBy ||
      input.challanNumber ||
      input.challanFile;

    if (status === 4 || status === 6) {
      const missingReceivedQty = rows.some(
        (row) =>
          row.TOSR_RECEIVED_ITEMS === null || row.TOSR_RECEIVED_ITEMS === ""
      );
      if (missingReceivedQty) {
        toast.warning("Please Enter Received Quantity.");
        return;
      }
      if (isInputFilled) {
        fullDeliveryList.push(input);
      }

      if (fullDeliveryList.length === 0) {
        toast.warning("Please Enter Delivery details.");
        return;
      }
    }
    const payload = {
      TOSR_REQUEST_ID: formData.requestId,
      TOSR_REQUEST_DATE: formData.requestDate,
      TOSR_REQUESTED_BY: editData
        ? getEmpDropData?.find((emp) => emp.username === formData.requestedBy)
            ?.userId
        : formData.requestedBy,
      TOSR_LOCATION_ID: formData.officeLocation,
      TOSR_FLOOR_ID: formData.floor,
      TOSR_DEPARTMENT_ID: formData.department,
      TOSR_PRIORITY: formData.priority,
      TOSR_ITEMS_DETAILS: rows.map((row) => ({
        TOSR_CATEGORY_ID: Number(row.TOSR_CATEGORY_ID) || null,
        TOSR_ITEM_ID: Number(row.TOSR_ITEM_ID) || null,
        TOSR_QUANTITY: Number(row.TOSR_QUANTITY) || 0,
        TOSR_RATE: parseFloat(row.TOSR_RATE) || 0,
        TOSR_AMOUNT: parseFloat(row.TOSR_AMOUNT) || 0,
        TOSR_RECEIVED_ITEMS: Number(row.TOSR_RECEIVED_ITEMS) || 0,
        TOSR_GST: parseFloat(row.TOSR_GST) || 0,
      })),
      TOSR_VENDOR_INFORMATION: vendors.map((vendor) => ({
        TOSR_VENDOR_ID: Number(vendor.TOSR_VENDOR_ID) || null,
        TOSR_VENDOR_EMAILID: vendor.TOSR_VENDOR_EMAILID || "",
      })),
      TOSR_REQUEST_STATUS: status,
      TOSR_BUSINESS_ID: formData?.business,
      TOSR_ENTITY: formData?.entity,
      TOSR_APPROVER_STATUS:
        approverStatusOverride !== undefined
          ? approverStatusOverride
          : formData?.approvalStatus || null,
      TOSR_DELIVERY_DETAILS: fullDeliveryList?.map((delivery) => ({
        TOSR_DELIVERY_DATE: delivery.deliveryDate || "",
        TOSR_RECEIVED_BY: delivery.receivedBy || "",
        TOSR_CHECKED_BY: delivery.checkedBy || "",
        TOSR_CHALLAN_NO: delivery.challanNumber || "",
        TOSR_REMARK: delivery.remarks || "",
        TOSR_ITEM_CONDITION: delivery.itemCondition || "",
        TOSR_CHALLAN_FILE: delivery.fileName,
      })),
    };
    setLoading(true);
    try {
      const formData = new FormData();

      const encryptionPayload = encrypt(payload);

      formData.append("encryptedData", encryptionPayload);
      fullDeliveryList.forEach((delivery) => {
        if (delivery.challanFile) {
          formData.append(`files`, delivery.challanFile);
        }
      });

      const response = await dispatch(officesupliceRequest(formData));
      if (response?.payload?.statusCode === 200) {
        setLoading(false);
        toast.success(response.payload.data.message);
        setTimeout(() => {
          navigate("/officeSupplyRequest");
        }, 2000);
      } else if (response?.payload?.statusCode === 400) {
        setLoading(false);

        console.log(response?.payload, "error message");
        toast.warning(response?.payload?.message);
      } else {
        setLoading(false);

        toast.error(response.error.message || "Failed to update request");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  const handleInputChange = (index, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );

    if (
      field === "TOSR_QUANTITY" ||
      field === "TOSR_RATE" ||
      field === "TOSR_GST"
    ) {
      setRows((prevRows) =>
        prevRows.map((row, rowIndex) => {
          if (rowIndex === index) {
            const quantity = parseFloat(row.TOSR_QUANTITY || 0);
            const rate = parseFloat(row.TOSR_RATE || 0);
            const gst = parseFloat(row.TOSR_GST || 0);
            const rateWithGst = rate + (rate * gst) / 100;
            return { ...row, TOSR_AMOUNT: (rateWithGst * quantity).toFixed(2) };
          }
          return row;
        })
      );
    }
  };

  const handleVendorInputChange = (index, field, value) => {
    setVendors((prevVendors) =>
      prevVendors.map((vendor, i) =>
        i === index ? { ...vendor, [field]: value } : vendor
      )
    );
  };

  const handleAprover = async (status) => {
    const payload = {
      id: formData.requestId,
      type: status,
    };
    try {
      const response = await dispatch(approverApproval(payload));
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data[0].message);
        setTimeout(() => {
          navigate("/officeSupplyRequest");
        }, 2000);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error("Failed to update approval status.");
    }
  };

  const totalAmount = useMemo(
    () => rows.reduce((acc, curr) => acc + Number(curr.TOSR_AMOUNT || 0), 0),
    [rows]
  );
  console.log(requestStatus, "requestStatus");
  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
      />
      {loading && <CommonLoader />}

      <div className="row">
        <div className="col" id="main">
          <div className="container-fluid mt-3">
            <h5 className="text-danger">
              {editData
                ? "Edit Office Supplies Request"
                : "Add New Office Supplies Request"}
            </h5>
            <hr />
            <form>
              <Row>
                <Col md={3}>
                  <CustomInput
                    type="date"
                    labelName="Request Date"
                    value={
                      formData.requestDate
                        ? moment(formData.requestDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={(e) =>
                      handleChange("requestDate", e.target.value)
                    }
                    isDisable={requestStatus === 3 || requestStatus === 4}
                  />
                </Col>
                <Col md={3}>
                  <CustomInput
                    type="text"
                    labelName="Requested By"
                    placeholder="Enter Name"
                    value={
                      editData ? formData.requestedBy : formData.requestedName
                    }
                    isDisable={true}
                  />
                </Col>
                <Col md={3}>
                  <CustomDropdown
                    dropdownLabelName="Entity"
                    valueKey="company_id"
                    labelKey="company_name"
                    options={[
                      { company_name: "Select", company_id: "" },
                      ...(companyList?.data || []),
                    ]}
                    selectedValue={formData.entity}
                    onChange={(e) => handleChange("entity", e.target.value)}
                    mandatoryIcon
                    isDisable={requestStatus === 3 || requestStatus === 4}
                  />
                </Col>
                <Col md={3}>
                  <CustomDropdown
                    dropdownLabelName="Business"
                    labelKey="businessName"
                    valueKey="businessId"
                    options={[
                      { businessName: "Select", businessId: "" },
                      ...(businesstype?.data || []),
                    ]}
                    selectedValue={formData?.business}
                    onChange={(e) => handleChange("business", e.target.value)}
                    mandatoryIcon={true}
                    isDisable={requestStatus === 3 || requestStatus === 4}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={3}>
                  <CustomDropdown
                    dropdownLabelName="Department"
                    options={[
                      { value: "", label: "Select Department" },
                      ...(Array.isArray(getDepartment_subDepartment)
                        ? getDepartment_subDepartment?.map((department) => ({
                            value: department.dept_code,
                            label: department.department_desc,
                          }))
                        : []),
                    ]}
                    onChange={(e) => handleChange("department", e.target.value)}
                    selectedValue={formData.department}
                    valueKey="value"
                    labelKey="label"
                    isDisable={requestStatus === 3 || requestStatus === 4}
                  />
                </Col>
                <Col md={3}>
                  <CustomDropdown
                    dropdownLabelName="Office Location"
                    mandatoryIcon={true}
                    options={[
                      { label: "Select", value: "" },
                      ...(building || []),
                    ]}
                    valueKey="value"
                    labelKey="label"
                    selectedValue={formData.officeLocation}
                    onChange={(e) =>
                      handleChange("officeLocation", e.target.value)
                    }
                    isDisable={requestStatus === 3 || requestStatus === 4}
                  />
                </Col>
                <Col md={3}>
                  <CustomDropdown
                    dropdownLabelName="Floor"
                    options={[
                      { label: "Select", value: "" },
                      ...(locationDropdown || []),
                    ]}
                    valueKey="value"
                    labelKey="label"
                    selectedValue={formData.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                    isDisable={requestStatus === 3 || requestStatus === 4}
                    mandatoryIcon={true}
                  />
                </Col>
                <Col md={3}>
                  <CustomDropdown
                    dropdownLabelName="Priority"
                    options={[
                      { label: "Select", value: "" },
                      ...(priorityDropdown || []),
                    ]}
                    valueKey="value"
                    labelKey="label"
                    selectedValue={formData.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                    isDisable={requestStatus === 3 || requestStatus === 4}
                  />
                </Col>
              </Row>
              <div className="d-flex align-items-center mt-3 mb-3">
                <span className="me-2">Item Details</span>{" "}
              </div>

              <SuppliesItems
                rows={rows}
                setRows={setRows}
                handleInputChange={handleInputChange}
                requestStatus={requestStatus}
                isDisable={requestStatus === 3 || requestStatus === 4}
                isUploadView={!editData ? true : false}
                isAllitemrecevied={isAllReceived}
              />
              <Row className="justify-content-end  mb-4">
                <Col xs="auto" className="d-flex align-items-center gap-2">
                  <span style={{ fontWeight: "bold" }}>Total Amount: ₹</span>
                  <span style={{ fontWeight: "bold" }}>
                    {totalAmount.toFixed(2)}
                  </span>
                </Col>
              </Row>

              <hr />
              {formData?.approvalStatus !== 1 &&
                formData?.approvalStatus !== "" &&
                isAdminLogin && (
                  <>
                    <Title title="Approval Details" />
                    <Row className="mt-3">
                      <Col md={4}>
                        <CustomDropdown
                          dropdownLabelName="Approval Status"
                          options={[
                            { label: "Select", value: "" },
                            ...(statusDropdown || []),
                          ]}
                          valueKey="value"
                          labelKey="label"
                          selectedValue={formData.approvalStatus}
                          onChange={(e) =>
                            handleChange("approvalStatus", e.target.value)
                          }
                          isDisable
                        />
                      </Col>
                      <Col md={4}>
                        <CustomInput
                          type="text"
                          labelName="Approver"
                          value={formData.approver}
                          isDisable
                        />
                      </Col>
                      <Col md={4}>
                        <CustomInput
                          type="date"
                          labelName="Approval Date"
                          value={
                            formData.approvalDate
                              ? moment(formData.approvalDate).format(
                                  "YYYY-MM-DD"
                                )
                              : ""
                          }
                          onChange={(e) =>
                            handleChange("approvalDate", e.target.value)
                          }
                          isDisable
                        />
                      </Col>
                    </Row>
                  </>
                )}

              {editData?.TOSR_VENDOR_INFORMATION &&
                isAdminLogin &&
                (requestStatus === 3 ||
                  requestStatus === 4 ||
                  requestStatus === 6) && (
                  <>
                    <div className=" mt-3 mb-3">
                      <span className="me-2 mt-4">Vendor Information</span>{" "}
                    </div>
                    <VendorInformationItem
                      vendors={vendors}
                      setVendors={setVendors}
                      handleVendorInputChange={handleVendorInputChange}
                      editData={editData}
                      emailErrors={emailErrors}
                      setEmailErrors={setEmailErrors}
                      isDisabled={requestStatus === 4}
                      vendorData={vendorData}
                    />

                    <hr />
                  </>
                )}

              {(isSecurityLogin &&
                (requestStatus === 3 ||
                  requestStatus === 4 ||
                  requestStatus === 6)) ||
              (isAdminLogin &&
                (requestStatus === 3 ||
                  requestStatus === 4 ||
                  requestStatus === 6)) ? (
                <>
                  {" "}
                  <DeliveryDetails
                    input={input}
                    setInput={setInput}
                    deliveries={deliveries}
                    isDisable={requestStatus === 4}
                    requestStatus={requestStatus}
                    itemCondition={itemCondition}
                  />
                </>
              ) : null}

              {isApproverLogin && requestStatus === 2 ? (
                <Row className="mt-3 justify-content-end">
                  <Col md={2}>
                    <CustomSingleButton
                      _ButtonText={"Approve"}
                      backgroundColor="#000"
                      Text_Color="#fff"
                      height="44px"
                      onPress={() => handleAprover("APPROVED")}
                      disabled={!isFormValid}
                    />{" "}
                  </Col>
                  <Col md={2}>
                    <CustomSingleButton
                      _ButtonText={"Reject"}
                      backgroundColor="#000"
                      Text_Color="#fff"
                      height="44px"
                      onPress={() => handleAprover("REJECTED")}
                      disabled={!isFormValid}
                    />{" "}
                  </Col>
                  <Col md={2}>
                    <CustomSingleButton
                      onPress={handleCancel}
                      _ButtonText="Cancel"
                      backgroundColor="rgb(217, 4, 41)"
                      Text_Color="#fff"
                      height={40}
                    />{" "}
                  </Col>
                </Row>
              ) : (
                <Row className="d-flex justify-content-end  mb-3">
                  <Col md={2}>
                    {!editData && (
                      <CustomSingleButton
                        _ButtonText={"Save As Draft"}
                        backgroundColor="#000"
                        Text_Color="#fff"
                        height="44px"
                        onPress={() => handleSaveOrUpdate(5)}
                        disabled={!isFormValid}
                      />
                    )}
                  </Col>{" "}
                  <Col md={2}>
                    <CustomSingleButton
                      _ButtonText={
                        isAdminLogin
                          ? requestStatus === 3 ||
                            requestStatus === 4 ||
                            requestStatus === 6
                            ? "Submit"
                            : "Send To Approver"
                          : isSecurityLogin
                          ? "Submit"
                          : "Send To Checker"
                      }
                      backgroundColor="#000"
                      Text_Color="#fff"
                      height="44px"
                      onPress={() => {
                        let status = 1;
                        let approverStatus = formData.approvalStatus;
                        if (isAdminLogin) {
                          if (
                            requestStatus === 3 ||
                            requestStatus === 4 ||
                            requestStatus === 6
                          ) {
                            status = isAllReceived ? 4 : 6;
                          } else if (formData.approvalStatus === 3) {
                            approverStatus = 1; // Set approver status to 1
                            status = 2;
                          } else {
                            status = 2;
                          }
                        } else if (isSecurityLogin) {
                          status = isAllReceived ? 4 : 6;
                        }

                        handleSaveOrUpdate(status, approverStatus);
                      }}
                      disabled={
                        !isFormValid ||
                        (!isAdminLogin &&
                          !isSecurityLogin &&
                          requestStatus !== 5 &&
                          requestStatus !== null) ||
                        (formData.approvalStatus === 2 && requestStatus === 4)
                      }
                    />
                  </Col>
                  <Col md={2}>
                    <CustomSingleButton
                      onPress={handleCancel}
                      _ButtonText="Cancel"
                      backgroundColor="rgb(217, 4, 41)"
                      Text_Color="#fff"
                      height="44px"
                    />{" "}
                  </Col>{" "}
                </Row>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewOfficeSupply;
