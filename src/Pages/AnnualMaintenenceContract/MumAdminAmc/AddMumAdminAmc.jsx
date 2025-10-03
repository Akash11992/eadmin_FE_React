import { Card, Col, Form, Row } from "react-bootstrap";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../Components/Title/Title";
import { useCallback, useEffect, useState } from "react";
import AmcDetailsComponent from "./AmcDetailsComponent";
import Amcperiod from "./Amcperiod";
import BudgetTable from "./BudgetTable";
import { useDispatch, useSelector } from "react-redux";
import { getMumAdmin, insertMumAdmin } from "../../../Slices/AMC/AMCSlice";
import { toast, ToastContainer } from "react-toastify";
import {
  getFile,
  updateFile,
  uploadFile,
} from "../../../Slices/Attachment/attachmentSlice";
import { useLocation, useNavigate } from "react-router-dom";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import CancelAlert from "../../../Components/Validations/CancelAlert";
import removeSpecialCharacter from "../../../Components/CustomInput/removeSpecialCharacter";
import validateFile from "../../../Components/CustomInput/fileValidation";

const AddMumAdminAmc = () => {
  const [form, setForm] = useState({
    vendor: null,
    equip_details: null,
    entity: null,
    type: null,
    service_sch: null,
    paymentTerm: null,
    po_number: null,
    budget_details: [],
    ref_id: null,
    file: null,
    location: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state;
  const { mumAdmin } = useSelector((state) => state.AMC);
  const data = mumAdmin?.data?.data[0] || [];
  const loading = useSelector((state) => state.AMC.status === "loading");
  const AttachmentDetails = useSelector((state) => state.Attachment.attachment);
  console.log(data, "data");
  useEffect(() => {
    type && type?.type === "editMode" && type?.id && fetchDetails();
  }, [type?.id]);

  useEffect(() => {
    if (type?.type === "editMode" && data && type?.id) {
      setForm({
        vendor: data["Vendor"] || null,
        equip_details: data?.EquipDetails || null,
        entity: data["Entity"] || null,
        type: data["AMC Type"] || null,
        service_sch: data["Service Schedule"] || null,
        paymentTerm: data["Payment Term"] || null,
        budget_details:
          data["BudgetDetails"]?.map((budget) => ({
            financialYear: budget["Financial Year"] || null,
            budgetedAmount: budget["Budgeted Amount"] || null,
            actualAmount: budget["Acutal Amount"] || null,
            increasePercent: budget["Increase In %"] || 0,
            increaseAmount: budget["Increase In Amount"] || 0,
            startDate: budget["Start Date"] || null,
            endDate: budget["End Date"] || null,
            status: budget["AMC Status"],
            gst: budget["GST"],
            totalAmount: budget["Total Amount"],
            poNumber: budget["PO Number"] || null,
            file: null,
            fileUrl: budget?.file || null,
          })) || [],
        ref_id: data["ID"] || null,
        location: data["Location"],
      });
    }
  }, [type?.id, data]);

  useEffect(() => {
    const Payload = {
      referenceName: "Admin Mum AMC",
      referenceKey: type?.id,
      referenceSubName: null,
    };
    dispatch(getFile(Payload));
  }, [type?.id]);

  const handleFormChange = useCallback((name, value) => {
    let sanitizedValue = value;
    setForm((prevState) => ({ ...prevState, [name]: sanitizedValue }));
  }, []);

  const handleSave = async () => {
    try {
      const response = await dispatch(insertMumAdmin(form));
      if (response.payload.statusCode === 400) {
        console.log(response.payload.data.message);
        toast.warning(response.payload.data.message);
      }

      if (response.payload.statusCode === 200) {
        await handleFileUpload(response.payload.data.data[0].id);
        toast.success(response.payload.data.data[0].result);
        setTimeout(() => {
          navigate("/mumAdminAmc");
        }, 3000);
      }
    } catch (error) {}
  };

  const handleFileUpload = async (id) => {
    for (const row of form.budget_details) {
      if (row.file) {
        const formData = new FormData();
        formData.append("attachment", row.file);
        formData.append("referenceName", "Admin Mum AMC");
        formData.append("referenceKey", id);
        formData.append("referenceSubName", row.financialYear);
        if (row.fileUrl) {
          await dispatch(updateFile(formData));
        } else {
          await dispatch(uploadFile(formData));
        }
      }
    }
  };

  const fetchDetails = async () => {
    await dispatch(getMumAdmin({ id: type?.id }));
  };

  const handleCancel = async () => {
    CancelAlert({
      onCancel: async () => {
        await navigate("/mumAdminAmc");
      },
    });
  };

  return (
    <Row className="dashboard me-1 ms-1">
      {loading && <CommonLoader />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Card>
        <Title title={"Admin AMC "} />
        <Form className="mt-4">
          <Row>
            <Col md={12}>
              <AmcDetailsComponent
                form={form}
                handleFormChange={handleFormChange}
                setForm={setForm}
                type={type?.type}
                AttachmentDetails={AttachmentDetails}
              />
              <BudgetTable form={form} setForm={setForm} />
              {/* <Amcperiod form={form} handleFormChange={handleFormChange} /> */}
            </Col>
          </Row>
          <Row className="mt-3 justify-content-end">
            <Col md="auto" className="d-flex gap-2">
              <CustomSingleButton
                _ButtonText={type?.type === "editMode" ? "Update" : "Save"}
                height={40}
                onPress={handleSave}
              />
              <CustomSingleButton
                _ButtonText="Cancel"
                height={40}
                onPress={handleCancel}
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </Row>
  );
};
export default AddMumAdminAmc;
