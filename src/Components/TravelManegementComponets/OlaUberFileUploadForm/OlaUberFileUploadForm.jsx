import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import CustomInput from '../../../Components/CustomInput/CustomInput';
import CustomSingleButton from '../../../Components/CustomSingleButton/CustomSingleButton';
import { getCompanyList } from '../../../Slices/Commondropdown/CommondropdownSlice';
import { useDispatch, useSelector } from 'react-redux';

const OlaUberFileUploadForm = ({
  form,
  vendorNameDataOptions,
  onFormChange,
  onFileChange,
  onFileUpload,
  handleToDateChange
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCompanyList());
  }, [dispatch]);

  const { companyList } = useSelector(
    (state) => state.CommonDropdownData
  );
  const today = new Date().toISOString().split("T")[0];
  return (
    <>
      <Row>
        <Col md="4">
          <CustomDropdown
            dropdownLabelName="Vendor Name"
            selectLevel={"Select"}
            labelKey="label"
            valueKey="value"
            Dropdownlable={true}
            options={vendorNameDataOptions}
            selectedValue={form.vendorName}
            onChange={(e) => onFormChange("vendorName", e.target.value)}
            mandatoryIcon
          />
        </Col>
        <Col md="4">
          <CustomDropdown
            dropdownLabelName="Company Name"
            valueKey="company_name"
            labelKey="company_name"
            selectLevel={"Select"}
            Dropdownlable={true}
            options={companyList?.data || []}
            selectedValue={form.companyName}
            onChange={(e) => onFormChange("companyName", e.target.value)}
            mandatoryIcon
          />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md="4">
          <CustomInput
            labelName="From Date"
            type="date"
            value={form.fromDate}
            onChange={(e) => onFormChange("fromDate", e.target.value)}
            mandatoryIcon
            min={today} // Prevents selecting a past date for "From Date"
          />
        </Col>
        <Col md="4">
          <CustomInput
            labelName="To Date"
            type="date"
            value={form.toDate}
            // onChange={(e) => onFormChange("toDate", e.target.value)}
            onChange={handleToDateChange}
            mandatoryIcon
            min={form.fromDate || today}
          />
        </Col>
        <Col md="4">
          <CustomInput
            labelName="Upload File"
            type="file"
            onChange={onFileChange}
            mandatoryIcon
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md="2">
          <CustomSingleButton
            _ButtonText={"Upload File"}
            onPress={onFileUpload}
            backgroundColor="#dc3545"
          />
        </Col>
      </Row>
    </>
  );
};

export default OlaUberFileUploadForm;
