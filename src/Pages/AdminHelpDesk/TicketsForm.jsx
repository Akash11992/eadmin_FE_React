import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Row, Tab, Table, Tabs } from "react-bootstrap";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmail,
  getTicketDetailsByid,
  insertTicketDetails,
  sendApprover,
  updateTicketDetails,
} from "../../Slices/AdminHelpDesk/AdminHelpDeskSlice";
import { useLocation, useNavigate } from "react-router-dom";
import GroupTypeDropdown from "./GroupTypeDropdown";
import TicketOwnerMediumDropdown from "./TicketOwnerMediumDropdown";
import TicketDetailsFields from "./TicketDetailsFields";
import ReplyTextEditor from "./ReplyTextEditor";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import { toast, ToastContainer } from "react-toastify";
import EmailValidation from "../../Components/Validations/EmailValidation";
import { addScheduler } from "../../Slices/Scheduler/schedulerSlice";
import { getFile, uploadFile } from "../../Slices/Attachment/attachmentSlice";
import UploadDocument from "./UploadDocument";
import ClosedTicketTemplate from "../../Components/AdminHelpDeskComponent/ClosedTicketTemplate";
import ReactDOMServer from "react-dom/server";
import AissgnedTicket from "../../Components/AdminHelpDeskComponent/AissgnedTicket";
import RepairMaintanance from "./RepairMaintanance";
import { FaEye, FaFileDownload } from "react-icons/fa";
import useDownloader from "react-use-downloader";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { BsFileEarmarkZipFill } from "react-icons/bs";
import RepairReplies from "./RepairReplies";
import Encryption from "../../Components/Decryption/Encryption";

