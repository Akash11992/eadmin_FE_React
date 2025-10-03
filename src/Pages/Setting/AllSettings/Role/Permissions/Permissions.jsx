import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import CustomSingleButton from "../../../../../Components/CustomSingleButton/CustomSingleButton";
import { useNavigate } from "react-router-dom";
import "./Permissions.css";
import MultiSelectDropdown from "../../../../../Components/CustomDropdown/MultiSelectDropdown";
import CommonLoader from "../../../../../Components/CommonLoader/CommonLoader";
import "../../General/CompanyDetails/AddCompanyDetails/AddCompanyDetail.css";
import {
  getPermissionById,
  getFetchByIdDetails,
  getModuleList,
  getPageList,
  getUpdateRole,
  getpagesAndModules,
} from "../../../../../Slices/Role/RoleSlice";
import { Title } from "../../../../../Components/Title/Title";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import MultiSelectDropdown2 from "../../../../../Components/CustomDropdown/MultiSelectDropdown2";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/saga-blue/theme.css"; // Theme CSS
import "primereact/resources/primereact.min.css";

const Permissions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [pagesAndModulesData ,setpagesAndModulesData] = useState();
  const { rolePermission, responseData } = location?.state || null;
  const roleData = rolePermission;
  // console.log('roleData..',roleData)
  // console.log('pagesAndModulesData..',pagesAndModulesData)
  const getResData = pagesAndModulesData ? pagesAndModulesData : responseData || [];
  // console.log('pagesAndModulesData',pagesAndModulesData)
  const [pageList, setPageList] = useState([]);
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const loading = useSelector((state) => state.Role.status === "loading");
  const findDetail = useSelector((state) => state.Role?.findDetailData || []);
  const moduleListData = useSelector((state) => state.Role.moduleList);
  const pageListData = useSelector((state) => state.Role.pageList);
  const [pagesFetched, setPagesFetched] = useState(false);
  const resultData = getResData?.payload?.Data?.result || {};
  // console.log("resultData..", resultData);
  const mData = Array.isArray(resultData?.module_name)
    ? resultData?.module_name
    : [];
  // console.log("mData..", mData?.length);
  const pData = Array.isArray(resultData?.Pages_name)
    ? resultData?.Pages_name
    : [];

  const modData = Array.isArray(mData)
    ? mData.map((module) => ({
        lable: module.module_name,
        value: module.module_id,
      }))
    : [];
  const pagData = Array.isArray(pData)
    ? pData.map((page) => ({
        label: page?.form_name,
        value: page?.form_id,
      }))
    : [];

  const D = modData?.map((item) => item?.value);
  const Page = pagData?.map((item) => item?.value);
  // console.log("D...", D);
  // console.log("Page...", Page);
  const [formData, setFormData] = useState({
    moduleType: modData ? D : [],
    pageType: pagData ? Page : [],
    permissions: {},
    view: 1,
    edit: 0,
    add: 0,
    delete: 0,
    import: 0,
    export: 0,
  });
  // useEffect code here..
  useEffect(() => {
    fetchModuletype();

    if (formData?.pageType?.length > 0) {
      handleFecthPagesByIdRole();
    }
  }, [formData?.pageType,pagesAndModulesData]);

  // Fetch pages whenever the moduleType changes.....
  useEffect(() => {
    if (formData?.moduleType?.length > 0) fetchPages();
  }, [formData.moduleType]);

  useEffect(() => {
    // Assuming findDetail?.data contains the response
    if (findDetail?.data) {
      const permissionData = findDetail.data.reduce((acc, form) => {
        acc[form.form_id] = {
          // form_id: form.form_id,
          // form_name: form.form_name,
          is_view: form.is_view,
          is_create: form.is_create,
          is_update: form.is_update,
          is_delete: form.is_delete,
          is_import: form.is_import,
          is_export: form.is_export,
        };
        return acc;
      }, {});

      // setFormData(permissionData);
      setFormData((prevData) => ({
        ...prevData,
        ...permissionData,
      }));
    }
  }, [findDetail?.data]);
  const mapPermissionsToForm = (findDetail) => {
    return findDetail.reduce(
      (acc, item) => ({
        view: item.is_view ? 1 : 0,
        edit: item.is_update ? 1 : 0,
        add: item.is_create ? 1 : 0,
        delete: item.is_delete ? 1 : 0,
        import: item.is_import ? 1 : 0,
        export: item.is_export ? 1 : 0,
      }),
      {}
    );
  };

  // handle input ALl field changes.....
  // const handleChange = (e, permissionType, formId) => {
  //   const { checked } = e?.target;

  //   const updatedFormData = Object?.keys(formData)?.reduce((acc, formId) => {
  //     acc[formId] = {
  //       ...formData[formId],
  //       [permissionType]: checked ? 1 : 0,
  //     };
  //     console.log("acc", acc);
  //     return acc;
  //   }, {});
  //   setFormData(updatedFormData);
  // };

  // handle input All field changes.....
  const handleCreateChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleCheckboxChange = (e, permissionType, formId) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [permissionType]: checked ? 1 : 0,
      },
    }));
  };

  // fetch all type module Name from get apis...
  const fetchModuletype = async () => {
    await dispatch(getModuleList());
  };

  const modules =
    moduleListData?.data?.map((module) => ({
      value: module.module_id,
      label: module.module_name,
    })) || [];

  const pages =
    pageListData?.data?.map((page) => ({
      value: page.form_id,
      label: page.form_name,
    })) || [];

  const fetchPages = async () => {
    if (formData.moduleType.length === 0) return;
    const payload = {
      module_ids: formData.moduleType,
    };
    const response = await dispatch(getPageList(payload));

    if (getPageList.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        setPageList(response.payload.data);
        setPagesFetched(true);
      }
    } else if (getPageList.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
      setPagesFetched(false);
    }
  };

  const handleUpdatePermissionByIdRole = async () => {
    if (!formData.moduleType || formData.moduleType.length === 0) {
      toast.warn("Please select at least one module");
      return;
    }
    console.log("formData.res....", formData);
    const permissions = {};
    Object.keys(formData).forEach((key) => {
      if (!isNaN(key)) {
        const item = formData[key];
        permissions[key] = {
          is_view: !!item.is_view,
          is_create: !!item.is_create,
          is_update: !!item.is_update,
          is_delete: !!item.is_delete,
          is_import: !!item.is_import,
          is_export: !!item.is_export,
        };
      }
    });
    const payload = {
      role_id: roleData?.roleId,
      ...permissions,
    };
    // console.log("Final Payload:", payload);

    const response = await dispatch(getUpdateRole(payload));
    if (getUpdateRole.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        // toast.success(response?.payload?.data?.message);
        const successMessage = response?.payload?.message || "Success!";
        toast.success(successMessage);

        setTimeout(() => {
          navigate("/role");
        }, 2000);
        setFormData({
          moduleType: [],
          pageType: [],
          view: 0,
          edit: 0,
          add: 0,
          delete: 0,
          import: 0,
          export: 0,
        });
        setPageList([]);
        setPagesFetched(false);
      }
    } else if (getUpdateRole.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleCreatePermission = async () => {
    if (!formData.moduleType || formData.moduleType.length === 0) {
      toast.warn("Please select at least one module");
      return;
    }
    const permission = {
      form_id: formData.pageType,
      role_id: [
        {
          roleId: roleData?.roleId,
          companyId: savedUserData?.data?.companyId,
        },
      ],
      is_create: formData.add,
      is_view: formData.view,
      is_update: formData.edit,
      is_field: 0,
      is_delete: formData.delete,
      is_export: formData.export,
      is_import: formData.import,
    };
    const response = await dispatch(getPermissionById(permission));
    if (getPermissionById.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        // toast.success(response?.payload?.data?.message);
        const successMessage = response?.payload?.message || "Success!";
        toast.success(successMessage);

        setTimeout(() => {
          navigate("/role");
        }, 2000);
        setFormData({
          moduleType: [],
          pageType: [],
          view: 0,
          edit: 0,
          add: 0,
          delete: 0,
          import: 0,
          export: 0,
        });
        setPageList([]);
        setPagesFetched(false);
      }
    } else if (getPermissionById.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleAddMorePermission = async () => {
    if (!formData.moduleType || formData.moduleType.length === 0) {
      toast.warn("Please select at least one module");
      return;
    }
    const permission = {
      form_id: newlySelectedPages,
      role_id: [
        {
          roleId: roleData?.roleId,
          companyId: savedUserData?.data?.companyId,
        },
      ],
      is_create: formData.add,
      is_view: formData.view,
      is_update: formData.edit,
      is_field: 0,
      is_delete: formData.delete,
      is_export: formData.export,
      is_import: formData.import,
    };
    const response = await dispatch(getPermissionById(permission));
    if (getPermissionById.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        // toast.success(response?.payload?.data?.message);
        const successMessage = response?.payload?.message || "Success!";
        toast.success(successMessage);
        const payload = {
          roleId: roleData?.roleId,
        }
       const responseData = await dispatch(getpagesAndModules(payload));
       setpagesAndModulesData(responseData)
      //  handleFecthPagesByIdRole();
        setPagesFetched(false);
      }
    } else if (getPermissionById.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleFecthPagesByIdRole = async () => {
    const permission = {
      form_ids: [formData.pageType],
      role_ids: [
        {
          roleId: roleData?.roleId,
          companyId: savedUserData?.data?.companyId,
          roleName: roleData?.roleName,
          groupName: savedUserData?.data?.group_name,
          commonRoleId: roleData?.commonRoleId,
          // permissionCount:""
        },
      ],
    };
    const response = await dispatch(getFetchByIdDetails(permission));
    if (getFetchByIdDetails.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        // console.log(response?.payload?.data);
      }
    } else if (getFetchByIdDetails.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      console.log(errorMessage);
    }
  };
  const findData = findDetail?.data?.map((formName) => ({
    Name: formName?.form_name,
  }));

  const handleCheckboxChangeModules = (e) => {
    setFormData((prev) => {
      const updatedModules = e.value;
      return { ...prev, moduleType: updatedModules };
    });
  };
  const [newlySelectedPages, setNewlySelectedPages] = useState([]);
  const handleCheckboxChangePages = (e) => {
    console.log('e.value..',e.value)
    setFormData((prev) => {
      const pageType = e.value;
      return { ...prev, pageType };
    });
    const newlySelected = e.value.filter(pageId => !formData.pageType.includes(pageId));
    setNewlySelectedPages(newlySelected);
  };
console.log('newlySelectedPages.',newlySelectedPages)
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row className="mb-3">
        <Col md={12}>
          <section className="content">
            <div className="container-fluid">
              <Row className="mt-3 ms-0">
                <Title title="Role" />
              </Row>
              <hr />
              <Row className="p-1">
                <Col md={4}>
                  <MultiSelectDropdown2
                    value={formData.moduleType}
                    onChange={handleCheckboxChangeModules}
                    options={modules}
                    optionLabel="label"
                    placeholder="Select Module"
                  />
                </Col>
                <Col md={4}>
                  <MultiSelectDropdown2
                    value={formData.pageType}
                    onChange={handleCheckboxChangePages}
                    // options={formData.moduleType.length > 0 ? pages : []}
                    options={pages}
                    optionLabel="label"
                    placeholder="Select Pages"
                  />
                </Col>
                {mData?.length > 0 ? (
                  <Col md={4} className="d-flex">
                    <p className="m-1">
                      if you want to add more Module / Pages
                    </p>
                    <CustomSingleButton
                      _ButtonText="Add"
                      height={40}
                      width={80}
                      onPress={handleAddMorePermission}
                    />
                  </Col>
                ) : null}
              </Row>
              <hr />

              <div className="tab-content" id="pills-tabContent">
                <Card className="card-default">
                  <Table>
                    <thead>
                      <tr>
                        <th
                          colSpan={1}
                          className="btmbrd bg-transparent text-white"
                        >
                          Roles
                        </th>
                        <th
                          colSpan={2}
                          className="btmbrd bg-transparent text-white"
                        >
                          {findDetail?.data &&
                            formData?.pageType?.length > 0 && (
                              <th
                                colSpan={1}
                                className="btmbrd bg-transparent text-white"
                              >
                                Pages
                              </th>
                            )}
                        </th>

                        <th
                          colSpan={4}
                          className="text-center bg-transparent text-white"
                        >
                          Record Permissions
                        </th>
                        <th
                          colSpan={2}
                          className="text-center bg-transparent text-white"
                        >
                          Action Permission
                        </th>
                      </tr>
                      <tr>
                        <th
                          colSpan={3}
                          className="btmbrd bg-transparent text-white"
                        ></th>
                        <th className="text-center bg-transparent text-white">
                          View
                        </th>
                        <th className="text-center bg-transparent text-white">
                          Edit
                        </th>
                        <th className="text-center bg-transparent text-white">
                          Add
                        </th>
                        <th className="text-center bg-transparent text-white">
                          Delete
                        </th>
                        <th className="text-center bg-transparent text-white">
                          Import
                        </th>
                        <th className="text-center bg-transparent text-white">
                          Export
                        </th>
                      </tr>
                    </thead>

                    {/* <thead>
                      <tr>
                        <th
                          colSpan={3}
                          className="btmbrd bg-transparent text-white"
                        ></th>
                        <th className="text-center bg-transparent text-white">
                          <center>
                            <input
                              type="checkbox"
                              name="view"
                              checked={Object.values(formData).every(
                                (item) => item.is_view === 1
                              )}
                              onChange={(e) => handleChange(e, "is_view")}
                            />
                          </center>
                        </th>
                        <th className="text-center bg-transparent text-white">
                          <center>
                            <input
                              type="checkbox"
                              name="edit"
                              checked={Object.values(formData).every(
                                (item) => item.is_update === 1
                              )}
                              onChange={(e) => handleChange(e, "is_update")}
                            />
                          </center>
                        </th>
                        <th className="text-center bg-transparent text-white">
                          <center>
                            <input
                              type="checkbox"
                              name="add"
                              checked={Object.values(formData).every(
                                (item) => item.is_create === 1
                              )}
                              onChange={(e) => handleChange(e, "is_create")}
                            />
                          </center>
                        </th>
                        <th className="text-center bg-transparent text-white">
                          <center>
                            <input
                              type="checkbox"
                              name="delete"
                              checked={Object.values(formData).every(
                                (item) => item?.is_delete === 1
                              )}
                              onChange={(e) => handleChange(e, "is_delete")}
                            />
                          </center>
                        </th>
                        <th className="text-center bg-transparent text-white">
                          <center>
                            <input
                              type="checkbox"
                              name="import"
                              checked={Object.values(formData).every(
                                (item) => item.is_import === 1
                              )}
                              onChange={(e) => handleChange(e, "is_import")}
                            />
                          </center>
                        </th>
                        <th className="text-center bg-transparent text-white">
                          <center>
                            <input
                              type="checkbox"
                              name="export"
                              checked={Object.values(formData).every(
                                (item) => item.is_export === 1
                              )}
                              onChange={(e) => handleChange(e, "is_export")}
                            />
                          </center>
                        </th>
                      </tr>
                    </thead> */}
                    {/* chnages */}

                    {mData?.length > 0 ? (
                      <tbody>
                        {findDetail?.data &&
                          findDetail.data.map((formDataItem, index) => (
                            <tr key={index}>
                              <td>
                                <strong>{roleData?.roleName}</strong>
                              </td>
                              <td>
                                <p>{formDataItem?.form_name}</p>
                              </td>
                              <td></td>

                              <td>
                                <center>
                                  <input
                                    type="checkbox"
                                    name="view"
                                    checked={
                                      formData[formDataItem.form_id]
                                        ?.is_view === 1
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "is_view",
                                        formDataItem.form_id
                                      )
                                    }
                                  />
                                </center>
                              </td>
                              <td>
                                <center>
                                  <input
                                    type="checkbox"
                                    name="edit"
                                    checked={
                                      formData[formDataItem.form_id]
                                        ?.is_update === 1
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "is_update",
                                        formDataItem.form_id
                                      )
                                    }
                                  />
                                </center>
                              </td>
                              <td>
                                <center>
                                  <input
                                    type="checkbox"
                                    name="add"
                                    checked={
                                      formData[formDataItem.form_id]
                                        ?.is_create === 1
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "is_create",
                                        formDataItem.form_id
                                      )
                                    }
                                  />
                                </center>
                              </td>
                              <td>
                                <center>
                                  <input
                                    type="checkbox"
                                    name="delete"
                                    checked={
                                      formData[formDataItem.form_id]
                                        ?.is_delete === 1
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "is_delete",
                                        formDataItem.form_id
                                      )
                                    }
                                  />
                                </center>
                              </td>
                              <td>
                                <center>
                                  <input
                                    type="checkbox"
                                    name="import"
                                    checked={
                                      formData[formDataItem.form_id]
                                        ?.is_import === 1
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "is_import",
                                        formDataItem.form_id
                                      )
                                    }
                                  />
                                </center>
                              </td>
                              <td>
                                <center>
                                  <input
                                    type="checkbox"
                                    name="export"
                                    checked={
                                      formData[formDataItem.form_id]
                                        ?.is_export === 1
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        e,
                                        "is_export",
                                        formDataItem.form_id
                                      )
                                    }
                                  />
                                </center>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    ) : (
                      <tbody>
                        {roleData && (
                          <tr>
                            <td>
                              <strong>{roleData?.roleName}</strong>
                            </td>
                            <td colSpan={2}>
                              {pagesFetched && formData.pageType.length > 0 && (
                                <td>
                                  {findData?.map((data, index) => (
                                    <div key={index}>{data?.Name}</div>
                                  ))}
                                </td>
                              )}
                            </td>

                            <td>
                              <center>
                                <input
                                  type="checkbox"
                                  name="view"
                                  checked={formData?.view === 1}
                                  onChange={handleCreateChange}
                                />
                              </center>
                            </td>
                            <td>
                              <center>
                                <input
                                  type="checkbox"
                                  name="edit"
                                  checked={formData?.edit === 1}
                                  onChange={handleCreateChange}
                                />
                              </center>
                            </td>
                            <td>
                              <center>
                                <input
                                  type="checkbox"
                                  name="add"
                                  checked={formData?.add === 1}
                                  onChange={handleCreateChange}
                                />
                              </center>
                            </td>
                            <td>
                              <center>
                                <input
                                  type="checkbox"
                                  checked={formData?.delete === 1}
                                  name="delete"
                                  onChange={handleCreateChange}
                                />
                              </center>
                            </td>
                            <td>
                              <center>
                                <input
                                  type="checkbox"
                                  name="import"
                                  checked={formData?.import === 1}
                                  onChange={handleCreateChange}
                                />
                              </center>
                            </td>
                            <td>
                              <center>
                                <input
                                  type="checkbox"
                                  name="export"
                                  checked={formData?.export === 1}
                                  onChange={handleCreateChange}
                                />
                              </center>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </Table>
                </Card>
              </div>
            </div>
          </section>
        </Col>
        {loading && <CommonLoader />}

        <Row className="mt-3 mb-2 justify-content-end">
          <Col md={3}>
            <CustomSingleButton
              _ButtonText="Submit"
              height={40}
              onPress={
                mData?.length > 0
                  ? handleUpdatePermissionByIdRole
                :
                handleCreatePermission
              }
            />
          </Col>
          <Col md={3}>
            <CustomSingleButton
              _ButtonText="Cancel"
              height={40}
              backgroundColor="#fff"
              Text_Color="#000"
              borderColor="gray"
              onPress={() => {
                navigate("/role");
              }}
            />
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default Permissions;
