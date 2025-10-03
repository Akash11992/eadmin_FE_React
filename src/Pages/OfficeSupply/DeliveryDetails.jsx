import React, { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import CustomDropdown from "../../Components/CustomDropdown/CustomDropdown";
import { Title } from "../../Components/Title/Title";
import moment from "moment";
import AutosizeTextarea from "../../Components/AutosizeTextarea/AutosizeTextarea";
import { input } from "@mui/material";
import CustomTable from "../../Components/CustomeTable/CustomTable";
import CustomInput from "../../Components/CustomInput/CustomInput";
import { FaDownload, FaEye } from "react-icons/fa";

const DeliveryDetails = ({
  input,
  setInput,
  deliveries,
  isDisable,
  requestStatus,
  itemCondition,
}) => {
  const handleinputChange = (name, value) => {
    if (name === "challanFile") {
      const updatedinput = {
        ...input,
        challanFile: value,
        fileName: value?.name || "",
      };
      setInput(updatedinput);
    } else {
      const updatedinput = { ...input, [name]: value };
      setInput(updatedinput);
    }
  };
console.log(deliveries, "deliveries");
  return (
    <div className="mt-3">
      <Title title="Delivery Details" />
      {!isDisable && (
        <>
          <Row className="mt-3">
            <Col md={4}>
              <CustomInput
                type="date"
                labelName="Delivery Date"
                value={input.deliveryDate}
                onChange={(e) =>
                  handleinputChange("deliveryDate", e.target.value)
                }
                placeholder="Select Delivery Date"
                isMax={new Date().toISOString().split("T")[0]}
                mandatoryIcon={requestStatus === 3}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="text"
                labelName="Received By"
                value={input.receivedBy}
                onChange={(e) =>
                  handleinputChange("receivedBy", e.target.value)
                }
                placeholder="Enter Receiver's Name"
                mandatoryIcon={requestStatus === 3}
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="text"
                labelName="Checked By"
                value={input.checkedBy}
                onChange={(e) => handleinputChange("checkedBy", e.target.value)}
                placeholder="Enter Checker's Name"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4}>
              <CustomDropdown
                dropdownLabelName="Item Condition"
                options={[
                  { label: "Select", value: "" },
                  ...(itemCondition || []),
                ]}
                valueKey="value"
                labelKey="label"
                selectedValue={input.itemCondition}
                onChange={(e) =>
                  handleinputChange("itemCondition", e.target.value)
                }
              />
            </Col>
            <Col md={4}>
              <CustomInput
                type="text"
                labelName="Challan Number"
                value={input.challanNumber}
                onChange={(e) =>
                  handleinputChange("challanNumber", e.target.value)
                }
                placeholder="Enter Challan Number"
                mandatoryIcon={requestStatus === 3}
              />
            </Col>
            <Col md={4}>
              <label htmlFor="challan-upload" style={{ marginBottom: "8px" }}>
                Upload Challan <span className="text-danger">*</span>
              </label>
              <input
                id="challan-upload"
                type="file"
                className="form-control"
                onChange={(e) =>
                  handleinputChange("challanFile", e.target.files[0])
                }
                accept=".pdf, .jpg, .jpeg, .png"
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4}>
              <div className="form-group">
                <label htmlFor="remarks">Remarks</label>
                <AutosizeTextarea
                  id="remarks"
                  value={input.remarks}
                  onChnage={(e) => handleinputChange("remarks", e.target.value)}
                />
              </div>
            </Col>
          </Row>
        </>
      )}
      {deliveries.length !== 0 && (
        <Row className="mt-3 rounded-5 ">
          <Table bordered className="rounded-5">
            <thead className="roun">
              <tr className="text-white bg-danger">
                <th style={{ backgroundColor: "#d90429", color: "white" }}>
                  Delivery Date
                </th>
                <th style={{ backgroundColor: "#d90429", color: "white" }}>
                  Received By
                </th>
                <th style={{ backgroundColor: "#d90429", color: "white" }}>
                  Checked By
                </th>
                <th style={{ backgroundColor: "#d90429", color: "white" }}>
                  Challan Number
                </th>
                <th style={{ backgroundColor: "#d90429", color: "white" }}>
                  Remarks
                </th>
                <th style={{ backgroundColor: "#d90429", color: "white" }}>
                  Item Condition
                </th>
                <th style={{ backgroundColor: "#d90429", color: "white" }}>
                  View Challan
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveries?.map((d, i) => (
                <tr key={i}>
                  <td>{moment(d.deliveryDate)?.format("DD-MM-YYYY")}</td>
                  <td>{d.receivedBy}</td>
                  <td>{d.checkedBy}</td>
                  <td>{d.challanNumber}</td>
                  <td>{d.remarks}</td>
                  <td>
                    {itemCondition?.find(
                      (cond) => cond.value === Number(d.itemCondition)
                    )?.label || ""}
                  </td>
                  <td className="text-center">
                    {d.fileUrl ? (
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <FaEye style={{ color: "black", cursor: "pointer" }} />
                      </a>
                    ) : (
                      <FaEye
                        style={{ color: "#ccc", cursor: "not-allowed" }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      )}
    </div>
  );
};

export default DeliveryDetails;
