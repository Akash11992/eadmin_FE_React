import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyList } from '../../../../../../Slices/Commondropdown/CommondropdownSlice';
import CustomDropdown from '../../../../../../Components/CustomDropdown/CustomDropdown';
import CustomInput from '../../../../../../Components/CustomInput/CustomInput';
import MultiEmailInput from '../../../../../../Components/CustomInput/MultiEmailInput';
import MultiSelectDropdown from '../../../../../../Components/CustomDropdown/MultiSelectDropdown';
import { fetchDepartment_SubDepartments } from '../../../../../../Slices/TravelManagementSlice/TravelManagementsSlice';
import { getBusinessTypes } from '../../../../../../Slices/CompanyDetails/CompanyDetailSlice';
import { alertDeletePettyCash, alertInsertPettyCash, getAllAlertList } from '../../../../../../Slices/PettyCashManagement/PettyCashSlice';
import { toast, ToastContainer } from 'react-toastify';
import CustomTable from '../../../../../../Components/CustomeTable/CustomTable';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ExportToXLSX } from '../../../../../../Components/Excel-JS/ExportToXLSX';
import DeleteAlert from '../../../../../../Components/Validations/DeleteAlert';

const AlertFormBalanceSummary = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    amount: "",
    to: "",
    too:"",
    cc: "",
    department: "",
    balance: "",
    business: "",
    to3:""
  });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const gelAlertList = useSelector((state) => state.PettyCash?.getAllAlert);
  const companyList = useSelector((state) => state.CommonDropdownData.companyList?.data || []);
  const businesstype = useSelector((state) => state.companyDetail.bussinessData?.data || []);
  const departmentList = useSelector((state) => state.TravelManagement.getDepartment_subDepartment || []);

  const filteredData = gelAlertList?.data?.map((item) => {
    const {
      ["BusinessId"]: _,
      ["CompanyId"]: __,
      ["DepartmentId"]: ___,
      ...rest
    } = item;
    return rest;
  });

  useEffect(() => {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  useEffect(() => {
    dispatch(getCompanyList());
    dispatch(getBusinessTypes());
    dispatch(getAllAlertList());
  }, [dispatch]);

  useEffect(() => {
    if (formData.business) {
      dispatch(fetchDepartment_SubDepartments({
        busineesId: formData.business,
        deptCode: null
      }));
    }
  }, [formData.business]);

 useEffect(() => {
  if (selectedAlert && departmentList.length > 0) {
    const dept = departmentList.find(
      (d) => d.department_desc === selectedAlert?.Department
    );

    const deptCode = dept?.dept_code || "";
      
    setFormData((prev) => ({
      ...prev,
      department: [deptCode].toString(), 
    }));
  }
}, [departmentList, selectedAlert]);


  const handleFormChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value),
    }));
  };

  const resetForm = () => {
    setFormData({
      company: "",
      amount: "",
      to: "",
      too:"",
      cc: "",
      department: [],
      balance: "",
      business: "",
      to3:""
    });
    setSelectedAlert(null);
  };

  const handleEdit = (item) => {  
    const companyObj = companyList.find(
      (company) => company.company_name === item?.Company
    );
    const companyId = companyObj?.company_id;

    const businessObj = businesstype.find(
      (business) => business.businessName === item?.Business
    );
    const businessId = businessObj?.businessId;

    setSelectedAlert(item);

    setFormData({
      company: companyId || "",
      business: businessId || "",
      department:[], 
      balance: item.Minimum_Balance,
      amount: item.Actual_Amount,
      to: item.ToEmail,
      too: item.ToEmail_2,
      cc: item.CC_Email,
      to3: item.ToEmail_3
    });

    if (businessId) {
      dispatch(fetchDepartment_SubDepartments({
        busineesId: businessId,
        deptCode: null
      }));
    }
  };

  const handleDelete = async (item) => {
    const params = {
      action: "DELETE",
      apc_id: item.ID,
      lastModifiedBy: userData?.data?.name,
    };

    DeleteAlert({
      onDelete: async () => {
        const response = await dispatch(alertDeletePettyCash(params));
        const result = response?.payload?.[0]?.result;
        if (result) toast.success(result);
        dispatch(getAllAlertList());
      },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (
      !formData.company ||
      !formData.amount ||
      !formData.balance ||
      !formData.to ||
      !formData.too ||
      !formData.cc || !formData.to3
    ) {
      toast.warning("Please fill in all required fields");
      return;
    }

    const params = {
      action: selectedAlert ? "UPDATE" : "INSERT",
      apc_id: selectedAlert ? selectedAlert.ID : null,
      company_id: formData.company,
      buss_id: formData.business || null,
      dept_id: formData.department?.[0] || null,
      min_bal: formData.balance,
      req_amt: formData.amount,
      to: formData.to,
      too: formData.too,
      cc: formData.cc,
      createdBy: userData?.data?.name,
      lastModifiedBy: selectedAlert ? userData?.data?.name : null,
      to3: formData.to3
    };

    const response = await dispatch(alertInsertPettyCash(params));
    const result = response?.payload?.[0]?.result;

    if (response?.error) {
      toast.error("Error saving data");
    } else {
      toast.success(result);
      resetForm();
      dispatch(getAllAlertList());
    }
  };

  const handleExportExcel = () => {
    if (gelAlertList?.data?.length > 0) {
      ExportToXLSX(gelAlertList?.data, "Balance Summary Alert Details");
    } else {
      toast.warning("No Records Found");
    }
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

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Row className="mb-2">
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Select Company"
            options={[{ company_id: "", company_name: "Select company" }, ...companyList]}
            selectedValue={formData.company}
            onChange={(e) => handleFormChange("company", e.target.value)}
            labelKey="company_name"
            valueKey="company_id"
            mandatoryIcon={true}
          />
        </Col>
        <Col md={4}>
          <CustomDropdown
            dropdownLabelName="Business"
            options={[{ businessId: "", businessName: "Select Business" }, ...businesstype]}
            selectedValue={formData.business}
            onChange={(e) => handleFormChange("business", e.target.value)}
            valueKey="businessId"
            labelKey="businessName"
          />
        </Col>
        <Col md={4}>
          <MultiSelectDropdown
            data={departmentList}
            valueKey="dept_code"
            labelKey="department_desc"
            value={formData.department}
            label="Department"
            handleCheckboxChange={(e) => handleCheckboxChange(e, "department")}
            selectLabel="Select Department"
          />
        </Col>
      </Row>

      <Row className="mt-2">
        <Col md={4}>
          <CustomInput
            labelName="Minimum Balance"
            type="number"
            height="38px"
            prefix="₹"
            value={formData.balance}
            onChange={(e) => {
              const val = e.target.value;
              if (Number(val) > 0) handleFormChange("balance", val);
            }}
            mandatoryIcon={true}
          />
        </Col>
        <Col md={4}>
          <CustomInput
            labelName="Actual Amount"
            type="number"
            height="38px"
            prefix="₹"
            value={formData.amount}
            onChange={(e) => {
              const val = e.target.value;
              if (Number(val) > 0) handleFormChange("amount", val);
            }}
            mandatoryIcon={true}
          />
        </Col>
        <Col md={4}>
          <Form.Group controlId="toEmail">
            <MultiEmailInput
              emails={formData?.to?.split(",") || []}
              onChange={(emails) => handleFormChange("to", emails.join(","))}
              label="To (Email)"
              placeHolder="Enter recipient email"
              mandatoryIcon={true}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-2">
      <Col md={4}>
          <Form.Group controlId="tooEmail">
            <MultiEmailInput
              emails={formData?.too?.split(",") || []}
              onChange={(emails) => handleFormChange("too", emails.join(","))}
              label="To (Email-II)"
              placeHolder="Enter II-recipient email"
              mandatoryIcon={true}
            />
          </Form.Group>
        </Col>
         <Col md={4}>
          <Form.Group controlId="to3Email">
            <MultiEmailInput
              emails={formData?.to3?.split(",") || []}
              onChange={(emails) => handleFormChange("to3", emails.join(","))}
              label="To (Email-III)"
              placeHolder="Enter III-recipient email"
              mandatoryIcon={true}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="ccEmail">
            <MultiEmailInput
              emails={formData?.cc?.split(",") || []}
              onChange={(emails) => handleFormChange("cc", emails.join(","))}
              label="CC (Email)"
              placeHolder="Enter CC Email"
              mandatoryIcon={true}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col md={12}>
          <Button variant="dark" type="submit" onClick={handleSave}>
            {selectedAlert ? "Update" : "Save"}
          </Button>{" "}
          <Button variant="danger" type="reset" onClick={resetForm}>
            Cancel
          </Button>{" "}
          <Button variant="dark" onClick={handleExportExcel}>
            Export to Excel
          </Button>
        </Col>
      </Row>

      <CustomTable
        data={filteredData}
        firstColumnVisibility={true}
        dataContained={filteredData?.length || null}
        pageCount={page}
        handlePageClick={(page) => setPage(page)}
        rowsPerPage={rowsPerPage}
        handleItemsPerPageChange={(val) => {
          setRowsPerPage(parseInt(val, 10));
          setPage(0);
        }}
        actions={actions}
        actionVisibility={true}
        marginTopTable={true}
        lineVisibility={true}
      />
    </>
  );
};

export default AlertFormBalanceSummary;
