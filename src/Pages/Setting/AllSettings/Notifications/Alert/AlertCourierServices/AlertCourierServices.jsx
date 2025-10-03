import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchMissingAWBRecords } from "../../../../../../Slices/CourierSevices/CourierSevicesSlice";
import CustomSingleButton from "../../../../../../Components/CustomSingleButton/CustomSingleButton";
import { addScheduler } from "../../../../../../Slices/Scheduler/schedulerSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";

function AlertCourierServices() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [days, setDays] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const getMissingAwb = useSelector(
    (state) => state.CourierService.missingAWBRecords
  );
  const data = getMissingAwb.data;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateEmailContent = (data) => {
    let emailBody = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <h2>AWB Records Pending Update</h2>
          <p>Dear User,</p>
          <p>The following AWB records need to be updated:</p>
          <table>
            <thead>
              <tr>
                <th>Reference No</th>
                <th>Sender Name</th>
                <th>Sender Department</th>
                <th>Consignee Name</th>
                <th>Pincode</th>
                <th>Official/Personal</th>
              </tr>
            </thead>
            <tbody>`;
    data.forEach((item) => {
      emailBody += `
        <tr>
          <td>${item.reference_no}</td>
          <td>${item.sender_name}</td>
          <td>${item.sender_department}</td>
          <td>${item.consignee_name}</td>
          <td>${item.pincode}</td>
          <td>${item.official_or_personal}</td>
        </tr>`;
    });

    emailBody += `
          </tbody>
        </table>
        <p>Please take necessary action to update the missing AWB records.</p>
        <p>Thank you!</p>
      </body>
    </html>`;
    return emailBody;
  };

  const validateFields = () => {
    if (!isChecked) {
      toast.warning("Please check the Notify checkbox.");
      return false;
    }
    if (!email) {
      toast.warning("Email is required.");
      return false;
    }
    if (!validateEmail(email)) {
      toast.warning("Invalid email format", {});
      setIsEmailValid(false);
      return false;
    }
    if (!days) {
      toast.warning("Days field is required.");
      return false;
    }
    setIsEmailValid(true);
    return true;
  };

  const fetchRecords = debounce(async (value) => {
    const payload = { daysInterval: value };
    await dispatch(fetchMissingAWBRecords(payload));
  }, 300);

  const fetchAndSendEmail = async () => {
    if (!validateFields()) return;

    if (data && data.length > 0) {
      const emailBodyForInwardCourier = generateEmailContent(data);
      const formData = new FormData();
      const isFileUpload = 0;
      formData.append("attachment", null);
      formData.append("to", email);
      formData.append("subject", `Request for AWB Number Update`);
      formData.append("content", emailBodyForInwardCourier);
      formData.append("is_file_upload", isFileUpload);

      await dispatch(addScheduler(formData));
      toast.success("Email sent successfully!");
    } else {
      toast.warn("No Pending AWB records found for the given days.");
    }
  };

  return (
    <Container>
      <Form>
        <Form.Group as={Row} className="align-items-center mb-3">
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              label="Notify to"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          </Col>
          <Col xs="auto">
            <Form.Control
              type="email"
              placeholder="Email Id"
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                if (!validateEmail(value)) {
                  setIsEmailValid(false);
                } else {
                  setIsEmailValid(true);
                }
              }}
              isInvalid={!isEmailValid}
            />
          </Col>
          <Col xs="auto" className="text-nowrap">
            <small>if AWBNO is not entered in</small>
          </Col>
          <Col xs="auto">
            <Form.Control
              type="number"
              placeholder="Days"
              style={{ width: "80px" }}
              value={days}
              onChange={(e) => {
                const value = e.target.value;
                setDays(value);
                if (value && !isNaN(value)) {
                  fetchRecords(value);
                }
              }}
            />
          </Col>
        </Form.Group>
        <CustomSingleButton
          _ButtonText="Submit"
          height={40}
          width={100}
          onPress={fetchAndSendEmail}
          disabled={!isChecked}
        />
      </Form>
      <ToastContainer />
    </Container>
  );
}

export default AlertCourierServices;