const TicketsForm = () => {
  const [form, setForm] = useState({
    type: "",
    group: "",
    ticketOwner: [],
    ticketMedium: "",
    days: null,
    escalationEmail: "",
    priority: "",
    email: "",
    subject: "",
    status: "",
    Description: "",
    content: "",
    disable: null,
    attachment: "",
    service: null,
    building: null,
    location: null,
    vendor: "",
    po: "",
    dateOfCompletion: "",
    dateOfPayment: "",
    cost: "",
    approvedBy: "",
  });

  const [file, setFile] = useState([]);
  const [AllocateFile, setAllocateFile] = useState(null);
  const [active, setActive] = useState("Add");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { download } = useDownloader();
  const encrypt = Encryption();
  const { validateEmail } = EmailValidation();
  const updateType = location.state;
  const validTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/msword",
    "application/pdf",
  ];

  const { email, ticketDetailsById } = useSelector(
    (state) => state.AdminHelpDesk
  );

  const loading = useSelector(
    (state) => state.AdminHelpDesk.status === "loading"
  );
  const AttachmentDetails = useSelector((state) => state.Attachment.attachment);
  // get ticket details by id  api
  useEffect(() => {
    dispatch(getTicketDetailsByid(updateType?.id));
  }, [updateType?.id]);

  const ticketData = ticketDetailsById?.ticketData;
  const ticketdataById =
    ticketData && ticketData.length > 0 ? ticketData[0] : null;

  const repairData = ticketDetailsById?.repairData || [];
  const isAnyApproved = repairData?.some((d) => d.Status === "Approve");

  useEffect(() => {
    if (
      updateType &&
      (updateType.type === "Allocate" ||
        updateType.type === "Reply" ||
        updateType.type === "TicketID" ||
        updateType.type === "Repair") &&
      ticketdataById
    ) {
      setForm({
        type: ticketdataById.Type || "1",
        group: ticketdataById.Group || "0",
        ticketMedium: ticketdataById.ticketMedium || "1",
        priority: ticketdataById.Priority || "1",
        status: ticketdataById.status || "1",
        ticketOwner: Array.isArray(ticketdataById.TicketOwner)
          ? ticketdataById.TicketOwner
          : ticketdataById.TicketOwner?.toString()
              .split(",")
              .filter((owner) => owner.trim() !== "") || [],

        days: ticketdataById.days || 1,
        escalationEmail: ticketdataById.escalationEmail || "",
        email: ticketdataById.email || "",
        subject: ticketdataById.Subject || "",
        Description: ticketdataById.Description || "",
        disable: updateType.type === "Reply" || updateType.type === "Repair",
        attachment: 0,
        service: ticketdataById.service || 0,
        building: ticketdataById.building || 0,
        location: ticketdataById.location || 0,
        vendor: "",
        po: "",
        dateOfCompletion: "",
        dateOfPayment: "",
        cost: "",
        approvedBy: "",
      });
    } else {
      setForm({
        type: "1",
        group: "0",
        ticketMedium: "1",
        priority: "1",
        status: "1",
        ticketOwner: [],
        days: 1,
        escalationEmail: "",
        email: "",
        subject: "",
        Description: "",
        disable: false,
        service: 0,
        building: 0,
        location: 0,
        vendor: "",
        po: "",
        dateOfCompletion: "",
        dateOfPayment: "",
        cost: "",
        approvedBy: "",
      });
    }
  }, [updateType, ticketDetailsById]);

  useEffect(() => {
    if (
      updateType &&
      (updateType.type === "Reply" || updateType.type === "Repair")
    ) {
      setForm((prevState) => ({
        ...prevState,
        disable: true,
      }));
    }
  }, [updateType]);

  useEffect(() => {
    if (repairData && repairData.length > 0) {
      const approvedEntry = repairData.find(
        (d) => d.approvedBy && d.cost && d.Status
      );
      if (approvedEntry) {
        setForm((prev) => ({
          ...prev,
          approvedBy: approvedEntry.approvedBy || prev.approvedBy,
          approvalStatus: approvedEntry.Status || "",
          dateOfPayment: approvedEntry.approval_date || prev.dateOfPayment,
        }));
      }
      setForm((prev) => ({
        ...prev,
        cost: approvedEntry?.cost || repairData[0]?.cost || prev.cost,
        po:
          approvedEntry?.purchase_order ||
          repairData[0]?.purchase_order ||
          prev.po,
        vendor: approvedEntry?.vendor || repairData[0]?.vendor || prev.vendor,
        dateOfCompletion:
          approvedEntry?.date_of_completion ||
          repairData[0].date_of_completion ||
          prev.dateOfCompletion,
      }));
    }
  }, [repairData]);
  useEffect(() => {
    const Payload = {
      referenceName: "AdminHelpDesk",
      referenceKey: updateType?.id,
      referenceSubName: active,
    };
    dispatch(getFile(Payload));
  }, [active]);

  // api file upload
  const handleFile = async (id) => {
    let subType = "Add";
    let files = AllocateFile;

    if (active === "Reply") {
      subType = "Reply";
      files = file;
    } else if (active === "Repair") {
      subType = "Repair";
      files = file;
    }

    // Multiple API calls for each file
    if (Array.isArray(files)) {
      for (let f of files) {
        if (f) {
          const formData = new FormData();
          formData.append("attachment", f);
          formData.append("referenceName", "AdminHelpDesk");
          formData.append("referenceKey", id);
          formData.append("referenceSubName", subType);

          const response = await dispatch(uploadFile(formData));
          if (response.payload.statusCode === 200) {
            // toast.success(response.payload.data.message);
          } else {
            toast.error("Failed to upload file");
          }
        }
      }
      setTimeout(() => {
        navigate("/ticketsManagement");
      }, 3000);
    } else if (files) {
      const formData = new FormData();
      formData.append("attachment", files);
      formData.append("referenceName", "AdminHelpDesk");
      formData.append("referenceKey", id);
      formData.append("referenceSubName", subType);

      const response = await dispatch(uploadFile(formData));
      if (response.payload.statusCode === 200) {
        toast.success(response.payload.data.message);
        setTimeout(() => {
          navigate("/ticketsManagement");
        }, 3000);
      } else {
        toast.error("Failed to upload file");
      }
    }
  };
  const handleFormChange = useCallback((name, value) => {
    setForm((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  // get email on select owner api
  useEffect(() => {
    if (form?.ticketOwner?.length > 0) {
      dispatch(getEmail(form?.ticketOwner));
    }
  }, [form?.ticketOwner]);

  useEffect(() => {
    if (email) {
      const emailString = email.map((e) => e.email).join(", ");
      setForm((prevState) => ({
        ...prevState,
        email: emailString,
      }));
    }
  }, [email]);
  // update ticekt api for allocate and reply
  const fetchUpdateDetails = async (flag) => {
    const payload = {
      form: form,
      type: updateType.type,
      ticketID: updateType.id,
      flag: flag,
      approver_status: flag === "repair" ? 1 : 0,
    };
    const response = await dispatch(updateTicketDetails(payload));
    if (response.payload.statusCode === 200) {
      toast.success(response.payload.data.message);
      const id = updateType.id;
      handleFile(id);
      setTimeout(() => {
        navigate("/ticketsManagement");
      }, 3000);
    } else {
      toast.error("Failed to update ticket, Please Try Again");
    }
  };
  // insert api
  const fetchSaveDetails = async () => {
    const response = await dispatch(insertTicketDetails(form));
    if (response.payload.statusCode === 200) {
      toast.success(response.payload.data.message);
      handleFile(response.payload.data.id);
      await fetchSchedulerApi(response.payload.data.id);
      setTimeout(() => {
        navigate("/ticketsManagement");
      }, 3000);
    } else {
      toast.error("Failed to raise ticket, Please Try Again");
    }
  };

  const emailBodyforClosedStatus = ReactDOMServer?.renderToStaticMarkup(
    <ClosedTicketTemplate
      name={ticketdataById?.sender_name}
      ticketNo={updateType?.id}
      Action={form?.content}
      status={form?.status}
    />
  );

  const emailBodyAissgnedTicket = ReactDOMServer?.renderToStaticMarkup(
    <AissgnedTicket ticketNo={updateType?.id} Action={form?.Description} />
  );
  // scheduler API for send email
  const fetchSchedulerApi = async (id) => {
    const formData = new FormData();
    const isReply =
      updateType &&
      (updateType.type === "Reply" || updateType.type === "Repair");
    const recipientEmail = isReply ? ticketdataById.sender_email : form.email;
    const content = isReply
      ? emailBodyforClosedStatus
      : emailBodyAissgnedTicket;
    const files = file || AllocateFile;
    const isFileUpload = files ? 1 : 0;
    const cc = form.escalationEmail;
    const status =
      form.status == 3
        ? "Work In Progress"
        : form.status == 2
        ? "Closed"
        : "Open";
    if (
      (updateType && updateType.type === "Allocate") ||
      isReply ||
      form.email !== ""
    ) {
      formData.append("attachment", files);
      formData.append("to", recipientEmail);
      formData.append(
        "subject",
        `TicketID-${updateType?.id || id} ${status}:${form.subject}`
      );
      formData.append("content", content);
      formData.append("is_file_upload", isFileUpload);
      formData.append("cc", cc);
      await dispatch(addScheduler(formData));
    }
  };
  // save button function
  const handleSaveDetails = async () => {
    if (!updateType && (!form.subject || !form.Description || !form.status)) {
      return toast.warning("Please fill Mandatory fields marked as *");
    } else if (
      updateType &&
      updateType.type === "Allocate" &&
      form.ticketOwner?.length === 0
    ) {
      return toast.warning("Please Select Ticket Owner to allocate");
    } else if (updateType && updateType.type === "Reply" && !form.content) {
      return toast.warning("Please Reply on Ticket before Save");
    } else if (
      updateType &&
      updateType.type === "Repair" &&
      (!form.content || !form.vendor)
    ) {
      return toast.warning("Please provide Repair details before Save");
    }

    if (form.email.length > 0 && !validateEmail(form.email)) {
      return toast.warning("Please enter a valid email");
    }

    if (
      form.escalationEmail.length > 0 &&
      !validateEmail(form.escalationEmail)
    ) {
      return toast.warning("Please enter a valid email");
    }
    if (Array.isArray(file) && file.length > 0) {
      for (let f of file) {
        if (!validTypes.includes(f.type)) {
          toast.warning("File must be jpg, jpeg, png, pdf, or doc");
          return;
        }
      }
    } else if (file && file.type && !validTypes.includes(file.type)) {
      toast.warning("File must be jpg, jpeg, png, pdf, or doc");
      return;
    }
    if (
      updateType &&
      (updateType.type === "TicketID" ||
        updateType.type === "Allocate" ||
        updateType.type === "Reply" ||
        updateType.type === "Repair")
    ) {
      await fetchUpdateDetails();
      await fetchSchedulerApi();
    } else {
      await fetchSaveDetails();
    }
  };

  const handleSendToApprover = async () => {
    const formData = new FormData();
    if (!updateType && (!form.subject || !form.Description || !form.status)) {
      return toast.warning("Please fill Mandatory fields marked as *");
    } else if (
      updateType &&
      updateType.type === "Repair" &&
      (!form.content || !form.vendor || !form.cost || !form.approvedBy)
    ) {
      console.log(form, "g");
      return toast.warning(
        "Please fill Cost/Approver and other mandatory details before Send to approver."
      );
    }
    const flag = "repair";
    const payload = {
      form: form,
      type: updateType.type,
      ticketID: updateType.id,
      flag: flag,
      approver_status: flag === "repair" ? 1 : 0,
    };
    const encryptedPayload = encrypt(payload);
    formData.append("encryptedData", encryptedPayload);
    if (file.length > 0) {
      file.forEach((f) => {
        formData.append("attachment", f);
      });
    }

    const response = await dispatch(sendApprover(formData));
    if (response.payload.statusCode === 200) {
      toast.success(response.payload.data.message);
      const id = updateType.id;
      handleFile(id);
      setTimeout(() => {
        navigate("/ticketsManagement");
      }, 3000);
    } else {
      toast.error("Failed to update ticket, Please Try Again");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
      />
      <Row className="dashboard me-1 ms-1">
        <Card>
          <Card.Body>
            <Tabs
              defaultActiveKey="Add"
              id="uncontrolled-tab-example"
              className="mb-3"
              onSelect={(tab) => setActive(tab)}
            >
              <Tab eventKey="Add" title="Ticket">
                <GroupTypeDropdown
                  form={form}
                  handleFormChange={handleFormChange}
                  view={updateType?.view}
                />
                <TicketOwnerMediumDropdown
                  form={form}
                  handleFormChange={handleFormChange}
                  view={updateType?.view}
                />
                <TicketDetailsFields
                  form={form}
                  handleFormChange={handleFormChange}
                  setFile={setAllocateFile}
                  AttachmentDetails={AttachmentDetails}
                  ticketdataById={ticketdataById}
                  view={updateType?.view}
                />
              </Tab>
              <Tab
                eventKey="Reply"
                title="Reply"
                disabled={updateType?.type !== "Reply"}
              >
                <ReplyTextEditor
                  form={form}
                  handleFormChange={handleFormChange}
                  id={updateType?.id}
                  setFile={setFile}
                  view={updateType?.view}
                />
              </Tab>
              <Tab
                eventKey="Repair"
                title="Repair & Maintenance"
                disabled={updateType?.type !== "Repair"}
              >
                <RepairMaintanance
                  form={form}
                  handleFormChange={handleFormChange}
                  id={updateType?.id}
                  setFile={setFile}
                  view={updateType?.view}
                />
              </Tab>
            </Tabs>
            <Row className="mt-3">
              {updateType?.view === false && (
                <Col md={8} className="d-flex">
                  {loading && <CommonLoader />}

                  <Col md={2}>
                    <CustomSingleButton
                      _ButtonText="Save"
                      height={40}
                      onPress={handleSaveDetails}
                    />
                  </Col>

                  {active === "Repair" && (
                    <Col md={3}>
                      <CustomSingleButton
                        _ButtonText="Send To Approver"
                        height={40}
                        onPress={handleSendToApprover}
                        disabled={isAnyApproved}
                      />
                    </Col>
                  )}
                  <Col md={2}>
                    <CustomSingleButton
                      _ButtonText="Cancel"
                      height={40}
                      onPress={() => navigate("/ticketsManagement")}
                    />
                  </Col>
                </Col>
              )}
              {active === "Reply" && (
                <UploadDocument
                  reply={ticketDetailsById.replyData}
                  id={updateType?.id}
                  AttachmentDetails={AttachmentDetails}
                />
              )}
            </Row>
            {active === "Repair" && repairData?.length > 0 && (
              <RepairReplies
                reply={repairData}
                id={updateType?.id}
                AttachmentDetails={AttachmentDetails}
              />
              // <Row className={"mt-4"}>
              //   <Table bordered responsive className="rounded-5">
              //     <thead className="roun">
              //       <tr className="text-white bg-danger">
              //         <th
              //           style={{ backgroundColor: "#d90429", color: "white" }}
              //         >
              //           Sr. No
              //         </th>
              //         <th
              //           style={{ backgroundColor: "#d90429", color: "white" }}
              //         >
              //           Vendor
              //         </th>
              //         <th
              //           style={{ backgroundColor: "#d90429", color: "white" }}
              //         >
              //           Purchase Order
              //         </th>
              //         <th
              //           style={{ backgroundColor: "#d90429", color: "white" }}
              //         >
              //           Date of Completion
              //         </th>
              //         <th
              //           style={{ backgroundColor: "#d90429", color: "white" }}
              //         >
              //           Discription
              //         </th>
              //         <th
              //           style={{ backgroundColor: "#d90429", color: "white" }}
              //         >
              //           Replied By
              //         </th>
              //         <th
              //           style={{ backgroundColor: "#d90429", color: "white" }}
              //         >
              //           Replied Date
              //         </th>
              //         <th
              //           style={{ backgroundColor: "#d90429", color: "white" }}
              //         >
              //           Attachment
              //         </th>
              //       </tr>
              //     </thead>
              //     <tbody>
              //       {repairData?.map((d, i) => (
              //         <tr key={i}>
              //           <td>{i + 1}</td>
              //           <td>{d.vendor}</td>
              //           <td>{d.purchase_order}</td>
              //           <td>{d.date_of_completion}</td>
              //           <td
              //             dangerouslySetInnerHTML={{ __html: d.description }}
              //           />
              //           <td>{d.name}</td>
              //           <td>{d.created_date}</td>
              //           <td className="text-center">
              //             {Array.isArray(d.files) && d.files.length > 0 ? (
              //               <>
              //                 {d.files.length > 1 ? (
              //                   <Button
              //                     className="btn-light no-hover me-1"
              //                     onClick={() =>
              //                       downloadZip(
              //                         d.files,
              //                         `Repair_maintenance.zip`
              //                       )
              //                     }
              //                     title="Download All as ZIP"
              //                   >
              //                     <BsFileEarmarkZipFill
              //                       style={{
              //                         // color: "green",
              //                         cursor: "pointer",
              //                       }}
              //                     />
              //                     {/* <FaFileDownload
              //                       style={{
              //                         color: "green",
              //                         cursor: "pointer",
              //                       }}
              //                     />{" "} */}
              //                   </Button>
              //                 ) : (
              //                   <>
              //                     {d.files.map((fileObj, idx) => (
              //                       <Button
              //                         key={idx}
              //                         className="btn-light no-hover me-1"
              //                         onClick={() =>
              //                           download(
              //                             fileObj.url,
              //                             fileObj.name || "Repair&Maintenance"
              //                           )
              //                         }
              //                         title={fileObj.name}
              //                       >
              //                         <FaFileDownload
              //                           style={{
              //                             color: "black",
              //                             cursor: "pointer",
              //                           }}
              //                         />
              //                       </Button>
              //                     ))}
              //                   </>
              //                 )}
              //               </>
              //             ) : (
              //               <FaFileDownload
              //                 style={{ color: "#ccc", cursor: "not-allowed" }}
              //               />
              //             )}
              //           </td>
              //         </tr>
              //       ))}
              //     </tbody>
              //   </Table>
              // </Row>
            )}
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default TicketsForm;
