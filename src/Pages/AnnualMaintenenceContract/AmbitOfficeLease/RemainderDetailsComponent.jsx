import React, { useState } from "react";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../../Components/CustomeTable/CustomTable";
import { useSelector } from "react-redux";

const RemainderDetailsComponent = () => {

    const data = [
        {
            srNo: 1,
            ["Reminder (Enter Days Before End Days)"]:"30 Days",
            EmailId: "Irfan.Ansari@cylsys.com",
           
        },
        {
            srNo: 2,
            ["Reminder (Enter Days Before End Days)"]:"60 Days",
            EmailId: "Irfan.Ansari@cylsys.com",
           
        },

    ];
    const { statusDropdown } =
        useSelector((state) => state.AdminHelpDesk);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();
    const actions = [
        {
            label: "Edit",
        }
        ,
        {
            label: "Delete",
        },
    ].filter((action) => action !== null);

    const permissionDetailData = useSelector(
        (state) => state.Role?.permissionDetails || []
    );
    const { All_Amc } = permissionDetailData.data || {};

    const handleAddNewClick = () => {
        navigate("/addambitOfficeLease"); // Navigate to the desired path
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
            view: false,
        };
        if (All_Amc?.update) {
            navigate("", { state: data });
        }
    };

    const [rows, setRows] = useState([
        {
            category: "Tea",
            itemName: "Greer",
            quantity: "",
            rate: "",
            amount: "",
            receivedItems: "",
        },
    ]);

    const addRow = () => {
        setRows([
            ...rows,
            {
                category: "",
                itemName: "",
                quantity: "",
                rate: "",
                amount: "",
                receivedItems: "",
            },
        ]);
    };

    const handleBulkUpload = () => {
        navigate("/voucherCreation")
    };
    return (


        <div className="mt-2" id="conveyance-form">
            <h6>Remainder Details</h6>
            <hr />
            <div className="container-fluid bookmakerTable border rounded-3 table-responsive card-body">

                <div className="container-fluid my-4 " >
                    <Table bordered >
                        <thead >
                            <tr>
                                <th className="bg-danger" style={{ color: "white" }}>Reminder (Enter Days Before End Days)</th>
                                <th className="bg-danger" style={{ color: "white" }}>Email Id</th>
                                <th className="bg-danger" style={{ color: "white" }}>Add New Reminder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>





                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Remainder"

                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Email Id"
                                        />
                                    </td>


                                    <td>
                                        {index === rows.length - 1 ? (
                                            <Button variant="dark" className="btn-sm mt-1" onClick={addRow}>
                                                +
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="danger"
                                                className="btn-sm mt-1"
                                                onClick={() =>
                                                    setRows(rows.filter((_, i) => i !== index))
                                                }
                                            >
                                                -
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>

                </div>
            </div>
            <Row className="mt-3 justify-content-end">
                <Col md="auto" className="d-flex gap-2">
                    <CustomSingleButton
                        _ButtonText="Set Remainder"
                        height={40}
                    // onPress={handleSaveasDraft}
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
        </div>
    );
};

// Placeholder functions for actions
const addRow = (event) => {
    event.preventDefault();
    console.log("Add row clicked");
    // Add logic to dynamically insert a new row
};

const showAlert = () => {
    alert("Form saved!");
};

const navigateToPage = () => {
    console.log("Navigate to another page");
    // Add navigation logic here
};

export default RemainderDetailsComponent;
