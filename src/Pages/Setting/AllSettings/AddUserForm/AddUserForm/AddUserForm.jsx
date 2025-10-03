import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomInput from "../../../../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../../../../Components/CustomSingleButton/CustomSingleButton";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import CustomDropdown from "../../../../../Components/CustomDropdown/CustomDropdown";
import CommonLoader from "../../../../../Components/CommonLoader/CommonLoader";
import { getDesignations } from "../../../../../Slices/Commondropdown/CommondropdownSlice";
import { getRoleTypes } from "../../../../../Slices/Role/RoleSlice";
import {
  CreateUserDetails,
  updateUserDetails,
} from "../../../../../Slices/ManageUserSlice/ManageUserSlice";
import { getBusinessTypes } from "../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getCompanyList } from "../../../../../Slices/Commondropdown/CommondropdownSlice";
import { getDepartments } from "../../../../../Slices/Commondropdown/CommondropdownSlice";
import { getRMname } from "../../../../../Slices/ManageUserSlice/ManageUserSlice";
import MultiSelectDropdown from "../../../../../Components/CustomDropdown/MultiSelectDropdown";

const AddUserForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userToEdit = location.state || null;
  const updateCatchData = location.state?.manageUserData;
  console.log('updateCatchData...',updateCatchData)
  const [formValues, setFormValues] = useState({
    name: updateCatchData ? updateCatchData?.username : "",
    email: updateCatchData ? updateCatchData?.userEmail : "",
    role: updateCatchData ? updateCatchData?.roleId : null,
    designationId: updateCatchData ? updateCatchData.designationId : null,
    companyId: updateCatchData ? updateCatchData.company_id : null,
    departmentId: updateCatchData ? updateCatchData.departmentId : null,
    RManager: updateCatchData ? updateCatchData.RM_EmpID : null,
    business: updateCatchData ? updateCatchData.businessId : null,
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const reportingManagers =
    useSelector((state) => state.ManageUser.RMname) || [];
  const rmdata = reportingManagers?.Data || [];
  const designationTypeData = useSelector(
    (state) => state.CommonDropdownData.designation
  );
  const departmentData =
    useSelector((state) => state.CommonDropdownData.departments) || [];
  const roleTypeData = useSelector((state) => state.Role.getRoleData);
  const companyListData =
    useSelector((state) => state.CommonDropdownData.companyList) || [];
  const businesstype = useSelector(
    (state) => state.companyDetail.bussinessData
  );
  useEffect(() => {
    fetchDesignationtype();
    fetchRoletypes();
    fetchCompanyListData();
    fetchDepartments();
    fetchbusinesstype();
    fetchRMname();
  }, []);

  const validateEmail = (email) => {
    const emailPattern =
      /^(?!\d+@)\w+([-+.']\w+)*@(?!\d+\.)\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return emailPattern.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation .......
    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "only alphabets are allowed.",
        }));
      } else if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "spaces or dots are not allowed.",
        }));
      } else if (!/^[A-Z]/.test(value.trim())) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: "the first word must be uppercase.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
      }
    }

    // Email validation
    if (name === "email") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email cannot be empty or contain only spaces.",
        }));
      } else if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
      }
    }
    if (name === "password") {
      if (value.length < 6) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be at least 6 characters long.",
        }));
      } else {
        const regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!regex.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password:
              "Password must include uppercase, lowercase, number, and special character.",
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
        }
      }
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const fetchbusinesstype = async () => {
    await dispatch(getBusinessTypes());
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const fetchRoletypes = async () => {
    await dispatch(getRoleTypes());
  };

  const fetchDesignationtype = async () => {
    await dispatch(getDesignations());
  };

  const fetchCompanyListData = async () => {
    await dispatch(getCompanyList());
  };
  const fetchDepartments = async () => {
    await dispatch(getDepartments());
  };
  const fetchRMname = async () => {
    await dispatch(getRMname());
  };
  // validate code here ..
  const isFormValid = () => {
    const {
      name,
      email,
      role,
      designationId,
      password,
      companyId,
      departmentId,
      RManager,
      business,
    } = formValues;

    return (
      name &&
      !errors.name &&
      email &&
      !errors.email &&
      role &&
      designationId &&
      password &&
      !errors.password &&
      companyId &&
      departmentId &&
      RManager &&
      business
    );
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      Name: formValues.name,
      Username: formValues.email,
      Email: formValues.email,
      Password: formValues.password,
      company_id: Number(formValues.companyId),
      designationId: parseInt(formValues.designationId),
      roleId: formValues.role,
      department: formValues.departmentId,
      RM_EmpID: formValues.RManager,
      business_id: formValues.business,
    };

    try {
      const response = await dispatch(CreateUserDetails(userData));
      setLoading(false);
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload.message || "User created successfully!");
        setTimeout(() => {
          navigate("/manageUser");
        }, 2000);
      } else {
        toast.error(response.error.message || "Failed to create user");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      Name: formValues.name,
      Username: formValues.email,
      Email: formValues.email,
      Password: formValues.password,
      company_id: Number(formValues.companyId),
      designationId: parseInt(formValues.designationId),
      roleId: formValues.role,
      department: formValues.departmentId,
      RM_EmpID: formValues.RManager,
      business_id: formValues.business,
    };

    try {
      const response = await dispatch(
        updateUserDetails({ ...userData, userId: updateCatchData?.userId })
      );
      setLoading(false);
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(response.payload.message || "User updated successfully!");
        setTimeout(() => {
          navigate("/manageUser");
        }, 2000);
      } else {
        toast.error(response.error.message || "Failed to update user");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userToEdit) {
      handleUpdateUser(e);
    } else {
      handleCreateUser(e);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    setFormValues((prev) => {
      const currentBusiness = Array.isArray(prev.business) ? prev.business : [];
      let updatedBusiness;
      if (checked) {
        updatedBusiness = [...currentBusiness, value];
      } else {
        updatedBusiness = currentBusiness.filter((id) => id !== value);
      }
      console.log("Updated business array:", updatedBusiness);
      return { ...prev, business: updatedBusiness };
    });
  };
  const handleClose = () => {
    navigate("/manageUser");
  };
  // const selectedBusinessObjects = businesstype?.data?.filter((business) =>
  //   formValues?.business?.includes(business.businessId)
  // );
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Container className="mt-4 mb-4">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
        />
        <Row className="justify-content-center">
          <Col md={12}>
            <div className="card">
              <div className="card-body">
                <div className="pt-1">
                  <h5 className="card-title text-center fs-4 text-danger">
                    {userToEdit ? "Edit User" : "Add User"}
                  </h5>
                  <p className="text-center small">
                    Enter your User details to {userToEdit ? "edit" : "add"}{" "}
                    User
                  </p>
                </div>
                <hr />

                {!loading && (
                  <form
                    className="row g-3 needs-validation"
                    onSubmit={handleSubmit}
                  >
                    <Col md={4}>
                      <CustomInput
                        labelName="Name"
                        type="text"
                        value={formValues.name}
                        placeholder="Your Colleague's Name comes here"
                        onChange={handleInputChange}
                        name="name"
                      />
                      {errors.name && (
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.name}
                        </small>
                      )}
                    </Col>

                    <Col md={4}>
                      <CustomInput
                        labelName="Email Address"
                        type="email"
                        value={formValues.email}
                        placeholder="Your Colleague's Email Address comes here"
                        onChange={handleInputChange}
                        name="email"
                      />
                      {errors.email && (
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.email}
                        </small>
                      )}
                    </Col>

                    <Col md={4}>
                      <CustomDropdown
                        dropdownLabelName="Assign Role"
                        options={[
                          {
                            value: "",
                            label: "Select a role for your Colleague",
                          },
                          ...(Array.isArray(roleTypeData?.data)
                            ? roleTypeData.data.map((e) => ({
                                value: e.roleId,
                                label: e.roleName,
                              }))
                            : []),
                        ]}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            role: e.target.value,
                          })
                        }
                        selectedValue={formValues.role}
                        valueKey="value"
                        labelKey="label"
                        mandatoryIcon={true}
                      />
                    </Col>

                    <Col md={4} className="mt-2">
                      <CustomDropdown
                        dropdownLabelName="Designation"
                        options={[
                          { value: "", label: "Select Designation" },
                          ...designationTypeData.map((e) => ({
                            value: e.dm_id,
                            label: e.dm_name,
                          })),
                        ]}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            designationId: e.target.value,
                          })
                        }
                        selectedValue={parseInt(formValues.designationId)}
                        valueKey="value"
                        labelKey="label"
                        mandatoryIcon={true}
                      />
                    </Col>

                    <Col md={4} className="mt-2">
                      <CustomDropdown
                        dropdownLabelName="Company"
                        options={[
                          { value: "", label: "Select company" },
                          ...(Array.isArray(companyListData?.data)
                            ? companyListData?.data?.map((e) => ({
                                value: e.company_id,
                                label: e.company_name,
                              }))
                            : []),
                        ]}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            companyId: Number(e.target.value),
                          })
                        }
                        selectedValue={formValues.companyId}
                        valueKey="value"
                        labelKey="label"
                        // mandatoryIcon={true}
                      />
                    </Col>
                    <Col md={4} className="mt-2">
                      <CustomDropdown
                        dropdownLabelName="Department"
                        options={[
                          { value: "", label: "Select Department" },
                          ...(Array.isArray(departmentData)
                            ? departmentData.map((department) => ({
                                value: department.dept_code,
                                label: department.department_desc,
                              }))
                            : []),
                        ]}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            departmentId: e.target.value,
                          })
                        }
                        selectedValue={parseInt(formValues.departmentId)}
                        valueKey="value"
                        labelKey="label"
                        mandatoryIcon={true}
                      />
                    </Col>

                    <Col md={4} className="mt-2">
                      <CustomDropdown
                        dropdownLabelName="Business Name"
                        options={[
                          { value: "", label: "Select Business" },
                          ...(Array.isArray(businesstype?.data)
                            ? businesstype?.data.map((business) => ({
                                value: business.businessId,
                                label: business.businessName,
                              }))
                            : []),
                        ]}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            business: e.target.value,
                          })
                        }
                        selectedValue={formValues.business}
                        valueKey="value"
                        labelKey="label"
                        mandatoryIcon={true}
                      />
                    </Col>
                    <Col md={4} className="mt-2">
                      <CustomDropdown
                        dropdownLabelName="Reporting Manager"
                        options={[
                          { value: "", label: "Select Reporting Manager" },
                          ...(Array.isArray(rmdata)
                            ? rmdata.map((manager) => ({
                                value: manager.RM_EmpID,
                                label: manager.RM_Name,
                              }))
                            : []),
                        ]}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            RManager: e.target.value,
                          })
                        }
                        selectedValue={formValues.RManager}
                        valueKey="value"
                        labelKey="label"
                        mandatoryIcon={true}
                      />
                    </Col>

                    <Col md={4} className="mt-2 position-relative">
                      <div style={{ position: "relative" }}>
                        <CustomInput
                          labelName="Password"
                          type={showPassword ? "text" : "password"}
                          value={formValues.password}
                          placeholder="Enter Your Password"
                          onChange={handleInputChange}
                          name="password"
                        />
                        <span
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            right: "20px",
                            top: "70%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                      {errors.password && (
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.password}
                        </small>
                      )}
                    </Col>

                    <Row className="mt-3 mb-2 justify-content-end">
                      <Col md={2}>
                        <CustomSingleButton
                          _ButtonText={userToEdit ? "Update" : "Submit"}
                          height={40}
                          onPress={handleSubmit}
                          disabled={!isFormValid()}
                        />
                      </Col>
                      <Col md={2}>
                        <CustomSingleButton
                          _ButtonText="Cancel"
                          height={40}
                          backgroundColor="#dc3545"
                          onPress={handleClose}
                        />
                      </Col>
                    </Row>
                  </form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      {loading && <CommonLoader />}
    </div>
  );
};

export default AddUserForm;
