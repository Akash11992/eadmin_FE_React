import { Card, Col, Row } from "react-bootstrap";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../Components/Title/Title";
import { useCallback, useEffect, useState } from "react";
import AddAmbitOfficeLeaseComponent from "./AddAmbitOfficeLeaseComponent";
import RentDetailsComponent from "./RentDetailsComponent";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import FormComponent from "./FormComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  getOfficeLease,
  insertOfficeLease,
} from "../../../Slices/AMC/AMCSlice";
import { toast, ToastContainer } from "react-toastify";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import CancelAlert from "../../../Components/Validations/CancelAlert";
import { uploadFile } from "../../../Slices/Attachment/attachmentSlice";
import removeSpecialCharacter from "../../../Components/CustomInput/removeSpecialCharacter";
import validateFile from "../../../Components/CustomInput/fileValidation";

const AddAmbitOfficeLease = () => {
  const [form, setForm] = useState({
    nameOfProp: null,
    address: null,
    propType: null,
    entity: null,
    toaStartDate: null,
    toaEndDate: null,
    lipStartDate: null,
    lipEndDate: null,
    noticePeriod: null,
    usableArea: null,
    chargableArea: null,
    depositAmt: null,
    parking: null,
    propTax: null,
    rent_details: [],
    id: null,
    officeLease: null,
    responsibility: null,
    rentFree: null,
    efficiency: null,
    renewalTerm: null,
    file: null,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const type = location.state;
  const loading = useSelector((state) => state.AMC.status === "loading");

  useEffect(() => {
    if (type?.id) {
      fetchDetails();
    }
  }, [type]);

  const fetchDetails = async () => {
    const response = await dispatch(getOfficeLease({ id: type?.id }));
    if (response.payload.statusCode === 200) {
      const data = response?.payload?.data?.data[0];
      setForm({
        nameOfProp: data["Name of Property"],
        address: data["Address"],
        propType: data["Property Type"],
        entity: data["Entity"],
        toaStartDate: data["Tenure Of Agreement Start Date"],
        toaEndDate: data["Tenure Of Agreement End Date"],
        lipStartDate: data["Lock In Period Start Date"],
        lipEndDate: data["Lock In Period End Date"],
        noticePeriod: data["Notice Period"],
        usableArea: data["Usable Area"],
        chargableArea: data["Chargable Area"],
        depositAmt: data["Deposit Amount"],
        parking: data["Parking"],
        propTax: data["Maintenance/Property taxes"],
        rent_details:
          data.rentDetails && data.rentDetails.length > 0
            ? data.rentDetails.map((item) => ({
                fromDate: item["From Date"] || null,
                toDate: item["To Date"] || null,
                amount: item["Rent Per Month"] || 0,
                rate: item["Rate Per Sq, Ft"] || 0,
                escalation: item["Escalation"] || null,
                camPerMonth: item["CAM Per Month"] || 0,
                camRate: item["CAM Rate Per Sq. Ft"] || 0,
                camEscalation: item["CAM Escalation"] || null,
              }))
            : [
                {
                  fromDate: null,
                  toDate: null,
                  amount: null,
                  rate: null,
                  escalation: null,
                  camPerMonth: null,
                  camRate: null,
                  camEscalation: null,
                },
              ],
        id: data["ID"] || null,
        responsibility: data["Responsibility"] || null,
        rentFree: data["Rent Free"] || null,
        efficiency: data["Efficiency"] || null,
        renewalTerm: data["Renwal Term"] || null,
      });
    }
  };

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

  const handleSave = async () => {
    const response = await dispatch(insertOfficeLease(form));
    if (response.payload.statusCode === 400) {
      toast.warning(response.payload.data.message);
      return;
    }
    if (response.payload.statusCode === 200) {
      toast.success(response.payload.data.message);
      handleFileUpload(response.payload.data.data[0].id);
      setTimeout(() => {
        navigate("/ambitOfficeLease");
      }, 3000);
    }
    if (response.payload.statusCode === 500) {
      toast.error(response.payload.data.message);
      return;
    }
    console.log(response, "response");
    // navigate("/ambitOfficeLease");
  };

  const handleFileUpload = async (id) => {
    const formData = new FormData();
    formData.append("attachment", form.file);
    formData.append("referenceName", "Annual Maintenance Contract");
    formData.append("referenceKey", id);
    formData.append("referenceSubName", "OfficeLease");
    if (form.file) {
      await dispatch(uploadFile(formData));
    }
  };
  const handleCancel = async () => {
    CancelAlert({
      onCancel: async () => {
        await navigate("/ambitOfficeLease");
      },
    });
  };
  return (
    <Row className="dashboard me-1 ms-1">
      {/* <Card> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      {loading && <CommonLoader />}
      <Title
        title={
          type?.type === "editMode" ? "Update Office Lease" : "Add Office Lease"
        }
      />

      <AddAmbitOfficeLeaseComponent
        form={form}
        handleFormChange={handleFormChange}
        setForm={setForm}
      />
      <FormComponent form={form} handleFormChange={handleFormChange} />
      <RentDetailsComponent form={form} setForm={setForm} />

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
          />
        </Col>
      </Row>
      {/* </Card> */}
    </Row>
  );
};
export default AddAmbitOfficeLease;
