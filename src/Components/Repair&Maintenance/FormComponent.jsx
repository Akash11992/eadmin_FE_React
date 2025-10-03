import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import CustomInput from "../CustomInput/CustomInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import SuppliesItems from "../../Pages/OfficeSupply/SuppliesItems";
import CustomSingleButton from "../CustomSingleButton/CustomSingleButton";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { getBusinessTypes } from "../../Slices/CompanyDetails/CompanyDetailSlice";
import { getCompanyList } from "../../Slices/Commondropdown/CommondropdownSlice";
import {
  getBuildingDropdown,
  getLocationDropdown,
  getPriorityDropdown,
} from "../../Slices/OfficeSupply/OfficeSupplySlice";
import {
  fetchDepartment_SubDepartments,
  fetchEmpDropDownData,
} from "../../Slices/TravelManagementSlice/TravelManagementsSlice";
import CommonLoader from "../CommonLoader/CommonLoader";

const FormComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    TOSR_REQUESTED_BY: null,
    TOSR_REQUEST_DATE: today,
    TOSR_LOCATION_ID: null,
    TOSR_FLOOR_ID: null,
    TOSR_DEPARTMENT_ID: null,
    TOSR_PRIORITY: "2",
    TOSR_BUSINESS_ID: null,
    TOSR_ENTITY: null,
  });

  const [rows, setRows] = useState([
    {
      id: uuidv4(),
      TOSR_CATEGORY_ID: null,
      TOSR_ITEM_ID: null,
      TOSR_C_ITEM_ID: null,
      TOSR_QUANTITY: null,
      TOSR_RATE: null,
      TOSR_AMOUNT: null,
      TOSR_RECEIVED_ITEMS: null,
      itemsList: [],
      TOSR_GST: null,
    },
  ]);

  const savedUserData = JSON.parse(localStorage.getItem("userData")) || [];
  const businesstype = useSelector((state) => state.companyDetail.bussinessData);
  const { priorityDropdown, building, locationDropdown } = useSelector((state) => state.OfficeSupply);
  const { companyList } = useSelector((state) => state.CommonDropdownData);
  const { getEmpDropData, getDepartment_subDepartment } = useSelector(
    (state) => state.TravelManagement
  );

  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = useCallback((name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const defaultId = useMemo(() => {
    const matchedUser = getEmpDropData?.find(
      (emp) => emp.userId === savedUserData?.data?.userId
    );
    return matchedUser || null;
  }, [getEmpDropData, savedUserData]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      TOSR_ENTITY: defaultId?.company_id,
    }));
  }, [defaultId?.company_id]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      TOSR_BUSINESS_ID: defaultId?.business,
    }));
  }, [defaultId?.business]);

  // Validate form
  useEffect(() => {
    const isValid =
      formData.TOSR_BUSINESS_ID &&
      formData.TOSR_LOCATION_ID &&
      formData.TOSR_ENTITY &&
      rows.some(
        (row) => row.TOSR_CATEGORY_ID && row.TOSR_ITEM_ID && row.TOSR_QUANTITY
      );
    setIsFormValid(isValid);
  }, [formData.TOSR_BUSINESS_ID, formData.TOSR_LOCATION_ID, formData.TOSR_ENTITY, rows]);

  // Fetch dropdown data on component mount
  useEffect(() => {
    dispatch(getPriorityDropdown("PRIORITY"));
    dispatch(getBuildingDropdown({ type: "building", id: 0 }));
    fetchDepartmentsDetails();
    dispatch(getBusinessTypes());
    dispatch(fetchEmpDropDownData());
    dispatch(getCompanyList());
  }, [dispatch, formData.TOSR_BUSINESS_ID]);

  // Fetch location dropdown when location ID changes
  useEffect(() => {
    if (formData.TOSR_LOCATION_ID) {
      const payload = { type: "location", id: formData.TOSR_LOCATION_ID };
      dispatch(getLocationDropdown(payload));
    }
  }, [formData.TOSR_LOCATION_ID, dispatch]);

  // Set requested by user on component mount
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      TOSR_REQUESTED_BY: savedUserData?.data?.userId,
    }));
  }, [savedUserData?.data?.userId]);

  const fetchDepartmentsDetails = async () => {
    const payload = {
      busineesId: formData.TOSR_BUSINESS_ID || 0,
    };

    try {
      await dispatch(fetchDepartment_SubDepartments(payload));
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
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

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setLoading(true);
    try {
      const payload = {
        TOSR_REQUESTED_BY: formData.TOSR_REQUESTED_BY || "",
        TOSR_REQUEST_DATE: formData?.TOSR_REQUEST_DATE,
        TOSR_DEPARTMENT_ID: formData.TOSR_DEPARTMENT_ID || null,
        TOSR_LOCATION_ID: formData.TOSR_LOCATION_ID || null,
        TOSR_FLOOR_ID: formData.TOSR_FLOOR_ID || null,
        TOSR_PRIORITY: formData.TOSR_PRIORITY,
        TOSR_ITEMS_DETAILS: rows?.map((row) => ({
          TOSR_CATEGORY_ID: row.TOSR_CATEGORY_ID ? Number(row.TOSR_CATEGORY_ID) : null,
          TOSR_ITEM_ID: row.TOSR_ITEM_ID ? Number(row.TOSR_ITEM_ID) : null,
          TOSR_QUANTITY: row.TOSR_QUANTITY ? Number(row.TOSR_QUANTITY) : 0,
          TOSR_RATE: row.TOSR_RATE ? parseFloat(row.TOSR_RATE) : 0,
          TOSR_AMOUNT: row.TOSR_AMOUNT ? parseFloat(row.TOSR_AMOUNT) : 0,
          TOSR_RECEIVED_ITEMS: row.TOSR_RECEIVED_ITEMS ? Number(row.TOSR_RECEIVED_ITEMS) : 0,
          TOSR_GST: parseFloat(row.TOSR_GST) || 0,
        })),
        TOSR_REQUEST_STATUS: 1,
        TOSR_BUSINESS_ID: formData.TOSR_BUSINESS_ID || null,
        TOSR_APPROVER_STATUS: 1,
        TOSR_ENTITY: formData.TOSR_ENTITY || null,
      };

      // TODO: Replace with actual maintenance request API call
      // const response = await dispatch(maintenanceRequest(payload));
      toast.success("Request submitted successfully");
      resetForm();
      navigate("/maintenance-requests");
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      TOSR_REQUESTED_BY: "",
      TOSR_REQUEST_DATE: today,
      TOSR_LOCATION_ID: "",
      TOSR_FLOOR_ID: "",
      TOSR_DEPARTMENT_ID: "",
      TOSR_PRIORITY: "2",
      TOSR_BUSINESS_ID: "",
      TOSR_ENTITY: "",
    });
    setRows([
      {
        id: uuidv4(),
        TOSR_CATEGORY_ID: null,
        TOSR_ITEM_ID: null,
        TOSR_C_ITEM_ID: null,
        TOSR_QUANTITY: null,
        TOSR_RATE: null,
        TOSR_AMOUNT: null,
        TOSR_RECEIVED_ITEMS: null,
        itemsList: [],
        TOSR_GST: null,
      },
    ]);
  };
  return (
    <div className="container-fluid bookmakerTable  rounded-3 table-responsive">
      <ToastContainer position="top-right" autoClose={5000} />
      {loading && <CommonLoader />}
      {!loading && (
        <div className="row">
          <div className="col" id="main">
            <div className="container-fluid mt-3">
              <form>
                <Row>
                  <Col md={3} className="mt-3">
                    <CustomInput
                      type="text"
                      labelName="Raised By"
                      placeholder="Enter Name"
                      value={savedUserData?.data?.name}
                      isDisable={true}
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomInput
                      type="text"
                      labelName="Subject"
                      placeholder="Enter Subject"
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomInput
                      type="text"
                      labelName="Description"
                      placeholder="Enter Description"
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomInput
                      type="text"
                      labelName="Service Vendor"
                      placeholder="Enter Service Vendor"
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomInput
                      type="text"
                      labelName="Contact Person"
                      placeholder="Enter Contact Person"
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomInput
                      type="date"
                      labelName="Raised Date"
                      value={formData.TOSR_REQUEST_DATE}
                      onChange={(e) => handleChange("TOSR_REQUEST_DATE", e.target.value)}
                      isMin={today}
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomDropdown
                      dropdownLabelName="Entity"
                      valueKey="company_id"
                      labelKey="company_name"
                      options={[
                        { company_name: "Select", company_id: "" },
                        ...(companyList?.data || []),
                      ]}
                      selectedValue={formData.TOSR_ENTITY}
                      onChange={(e) => handleChange("TOSR_ENTITY", e.target.value)}
                      mandatoryIcon
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomDropdown
                      dropdownLabelName="Business"
                      labelKey="businessName"
                      valueKey="businessId"
                      options={[
                        { businessName: "Select", businessId: "" },
                        ...(businesstype?.data || []),
                      ]}
                      selectedValue={formData?.TOSR_BUSINESS_ID}
                      onChange={(e) => handleChange("TOSR_BUSINESS_ID", e.target.value)}
                      mandatoryIcon={true}
                    />
                  </Col>
                  <Col md={3} className="mt-3">
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
                      labelKey="label"
                      valueKey="value"
                      onChange={(e) => handleChange("TOSR_DEPARTMENT_ID", e.target.value)}
                      selectedValue={formData.TOSR_DEPARTMENT_ID}
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomDropdown
                      dropdownLabelName="Office Location"
                      mandatoryIcon={true}
                      options={[
                        { label: "Select", value: "" },
                        ...(building || []),
                      ]}
                      labelKey="label"
                      valueKey="value"
                      selectedValue={formData.TOSR_LOCATION_ID}
                      onChange={(e) => handleChange("TOSR_LOCATION_ID", e.target.value)}
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomDropdown
                      dropdownLabelName="Floor"
                      options={[
                        { label: "Select", value: "" },
                        ...(locationDropdown || []),
                      ]}
                      labelKey="label"
                      valueKey="value"
                      selectedValue={formData.TOSR_FLOOR_ID}
                      onChange={(e) => handleChange("TOSR_FLOOR_ID", e.target.value)}
                    />
                  </Col>
                  <Col md={3} className="mt-3">
                    <CustomDropdown
                      dropdownLabelName="Priority"
                      options={[
                        { label: "Select", value: "" },
                        ...(priorityDropdown || []),
                      ]}
                      labelKey="label"
                      valueKey="value"
                      selectedValue={formData.TOSR_PRIORITY}
                      onChange={(e) => handleChange("TOSR_PRIORITY", e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="mt-4 d-flex justify-content-between align-items-center">
                  <span className="me-2">Item Details</span>
                </Row>

                <SuppliesItems
                  rows={rows}
                  setRows={setRows}
                  handleInputChange={handleInputChange}
                  isUploadView={true}
                />
                <div className="d-flex justify-content-end gap-3 mb-3">
                  <CustomSingleButton
                    _ButtonText="Send To Checker"
                    backgroundColor="#000"
                    Text_Color="#fff"
                    height="44px"
                    width="auto"
                    onPress={handleSubmit}
                    disabled={!isFormValid}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormComponent;
