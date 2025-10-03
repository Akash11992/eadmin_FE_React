import React from "react";
import { Form, Button, Row, Col, Tab, Tabs, Nav } from "react-bootstrap";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import { Autocomplete, TextField } from "@mui/material";
import { FaInfoCircle } from "react-icons/fa";
import CommonSingleDropdown from "../../../Components/CommonCustomDropdown/CommonSingleDropdown";

const VMComponent = (props) => {
  const {
    formData,
    handleInputChange,
    errors,
    categoriesData,
    subcategoriesFindData,
    selectedSubCategory,
    setSelectedSubCategory,
    getEmpDropData,
    handleFormChange,
    gstOptions,
    countryDropdown,
    stateDropdown,
    cityDropdown,
    setFormData,
    fileInputRef,
    handleFileChange,
    isPreferredVendor,
    setIsPreferredVendor,
    onKeyDown,
    onPaste,
    multiEmailInput,
    handleMultiEmailChange,
  } = props;

  const getDisplayValue = () => {
    return [...(formData.otherEmails || []), multiEmailInput].join(", ");
  };

  return (
    <div>
      <Row>
        <Col md={12}>
          <Form>
            <Form.Group as={Row} className="py-2">
              <Col sm={4}>
                <CustomInput
                  labelName="Supplier Code"
                  placeholder="Enter Supplier Code"
                  value={formData.supplierCode}
                  onChange={handleInputChange}
                  type="text"
                  mandatoryIcon={true}
                  name="supplierCode"
                  maxLength={10}
                />
                {errors.supplierCode && (
                  <small className="text-danger errorText">
                    {errors.supplierCode}
                  </small>
                )}
              </Col>

              <Col sm={4}>
                <CustomInput
                  labelName="Account Code"
                  placeholder="Enter Account Code"
                  value={formData.accountCode}
                  onChange={handleInputChange}
                  type="text"
                  mandatoryIcon={true}
                  name="accountCode"
                  maxLength={10}
                />
                {errors?.accountCode && (
                  <small className="text-danger errorText">
                    {errors?.accountCode}
                  </small>
                )}
              </Col>

              <Col sm={4}>
                <CustomInput
                  labelName="Account Type"
                  placeholder="Enter Account Type"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  type="text"
                  mandatoryIcon={true}
                  name="accountType"
                  maxLength={1}
                />
                {errors?.accountType && (
                  <small className="text-danger errorText">
                    {errors?.accountType}
                  </small>
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="py-2">
              <Col md={4}>
                <CustomDropdown
                  dropdownLabelName="Categories"
                  options={[
                    {
                      categorie_id: "",
                      categories_name: "Select Categories",
                    },
                    ...(categoriesData || []),
                  ]}
                  valueKey="categorie_id"
                  labelKey="categories_name"
                  onChange={(e) =>
                    handleFormChange("selectedCategory", e.target.value)
                  }
                  selectedValue={formData.selectedCategory}
                  mandatoryIcon={true}
                />
              </Col>

              <Col md={4}>
                <CustomDropdown
                  dropdownLabelName="Sub Categories"
                  options={[
                    {
                      subcategory_id: "",
                      subcategory_name: "Select Sub Categories",
                    },
                    ...(subcategoriesFindData || []),
                  ]}
                  valueKey="subcategory_id"
                  labelKey="subcategory_name"
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  selectedValue={selectedSubCategory}
                  isDisable={!formData.selectedCategory}
                />
              </Col>
              <Col md={4}>
                <Form.Label>Responsibility</Form.Label>
                <Autocomplete
                  options={getEmpDropData}
                  getOptionLabel={(option) => option.username || null}
                  isOptionEqualToValue={(option, value) =>
                    option.userId === value.userId
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select a responsibility"
                    />
                  )}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: "responsibility",
                        value: newValue ? newValue.userId : null,
                      },
                    });
                  }}
                  value={
                    getEmpDropData.find(
                      (emp) => emp.userId == formData.responsibility
                    ) || null
                  }
                  size="small"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="py-2">
              <Col sm={3} className="d-flex">
                <Form.Label className="me-2">
                  Preferred Vendor<span className="text-danger">*</span>
                </Form.Label>
                <Form.Check
                  id="preferredVendor"
                  type="checkbox"
                  checked={isPreferredVendor}
                  onChange={(e) => setIsPreferredVendor(e.target.checked)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="py-2">
              <Form.Label column sm={3}>
                Primary Contact <FaInfoCircle />
              </Form.Label>

              <Col sm={3}>
                <CustomInput
                  labelName=""
                  placeholder="First Name"
                  type="text"
                  value={formData?.firstName}
                  onChange={handleInputChange}
                  name="firstName"
                />
                {errors?.firstName && (
                  <small className="text-danger errorText">
                    {errors?.firstName}
                  </small>
                )}
              </Col>

              <Col sm={3}>
                <CustomInput
                  labelName=""
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                  value={formData?.lastName}
                  onChange={handleInputChange}
                />
                {errors?.lastName && (
                  <small className="text-danger errorText">
                    {errors?.lastName}
                  </small>
                )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="py-2">
              <Form.Label column sm={3}>
                Company Name <span className="text-danger">*</span>
              </Form.Label>
              <Col sm={9}>
                <CustomInput
                  labelName=""
                  placeholder="Enter Company Name"
                  type="text"
                  name="companyName"
                  value={formData?.companyName}
                  onChange={handleInputChange}
                />
                {errors?.companyName && (
                  <small className="text-danger errorText">
                    {errors?.companyName}
                  </small>
                )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="py-2">
              <Form.Label column sm={3} className="text-danger">
                Vendor Display Name*
              </Form.Label>
              <Col sm={9}>
                <CustomInput
                  type="text"
                  id="vendorDisplayName"
                  placeholder="Enter Vendor Display Name"
                  required={true}
                  value={formData?.description}
                  onChange={handleInputChange}
                  name="description"
                />
                {errors.description && (
                  <small className="text-danger errorText">
                    {errors.description}
                  </small>
                )}
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="py-2">
              <Form.Label column sm={3}>
                Vendor Email
                <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Col sm={4}>
                <CustomInput
                  labelName=""
                  placeholder="Enter Vendor Email"
                  type="email"
                  value={formData?.emailId}
                  onChange={handleInputChange}
                  name="emailId"
                  // required
                />
                {errors?.emailId && (
                  <small className="text-danger errorText">
                    {errors?.emailId}
                  </small>
                )}
              </Col>
              <Col sm={4}>
                <CustomInput
                  labelName=""
                  placeholder="Enter Other Email"
                  type="text"
                  value={getDisplayValue()}
                  onChange={handleMultiEmailChange}
                  name="emailId"
                  onKeyDown={onKeyDown}
                  onPaste={onPaste}
                  // required
                />
                {errors?.emailId && (
                  <small className="text-danger errorText">
                    {errors?.emailId}
                  </small>
                )}
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="py-2">
              <Form.Label column sm={3}>
                Vendor Phone
                <span style={{ color: "red" }}>*</span>
              </Form.Label>

              <Col sm={4}>
                <CustomInput
                  labelName=""
                  placeholder="Work Phone"
                  type="text"
                  name="phoneNo"
                  value={formData?.phoneNo}
                  onChange={handleInputChange}
                  maxLength={10}
                />
                {errors?.phoneNo && (
                  <small className="text-danger errorText">
                    {errors?.phoneNo}
                  </small>
                )}
              </Col>

              <Col sm={4}>
                <CustomInput
                  labelName=""
                  placeholder="Mobile"
                  type="numeric"
                  name="mobileNo"
                  value={formData?.mobileNo}
                  onChange={handleInputChange}
                  maxLength={10}
                />
                {errors?.mobileNo && (
                  <small className="text-danger errorText">
                    {errors?.mobileNo}
                  </small>
                )}
              </Col>
            </Form.Group>
          </Form>
        </Col>

        <Tabs
          defaultActiveKey="self"
          id="myTab"
          className="my-3"
          transition={false}
        >
          <Tab eventKey="self" title="Other Details">
            <Row>
              <Col md={6}>
                <CustomDropdown
                  options={gstOptions}
                  valueKey="value"
                  labelKey="label"
                  selectedValue={formData.gstTreatment}
                  onChange={handleInputChange}
                  placeholder="Select a GST treatment"
                  isDisable={false}
                  dropdownLabelName="GST Treatment"
                />
              </Col>

              <Col md={6}>
                <CustomInput
                  labelName="GSTIN/UIN"
                  placeholder="Enter GSTIN/UIN"
                  type="text"
                  name="gstin"
                  required={true}
                />
              </Col>
            </Row>
          </Tab>

          {/* BILLING ADDRESS tabes codes here */}
          <Tab eventKey="father" title="Address">
            <h6 className="mt-4 mb-4">BILLING ADDRESS</h6>
            <Row>
              {/* <Col md={6}> */}

              <Col md={4}>
                <CommonSingleDropdown
                  dropdownLabelName="Country / Region"
                  mandatoryIcon={true}
                  options={[
                    // { value: "", label: "Select Country" },
                    ...(countryDropdown || [])?.map((country) => ({
                      value: country.cm_id,
                      label: country.cm_name,
                    })),
                  ]}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      countryId: e.target.value,
                      stateId: "",
                      cityId: "",
                    });
                  }}
                  selectedValue={formData.countryId || null}
                  valueKey="value"
                  labelKey="label"
                  placeholder="Select Country"
                />
              </Col>

              <Col md={4}>
                <CommonSingleDropdown
                  dropdownLabelName="State"
                  mandatoryIcon={true}
                  options={
                    stateDropdown?.map((state) => ({
                      value: state.state_id,
                      label: state.state_name,
                    })) || []
                  }
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      stateId: e.target.value,
                      cityId: "",
                    });
                  }}
                  selectedValue={formData.stateId || null}
                  valueKey="value"
                  labelKey="label"
                  // height="42px"
                  placeholder="Select State"
                />
              </Col>

              <Col md={4}>
                <CommonSingleDropdown
                  dropdownLabelName="City"
                  mandatoryIcon={true}
                  options={
                    cityDropdown?.map((city) => ({
                      value: city.city_id,
                      label: city.city_name,
                    })) || []
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, cityId: e.target.value })
                  }
                  selectedValue={formData.cityId || null}
                  valueKey="value"
                  labelKey="label"
                  // height="42px"
                  placeholder="Select City"
                />
              </Col>
              <Row className="py-2">
                <Col md={4} className="pt-2">
                  <CustomInput
                    placeholder="Enter Zip Code"
                    type="text"
                    name="postalCode"
                    required={false}
                    value={formData?.postalCode}
                    onChange={handleInputChange}
                    labelName="Zip Code"
                    mandatoryIcon={true}
                  />
                </Col>

                <Col md={4} className="pe-2 ps-4">
                  <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                      Address <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData?.addressLine}
                      onChange={handleInputChange}
                      name="addressLine"
                      className="shadow-none border-secondary-subtle"
                    />
                  </Form.Group>
                </Col>

                <Col md={4} className="pt-2 ps-4">
                  <CustomInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    labelName="Upload File"
                  />
                </Col>
              </Row>
            </Row>
          </Tab>
        </Tabs>
      </Row>
    </div>
  );
};

export default VMComponent;
