import React, { useMemo } from "react";
import formatDate from "../DatePicker/formatDate";
import Encryption from "../Decryption/Encryption";

const SentToChecker = (props) => {
  const {
    requestedBy,
    formData,
    rows,
    departmentData,
    priorityDropdown,
    building,
    locationDropdown,
    officesupplice,
    flag,
    business,
    company,
    currentBaseUrl
  } = props;

  const encryptData = Encryption();
  const API = `${process.env.REACT_APP_API}/api`;
  // Helper function to find label by value
  const findLabel = (list, value) =>
    list?.find((item) => item.value == value)?.label || "";

  const companyName = useMemo(
    () =>
      company?.find(
        (dept) => dept.company_id == (formData.TOSR_ENTITY || formData.entity)
      )?.company_name || "",
    [company, formData]
  );
  const businessName = useMemo(
    () =>
      business?.find(
        (dept) =>
          dept.businessId == (formData.TOSR_BUSINESS_ID || formData.business)
      )?.businessName || "",
    [business, formData]
  );
  // Derived values using helper function
  const department = useMemo(
    () =>
      departmentData?.find(
        (dept) =>
          dept.dept_code == (formData.TOSR_DEPARTMENT_ID || formData.department)
      )?.department_desc || "",
    [departmentData, formData]
  );

  const buildings = useMemo(
    () =>
      findLabel(building, formData.TOSR_LOCATION_ID || formData.officeLocation),
    [building, formData]
  );

  const floor = useMemo(
    () => findLabel(locationDropdown, formData.TOSR_FLOOR_ID || formData.floor),
    [locationDropdown, formData]
  );

  const priority = useMemo(
    () =>
      findLabel(priorityDropdown, formData.TOSR_PRIORITY || formData.priority),
    [priorityDropdown, formData]
  );

  const isApprover = flag === "Approver";
  const isVendor = flag === "Vendor";
  const name = isApprover ? "Approver" : isVendor ? "Vendor" : "Checker";

console.log(  currentBaseUrl,"")  
const encrypt = encryptData({
    id: formData?.requestId,
    type: "APPROVED",
  });
  const encrypt2 = encryptData({
    id: formData?.requestId,
    type: "REJECTED",
  });
  const encryptID = encryptData({id:formData?.requestId})
  // Enrich rows with category and item names
  const enrichedRows = useMemo(() => {
    return rows.map((item) => {
      const category = officesupplice?.find(
        (cat) => cat.TOSCM_CATEGORY_ID == item.TOSR_CATEGORY_ID
      )?.TOSCM_CATEGORY_NAME;

      const selectedItem = item?.itemsList?.find(
        (data) => data.TOSCI_C_ITEM_ID == item?.TOSR_ITEM_ID
      )?.TOSCI_ITEM_NAME;

      return {
        ...item,
        category: category || "",
        selectedItem: selectedItem || "",
      };
    });
  }, [rows, officesupplice]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h3>Dear {name},</h3>

      <p style={{ marginTop: "30px" }}>
        {isApprover
          ? `An office supplies request has been approved by the Checker and forwarded for your approval.`
          : isVendor
          ? `Please find below office supplies request for your reference:`
          : `A new office supplies request has been raised by ${requestedBy}. The details are as follows:`}
      </p>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <table
            border="1"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#dc3545", color: "white" }}>
                <th>Request Date</th>
                {isApprover && <th>Requested By</th>}
                <th>Entity</th>
                <th>Business</th>
                <th>Department</th>
                <th>Location</th>
                <th>Floor</th>
                {/* <th>Priority</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {formatDate(
                    formData.TOSR_REQUEST_DATE || formData.requestDate
                  )}
                </td>
                {isApprover && <td>{requestedBy}</td>}
                <td>{companyName}</td>
                <td>{businessName}</td>
                <td>{department}</td>
                <td>{buildings}</td>
                <td>{floor}</td>
                {/* <td>{priority}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p>Item Details:</p>
      </div>
      <div>
        <table
          border="1"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            textAlign: "center",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#dc3545", color: "white" }}>
              <th>Category</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th> GST(%)</th>
              <th> Amount(Incl. GST)</th>
            </tr>
          </thead>
          <tbody>
            {enrichedRows.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.selectedItem}</td>
                <td>{item.TOSR_QUANTITY}</td>
                <td>{item.TOSR_RATE}</td>
                <td>{item.TOSR_GST}</td>
                <td>{item.TOSR_AMOUNT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: "30px" }}>
        {isApprover
          ? "Kindly click on the appropriate button below to approve or reject these reports. You may also add any remarks; if required."
          : "Kindly review and process the request accordingly."}
      </p>
      {isApprover && (
        <>
          <div style={{ marginTop: "20px" }}>
            {/* Approve Link */}
            <a
              href={`${API}/approvalStatus?data=${encrypt}`}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "#28a745",
                color: "white",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
              }}
              target="_blank"
            >
              Approve
            </a>
            {/* Reject Link */}
            <a
              id="rejectLink"
              href={`${API}/approvalStatus?data=${encrypt2}`}
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "#dc3545",
                color: "white",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
              }}
              target="_blank"
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
              href={`${currentBaseUrl}/officeSupplyRemark?remark=${encodeURIComponent(
                encryptID
              )}`}
              target="_blank"
            >
              <small>
                <span
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                  }}
                >
                  Click Here{" "}
                </span>
                for remark.
              </small>{" "}
            </a>{" "}
          </div>
          <br />
        </>
      )}

      <p>Regards</p>
      <p>Ambit-Admin</p>
      <p style={{ fontStyle: "italic", fontSize: "13px", marginTop: "20px" }}>
        This is a system-generated email. Please do not reply.
      </p>
    </div>
  );
};

export default SentToChecker;
