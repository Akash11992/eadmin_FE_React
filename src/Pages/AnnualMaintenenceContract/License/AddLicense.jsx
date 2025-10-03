import { Card, Col, Row } from "react-bootstrap";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../Components/Title/Title";
import LicenseForm from "./LicenseForm";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getLicenses, insertLicense } from "../../../Slices/AMC/AMCSlice";
import { toast, ToastContainer } from "react-toastify";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import CancelAlert from "../../../Components/Validations/CancelAlert";
import { uploadFile } from "../../../Slices/Attachment/attachmentSlice";
import validateFile from "../../../Components/CustomInput/fileValidation";
import removeSpecialCharacter from "../../../Components/CustomInput/removeSpecialCharacter";

const AddLicense = () => {
  const [form, setForm] = useState({
    Company: [],
    nameOfEstablishment: null,
    type: null,
    licenseNo: null,
    serviceVendor: "",
    regionWard: null,
    period: null,
    renewalDate: null,
    others_license_Types: '',
    remark: "",
    id: null,
    file: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state;

  const loading = useSelector((state) => state.AMC.status === "loading");
  const { licenses } = useSelector((state) => state.AMC);
  const data = licenses?.data?.data[0];

  useEffect(() => {
    if (type?.type === "editMode" && type?.id) {
      fetchDetails();
    }
  }, [type]);

  useEffect(() => {
    if (type?.type === "editMode" && data && type?.id) {
      setForm({
        Company: data["Company"],
        nameOfEstablishment: data["Name Of Govt. Agency"],
        type: data["License Type"],
        others_license_Types: data["Other License Type"],
        serviceVendor: data["Name Of Service Vendor"],
        licenseNo: data["License Number"],
        regionWard: data["Region Ward"],
        period: data["License Period"],
        renewalDate: data["Renewal Date"],
        responsibility: data["Responsibility"],
        remark: data["Remark"],
        id: type?.id,
      });
    }
  }, [type, data]);

  const handleFormChange = useCallback((name, value) => {
    let sanitizedValue = value;
    if (typeof value === "string") {
      sanitizedValue = value ? removeSpecialCharacter(value) : null;
    }
  
    if (name === "file" && value) {
      const validation = validateFile(value);
      if (!validation.isValid) {
        toast.error(validation.message);
        sanitizedValue = null; 
      }
    }
    setForm((prevState) => ({ ...prevState, [name]: sanitizedValue }));
  }, []);

  const fetchDetails = async () => {
    await dispatch(getLicenses({ id: type?.id }));
  };
  const handleSave = async () => {
    const response = await dispatch(insertLicense(form));
    if (response.payload.statusCode === 400) {
      toast.warning(response.payload.data.message);
    }
    if (response.payload.statusCode === 200) {
      toast.success(response.payload.data.data[0].result);
      handleFileUpload(response.payload.data.data[0].id);
      setTimeout(() => {
        navigate("/license");
      }, 3000);
    }
  };

  const handleFileUpload = async (id) => {
    const formData = new FormData();
    formData.append("attachment", form.file);
    formData.append("referenceName", "Annual Maintenance Contract");
    formData.append("referenceKey", id);
    formData.append("referenceSubName", "License");
    if (form.file) {
      await dispatch(uploadFile(formData));
    }
  };
  const handleCancel = async () => {
    CancelAlert({
      onCancel: async () => {
        await navigate("/license");
      },
    });
  };
  return (
    <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
      {loading && <CommonLoader />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      {/* <Title title="Add License Details" /> */}

      <div>
        <LicenseForm
          form={form}
          handleFormChange={handleFormChange}
          setForm={setForm}
        />
        <Row className="mt-3 justify-content-end mb-2">
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
              backgroundColor="red"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default AddLicense;