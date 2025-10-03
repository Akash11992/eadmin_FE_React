import React, { useState } from "react";
import CommonLoader from "../../../Components/CommonLoader/CommonLoader";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { Title } from "../../../Components/Title/Title";
import { Card, Col, Row, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const vaucherData = (
    [
        { label: "Select Type", value: 1 },
        { label: "Conveyance", value: 2 },
        { label: "Repair & Maintenance", value: 3 },
        { label: "Canteen", value: 4 },
        { label: "Advance Against Salary AW", value: 5 },
        { label: "Advance Against Salary KW" },
        { label: "TDS Payment", value: 6 },
        { label: "Staff Welfare", value: 7 },
        { label: "Training/ HR Event", value: 8 },
        { label: "Printing & Stationary", value: 9 },
        { label: "Meeting Exp Lunch/ Dinner Refreshments", value: 10 },
        { label: "Court Fee / Stamp Fee / Notary", value: 11 },
        { label: "Revenue Stamp PT Challan Books", value: 12 },
        { label: "Filing Fees", value: 13 },
        { label: "Lift/Electrical Inspection / S&E License fees", value: 14 },
        { label: "Electricity / Water Bill", value: 15 },
        { label: "Transportation", value: 16 },
        { label: "Books & Periodicals", value: 17 },
        { label: "Data Card /Mobile Bill Payment", value: 18 },
        { label: "Others", value: 19 },
        // ...employeeDropdown,
    ])

const Reports = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const loading = useSelector(
        (state) => state.AdminHelpDesk.status === "loading"
    );
    const data = [
        {
            SrNo: 1,
            AccountName: "AMBIT PVT. LTD.",
            ReceivedAmount: "55,000",
            VoucherDate: "02.09.2024",
            Particulars: "Conveyance - Office boy Mahadev on 28th August 2024",
            DateOfPayment: "09.09.2024",
            TotalAmtPaid: "47,659",
            Conveyance: "5,555",
            ["ConveyanceOthers(Peons)"]: "2,999",
            AdvanceAgainstSalaryAW:"",
             AdvanceAgainstSalaryKW:"",
             TDSPayment:"25,100",
             StaffWelfare:"",
             ["Training/ HR Event/Sports"]:"",
             PrintingAndStationery:"4575",
             ["Meeting Exp Lunch/ DinnerRefreshments"]:"1450",
             ["Court Fees/ Stamp Paper/Notary"]:"",
             ["Revenue Stamp / PT Challan Books"]:"",
             ["Filing Fees"]:"",
             ["Lift/Electrical Inspection/ S&E License Fees"]:"7980",
             ["Repairs and Maintenance"]:"",
             ["Electricity / Water Bill"]:"",
             ["Transportation"]:"",
             ["Books & Periodicals	Others."]:"",
             ["Data Card/Mobile Bill Payment"]:"",
             CourierCharges:"",
             NameOfVendor:"",
             GSTNOfVendor:"",
             BillAmountInclusiveOfGST:"",
             SGST:"",
             CGST:"",
             WhetherBillInCompanyName:"",
             ErrorFormula:""

        },
        {
            SrNo: 2,
            AccountName: "AMBIT CAPITAL PVT. LTD.",
            ReceivedAmount: "13,645",
            VoucherDate: "16.09.2024",
            Particulars: "Disposable spoon bowl ordered for IE team on 16th sept 2024",
            DateOfPayment: "30.09.2024",
            TotalAmtPaid: "13,645",
            Conveyance: "3,590",
            ["ConveyanceOthers(Peons)"]: "2,999",
            AdvanceAgainstSalaryAW:"",
             AdvanceAgainstSalaryKW:"",
             TDSPayment:"25,100",
             StaffWelfare:"",
             ["Training/ HR Event/Sports"]:"",
             PrintingAndStationery:"4575",
             ["Meeting Exp Lunch/ DinnerRefreshments"]:"1450",
             ["Court Fees/ Stamp Paper/Notary"]:"",
             ["Revenue Stamp / PT Challan Books"]:"",
             ["Filing Fees"]:"",
             ["Lift/Electrical Inspection/ S&E License Fees"]:"7980",
             ["Repairs and Maintenance"]:"",
             ["Electricity / Water Bill"]:"",
             ["Transportation"]:"",
             ["Books & Periodicals	Others."]:"",
             ["Data Card/Mobile Bill Payment"]:"",
             CourierCharges:"",
             NameOfVendor:"",
             GSTNOfVendor:"",
             BillAmountInclusiveOfGST:"",
             SGST:"",
             CGST:"",
             WhetherBillInCompanyName:"",
             ErrorFormula:""

        },
        {
            SrNo: 3,
            AccountName: "AMBIT INVESTMENT ADVISORS PVT. LTD.",
            ReceivedAmount: "5,000",
            VoucherDate: "25.09.2024",
            Particulars: "Conveyance - Office boy Arun on 30th Aug. to 23rd Sept 2024",
            DateOfPayment: "27.09.2024",
            TotalAmtPaid: "2,246",
            Conveyance: "1,956",
            ["ConveyanceOthers(Peons)"]: "2,999",
            AdvanceAgainstSalaryAW:"",
             AdvanceAgainstSalaryKW:"",
             TDSPayment:"25,100",
             StaffWelfare:"",
             ["Training/ HR Event/Sports"]:"",
             PrintingAndStationery:"4575",
             ["Meeting Exp Lunch/ DinnerRefreshments"]:"1450",
             ["Court Fees/ Stamp Paper/Notary"]:"",
             ["Revenue Stamp / PT Challan Books"]:"",
             ["Filing Fees"]:"",
             ["Lift/Electrical Inspection/ S&E License Fees"]:"7980",
             ["Repairs and Maintenance"]:"",
             ["Electricity / Water Bill"]:"",
             ["Transportation"]:"",
             ["Books & Periodicals	Others."]:"",
             ["Data Card/Mobile Bill Payment"]:"",
             CourierCharges:"",
             NameOfVendor:"",
             GSTNOfVendor:"",
             BillAmountInclusiveOfGST:"",
             SGST:"",
             CGST:"",
             WhetherBillInCompanyName:"",
             ErrorFormula:""

        }
        
    ];

    const actions = [
        {
            label: "Edit",
            // onClick: (item) => handleAllocate(item),
        }
        ,
        {
            label: "Sent To Approval",
            // onClick: (item) => handleDelete(item),
        },
        {
            label: "Delete",
            // onClick: (item) => handleDelete(item),
        },

    ].filter((action) => action !== null);




    const handleAddNewClick = () => {
        navigate("/addPettyCashReport"); // Navigate to the desired path
    };
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event, 10));
        setPage(0);
    };
    const handleEdit = async (item) => {
        const data = {
            id: item,
            type: "AmcID",
        };

    };


    return (
        <div class="container-fluid bookmakerTable border rounded-3 table-responsive">
            <Row>
                {loading && <CommonLoader />}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    closeOnClick={true}
                />
                <Card className="border-0">
                    <Title title="Petty Cash Statement" />
                    <Row className="mt-2">                
                            <Col md={3} className="mt-4 " >
                                <CustomInput
                                    labelName=""
                                    type="input"
                                    placeholder="Search"
                                />
                            </Col>
                            <Col md={2} className="mt-4">
                                <CustomSingleButton
                                    _ButtonText="Export To Excel"
                                    height={40}

                                />
                            </Col>
                            <Col md={2} className="mt-4" style={{ marginLeft: "41%" }}>
                                <CustomSingleButton
                                    _ButtonText="Add New"
                                    height={40}
                                    onPress={handleAddNewClick}
                                />
                            </Col>

                    


                    </Row>
                    <CustomTable
                        data={data}
                        paginationDropDown={false}
                        dataContained={data?.length}
                        pageCount={page}
                        handlePageClick={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        handleItemsPerPageChange={handleChangeRowsPerPage}
                        actionVisibility={true}
                        actions={actions}
                        clickableColumns={["Ticket ID"]}
                        onColumnClick={(id) => handleEdit(id)}
                        marginTopTable={true}
                        lineVisibility={true}
                    // onPress={handleAddNew}
                    // buttonTitle={"Add New"}
                    />
                </Card>

            </Row>
        </div>
    );
}
export default Reports;