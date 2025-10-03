import React, { useEffect } from "react";
import { Card, Col, Dropdown, Row, SplitButton } from "react-bootstrap";
import { toast } from "react-toastify";
import { Title } from "../../../Components/Title/Title";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import FromDate from "../../../Components/DatePicker/FromDate";
import EndDate from "../../../Components/DatePicker/EndDate";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVendorNameDetails,
  getReconcileTravelRecords,
  getTravelMode,
} from "../../../Slices/TravelManagementSlice/TravelManagementsSlice";
import { ExportToXLSX } from "../../../Components/Excel-JS/ExportToXLSX";

const InvoiceForm = (props) => {
  const { form, handleForm, HandleUpload } = props;

  const dispatch = useDispatch();

  const { travelModeData, vendorDetailsNameData } = useSelector(
    (state) => state.TravelManagement
  );

  useEffect(() => {
    dispatch(getTravelMode("TRAVEL_MODE"));
  }, []);

  useEffect(() => {
    const fetchVendorNames = async () => {
      const payload = {
        sub_category_id: form?.type,
      };
      try {
        await dispatch(fetchVendorNameDetails(payload));
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    };
    if (form?.type) {
      fetchVendorNames();
    }
  }, [form?.type]);

  const dropdownItems = [
    { eventKey: "1", label: "Reconcile Records" },
    { eventKey: "2", label: "Pending Records" },
  ];

  const formatDateOrTime = (value) => {
   const date = new Date(value)
   const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return formattedDate
  };

  const handleRecords = async (id) => {
    const payload = {
      type: form.type,
      vendor: form.vendor,
      fromDate: form.fromDate,
      endDate: form.endDate,
      reportType: id,
    };
    const response = await dispatch(getReconcileTravelRecords(payload));
    if (response.payload.statusCode === 400) {
      toast.warning(response.payload.data.message);
    }
    if (response.payload.statusCode === 200) {
      const data = response?.payload?.data?.data;
      const typeName = form.type == "2" ? "Car" : "Air";
      const vendorName = vendorDetailsNameData?.find(
        (item) => item.VENDOR_ID == form.vendor
      );
      const fromDate = formatDateOrTime(form.fromDate);
      const endDate = formatDateOrTime(form.endDate);
      if (data?.length > 0) {
        ExportToXLSX(
          data,
          `${typeName}-${vendorName?.DESCRIPTION}-${fromDate}-${endDate}`
        );
      } else {
        toast.warning("No Records Found");
      }
    }
  };
  
  return (
    <Row className="dashboard me-1 ms-1">
      <Card>
        <Title title="Upload Invoice" />
        <Row className="mt-4 justify-content-around">
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Traveler Mode"
              labelKey="label"
              valueKey="value"
              options={[{ label: "Select", value: "" }, ...travelModeData]}
              mandatoryIcon={true}
              selectedValue={form.type}
              onChange={(e) => handleForm("type", e.target.value)}
            />
          </Col>
          <Col md={3}>
            <CustomDropdown
              dropdownLabelName="Vendor Name"
              labelKey="DESCRIPTION"
              valueKey="VENDOR_ID"
              options={[
                { DESCRIPTION: "Select", VENDOR_ID: "" },
                ...vendorDetailsNameData,
              ]}
              mandatoryIcon={true}
              selectedValue={form.vendor}
              onChange={(e) => handleForm("vendor", e.target.value)}
            />
          </Col>
          <Col md={3}>
            <FromDate
              fromDate={form.fromDate}
              endDate={form.endDate}
              handleChange={(date) => handleForm("fromDate", date)}
              Label="From Date"
              mandatoryIcon={true}
            />
          </Col>
          <Col md={3}>
            <EndDate
              fromDate={form.fromDate}
              endDate={form.endDate}
              handleChange={(date) => handleForm("endDate", date)}
              Label="To Date"
              mandatoryIcon={true}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={3}>
            <CustomInput
              labelName="Upload File"
              type="file"
              placeholder="Select File"
              mandatoryIcon={true}
              onChange={(e) => handleForm("file", e.target.files[0])} // Set the file without binding `value`
              accept=".xlsx,.csv"
            />
          </Col>
          <Col md={2} className="mt-4">
            <CustomSingleButton
              _ButtonText="Upload"
              height={40}
              onPress={HandleUpload}
            />
          </Col>
          <Col md={4} className="mt-4">
            <SplitButton
              id="dropdown-button-drop-end"
              drop="end"
              variant="dark"
              title="Generate Report"
              onSelect={handleRecords}
            >
              {dropdownItems?.map((item) => (
                <Dropdown.Item key={item.eventKey} eventKey={item.eventKey}>
                  {item.label}
                </Dropdown.Item>
              ))}
            </SplitButton>
          </Col>
        </Row>
      </Card>
    </Row>
  );
};

export default InvoiceForm;
