import React from "react";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import CustomInput from "../CustomInput/CustomInput";
const CommonRowTable = (props) => {
  const {
    warning_Message,
    add_button,
    total_amount,
    rows,
    headers,
    handleInput,
    handleFileChange,
    addRow,
    removeRow,
    checkbox_view,
    handleSelectAllChange,
    handleRowCheckboxChange,
    checkedRows,
    selectAll,
  } = props;
  const formatHeader = (header) => {
    return header
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim()
      .replace(
        /\w\S*/g,
        (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      );
  };

  return (
    <div>
      <Table bordered hover responsive style={{ whiteSpace: "pre" }}>
        <thead>
          <tr>
            {checkbox_view && (
              <th style={{ backgroundColor: "#d90429", color: "white" }}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
            )}
            {/* {headers.map((header) => (
              <th
                key={header.name}
                style={{
                  backgroundColor: "#d90429",
                  color: "white",
                  minWidth: "160px",
                }}
              >
                {formatHeader(header.name)}
              </th>
            ))} */}
            {headers.map((header) => (
              <th
                key={header.name}
                style={{
                  minWidth: "120px",
                  backgroundColor: "#d90429",
                  color: "white",
                }}
              >
                {header.placeholder}
              </th>
            ))}
            {/* <th style={{ backgroundColor: "#d90429", color: "white" }}>Add</th> */}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {checkbox_view && (
                <td>
                  <input
                    type="checkbox"
                    checked={checkedRows[index]}
                    onChange={() => handleRowCheckboxChange(index)}
                  />
                </td>
              )}
              {headers.map((header) => (
                <td key={header.name}>
                  {header.isFile ? (
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => handleFileChange(e, index, header.name)}
                    />
                  ) : (
                    <CustomInput
                      type={header.type || "text"}
                      name={header.name}
                      // value={row[header.name]}
                      value={
                        header.type === "date"
                          ? row[header.name] || ""
                          : row[header.name]
                      }
                      onChange={(e) => handleInput(e, index)}
                      placeholder={header.placeholder || `Enter ${header.name}`}
                      isDisable={header.isDisable || false}
                    />
                  )}
                </td>
              ))}
              {add_button && (
                <td>
                  {index === rows.length - 1 ? (
                    <Button
                      variant="dark"
                      className="btn-sm mt-1"
                      onClick={addRow}
                    >
                      +
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      className="btn-sm mt-1"
                      onClick={() => removeRow(index)}
                    >
                      -
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
          {total_amount && (
            <tr>
              <td
                colSpan={8}
                style={{ textAlign: "right", fontWeight: "bold" }}
              >
                Total Amount:
                <span>
                  {rows.reduce(
                    (total, row) => total + (parseFloat(row.amount) || 0),
                    0
                  )}
                </span>
              </td>

              <td colSpan={3}></td>
            </tr>
          )}
        </tbody>
      </Table>
      {total_amount && (
        <Row className="mt-3">
          <Col md={12} className="align-content-end">
            <Alert
              variant="warning"
              style={{
                backgroundColor: "#fff3cd",
                color: "#856404",
                margin: "0",
                padding: "8px",
              }}
            >
              Note: Please click on + button to add rows
            </Alert>
          </Col>
          <Col md={2}></Col>
        </Row>
      )}
      {warning_Message && (
        <Row className="mt-3">
          <Alert
            variant="warning"
            style={{
              backgroundColor: "#fff3cd",
              color: "#856404",
              margin: "0",
              padding: "8px",
            }}
          >
            Note: Please click on + button to add rows
          </Alert>
        </Row>
      )}
    </div>
  );
};

export default CommonRowTable;
