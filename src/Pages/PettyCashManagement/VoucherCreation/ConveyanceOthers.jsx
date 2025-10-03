import React, { useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import CustomSingleButton from "../../../Components/CustomSingleButton/CustomSingleButton";
import { useNavigate } from "react-router-dom";

const ConveyanceOthers = ({ selectedVoucherValue }) => {
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

  
  const navigate = useNavigate();
      const handleBulkUpload = () => {
         navigate("/voucherCreation")
      };

    if (selectedVoucherValue === 9) {
        return (
            <div id="conveyance-form">
                <div className="card-body">
                    <h3>Conveyance Others (Peons)</h3>
                    <hr />

                    <div className="container-fluid my-4">
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th style={{ backgroundColor: "#d90429", color: "white" }}>Particulars</th>
                                    <th style={{ backgroundColor: "#d90429", color: "white" }}>Quantity</th>
                                    <th style={{ backgroundColor: "#d90429", color: "white" }}>Rate</th>
                                    <th style={{ backgroundColor: "#d90429", color: "white" }}>Amount</th>
                                   
                                    <th style={{ backgroundColor: "#d90429", color: "white" }}>Upload</th>
                                    <th style={{ backgroundColor: "#d90429", color: "white" }}>Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Particulars"
                                                
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="input"
                                                className="form-control"
                                                placeholder="Enter Quantity"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Rate"
                                                value={row.amount}
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Amount"
                                                // value={row.receivedItems}
                                                // onChange={(e) =>
                                                //     handleInputChange(index, "receivedItems", e.target.value)
                                                // }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="file"
                                                className="form-control"
                                                
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

                        <Alert
                            variant="warning"
                            style={{
                                backgroundColor: "#fff3cd",
                                color: "#856404",
                                margin: "0",
                            }}
                        >
                            Note: Please click on + button to add rows
                        </Alert>

                        <div className="d-flex justify-content-end gap-3 mb-3 mt-2">
                            <CustomSingleButton
                                onPress={handleBulkUpload}
                                _ButtonText="Submit"
                                backgroundColor="#000"
                                Text_Color="#fff"
                                height="44px"
                                width="auto"
                                className="mt-3"
                            />
                                <CustomSingleButton
                                onPress={handleBulkUpload}
                                _ButtonText="Save"
                                backgroundColor="#000"
                                Text_Color="#fff"
                                height="44px"
                                width="auto"
                                className="mt-3"
                            />
                                <CustomSingleButton
                                onPress={handleBulkUpload}
                                _ButtonText="Cancel"
                                backgroundColor="#000"
                                Text_Color="#fff"
                                height="44px"
                                width="auto"
                                className="mt-3"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );

    }
    return null;
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

export default ConveyanceOthers;
