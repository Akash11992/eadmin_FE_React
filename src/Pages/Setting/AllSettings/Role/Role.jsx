import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import "./Role.css";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
  getRoleTypes,
  deleteRole,
  getRoleCount,
  getpagesAndModules,
} from "../../../../Slices/Role/RoleSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "sweetalert2/dist/sweetalert2.min.css";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Title } from "../../../../Components/Title/Title";
import DeleteAlert from "../../../../Components/Validations/DeleteAlert";
import CommonLoader from "../../../../Components/CommonLoader/CommonLoader";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";

const Role = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roleCounts, setRoleCounts] = useState({});
  const { status } = useSelector((state) => state.Role);
  const roletypeData = useSelector((state) => state.Role.getRoleData);
  const savedUserData = JSON.parse(localStorage.getItem("userData"));
  const roles = roletypeData.data || [];
  const loading = status === "loading";
  const permissionDetailData = useSelector(
    (state) => state.Role?.permissionDetails || []
  );
  const { Role } = permissionDetailData.data || {};

  // useEffect code here ..
  useEffect(() => {
    fetchRoletype();
  }, []);

  useEffect(() => {
    if (roles.length > 0) {
      handleRoleCount();
    }
  }, [roles]);

  // fetch role all type from get apis...
  const fetchRoletype = async () => {
    await dispatch(getRoleTypes());
  };

  const ConfigurePermissions = async (e, roleId) => {
    e.preventDefault();
    const rolePermission = roles?.find((role) => role.roleId === roleId);
    const payload = {
      roleId: roleId,
    };
    const responseData = await dispatch(getpagesAndModules(payload));
    console.log("responseData..", responseData);
    // navigate("/permissions", { state: rolePermission });
    navigate("/permissions", {
      state: {
        rolePermission,
        responseData,
      },
    });
  };

  // handle edit code here..
  const handleEdit = (roleId) => {
    const roleToEdit = roles.find((role) => role.roleId === roleId);
    if (roleToEdit) {
      navigate(`/addRole`, { state: roleToEdit });
    }
  };

  // handle delete function code here....
  const handleRoleDelete = async (roleId) => {
    console.log("handleRoleDelete called with ID:", roleId);
    const payload = {
      roleId,
      companyIds: savedUserData?.data?.companyId,
    };
    const response = await dispatch(deleteRole(payload));
    if (deleteRole.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        toast.success(response.payload.data.message);
        fetchRoletype();
      }
    } else if (deleteRole.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      toast.warn(errorMessage);
    }
  };

  const handleDelete = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "black",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "custom-popup",
        title: "custom-title",
        content: "custom-content",
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleRoleDelete(roleId);
      }
    });
  };

  // handle role count function code here....
  const handleRoleCount = async (roleId) => {
    const payload = {
      role_data: roles.map((role) => ({
        roleId: role.roleId,
        company_id: savedUserData?.data?.companyId,
      })),
    };

    const response = await dispatch(getRoleCount(payload));
    if (getRoleCount.fulfilled.match(response)) {
      if (response?.payload?.statusCode === 200) {
        const roleCountsMap = response?.payload?.count.reduce((acc, item) => {
          acc[item.role_id] = item.count;
          return acc;
        }, {});
        console.log("roleCountsMap", roleCountsMap);
        setRoleCounts(roleCountsMap);
      }
    } else if (getRoleCount.rejected.match(response)) {
      const errorMessage =
        response?.payload?.message || "An unknown error occurred.";
      console.log(errorMessage);
    }
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
      <Container fluid>
        <Row className="mb-2">
          <Col md={10}>
            <h5>
              Create different roles and assign permissions to each role to
              access organizational data
            </h5>
          </Col>
          {Role?.create ? (
            <Col md={2}>
              <CustomSingleButton
                _ButtonText="+ Add Role"
                height={40}
                onPress={() => {
                  navigate("/addRole");
                }}
              />
            </Col>
          ) : null}
        </Row>

        <div className="card-body">
          <Row>
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <Col md={4} key={role?.roleId}>
                  <Card className={`card-default card-custom`}>
                    <Card.Header>
                      <Row className="align-items-baseline">
                        <Col md={8}>
                          <h5 className="text-center">{role?.roleName}</h5>
                        </Col>
                        {Role?.update || Role?.delete ? (
                          <Col md={4} className="text-end d-flex">
                            {Role?.update ? (
                              <div
                                onClick={() => handleEdit(role.roleId)}
                                className="btn btn-link"
                              >
                                <FaEdit
                                  className="text-warning-emphasis"
                                  size={18}
                                />
                              </div>
                            ) : null}

                            {Role?.delete ? (
                              <div
                                onClick={() =>
                                  DeleteAlert({
                                    onDelete: () => handleDelete(role?.roleId),
                                  })
                                }
                                className="btn btn-link"
                              >
                                <MdDelete className="text-danger" size={20} />
                              </div>
                            ) : null}
                          </Col>
                        ) : null}
                      </Row>
                    </Card.Header>
                    <Card.Body className="p-0">
                      <Table size="sm" className="mb-0">
                        <tbody>
                          <tr>
                            <td>
                              <div className="p-4">
                                <a
                                  href="#"
                                  onClick={(e) =>
                                    ConfigurePermissions(e, role.roleId)
                                  }
                                >
                                  <span className="rolebtn">
                                    Configure permissions
                                  </span>
                                </a>
                              </div>
                            </td>
                            <td className="p-4">
                              <label>
                                <a href="">
                                  <span className="rolebtn">
                                    {/* {roleCounts[role.roleId] || 0} */}
                                    {roleCounts[role.roleId] || 0}
                                  </span>
                                </a>
                              </label>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="fw-bold text-center">No roles available</p>
            )}
          </Row>
        </div>
      </Container>
      {loading && <CommonLoader />}
    </div>
  );
};

export default Role;
