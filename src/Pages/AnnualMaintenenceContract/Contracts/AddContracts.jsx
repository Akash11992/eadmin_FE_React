import { Card, Col, Row } from "react-bootstrap";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../Components/Title/Title";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import ContractForm from "./ContractForm";
import { getContract, insertContract } from "../../../Slices/AMC/AMCSlice";
import CancelAlert from "../../../Components/Validations/CancelAlert";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadFile } from "../../../Slices/Attachment/attachmentSlice";
import validateFile from "../../../Components/CustomInput/fileValidation";

const AddContracts = () => {
  const [form, setForm] = useState({
    vendor: null,
    startDate: null,
    endDate: null,
    serviceType: null,
    remark: null,
    id: null,
    file: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state;

  const loading = useSelector((state) => state.AMC.status === "loading");
  // const { vendor } = useSelector((state) => state.AMC);

  useEffect(() => {
    if (type?.id) {
      fetchDetails();
    }
  }, [type]);

  const fetchDetails = async () => {
    const response = await dispatch(getContract({ id: type?.id }));
    if (response.payload.statusCode === 200) {
      const data = response?.payload?.data?.data[0];
      setForm({
        vendor: data["Vendor"],
        startDate: data["Start Date"],
        endDate: data["End Date"],
        serviceType: data["Type Of Service"],
        remark: data["Remark"],
        id: data["ID"] || null,
      });
    }
  };
  const handleFormChange = useCallback((name, value) => {
    if (name === "file" && value) {
      const validation = validateFile(value);
      if (!validation.isValid) {
       return  toast.error(validation.message);
      }
    }
    setForm((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleSave = async () => {
    const response = await dispatch(insertContract(form));
    if (response.payload.statusCode === 400) {
      toast.warning(response.payload.data.message);
    }
    if (response.payload.statusCode === 200) {
      toast.success(response.payload.data.data[0].result);
      handleFileUpload(response.payload.data.data[0].id);
      setTimeout(() => {
        navigate("/contracts");
      }, 3000);
    }
    if (response.payload.statusCode === 500) {
      toast.error(response.payload.data.message);
      return;
    }
  };

  const handleFileUpload = async (id) => {
    const formData = new FormData();
    formData.append("attachment", form.file);
    formData.append("referenceName", "Annual Maintenance Contract");
    formData.append("referenceKey", id);
    formData.append("referenceSubName", "Contract");
    if (form.file) {
      await dispatch(uploadFile(formData));
    }
  };
  const handleCancel = async () => {
    CancelAlert({
      onCancel: async () => {
        await navigate("/contracts");
      },
    });
  };
  console.log(form, "form");
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
        <Title
          title={
            type?.type === "editMode" ? "Update Contract" : "Add Contracts"
          }
        />
        <ContractForm form={form} handleFormChange={handleFormChange} />
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
      </Card>
    </Row>
  );
};
export default AddContracts;
