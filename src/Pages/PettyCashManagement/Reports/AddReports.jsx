
import { Title } from "../../../Components/Title/Title";
import { Card, Col, Form, Row, ToastContainer } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";




const AddReports = () => {
    const [formState, setFormState] = useState({
        selectedVoucherValue: null,
        formData: {
            employeeName: "",
            employeeId: "",
            business: "",
            company: "",
            department: "",
            voucherId: "001",
            createdBy: "Irfan",
            voucherDate: "01/01/2025",
        },
    });
    const navigate = useNavigate();

    const handleNavigateToSubmit = () => {
        navigate("/reports"); // Replace with your target route
    };

    const handleNavigateToCancel = () => {
        navigate("/reports"); // Replace with your target route
    };
    const employeeData = {
        Irfan: {
            employeeId: "E001",
            company: "AMBIT PVT LTD.",
            department: "Development",
        },
        Rahul: {
            employeeId: "E002",
            company: "AMBIT CAPITAL PVT LTD.",
            department: "HR",
        },
        Rupesh: {
            employeeId: "E003",
            company: "AMBIT CAPITAL PVT LTD.",
            department: "Finance",
        },
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "employeeName" && employeeData[value]) {
            setFormState((prevState) => ({
                ...prevState,
                formData: {
                    ...prevState.formData,
                    employeeName: value,
                    employeeId: employeeData[value].employeeId,
                    company: employeeData[value].company,
                    department: employeeData[value].department,
                },
            }));
        } else {
            setFormState((prevState) => ({
                ...prevState,
                formData: {
                    ...prevState.formData,
                    [name]: value,
                },
            }));
        }
    };

    const voucherData = [
        { label: "Select Type", value: 1 },
        { label: "Conveyance", value: 2 },
        { label: "Repair & Maintenance", value: 3 },
        { label: "Canteen", value: 4 },
        { label: "Conveyance Others (Peons)", value: 9 },
        { label: "Advance Against Salary AW", value: 8 },
        { label: "Advance Against Salary KW", value: 7 },
        { label: "TDS Payment", value: 8 },
        { label: "Staff Welfare", value: 9 },
        { label: "Training/ HR Event", value: 10 },
        { label: "Printing & Stationary", value: 11 },
        { label: "Meeting Exp Lunch/ Dinner Refreshments", value: 12 },
        { label: "Court Fee / Stamp Fee / Notary", value: 13 },
        { label: "Revenue Stamp PT Challan Books", value: 14 },
        { label: "Filing Fees", value: 15 },
        { label: "Lift/Electrical Inspection / S&E License fees", value: 16 },
        { label: "Electricity / Water Bill", value: 17 },
        { label: "Transportation", value: 18 },
        { label: "Books & Periodicals", value: 19 },
        { label: "Data Card /Mobile Bill Payment", value: 20 },
        { label: "Others", value: 21 },
    ];

    const handleDropdownChange = (value) => {
        setFormState((prevState) => ({
            ...prevState,
            selectedVoucherValue: parseInt(value),
        }));
    };

    return (
        <>
            <Row>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick={true}
                />
                <Card className="border-0">
                    <Title title="Add Petty Cash Statement" />
                    <Card.Body>
                        <Form className="mt-4">
                            <Row>
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Account Name"
                                        placeholder="Enter Account Name"
                                        mandatoryIcon={true}
                                        name="voucherId"


                                    />
                                </Col>
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Received Amount"
                                        placeholder="Enter Received Amount"
                                        mandatoryIcon={true}
                                        name="business"
                                        value={formState.formData.business}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Voucher Date"
                                        placeholder="Enter Voucher Date"
                                        mandatoryIcon={true}
                                        value={formState.formData.employeeName}
                                        onChange={handleInputChange}
                                    />
                                </Col>

                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Particulars"
                                        placeholder="Enter Particulars"
                                        mandatoryIcon={true}
                                        name="employeeId"
                                        value={formState.formData.employeeId}
                                        disabled
                                    />
                                </Col>
                                <h6 className="my-2 mt-4" style={{ color: "red" }}>
                                    Payment Details
                                </h6>
                                <hr />
                                <Col md={3}>
                                    <CustomInput
                                        type="date"
                                        labelName="Date Of Payment"

                                        mandatoryIcon={true}


                                    />
                                </Col>
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Total Amt Paid"
                                        placeholder="Enter Total Amt Paid"
                                        mandatoryIcon={true}
                                        name="department"

                                    />
                                </Col>
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Conveyance"
                                        placeholder="Enter Conveyance"
                                        mandatoryIcon={true}

                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Conveyance Others (Peons)"
                                        placeholder="Conveyance Others (Peons)"
                                        mandatoryIcon={true}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Advance Against Salary AW"
                                        placeholder="Enter Advance Against Salary AW"
                                        mandatoryIcon={true}

                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Advance Against Salary KW"
                                        placeholder="Enter Advance Against Salary KW"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="TDS Payment"
                                        placeholder="Enter TDS Payment"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <h6 className="my-2 mt-4" style={{ color: "red" }}>
                                    Maintenance Details
                                </h6>
                                <hr />
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        placeholder="Enter Staff Welfare"
                                        labelName="Staff Welfare"
                                        mandatoryIcon={true}


                                    />
                                </Col>
                                <Col md={3}>
                                    <CustomDropdown
                                        dropdownLabelName="Training/HR Event/Sports"
                                        placeholder="Enter Training/HR Event/Sports"
                                        labelKey="label"
                                        valueKey="value"
                                        mandatoryIcon={true}
                                        options={[
                                            { label: "Select Type", value: 1 },
                                            { label: "HR", value: 2 },
                                            { label: "Sports", value: 3 },
                                        ]}

                                    />
                                </Col>
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Printing & Stationery"
                                        placeholder="Enter Printing & Stationery"
                                        mandatoryIcon={true}

                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col md={3}>
                                    <CustomInput
                                        type="text"
                                        labelName="Meeting Refreshments"
                                        placeholder="Enter Meeting Refreshments"
                                        mandatoryIcon={true}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="number"
                                        labelName="Court Notary"
                                        placeholder="Enter Court Fees/Stamp Paper/Notary"
                                        mandatoryIcon={true}

                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Revenue Challan Books"
                                        placeholder="Enter Revenue Stamp/PT"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Filing Fees"
                                        placeholder="Enter Filing Fees"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="License Fees:"
                                        placeholder="Enter Lift/Electrical Insp/S&E Fees"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Repairs and Maintenance"
                                        placeholder="Enter Repairs and Maintenance"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Electricity/Water Bill"
                                        placeholder="Enter Electricity/Water Bill"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Transportation"
                                        placeholder="Enter Transportation"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Books & Periodicals"
                                        placeholder="Enter Books & Periodicals"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Others"
                                        placeholder="Enter Others"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Data Bill Payment"
                                        placeholder="Enter Data Card/Mobile Bill Payment"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Courier Charges"
                                        placeholder="Enter Courier Charges"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <h6 className="my-2 mt-4" style={{ color: "red" }}>
                                    Tax and Bill Details
                                </h6>
                                <hr />
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Name of Vendor"
                                        placeholder="Enter Name of Vendor"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="GSTN of Vendor"
                                        placeholder="Enter GSTN of Vendor"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="number"
                                        labelName="Bill Amount Inclusive of GST"
                                        placeholder="Enter Bill Amount Inclusive of GST"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="SGST"
                                        placeholder="Enter SGST"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="CGST"
                                        placeholder="Enter CGST"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Bill In Company Name"
                                        placeholder="Enter Whether Bill In Company Name"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <Col md={3} className="mt-3">
                                    <CustomInput
                                        type="text"
                                        labelName="Error Formula"
                                        placeholder="Enter Error Formula"
                                        mandatoryIcon={true}
                                    />
                                </Col>
                                <div className="d-flex justify-content-end gap-3 mb-3 mt-2">
                                    <CustomSingleButton
                                        _ButtonText="Submit"
                                        backgroundColor="#000"
                                        Text_Color="#fff"
                                        height="44px"
                                        width="auto"
                                        className="mt-3"
                                        onPress={handleNavigateToSubmit}
                                    />
                                  
                                    <CustomSingleButton
                                        _ButtonText="Cancel"
                                        backgroundColor="#000"
                                        Text_Color="#fff"
                                        height="44px"
                                        width="auto"
                                        className="mt-3"
                                        onPress={handleNavigateToCancel}
                                    />
                                </div>
                            </Row>



                        </Form>
                    </Card.Body>
                </Card>
            </Row >
        </>
    );
};

export default AddReports;
