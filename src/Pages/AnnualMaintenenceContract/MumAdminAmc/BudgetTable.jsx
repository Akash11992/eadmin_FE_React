import React, { useEffect, useCallback, useState } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import MUIStartDate from "../../../Components/DatePicker/MUIStartDate";
import CustomDropdown from "../../../Components/CustomDropdown/CustomDropdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchDropdownData } from "../../../Slices/AMC/AMCSlice";
import { LuArrowDownUp } from "react-icons/lu";
import "../../../Assets/css/AMC/amc.css";
import { FaDownload } from "react-icons/fa";
import validateFile from "../../../Components/CustomInput/fileValidation";
import { toast } from "react-toastify";

const BudgetTable = ({ form, setForm }) => {
  const currentYear = new Date().getFullYear();
  const defaultFY = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  const { amcStatus } = useSelector((state) => state.AMC);
  const [activeRow, setActiveRow] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchDropdownData({ id: "AMC_STATUS", type: "AMC", key: "amcStatus" })
    );
  }, [dispatch]);

  // Ensure at least one row is available
  useEffect(() => {
    if (!form.budget_details || form.budget_details.length === 0) {
      setForm((prev) => ({
        ...prev,
        budget_details: [
          {
            financialYear: defaultFY,
            startDate: null,
            endDate: null,
            budgetedAmount: null,
            actualAmount: null,
            increasePercent: 0,
            increaseAmount: 0,
            status: null,
            gst: null,
            totalAmount: null,
            poNumber: null,
            file: null,
          },
        ],
      }));
    }
  }, [form.budget_details, setForm, defaultFY]);

  // Function to update field values
  const handleInputChange = useCallback(
    (index, field, value) => {
      const updatedDetails = [...form.budget_details];
      if (field === "file") {
        const validation = validateFile(value);
        if (!validation.isValid) {
          toast.error(validation.message);
          return;
        }
        updatedDetails[index][field] = value;
      } else {
        updatedDetails[index] = {
          ...updatedDetails[index],
          [field]: value,
        };
      }

      // Calculate financial year based on startDate and endDate
      if (field === "startDate" || field === "endDate") {
        const startDate = updatedDetails[index].startDate;
        const endDate = updatedDetails[index].endDate;

        if (startDate && endDate) {
          const startYear = new Date(startDate).getFullYear();
          const endYear = new Date(endDate).getFullYear();
          updatedDetails[index].financialYear = `${startYear}-${(endYear % 100)
            .toString()
            .padStart(2, "0")}`;
        }
      }

      // Auto-calculate Increase Amount if necessary
      if (field === "increasePercent" && updatedDetails[index].actualAmount) {
        updatedDetails[index].increaseAmount =
          (updatedDetails[index].actualAmount * parseFloat(value)) / 100 || 0;
      }

      if (field === "actualAmount" && updatedDetails[index].increasePercent) {
        updatedDetails[index].increaseAmount =
          (parseFloat(value) * updatedDetails[index].increasePercent) / 100 ||
          0;
      }

      if (
        (field === "gst" && updatedDetails[index].actualAmount) ||
        (field === "actualAmount" && updatedDetails[index].gst)
      ) {
        const actual = parseFloat(updatedDetails[index].actualAmount) || 0;
        const gstPercent = parseFloat(updatedDetails[index].gst) || 0;
        const gstAmount = (actual * gstPercent) / 100;
        updatedDetails[index].totalAmount = actual + gstAmount;
      }

      setForm((prev) => ({
        ...prev,
        budget_details: updatedDetails,
      }));
    },
    [form.budget_details, setForm]
  );
  console.log(form.budget_details, "rows");
  // Function to add a new row
  const addRow = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      budget_details: [
        ...prev.budget_details,
        {
          financialYear: defaultFY,
          startDate: null,
          endDate: null,
          budgetedAmount: null,
          actualAmount: null,
          increasePercent: 0,
          increaseAmount: 0,
          status: null,
          gst: null,
          totalAmount: null,
          poNumber: null,
          file: null,
        },
      ],
    }));
    setActiveRow(form.budget_details.length); // Set the active row to the newly added row
  }, [setForm, form.budget_details.length, defaultFY]);

  // Function to remove a row
  const removeRow = useCallback(
    (index) => {
      if (form.budget_details.length > 1) {
        setForm((prev) => ({
          ...prev,
          budget_details: prev.budget_details.filter((_, i) => i !== index),
        }));
        setActiveRow(null); // Reset the active row
      }
    },
    [form.budget_details.length, setForm]
  );

  return (
    <Row className="tableSchroll mt-2">
      <Col md={12}>
        <Table size="sm" responsive="md">
          <thead>
            <tr className="text-center text-nowrap">
              <th className="bg-danger text-white tablebodyWidthfy">FY *</th>
              <th className="bg-danger text-white tablebodyWidth">
                Start Date *
              </th>
              <th className="bg-danger text-white tablebodyWidth">
                End Date *
              </th>
              <th className="bg-danger text-white tablebodyWidth">
                Budgeted Amount *
              </th>
              <th className="bg-danger text-white tablebodyWidth">
                Actual Amount *
              </th>
              <th className="bg-danger text-white tablebodyWidth">GST (%) *</th>
              <th className="bg-danger text-white tablebodyWidth">
                Total Amount *
              </th>
              <th className="bg-danger text-white tablebodyWidth">
                <LuArrowDownUp /> In %
              </th>
              <th className="bg-danger text-white tablebodyWidth">
                <LuArrowDownUp /> In Amount
              </th>
              <th className="bg-danger text-white tablebodyWidth">
                PO Number *
              </th>{" "}
              <th
                className="bg-danger text-white"
                style={{ minWidth: "300px" }}
              >
                Upload Document*
              </th>
              <th className="bg-danger text-white tablebodyWidth">Status *</th>
              <th className="bg-danger text-white ">View Document</th>
              <th className="bg-danger text-white tablebodyWidth">Action</th>
            </tr>
          </thead>
          <tbody>
            {form.budget_details.map((row, index) => (
              <tr key={index}>
                <td>
                  <CustomInput
                    type="text"
                    placeholder="Auto"
                    value={row.financialYear || ""}
                    isDisable
                  />
                </td>
                <td>
                  <MUIStartDate
                    onChange={(newValue) =>
                      handleInputChange(
                        index,
                        "startDate",
                        newValue ? newValue.format("YYYY-MM-DD") : ""
                      )
                    }
                    value={row.startDate || ""}
                    MaxValue={row.endDate}
                  />
                </td>
                <td>
                  <MUIStartDate
                    onChange={(newValue) =>
                      handleInputChange(
                        index,
                        "endDate",
                        newValue ? newValue.format("YYYY-MM-DD") : ""
                      )
                    }
                    value={row.endDate || ""}
                    MinValue={row.startDate}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter Amount"
                    value={row.budgetedAmount}
                    onChange={(e) =>
                      handleInputChange(index, "budgetedAmount", e.target.value)
                    }
                    isMin={0}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter Amount"
                    value={row.actualAmount}
                    onChange={(e) =>
                      handleInputChange(index, "actualAmount", e.target.value)
                    }
                    isMin={0}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter GST"
                    value={row.gst}
                    onChange={(e) =>
                      handleInputChange(index, "gst", e.target.value)
                    }
                    isMin={0}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter Amount"
                    value={row.totalAmount}
                    onChange={(e) =>
                      handleInputChange(index, "totalAmount", e.target.value)
                    }
                    isMin={0}
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Enter %"
                    value={row.increasePercent}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "increasePercent",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <CustomInput
                    type="number"
                    placeholder="Auto"
                    value={row.increaseAmount || ""}
                    isDisable
                    isMin={0}
                  />
                </td>
                <td>
                  <CustomInput
                    type="text"
                    placeholder="Enter PO Number"
                    value={row.poNumber}
                    onChange={(e) =>
                      handleInputChange(index, "poNumber", e.target.value)
                    }
                  />
                </td>
                <td>
                  <CustomInput
                    type="file"
                    // mandatoryIcon={true}
                    accept=".pdf,.jpeg,.jpg,.png"
                    onChange={(e) =>
                      handleInputChange(index, "file", e.target.files[0])
                    }
                  />
                </td>

                <td>
                  <CustomDropdown
                    labelKey="label"
                    valueKey="value"
                    options={[
                      { label: "Select", value: "" },
                      ...(amcStatus || []),
                    ]}
                    selectedValue={row.status}
                    onChange={(e) =>
                      handleInputChange(index, "status", e.target.value)
                    }
                  />
                </td>
                <td className="text-center">
                  {row?.fileUrl ? (
                    <a
                      href={row?.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <FaDownload
                        style={{ color: "black", cursor: "pointer" }}
                      />
                    </a>
                  ) : (
                    <FaDownload
                      style={{ color: "#ccc", cursor: "not-allowed" }}
                    />
                  )}
                </td>
                <td className="text-center">
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={addRow}
                    disabled={activeRow !== null && activeRow !== index}
                  >
                    Renew AMC
                  </Button>
                  {form.budget_details.length > 1 && (
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
  );
};

BudgetTable.propTypes = {
  form: PropTypes.shape({
    budget_details: PropTypes.arrayOf(
      PropTypes.shape({
        financialYear: PropTypes.string.isRequired,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        budgetedAmount: PropTypes.number,
        actualAmount: PropTypes.number,
        increasePercent: PropTypes.number,
        increaseAmount: PropTypes.number,
        status: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  setForm: PropTypes.func.isRequired,
};

export default BudgetTable;
