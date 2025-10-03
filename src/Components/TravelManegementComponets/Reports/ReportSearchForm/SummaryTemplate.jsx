import { useState } from "react";
import { API_GET_APPROVAL_SUMMARY } from "../../../../Services/ApiConstant";
import Encryption from "../../../Decryption/Encryption";

const SummaryTemplate = (props) => {
  const {
    name,
    month,
    vendor,
    OlaAmount,
    UberAmount,
    business,
    id,
    createdBy,
    fromName,
    currentBaseUrl,
  } = props;
  const [remark, setRemark] = useState(null);
  const encryptData = Encryption();
  const encryptID = encryptData(id);
  const encryptcreatedBy = encryptData(createdBy);

  const getOlaUberLabel = () => {
    const hasOla =
      OlaAmount != null && OlaAmount !== "" && OlaAmount !== "0.00";
    const hasUber =
      UberAmount != null && UberAmount !== "" && UberAmount !== "0.00";
    if (hasOla && hasUber) return "Ola and Uber";
    if (hasOla) return "Ola";
    if (hasUber) return "Uber";
    return "";
  };
  console.log(typeof UberAmount, "UberAmount");
  const renderVendorExpenses = () => {
    const label = getOlaUberLabel();
    if (label === "Ola") {
      return (
        <div>
          <p>
            • Ola ride: ₹ <span>{OlaAmount}</span>
          </p>{" "}
          <br />
        </div>
      );
    } else if (label === "Uber") {
      return (
        <div>
          <p>
            • Uber ride: ₹ <span>{UberAmount}</span>
          </p>{" "}
          <br />
        </div>
      );
    } else if (label === "Ola and Uber") {
      return (
        <div style={{ paddingTop: "10px" }}>
          <p style={{ margin: "2px 0" }}>• Ola ride: ₹ {OlaAmount}</p>
          <p style={{ margin: "2px 0" }}>• Uber ride: ₹ {UberAmount}</p>
          <br />
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <p>Dear {name || "Sir/Ma'am"},</p>
      <p>
        Please find the generated report for the {getOlaUberLabel()} business
        rides for <span style={{ marginRight: "2px" }}>{month}</span> attached
        for your review.
      </p>
      &thinsp;
      <p>The total expenses for {business} are as follows: &thinsp;</p>
      {renderVendorExpenses()}
      <p>
        Kindly click on the appropriate button below to approve or reject these
        reports. You may also add any remarks; if required.
      </p>
      <br />
      <a
        href={API_GET_APPROVAL_SUMMARY(
          encryptID,
          "Approve",
          remark,
          encryptcreatedBy
        )}
        style={{
          marginLeft: "10px",
          padding: "5px 10px",
          backgroundColor: "#28a745",
          color: "white",
          textDecoration: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        Approve
      </a>
      <a
        id="rejectLink"
        href={API_GET_APPROVAL_SUMMARY(
          encryptID,
          "Reject",
          remark,
          encryptcreatedBy
        )}
        style={{
          marginLeft: "10px",
          padding: "5px 10px",
          backgroundColor: "#dc3545",
          color: "white",
          textDecoration: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        Reject
      </a>
      <a
        style={{
          marginLeft: "10px",
          textDecoration: "none",
          color: "black",
          fontWeight: "0.5px",
          cursor: "pointer",
        }}
        href={`${currentBaseUrl}/olauberremark?remark=${encodeURIComponent(
          encryptID
        )}`}
        target="_blank"
      >
        <small>
          <span
            style={{
              textDecoration: "underline",
              color: "blue",
              marginRight: "2px",
            }}
          >
            Click Here{" "}
          </span>
          for remark.
        </small>{" "}
      </a>
      <br />
      <br />
      <br />
      <div>
        <p>Regards,</p>
        <p>{fromName}</p>
      </div>
    </div>
  );
};

export default SummaryTemplate;
