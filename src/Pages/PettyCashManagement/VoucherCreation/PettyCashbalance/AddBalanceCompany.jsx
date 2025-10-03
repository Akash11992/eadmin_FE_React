import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CustomInput from "../../../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../../../Components/CustomSingleButton/CustomSingleButton";
import CustomDropdown from "../../../../Components/CustomDropdown/CustomDropdown";
import { getCompanyList } from "../../../../Slices/Commondropdown/CommondropdownSlice";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "react-bootstrap";
import { addCompanyPettyCash } from "../../../../Slices/PettyCashManagement/PettyCashSlice";
import { toast } from "react-toastify";

const AddBalanceCompany = (props) => {
  const { show, onClose } = props;
  const [addCompany, setAddCompany] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const dispatch = useDispatch();

  const companyListData =
    useSelector((state) => state.CommonDropdownData.companyList) || [];

  useEffect(() => {
    dispatch(getCompanyList());
  }, [dispatch]);

  const handleSave = async () => {
    const payload = {
      companyId: addCompany,
      openingBalance: openingBalance,
    };
    const response = await dispatch(addCompanyPettyCash(payload));
    console.log(response, "re");
    if (response.payload.statusCode === 400) {
      toast.warning(response.payload.message);
    } else if (response.payload.statusCode === 200) {
      toast.success(response.payload.data[0].message);
      setAddCompany("");
      setOpeningBalance("");

      onClose();
    } else {
      toast.error("Something went wrong! Please try again.");
    }
  };
  return (
    <Modal show={show} onHide={onClose} centered>
      {/* <Modal.Header closeButton> */}
      <Modal.Header>
        <Modal.Title>Add Company</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Col md={12} xs={12}>
          <CustomDropdown
            labelKey="company_name"
            valueKey="company_id"
            options={[
              { company_name: "Select Entity", company_id: "" },
              ...(companyListData?.data || []),
            ]}
            selectedValue={addCompany?.companyDetails}
            onChange={(e) => setAddCompany(e.target.value)}
            dropdownLabelName="Company Name"
          />
        </Col>
        <Col md={12} xs={12} className="mt-3">
          <CustomInput
            type="number"
            value={openingBalance}
            labelName="Opening Balance"
            onChange={(e) => setOpeningBalance(e.target.value)}
            placeholder="Enter Opening Balance"
            style={{ width: "100%" }}
          />
        </Col>
      </Modal.Body>

      <Modal.Footer>
        <CustomSingleButton
          onPress={handleSave}
          _ButtonText="Save"
          backgroundColor="#000"
          height="44px"
          width="auto"
        />
        <div className="me-4" />
        <CustomSingleButton
          onPress={onClose}
          _ButtonText="Cancel"
          backgroundColor="red"
          height="44px"
          width="auto"
        />
      </Modal.Footer>
    </Modal>
  );
};

export default AddBalanceCompany;
