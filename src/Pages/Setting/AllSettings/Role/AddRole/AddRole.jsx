import React, { useState, useEffect } from "react";
import { Title } from "../../../../../Components/Title/Title";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import CustomSingleButton from "../../../../../Components/CustomSingleButton/CustomSingleButton";
import MultiSelectDropdown from "../../../../../Components/CustomDropdown/MultiSelectDropdown";
import {
  createRole,
  updateRole,
  getcontryById,
} from "../../../../../Slices/Role/RoleSlice";
import CommonLoader from "../../../../../Components/CommonLoader/CommonLoader";
import CustomInput from "../../../../../Components/CustomInput/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getALlCompanyDetail } from "../../../../../Slices/CompanyDetails/CompanyDetailSlice";
import { getCompanyList } from "../../../../../Slices/Commondropdown/CommondropdownSlice";
import CustomDropdown from "../../../../../Components/CustomDropdown/CustomDropdown";
const AddRole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { roleId } = useParams();
  const roleData = location.state || null;
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const loading = useSelector((state) => state.Role.status === "loading");
  // const companyDetail = useSelector((state) => state.Role?.getCountry || []);
  const companyDetail = useSelector(
    (state) => state.CommonDropdownData?.companyList || []
  );
  const [formData, setFormData] = useState({
    roleName: roleData ? roleData.roleName : "",
    // designationId: roleData ? roleData.designationID : null,
    designationId: null,
    description: roleData ? roleData.description : "",
    companyIds: savedUserData ? [savedUserData?.data?.companyId] : [],
    groupName: savedUserData?.data?.group_name || "",
    company: [],
  });
  const [errors, setErrors] = useState({
    roleName: "",
    description: "",
  });
  // fetch all business from get apis...
  const fetchCompanytype = async () => {
    const response = await dispatch(getALlCompanyDetail());
    console.log("response", response);
  };

  // useEffect code here ..
  useEffect(() => {
    if (roleId) {
      console.log(roleId);
    }
    fetchCompanytype();
    fetchCompanyListData();
    handleGetCountry();
  }, [roleId]);

  const fetchCompanyListData = async () => {
    await dispatch(getCompanyList());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation for roleName and description.......
    if (name === "roleName" || name === "description") {
      if (/^[\s.]+|[\s.]+$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only spaces or dots are not allowed.",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  // validate code here ..
  const isFormValid = () => {
    const { roleName, description } = formData;
    // return roleName && description;
    return roleName && description && !errors.roleName && !errors.description;
  };

  // handle submit code here....
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      companyIds: formData.companyIds,
    };
    const response = await dispatch(createRole(payload));
    if (createRole.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        toast.success(response.payload.data.message);
        setTimeout(() => {
          navigate("/role");
        }, 2000);
      }
    } else if (createRole.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  // handle Update code here....
  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      roleIds: roleData?.roleId,
      roleName: formData?.roleName,
      description: formData?.description,
      // designation: formData?.designationId,
      designation: savedUserData?.data?.designation,
      companyIds: [savedUserData?.data?.companyId],
      // designation: 14,
      commonRoleId: roleData?.commonRoleId,
    };
    const response = await dispatch(updateRole(payload));

    if (updateRole.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        toast.success(response.payload.data.message);
        setTimeout(() => {
          navigate("/role");
        }, 2000);
      }
    } else if (updateRole.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  // handle get country code here....
  const handleGetCountry = async () => {
    const payload = {
      companyId: savedUserData?.data?.companyId,
    };
    const response = await dispatch(getcontryById(payload));
    if (getcontryById.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 201) {
        console.log("getcountry data..", response.payload.data);
      }
    } else if (getcontryById.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      // toast.warn(errorMessage);
      console.log(errorMessage);
    }
  };

  // country map code here..
  const countryList = Array.isArray(companyDetail?.data)
    ? companyDetail.data.map((company) => ({
        value: company.company_id,
        label: company.company_name,
      }))
    : [];
  console.log("countryList", countryList);
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const companyType = checked
        ? [...prev.companyType, value]
        : prev.companyType.filter((owner) => owner !== value);
      return { ...prev, companyType };
    });
  };

  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row className="mt-3 ms-0">
        <Title title="Role" />
      </Row>
      <hr />
      <Container>
        <section className="section register d-flex flex-column align-items-center justify-content-center flex-wrap">
          <Row className="justify-content-center">
            <Col
              md={6}
              className="d-flex flex-column align-items-center flex-wrap mb-3"
            >
              <Card className="w-100 m-3">
                <Card.Body>
                  <h5 className="card-title text-center">
                    {roleData?.roleName ? "Update Role" : "Add Role"}
                  </h5>
                  <hr />
                  <Form className="row needs-validation" noValidate>
                    <Form.Group as={Col} md={12}>
                      <CustomInput
                        labelName="Role Name"
                        type="text"
                        value={formData?.roleName}
                        name="roleName"
                        placeholder="Role Name"
                        onChange={handleInputChange}
                        mandatoryIcon={true}
                      />
                      {errors.roleName && (
                        <small className="text-danger">{errors.roleName}</small>
                      )}
                    </Form.Group>

                    <Form.Group as={Col} md={12} className="mt-2">
                      <Form.Label>Description</Form.Label>
                      <span className="text-danger">*</span>
                      <Form.Control
                        as="textarea"
                        placeholder="Description"
                        style={{ height: "100px" }}
                        className="shadow-none border-secondary-subtle"
                        rows={2}
                        value={formData.description}
                        name="description"
                        onChange={handleInputChange}
                      />
                      {errors.description && (
                        <small className="text-danger">
                          {errors.description}
                        </small>
                      )}
                    </Form.Group>

                    {savedUserData?.data?.is_individual == 0 ? (
                      <>
                        {/* <Form.Group as={Col} md={12} className="mt-2">
                          <MultiSelectDropdown
                            data={countryList}
                            valueKey="value"
                            labelKey="label"
                            label="Company"
                            selectLabel="Select Company"
                            value={formData.company}
                            handleCheckboxChange={handleCheckboxChange}
                          />
                        </Form.Group> */}
                        <Form.Group as={Col} md={12} className="mt-2">
                          <CustomDropdown
                            dropdownLabelName="Company"
                            options={[
                              { value: "", label: "Select company" },
                              ...(Array.isArray(countryList)
                                ? countryList.map((e) => ({
                                    value: e.value,
                                    label: e.label,
                                  }))
                                : []),
                            ]}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                company: [e.target.value],
                              })
                            }
                            selectedValue={formData.company}
                            valueKey="value"
                            labelKey="label"
                            mandatoryIcon={false}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={12} className="mt-2">
                          <CustomInput
                            labelName="Company Group"
                            type="text"
                            value={formData?.groupName}
                            name="groupName"
                            placeholder="Company Group"
                            onChange={handleInputChange}
                            mandatoryIcon={true}
                            isDisable={true}
                          />
                        </Form.Group>
                      </>
                    ) : null}
                    {loading && <CommonLoader />}
                    <Col md={12} className="mt-3">
                      <Row className="mt-3 mb-3">
                        <Col md={3}>
                          <CustomSingleButton
                            _ButtonText={roleData?.roleName ? "Update" : "Add"}
                            height={40}
                            onPress={
                              roleData?.roleName ? handleUpdate : handleSubmit
                            }
                            disabled={!isFormValid()}
                          />
                        </Col>
                        <Col md={3}>
                          <CustomSingleButton
                            _ButtonText="Close"
                            height={40}
                            backgroundColor="#dc3545"
                            onPress={() => {
                              navigate("/role");
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default AddRole;
