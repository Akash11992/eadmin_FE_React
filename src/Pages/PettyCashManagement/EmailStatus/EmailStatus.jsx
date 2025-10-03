import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmailAlertList,
  resendEmail,
} from "../../../Slices/PettyCashManagement/PettyCashSlice";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { Card, Modal, Button, Form } from "react-bootstrap";
import { Title } from "../../../Components/Title/Title";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import { toast, ToastContainer } from "react-toastify";

const EmailStatus = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [remark, setRemark] = useState("");

  const getAllEmailListData = useSelector(
    (state) => state?.PettyCash?.getAllEmail
  );
  const getAllEmailData = getAllEmailListData?.data || [];

  const filteredData = getAllEmailData?.map((item) => {
    const { ["Company_Id"]: _, ["DepartmentId"]: __, ...rest } = item;
    return rest;
  });

  useEffect(() => {
    setLoading(true);
    dispatch(getAllEmailAlertList());
    setLoading(false);
  }, [dispatch]);

  const handleResend = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSendResend = async () => {
    const company_id = getAllEmailData?.find(
      (item) => item.Company === selectedItem.Company
    ).Company_Id;

    let action = null;

    if (selectedItem["1st_approval_status"] === "Raised Query") {
      action = "resend-1";
    } else if (selectedItem["2nd_approval_status"] === "Raised Query") {
      action = "resend-2";
    }

    if (!action) {
      toast.warning("No matching record found for resend");
      return;
    } else if (!remark.trim()) {
      toast.warning("Please Enter Remark before Resend");
      return;
    }

    const payload = {
      company_id: company_id,
      remark: remark,
      action: action,
    };
    const response = await dispatch(resendEmail(payload));
    if (response?.payload.statusCode === 200) {
      toast.success("Request Successfully Resend.");
      setShowModal(false);
      setRemark("");
      await dispatch(getAllEmailAlertList());
    } else {
      toast.error("Failed to resend, Please Try Again!");
    }
  };

  let actions = [
    {
      label: "Resend",
      onClick: handleResend,
    },
  ];

  return (
    <>
      <div className="container-fluid">
        <ToastContainer position="top-right" autoClose={3000} />
        <Card className="p-2">
          <Title title="Email Approval Tracking" />

          <CustomTable
            data={filteredData || []}
            firstColumnVisibility={true}
            dataContained={filteredData?.length || 0}
            pageCount={page}
            handlePageClick={(page) => setPage(page)}
            rowsPerPage={rowsPerPage}
            handleItemsPerPageChange={(val) => {
              setRowsPerPage(parseInt(val, 10));
              setPage(0);
            }}
            actionVisibility={true}
            actions={actions}
          />
        </Card>

        {loading && <CommonLoader />}

        {/* Resend Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Resend for Approval</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remark here..."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="bg-danger text-white border-0"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="bg-black text-white border-0"
              onClick={handleSendResend}
            >
              Resend
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default EmailStatus;
