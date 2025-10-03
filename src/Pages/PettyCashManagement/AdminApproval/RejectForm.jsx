import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Decryption from "../../../Components/Decryption/Decryption";
import Encryption from "../../../Components/Decryption/Encryption";

const RejectForm = () => {
  const [data, setData] = useState("");
  const [remark, setRemark] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const params = new URLSearchParams(window.location.search);
  const encryptedData = params.get("q");
  const [checkedRows, setCheckedRows] = useState([]);

  const encrypt = Encryption();
  const decrypt = Decryption();
  let refString = "";
  if (encryptedData) {
    const decrypted = decrypt(decodeURIComponent(encryptedData));
    refString = decrypted.rows || ""; // e.g., "CON01:1,CAF02:2"
  }

  const handleCheckboxChange = (row, checked) => {
    const value = `${row["Voucher ID"] || row["Voucher Id"]}:${
      row["Voucher Type Id"] || row["Voucher Type ID"]
    }`;
    setCheckedRows((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };
  console.log(refString, "refString");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkedRows.length === 0) {
      setError("Please select at least one voucher.");
      return;
    }

    if (remark.trim() === "") {
      setError("Please enter a remark before submitting.");
      return;
    }
    const uncheckedRows = refString
      .map(
        (row) =>
          `${row["Voucher ID"] || row["Voucher Id"]}:${
            row["Voucher Type Id"] || row["Voucher Type ID"]
          }`
      )
      .filter((v) => !checkedRows.includes(v));
    try {
      if (uncheckedRows.length > 0) {
        const encryptedData = encrypt({ refs: uncheckedRows.join(",") });
        await axios.get(
          `${process.env.REACT_APP_API}/api/approve-admin?q=${encodeURIComponent(
            encryptedData
          )}`
        );
      }
      const result = await axios.post(
        `${process.env.REACT_APP_API}/api/reject-admin`,
        {
          data: {
            refs: checkedRows?.join(","),
            remark: remark.trim(),
          },
        }
      );
      setData(result?.data);
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleChange = (e) => {
    setRemark(e.target.value);
    if (error) setError(""); // Clear error as user types
  };

  return (
    <>
      {!submitted ? (
        <div className="d-flex justify-content-center">
          <div className="col-md-10" style={{ overflowX: "auto" }}>
            <h3
              className="text-center mb-4"
              style={{ color: "#d93434", fontWeight: "600" }}
            >
              Reject Pending Vouchers
            </h3>
            <table className="table table-bordered text-center align-middle">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#d93434", color: "#faf6f6" }}>
                    <input
                      type="checkbox"
                      checked={
                        checkedRows.length === refString.length &&
                        refString.length > 0
                      }
                      onChange={(e) =>
                        setCheckedRows(
                          e.target.checked
                            ? refString.map(
                                (row) =>
                                  `${row["Voucher ID"] || row["Voucher Id"]}:${
                                    row["Voucher Type Id"] ||
                                    row["Voucher Type ID"]
                                  }`
                              )
                            : []
                        )
                      }
                    />
                  </th>
                  {[
                    "Sr.No",
                    "Voucher ID",
                    "Voucher Type",
                    "Created By",
                    "Expense Date",
                    "User Name",
                    "Company",
                    "Department",
                    "Area / Travel Mode / Particular",
                    "Travel Details / Quantity / Service",
                    "Remarks",
                    "Rate",
                    "Amount",
                  ].map((title) => (
                    <th
                      key={title}
                      style={{
                        backgroundColor: "rgb(219, 52, 52)",
                        color: "#faf6f6",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refString.map((row, i) => {
                  const value = `${row["Voucher ID"] || row["Voucher Id"]}:${
                    row["Voucher Type Id"] || row["Voucher Type ID"]
                  }`;

                  return (
                    <tr key={i}>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkedRows.includes(value)}
                          onChange={(e) =>
                            handleCheckboxChange(row, e.target.checked)
                          }
                        />
                      </td>
                      <td>{i + 1}</td>
                      <td>{row["Voucher ID"] || row["Voucher Id"] || ""}</td>
                      <td>
                        {row["Voucher Type"] || row["voucher type"] || ""}
                      </td>
                      <td>{row["Created By"] || ""}</td>
                      <td>{row["Expense_Date"] || ""}</td>
                      <td>{row["User Name"] || ""}</td>
                      <td>{row["Company Details"] || ""}</td>
                      <td>{row["User Department"] || ""}</td>
                      <td>
                        {row["Area"] ||
                          row["Travel Mode"] ||
                          row["Particular"] ||
                          "-"}
                      </td>
                      <td>
                        {row["Service"] ||
                          row["Travel Details"] ||
                          row["Quantity"] ||
                          "-"}
                      </td>
                      <td>{row["Remark"] || row["Remarks"] || "-"}</td>
                      <td>{row["Rate"] || "-"}</td>
                      <td>{row["Amount"] || row["Expense"] || "0"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4">
              <p className="fw-semibold">
                Please provide a reason for rejecting{" "}
                {checkedRows.length > 0
                  ? `the selected ${checkedRows.length} voucher${
                      checkedRows.length > 1 ? "s" : ""
                    }`
                  : "the vouchers"}
                :
              </p>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={remark}
                  onChange={handleChange}
                  placeholder="Enter your rejection remarks..."
                  className="form-control"
                  style={{
                    height: 100,
                    resize: "none",
                    fontSize: 14,
                  }}
                />
                {error && (
                  <div style={{ color: "red", marginTop: 8 }}>{error}</div>
                )}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={remark.trim() === "" || checkedRows.length === 0}
                    className="btn mt-3"
                    style={{
                      padding: "10px 30px",
                      backgroundColor: remark.trim() ? "#dc3545" : "#ccc",
                      color: "white",
                      border: "none",
                      borderRadius: 5,
                      fontSize: 16,
                      cursor: remark.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            height: "60vh",
            backgroundColor: "#f4f4f4",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              minWidth: "700px",
            }}
          >
            <h3 style={{ color: "green", marginBottom: "20px" }}>{data}</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default RejectForm;
