import { useCallback, useState, useEffect } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import "./ConveyanceMobileView/MobileView.css";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomAutoComplete from "../../../Components/CustomAutoComplete/CustomAutoComplete";
import { insertPettycashConveyance } from "../../../Slices/PettyCashManagement/PettyCashSlice";
import { useDispatch, useSelector } from "react-redux";
import { getTravelModeDetails } from "../../../Slices/PettyCashManagement/PettyCashDropdownSlice";
import { getShipperNameDropdown } from "../../../Slices/CourierSevices/CourierSevicesSlice";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { getBusinessTypes } from "../../../Slices/CompanyDetails/CompanyDetailSlice";
import MultiSelectDropdown from "../../../Components/CustomDropdown/MultiSelectDropdown";
import { getCompanyList } from "../../../Slices/Commondropdown/CommondropdownSlice";
import { fetchDepartment_SubDepartments } from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";

const Conveyance = (props) => {
  const { formState, isViewMode, path } = props;

  const [file, setFile] = useState([]);
  const [getData, setGetData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([
    {
      date: "",
      user_id: "",
      businessId: "",
      user_name: "",
      company_details: "",
      user_details: "",
      travel_mode: ["3"],
      travel_details: [],
      amount: [],
      remark: "",
      file: "",
      voucher_date: "",
      from_place: "",
      remarks: "",
      isDisableUser: true,
    },
  ]);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { state } = location;
  const { voucherData, isEditMode, voucherType } = state || {};

  const travelModeAllData = useSelector(
    (state) => state?.PettyCashDropdown?.travelModeData
  );
  const userNameDropdown = useSelector(
    (state) => state.CourierService?.shipperNameDropdown?.data || []
  );
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  const { companyList } = useSelector((state) => state.CommonDropdownData);

  const { getDepartment_subDepartment } = useSelector(
    (state) => state.TravelManagement
  );
  const Bussiness = businesstype?.data;

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

  useEffect(() => {
    fetchbusinesstype();
    dispatch(getCompanyList());
    dispatch(fetchDepartment_SubDepartments({ busineesId: null }));
  }, []);

  const fetchbusinesstype = async () => {
    await dispatch(getBusinessTypes());
  };
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await dispatch(getTravelModeDetails("TRAVEL_MODE"));
      await dispatch(getShipperNameDropdown());

      if (isEditMode || voucherData) {
        const dataToUse = voucherData;
        const employeeDetails =
          userNameDropdown.find((item) => item.Emp_id === dataToUse.user_id) ||
          {};

        setRows([
          {
            date: parseDate(dataToUse.Expense_Date),
            user_id: dataToUse.user_id,
            user_name: employeeDetails.Employee || dataToUse["User Name"] || "",
            businessId: employeeDetails.businessId || "",
            company_details: dataToUse.company_id || "",
            user_details: dataToUse.department || "",
            travel_mode: dataToUse.travel_id || "",
            travel_details:
              dataToUse["travel_details"] || dataToUse.from_place || "",
            amount: dataToUse.amounts || dataToUse.amount || "",
            remark: dataToUse.Remark || dataToUse.remarks || "",
            file: dataToUse.Document || dataToUse.file || "",
            voucher_date: parseDate(dataToUse["Voucher Date"] || ""),
            from_place:
              dataToUse["Travel Details"] || dataToUse.from_place || "",
            remarks: dataToUse.Remark || dataToUse.remarks || "",
            isDisableUser:
              employeeDetails?.role_name === "admin" ? false : true,
          },
        ]);
      }
      setIsLoading(false);
    };

    initializeData();
  }, []);

  useEffect(() => {
    // Update employee details when userNameDropdown changes
    if (isEditMode && voucherData && userNameDropdown.length > 0) {
      const dataToUse = voucherData;
      const employeeDetails = userNameDropdown.find(
        (item) => item.Emp_id === dataToUse.user_id
      );

      if (employeeDetails) {
        setRows((prevRows) => {
          return prevRows.map((row) => ({
            ...row,
            user_name: employeeDetails.Employee,
            company_details: employeeDetails.company_name,
            user_details: employeeDetails.user_details,
          }));
        });
      }
    }
  }, [userNameDropdown, isEditMode, voucherData]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        date: "",
        user_id: "",
        businessId: "",
        travel_mode: ["3"],
        travel_details: [],
        amount: [],
        remark: "",
        file: "",
        voucher_date: "",
        from_place: "",
        remarks: "",
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
  const handleEmployeeNameChange = useCallback(
    async (selectedValue, index) => {
      if (selectedValue && selectedValue.Employee) {
        const { Employee, Emp_id, company_id, department, role_name } =
          selectedValue;
        const updatedRows = [...rows];
        updatedRows[index] = {
          ...updatedRows[index],
          user_name: Employee,
          user_id: Emp_id,
          company_details: company_id,
          user_details: department,
          isDisableUser: role_name === "admin" ? false : true,
        };
        setRows(updatedRows);
      } else {
        const updatedRows = [...rows];
        updatedRows[index] = {
          ...updatedRows[index],
          user_name: "",
          user_id: "",
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
    const updatedRows = [...rows];

    updatedRows[index] = {
      ...updatedRows[index],
      [name]: value,
      ...(name === "voucher_date" && { date: value }),
      ...(name === "from_place" && { travel_details: value }),
      ...(name === "remarks" && { remark: value }),
    };

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

  const handleTravelMode = (e, index) => {
    const { value, checked, field } = e.target;
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const currentModes = Array.isArray(updatedRows[index].travel_mode)
        ? [...updatedRows[index].travel_mode]
        : [];

      if (checked) {
        if (!currentModes.includes(value)) {
          currentModes.push(value);
        }
      } else {
        const removeIndex = currentModes.indexOf(value);
        if (removeIndex > -1) {
          currentModes.splice(removeIndex, 1);
        }
      }

      updatedRows[index].travel_mode = currentModes.sort((a, b) => a - b);
      return updatedRows;
    });
  };

  const handleTravelDetailChange = (rowIndex, travelIndex, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].travel_details[travelIndex] = value;
    setRows(updatedRows);
  };

  const handleAmountChange = (rowIndex, travelIndex, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].amount[travelIndex] = value;
    setRows(updatedRows);
  };

  const createPayload = (rows) => {
    return rows.map((row) => ({
      date: row.date || "",
      user_id: row.user_id || "",
      businessId: row.businessId || "",
      travel_mode: row.travel_mode || "",
      travel_details: row.travel_details || "",
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
        row.user_id &&
        row.travel_mode &&
        row.travel_details &&
        row.amount &&
        row.company_details &&
        row.user_details
    );
  };

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
console.log(voucherData,"voucherData")
  const handleSave = async (status) => {
    setIsLoading(true);

    if (!rows || rows.length === 0) {
      toast.error("No data to save.");
      setIsLoading(false);
      return;
    }
    if (!formState.selectedVoucherValue || !formState.createdBy) {
      toast.warning("Please fill all required fields");
      setIsLoading(false);
      return;
    }
    if (!validateRows(rows)) {
      toast.warning("Please fill all required fields");
      setIsLoading(false);
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
        toast.success("Voucher Saved Successfully");
        setTimeout(() => {
          navigate("/voucherCreation");
        }, 2000);
      } else {
        toast.error("Error saving voucher.");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Unexpected error saving data");
      setIsLoading(false);
    }
  };

  const selectedUser = userNameDropdown.find(
    (user) => user.Emp_id === rows[0]?.user_id
  );

  const role = selectedUser?.role_name || "";

  useEffect(() => {}, [getData]);
  const handleCancle = async () => {
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
  if (formState?.selectedVoucherValue == "1" || voucherType == "1") {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick={true}
        />
        <div id="conveyance-form">
          <div className="card-body">
            <hr />
            <h3>
              Conveyance{" "}
              {isViewMode ? "(View Mode)" : isEditMode ? "(Edit Mode)" : ""}
            </h3>
            <hr />

            <div className="container-fluid my-4 p-0" id="conveyance_table_div">
              <Table bordered hover responsive style={{ whiteSpace: "pre" }}>
                <thead>
                  <tr>
                    <th style={{ backgroundColor: "#d90429", color: "white" }}>
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
                      Travel Mode
                    </th>
                    {rows?.some(
                      (row) =>
                        Array.isArray(row.travel_mode) &&
                        row.travel_mode.length > 1
                    ) && (
                      <th
                        style={{
                          backgroundColor: "#d90429",
                          color: "white",
                          minWidth: "200px",
                        }}
                      >
                        Selected Travel Modes
                      </th>
                    )}
                    <th
                      style={{
                        backgroundColor: "#d90429",
                        color: "white",
                        minWidth: "200px",
                      }}
                    >
                      Travel Details
                    </th>
                    <th
                      style={{
                        backgroundColor: "#d90429",
                        color: "white",
                        minWidth: "150px",
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
                      Upload File
                    </th>
                    <th style={{ backgroundColor: "#d90429", color: "white" }}>
                      Add
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows?.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <CustomInput
                          type="date"
                          name="voucher_date"
                          value={row.date}
                          onChange={(e) => handleInput(e, index)}
                          placeholder="Enter Date"
                          isMax={new Date().toISOString().split("T")[0]}
                          isDisable={isViewMode ? true : false}
                        />
                      </td>
                      <td>
                        <CustomAutoComplete
                          field={"Employee"}
                          data={userNameDropdown}
                          onChange={(e) => handleEmployeeNameChange(e, index)}
                          placeholder="Enter User Name"
                          value={
                            userNameDropdown.find(
                              (item) =>
                                item.Employee === row.user_name ||
                                item.Emp_id === row.user_id
                            ) || ""
                          }
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
                        {/* <CustomInput
                          type="text"
                          name="company_details"
                          value={row.company_details}
                          onChange={(e) => handleInput(e, index)}
                          placeholder="Company Details"
                          isDisable={true}
                        /> */}
                      </td>
                      <td>
                        <CustomDropdown
                          labelKey="department_desc"
                          valueKey="dept_code"
                          Dropdownlable
                          options={getDepartment_subDepartment}
                          selectedValue={row.user_details}
                          onChange={(e) => handleInput(e, index)}
                          isDisable={row.isDisableUser}
                          name="user_details"
                        />
                        {/* <CustomInput
                          type="text"
                          name="user_details"
                          value={row.user_details}
                          onChange={(e) => handleInput(e, index)}
                          placeholder="User Department"
                          isDisable={true}
                        /> */}
                      </td>
                      <td>
                        {/* <CustomDropdown
                          labelKey="label"
                          valueKey="value"
                          options={[
                            { value: null, label: "Select Mode" },
                            ...(Array.isArray(travelModeAllData?.data)
                              ? travelModeAllData?.data?.map((e) => ({
                                  value: e.value,
                                  label: e.label,
                                }))
                              : []),
                          ]}
                          selectedValue={row.travel_mode}
                          onChange={(e) => handleTravelMode(e, index)}
                        /> */}
                        <MultiSelectDropdown
                          data={travelModeAllData?.data}
                          valueKey="value"
                          labelKey="label"
                          value={row.travel_mode}
                          handleCheckboxChange={(e) =>
                            handleTravelMode(e, index)
                          }
                          selectLabel="Select"
                          isDisabled={isViewMode ? true : false}
                        />
                      </td>
                      {rows.some(
                        (r) =>
                          Array.isArray(r.travel_mode) &&
                          r.travel_mode.length > 1
                      ) && (
                        <td>
                          {Array.isArray(row.travel_mode) &&
                          row.travel_mode.length > 1
                            ? row.travel_mode.map((tm, travelIndex) => {
                                const modeLabel =
                                  travelModeAllData?.data?.find(
                                    (m) => m.value == tm
                                  )?.label || tm;
                                return (
                                  <CustomInput
                                    key={travelIndex}
                                    type="text"
                                    value={modeLabel}
                                    isDisable={true}
                                    className="mb-2"
                                  />
                                );
                              })
                            : ""}
                        </td>
                      )}
                      <td>
                        {/* <CustomInput
                          type="text"
                          name="from_place"
                          value={row.from_place}
                          onChange={(e) => handleInput(e, index)}
                          placeholder="Enter Travel Details"
                        /> */}
                        <td>
                          {(Array.isArray(row.travel_mode)
                            ? row.travel_mode
                            : []
                          ).map((tm, travelIndex) => {
                            // Find label for current mode value
                            const modeLabel =
                              travelModeAllData?.data?.find(
                                (m) => m.value == tm
                              )?.label || tm;

                            return (
                              <CustomInput
                                key={travelIndex}
                                type="text"
                                placeholder={`Enter details for ${modeLabel}`}
                                value={row.travel_details[travelIndex] || ""}
                                onChange={(e) =>
                                  handleTravelDetailChange(
                                    index,
                                    travelIndex,
                                    e.target.value
                                  )
                                }
                                isDisable={isViewMode ? true : false}
                                className="mb-2"
                              />
                            );
                          })}
                        </td>
                      </td>
                      <td>
                        {/* <CustomInput
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
                        /> */}
                        <td>
                          {(Array.isArray(row.travel_mode)
                            ? row.travel_mode
                            : []
                          ).map((tm, travelIndex) => (
                            <CustomInput
                              key={travelIndex}
                              type="text"
                              placeholder="Enter amount"
                              value={row.amount[travelIndex] || ""}
                              onChange={(e) =>
                                handleAmountChange(
                                  index,
                                  travelIndex,
                                  e.target.value
                                )
                              }
                              isDisable={isViewMode ? true : false}
                              className="mb-3"
                            />
                          ))}
                        </td>
                      </td>
                      <td>
                        <CustomInput
                          type="text"
                          name="remarks"
                          value={row.remarks}
                          onChange={(e) => handleInput(e, index)}
                          placeholder="Enter Remark"
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
                              disabled={isViewMode}
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
                          (total, row) =>
                            total +
                            (Array.isArray(row.amount)
                              ? row.amount.reduce(
                                  (rowTotal, amt) =>
                                    rowTotal + (parseFloat(amt) || 0),
                                  0
                                )
                              : 0),
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
                {isEditMode ? (
                  ""
                ) : (
                  <CustomSingleButton
                    onPress={() => handleSave(2)}
                    _ButtonText="Send for Approval"
                    backgroundColor="#000"
                    height="44px"
                    width="auto"
                  />
                )}
                {isViewMode ? (
                  ""
                ) : (
                  <>
                    <CustomSingleButton
                      onPress={() => handleSave(1)}
                      _ButtonText={isEditMode ? "Update" : "Save"}
                      backgroundColor="#000"
                      height="44px"
                      width="auto"
                    />
                  </>
                )}
                <CustomSingleButton
                  onPress={handleCancle}
                  _ButtonText="Cancel"
                  backgroundColor="#000"
                  height="44px"
                  width="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return null;
};

export default Conveyance;
