import React, { useEffect } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import MUIStartDate from "../../../Components/DatePicker/MUIStartDate";

const RentDetailsComponent = (props) => {
  const { form, setForm } = props;

  // Ensure at least one row is available
  useEffect(() => {
    if (!form?.rent_details || form.rent_details.length === 0) {
      setForm((prev) => ({
        ...prev,
        rent_details: [
          {
            fromDate: null,
            toDate: null,
            amount: null,
            rate: null,
            escalation: null,
            camPerMonth: null,
            camRate: null,
            camEscalation: null,
          },
        ],
      }));
    }
  }, [form?.rent_details, setForm]);

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...form?.rent_details];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setForm((prev) => ({
      ...prev,
      rent_details: updatedDetails,
    }));
  };

  // Add a new row
  const addRow = () => {
    setForm((prev) => ({
      ...prev,
      rent_details: [
        ...prev?.rent_details,
        {
          fromDate: null,
          toDate: null,
          amount: null,
          rate: null,
          escalation: null,
          camPerMonth: null,
          camRate: null,
          camEscalation: null,
        },
      ],
    }));
  };

  // Remove a row
  const removeRow = (index) => {
    if (form?.rent_details?.length > 1) {
      setForm((prev) => ({
        ...prev,
        rent_details: prev?.rent_details.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <div className="mt-2" id="conveyance-form">
      <h6>Rent Details</h6>
      <hr />
      <Row className="mt-2">
        <Col md={12}>
          <Table size="sm" bordered hover responsive>
            <thead>
              <tr className="text-center">
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>From Date</th>
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>To Date</th>
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>Rent Per Month</th>
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>Rate per sq. ft.</th>
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>Escalation</th>
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>CAM Per Month</th>
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>CAM Rate Per Sq. Ft</th>
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>CAM Escalation</th>
                <th className="bg-danger text-white" style={{ minWidth: "160px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {form?.rent_details?.map((row, index) => (
                <tr key={index}>
                  <td>
                    <MUIStartDate
                      onChange={(newValue) =>
                        handleInputChange(
                          index,
                          "fromDate",
                          newValue ? newValue.format("YYYY-MM-DD") : null
                        )
                      }
                      value={row.fromDate}
                      MaxValue={row.toDate}
                    />
                  </td>
                  <td>
                    <MUIStartDate
                      onChange={(newValue) =>
                        handleInputChange(
                          index,
                          "toDate",
                          newValue ? newValue.format("YYYY-MM-DD") : null
                        )
                      }
                      value={row.toDate}
                      MinValue={row.fromDate}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="number"
                      placeholder="Enter Rent"
                      value={row.amount}
                      onChange={(e) =>
                        handleInputChange(index, "amount", e.target.value)
                      }
                      isMin={0}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="number"
                      placeholder="Enter Rate"
                      value={row.rate}
                      onChange={(e) =>
                        handleInputChange(index, "rate", e.target.value)
                      }
                      isMin={0}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="text"
                      placeholder="Enter Escalation"
                      value={row.escalation}
                      onChange={(e) =>
                        handleInputChange(index, "escalation", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="number"
                      placeholder="Enter CAM"
                      value={row.camPerMonth}
                      onChange={(e) =>
                        handleInputChange(index, "camPerMonth", e.target.value)
                      }
                      isMin={0}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="number"
                      placeholder="Enter CAM Rate"
                      value={row.camRate}
                      onChange={(e) =>
                        handleInputChange(index, "camRate", e.target.value)
                      }
                      isMin={0}
                    />
                  </td>
                  <td>
                    <CustomInput
                      type="text"
                      placeholder="Enter CAM Escalation"
                      value={row.camEscalation}
                      onChange={(e) =>
                        handleInputChange(index, "camEscalation", e.target.value)
                      }
                    />
                  </td>
                  <td className="text-center">
                    <Button variant="dark" size="sm" onClick={addRow}>
                      +
                    </Button>
                    {form?.rent_details?.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeRow(index)}
                        className="ms-2"
                      >
                        -
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default RentDetailsComponent;