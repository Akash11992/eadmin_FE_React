import React, { useEffect, useState } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Title } from "../../Components/Title/Title";
import { ExportToXLSX } from "../../Components/Excel-JS/ExportToXLSX";
import CommonLoader from "../../Components/CommonLoader/CommonLoader";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import CustomInput from "../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../Components/CustomSingleButton/CustomSingleButton";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getReport,
  officesuppliceCategory,
  officesuppliceItem,
} from "../../Slices/OfficeSupply/OfficeSupplySlice";

const OfficeSupplyReport = () => {
  const [searchReport, setSearchReport] = useState({
    fromDate: "",
    toDate: "",
    category: "",
    itemName: "",
  });

  const dispatch = useDispatch();

  const { officesupplice, officesuppliceItems } = useSelector(
    (state) => state.OfficeSupply
  );
  const loading = useSelector(
    (state) => state.OfficeSupply.status === "loading"
  );
  useEffect(() => {
    dispatch(officesuppliceCategory({ type: "Category" }));
  }, [dispatch]);

  useEffect(() => {
    if (searchReport.category) {
      dispatch(
        officesuppliceItem({
          type: "Item Name",
          category_id: searchReport.category,
        })
      );
    }
  }, [searchReport.category, dispatch]);

  const handleFormChange = (key, value) => {
    setSearchReport((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };

  const handleExportExcel = async () => {
    const { fromDate, toDate } = searchReport;
    const formatDate = (date) => {
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    };
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);
    const response = await dispatch(getReport(searchReport));
    console.log(response,"response")
    if (response.payload.statusCode === 400) {
      toast.warning(response.payload.message);
    } else if (response.payload.statusCode === 200) {
      toast.success(response.payload.message);
      const data = response.payload.data;
      const fullFileName = `${formattedFromDate}_to_${formattedToDate}_Report`;
      ExportToXLSX(data, fullFileName);
      setSearchReport({
        fromDate: "",
        toDate: "",
        category: "",
        itemName: "",
      });
    } else {
      toast.error("Failed To Download Details");
    }
  };

  return (
    <div>
      {loading && <CommonLoader />}
      <Container className="border rounded-3 p-4">
        <ToastContainer position="top-right" autoClose={3000} />
        <Title title={"Report"} />
        <hr />
        <Form>
          <Row className="mb-3">
            <Col md={3}>
              <CustomInput
                type="date"
                labelName="From Date"
                mandatoryIcon={true}
                value={searchReport.fromDate}
                onChange={(e) => handleFormChange("fromDate", e.target.value)}
              />
            </Col>
            <Col md={3}>
              <CustomInput
                type="date"
                labelName="To Date"
                mandatoryIcon={true}
                value={searchReport.toDate}
                onChange={(e) => handleFormChange("toDate", e.target.value)}
              />
            </Col>
            <Col md={3}>
              <CustomDropdown
                dropdownLabelName="Category"
                options={[
                  { label: "Select Categories", value: "" },
                  ...officesupplice?.map((item) => ({
                    label: item.TOSCM_CATEGORY_NAME,
                    value: item.TOSCM_CATEGORY_ID,
                  })),
                ]}
                valueKey="value"
                labelKey="label"
                selectedValue={searchReport.category}
                onChange={(e) => handleFormChange("category", e.target.value)}
              />
            </Col>
            <Col md={3}>
              <CustomDropdown
                dropdownLabelName="Item Name"
                options={[
                  { label: "Select Item", value: "" },
                  ...officesuppliceItems.map((item) => ({
                    label: item.TOSCI_ITEM_NAME,
                    value: item.TOSCI_C_ITEM_ID,
                  })),
                ]}
                valueKey="value"
                labelKey="label"
                selectedValue={searchReport.itemName}
                onChange={(e) => handleFormChange("itemName", e.target.value)}
              />
            </Col>
          </Row>

          <CustomSingleButton
            onPress={handleExportExcel}
            _ButtonText="Download Excel"
            backgroundColor="#000"
            Text_Color="#fff"
            borderColor="#000"
            height="48px"
            width="200px"
            margin="20px 0"
          />
        </Form>
      </Container>
    </div>
  );
};

export default OfficeSupplyReport;
