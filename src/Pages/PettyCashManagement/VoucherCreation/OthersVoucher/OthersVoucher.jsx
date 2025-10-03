import React, { useState, useEffect, useCallback } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import CustomAutoComplete from "../../../../Components/CustomAutoComplete/CustomAutoComplete";
import { getShipperNameDropdown } from "../../../../Slices/CourierSevices/CourierSevicesSlice";
import { insertPettycashConveyance } from "../../../../Slices/PettyCashManagement/PettyCashSlice";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import {
  getFile,
  uploadFile,
} from "../../../../Slices/Attachment/attachmentSlice";
import { getBusinessTypes } from "../../../../Slices/CompanyDetails/CompanyDetailSlice";
import CustomDropdown from "../../../../Components/CustomDropdown/CustomDropdown";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import { getCompanyList } from "../../../../Slices/Commondropdown/CommondropdownSlice";
import { fetchDepartment_SubDepartments } from "../../../../Slices/TravelManagementSlice/TravelManagementsSlice";

const OthersVoucher = ({ formState, isViewMode, path }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { voucherData, isEditMode, voucherType } = state || {};
  const userNameDropdown = useSelector(
    (state) => state.CourierService?.shipperNameDropdown?.data || []
  );
  const { companyList } = useSelector((state) => state.CommonDropdownData);

  const { getDepartment_subDepartment } = useSelector(
    (state) => state.TravelManagement
  );
  const userAttachment = useSelector((state) => state.Attachment?.attachment);
  const [file, setFile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const parseDate = (dateString) => {
    if (!dateString) return "";
    if (typeof dateString === "string" && dateString.includes("-")) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
    }

    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    } catch (e) {
      console.warn("Date parsing error:", e);
    }

    return "";
  };

  const [rows, setRows] = useState(() => {
    if (voucherData) {
      const dataToUse = voucherData;

      // Find approver details if available
      const approverDetails = userNameDropdown.find(
        (item) => item.Emp_id === dataToUse.user_id
      );

      return [
        {
          date: parseDate(dataToUse.Expense_Date),
          userName: approverDetails?.Employee || dataToUse["User Name"] || "",
          userId: dataToUse.user_id || "",
          company_details: dataToUse.company_id || "",
          user_details: dataToUse.department || "",
          service: dataToUse.Service || "",
          amount: dataToUse.Amount || "",
          remark: dataToUse.Remark || "",
          file: dataToUse.Document || "",
          voucher_date: parseDate(dataToUse["Voucher Date"] || dataToUse.date),
          isDisableUser: approverDetails?.role_name === "admin" ? false : true,
        },
      ];
    }

    // Default new voucher
    return [
      {
        date: "",
        userName: "",
        userId: "",
        company_details: "",
        user_details: "",
        service: "",
        amount: "",
        remark: "",
        file: "",
        voucher_date: "",
        isDisableUser: true,
      },
    ];
  });

  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  const Bussiness = businesstype?.data;
  useEffect(() => {
    fetchbusinesstype();
    dispatch(getCompanyList());
    dispatch(fetchDepartment_SubDepartments({ busineesId: null }));
  }, []);
  const fetchbusinesstype = async () => {
    await dispatch(getBusinessTypes());
  };
  const selectedUser = userNameDropdown.find(
    (user) => user.Emp_id === rows[0]?.user_id
  );
  const role = selectedUser?.role_name || "";

  const handleBusinessChange = (selectedBusiness, index) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      ...updatedRows[index],
      businessId: selectedBusiness.value,
      businessName: selectedBusiness.label,
      businessCode: selectedBusiness.businessCode,
      companyName: selectedBusiness.companyName,
    };
    setRows(updatedRows);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getShipperNameDropdown());
    setIsLoading(false);
  }, [dispatch, isEditMode, voucherData]);



  const addRow = () => {
    setRows([
      ...rows,
      {
        date: "",
        userName: "",
        userId: "",
        company_details: "",
        user_details: "",
        service: "",
        amount: "",
        remark: "",
        file: "",
        voucher_date: "",
        isDisableUser: true,
      },
    ]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  const handleUserChange = useCallback(
    (selectedValue, index) => {
      if (selectedValue && selectedValue.Employee) {
        const { Employee, Emp_id, company_id, department, role_name } =
          selectedValue;

        const updatedRows = [...rows];
        updatedRows[index] = {
          ...updatedRows[index],
          userName: Employee,
          userId: Emp_id,
          company_details: company_id,
          user_details: department,
          isDisableUser: role_name === "admin" ? false : true,
        };
        setRows(updatedRows);
      } else {
        const updatedRows = [...rows];
        updatedRows[index] = {
          ...updatedRows[index],
          userName: "",
          userId: "",
          company_details: "",
          user_details: "",
        };
        setRows(updatedRows);
      }
    },
    [rows]
  );

  const handleInput = (e, index) => {
    const { name, value } = e.target;
    console.log(e.target,"e.target")
    const updatedRows = [...rows];

    const updatedRow = {
      ...updatedRows[index],
      [name]: value,
    };

    if (name === "voucher_date") {
      updatedRow.date = value;
    }

    updatedRows[index] = updatedRow;
    setRows(updatedRows);
  };

  const handleFileChange = (event, index) => {
    const uploadedFile = event.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const updatedRows = [...rows];

    if (uploadedFile && !allowedTypes.includes(uploadedFile.type)) {
      toast.error("Invalid file format. Only PDF, JPG, JPEG, PNG are allowed.");
      updatedRows[index].file = "";
      setRows(updatedRows);
      const updatedFiles = [...file];
      updatedFiles[index] = null;
      setFile(updatedFiles);
      return;
    }
    updatedRows[index].file = uploadedFile ? uploadedFile.name : "";
    setRows(updatedRows);

    const updatedFiles = [...file];
    updatedFiles[index] = uploadedFile;
    setFile(updatedFiles);
  };

  const createPayload = (rows) => {
    return rows.map((row) => ({
      date: row.date || "",
      user_id: row.userId || "",
      service: row.service || "",
      amount: row.amount || "",
      remark: row.remark || "",
      file: row.file || "",
      company_details: row.company_details || "",
      user_details: row.user_details || "",
    }));
  };

  const validateRows = (rows) => {
    return rows.every(
      (row) =>
        row.date &&
        row.userId &&
        row.service &&
        row.amount &&
        row.company_details &&
        row.user_details
    );
  };

  const handleSave = async (status) => {
    setIsLoading(true);

    if (!formState.selectedVoucherValue || !formState.createdBy) {
      toast.warning("Please fill all required fields");
      setIsLoading(false);
      return;
    }
    if (!rows || rows.length === 0) {
      toast.error("No data to save.");
      return;
    }

    if (!validateRows(rows)) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = new FormData();
    payload.append("voucherType", formState.selectedVoucherValue);
    payload.append("status", status);
    payload.append("createdBy", formState.createdBy);
    payload.append("voucherData", JSON.stringify(createPayload(rows)));
    payload.append("id", voucherData ? voucherData["Voucher ID"] : "");

    (file || []).forEach((f) => {
      if (f) payload.append("file", f);
    });

    try {
      const response = await dispatch(insertPettycashConveyance(payload));
      if (response?.meta?.requestStatus === "fulfilled") {
        const successMsg = response?.payload?.[0]?.result;
        toast.success(successMsg);
        setTimeout(() => {
          navigate("/voucherCreation");
        }, 2000);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    }
    setIsLoading(false);
  };

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Are you sure for Cancel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      width: "500px",
      customClass: {
        popup: "custom-popup",
      },
    });

    if (result.isConfirmed) {
      navigate(path);
    }
  };

  if (isLoading) {
    return <CommonLoader />;
  }

  if (formState.selectedVoucherValue == 6 || voucherType == "6") {
    return (
      <div id="others-voucher-form">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <div className="card-body">
          <hr />
          <h3>
            Others{" "}
            {isViewMode ? "(View Mode)" : isEditMode ? "(Edit Mode)" : ""}
          </h3>
          <hr />

          <div className="container-fluid my-4 p-0">
            <Table bordered hover responsive style={{ whiteSpace: "pre" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      width: "120px",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      minWidth: "175px",
                    }}
                  >
                    User Name
                  </th>
                  {/* {role === "admin" ? (
                    <th
                      style={{
                        backgroundColor: "#d90429",
                        color: "white",
                        minWidth: "175px",
                      }}
                    >
                      Business
                    </th>
                  ) : null} */}
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      minWidth: "175px",
                    }}
                  >
                    Company Details
                  </th>
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      minWidth: "175px",
                    }}
                  >
                    User Department
                  </th>
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      minWidth: "175px",
                    }}
                  >
                    Service
                  </th>
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      minWidth: "175px",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      minWidth: "175px",
                    }}
                  >
                    Remark
                  </th>
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      minWidth: "175px",
                    }}
                  >
                    Upload
                  </th>
                  <th
                    style={{
                      backgroundColor: "#d90429",
                      color: "white",
                      width: "80px",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((row, index) => (
                  <tr key={index}>
                    <td style={{ width: "120px" }}>
                      <CustomInput
                        type="date"
                        name="voucher_date"
                        value={row.date}
                        onChange={(e) => handleInput(e, index)}
                        placeholder="Enter Date"
                        isMax={new Date().toISOString().split("T")[0]}
                        style={{ width: "100%" }}
                        isDisable={isViewMode ? true : false}
                      />
                    </td>

                    <td>
                      <CustomAutoComplete
                        field={"Employee"}
                        data={userNameDropdown}
                        onChange={(e) => handleUserChange(e, index)}
                        placeholder="Select User"
                        value={
                          userNameDropdown.find(
                            (item) =>
                              item.Employee === row.userName ||
                              item.Emp_id === row.userId
                          ) || ""
                        }
                        style={{ width: "100%" }}
                        disabled={isViewMode ? true : false}
                      />
                    </td>
                    {/* {role === "admin" ? (
                      <td>
                        <CustomDropdown
                          labelKey="label"
                          valueKey="value"
                          options={[
                            { value: null, label: "Select Business" },
                            ...(Array.isArray(Bussiness)
                              ? Bussiness?.map((e) => ({
                                  value: e.businessId,
                                  label: `${e.businessName} (${e.business_code})`,
                                }))
                              : []),
                          ]}
                          selectedValue={row.businessId}
                          onChange={(e) => handleBusinessChange(e, index)}
                          isDisable={isViewMode ? true : false}
                        />
                      </td>
                    ) : null} */}
                    <td>
                      {/* <CustomInput
                        type="text"
                        name="company_details"
                        value={row.company_details}
                        onChange={(e) => handleInput(e, index)}
                        placeholder="Company Details"
                        isDisable={true}
                        style={{ width: "100%" }}
                      /> */}
                      <CustomDropdown
                        labelKey="label"
                        valueKey="value"
                        options={[
                          { value: null, label: "Select" },
                          ...(Array.isArray(companyList?.data)
                            ? companyList?.data?.map((e) => ({
                                value: e.company_id,
                                label: e.company_name,
                              }))
                            : []),
                        ]}
                        selectedValue={row.company_details}
                        onChange={(e) => handleInput(e, index)}
                        isDisable={row.isDisableUser}
                        name="company_details"
                      />
                    </td>

                    <td>
                      {/* <CustomInput
                        type="text"
                        name="user_details"
                        value={row.user_details}
                        onChange={(e) => handleInput(e, index)}
                        placeholder="User Department"
                        isDisable={true}
                        style={{ width: "100%" }}
                      /> */}
                      <CustomDropdown
                        labelKey="department_desc"
                        valueKey="dept_code"
                        Dropdownlable
                        options={getDepartment_subDepartment}
                        selectedValue={row.user_details}
                        onChange={(e) => handleInput(e, index)}
                        isDisable={row.isDisableUser}
                        name= "user_details"
                      />
                    </td>

                    <td>
                      <CustomInput
                        type="text"
                        name="service"
                        value={row.service}
                        onChange={(e) => handleInput(e, index)}
                        placeholder="Enter Service"
                        style={{ width: "100%" }}
                        isDisable={isViewMode ? true : false}
                      />
                    </td>

                    <td>
                      <CustomInput
                        type="text"
                        name="amount"
                        value={row.amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*$/.test(value)) {
                            handleInput(e, index);
                          }
                        }}
                        placeholder="Enter Amount"
                        style={{ width: "100%" }}
                        isDisable={isViewMode ? true : false}
                      />
                    </td>

                    <td>
                      <CustomInput
                        type="text"
                        name="remark"
                        value={row.remark}
                        onChange={(e) => handleInput(e, index)}
                        placeholder="Enter Remark"
                        style={{ width: "100%" }}
                        isDisable={isViewMode ? true : false}
                      />
                    </td>

                    <td>
                      <input
                        id={`fileUpload-${index}`}
                        type="file"
                        accept=".pdf, .jpg, .jpeg, .png"
                        className="form-control"
                        onChange={(e) => handleFileChange(e, index)}
                        style={{ width: "100%" }}
                        disabled={isViewMode ? true : false}
                      />
                      <div className="text-muted mt-1">
                        <small>
                          Only PDF, JPG, JPEG, PNG files are allowed
                        </small>
                      </div>
                      {row.file && !file && (
                        <div className="mt-1">
                          <small>Current file: {row.file}</small>
                        </div>
                      )}
                    </td>

                    <td>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="danger"
                          className="btn-sm me-1"
                          onClick={() => removeRow(index)}
                          disabled={rows.length === 1 || isViewMode}
                        >
                          -
                        </Button>

                        {index === rows.length - 1 && (
                          <Button
                            variant="dark"
                            className="btn-sm"
                            onClick={addRow}
                            disabled={isViewMode ? true : false}
                          >
                            +
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Total Amount:
                    <span>
                      {rows.reduce(
                        (total, row) => total + (parseFloat(row.amount) || 0),
                        0
                      )}
                    </span>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tbody>
            </Table>

            <div className="mt-3 mb-2">
              <Alert
                variant="warning"
                style={{
                  backgroundColor: "#fff3cd",
                  color: "#856404",
                  margin: "0",
                }}
              >
                Note: Please click on + button to add rows
              </Alert>
            </div>

            <div className="d-flex justify-content-end gap-3 mb-3 mt-2">
              {!isViewMode && (
                <>
                  <CustomSingleButton
                    onPress={() => handleSave(2)}
                    _ButtonText="Send for Approval"
                    backgroundColor="#000"
                    height="44px"
                    width="auto"
                  />
                  <CustomSingleButton
                    onPress={() => handleSave(1)}
                    _ButtonText={isEditMode ? "Update" : "Save"}
                    backgroundColor="#000"
                    height="44px"
                    width="auto"
                  />{" "}
                </>
              )}
              <CustomSingleButton
                onPress={handleCancel}
                _ButtonText="Cancel"
                backgroundColor="#000"
                height="44px"
                width="auto"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default OthersVoucher;
