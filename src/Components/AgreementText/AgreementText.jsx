import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import CustomSingleButton from "../CustomSingleButton/CustomSingleButton";

const EditableSpan = ({ initialText = "------------", onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (text.trim() === "") {
      setText(initialText);
    } else {
      if (onChange) {
        onChange(text);
      }
    }
    setIsEditing(false);
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return isEditing ? (
    <input
      type="text"
      value={text === initialText ? "" : text}
      onBlur={handleBlur}
      onChange={handleChange}
      autoFocus
      style={{
        width: "100px",
        margin: "0 5px",
        border: "none",
        outline: "none",
        background: "transparent",
        fontSize: "inherit",
        fontFamily: "inherit",
      }}
      onFocus={(e) =>
        e.target.setSelectionRange(e.target.value.length, e.target.value.length)
      } 
    />
  ) : (
    <span onClick={handleClick} style={{ cursor: "pointer" }}>
      {text}
    </span>
  );
};

const AgreementText = () => {
  const [showExportButton, setShowExportButton] = useState(false);

  // Function to generate PDF code here......
  const generatePDF = () => {
    const agreementContent = document.getElementById("agreement-content");

    html2canvas(agreementContent, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.7);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("business_agreement.pdf");
    });
  };

  const handleEditableChange = (newText) => {
    console.log("EditableSpan changed:", newText);
  };

  return (
    <div className="container-fluid bookmakerTable border rounded-3 table-responsive">
      <Row>
        <Col md={12} className="card p-4" id="agreement-content">
          <div>
            <p>
              This Agreement entered into at{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />{" "}
              Between M/s.{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />
              , a company incorporated under the Companies Act, 1956, having its
              registered office at{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />{" "}
              and Factory at{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />{" "}
              <br />
              AND <br />
              M/s.{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />
              , Represented by{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />
              , hereinafter referred to as the AGENCY/SECOND PARTY. <br />
              WHEREAS the company/first party intends to appoint the
              Agency/Second Party as Consignee Agent in the State of{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />{" "}
              State on the following terms and conditions.
            </p>
            <h4 className="text-center">
              NOW THIS DEED WITNESSETH AS UNDER AGREED BY AND BETWEEN <br /> THE
              PARTY HERETO.
            </h4>
            <p>
              1. This agreement will be effective and from{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />{" "}
              and will expire on{" "}
              <EditableSpan
                initialText="------------"
                onChange={handleEditableChange}
              />{" "}
              and be renewable for further periods as may be mutually agreed
              upon between the parties deem fit and proper to be mutually
              decided.
            </p>
            <p>
              2. The Agency shall maintain proper records of the stocks received
              from the company for delivery/dispatches and account for all the
              stocks kept by them from time to time.
            </p>
            <p>
              3. The Agency undertakes to provide proper and adequate office and
              warehousing facilities with lying with them to keep proper records
              and to ensure the stocks.
            </p>
            <p>
              4. The Agency shall ensure that no change is made in the
              constitution of the organization of the Agency’s firm except for
              reasons beyond the control of the Agency in which case the Agency
              shall inform the Firm within thirty days of such change.
            </p>
            <p>
              5. The Agency shall ensure that: <br />
              a) No modification or variation of the agreement shall be valid or
              binding unless made in Writing and executed by both the parties.
              <br />
              b) The agency shall not assign or otherwise transfer its rights or
              benefits, liabilities, duties, or obligations under this agreement
              to any other party without the prior consent in writing from the
              company.
            </p>
            <p>
              6. The agency shall render the following services: <br />
              a) Secure inward and outward handling of our goods including
              transport cartage. The Agency will efficiently perform the
              functions as laid down in this agreement. <br />
              b) Invoicing/Delivery/Dispatch/Booking of the consignment to the
              customers in accordance with the company’s instructions from time
              to time.
            </p>
            <p>
              7(a) The goods would be dispatched by the company from time to
              time and should carefully be taken delivery of by the Agency from
              the carriers as having received the goods on behalf of the
              company. <br />
              b. Goods received by the Agency on Company’s behalf from the
              carriers will be kept by the Agency in the warehouse and proper
              documents shall be made to record the Receipt. <br />
              c. In the event of any shortage/damage/manufacturing defect to the
              consignment noticed at the time of receipts of stocks from the
              carriers either or customers, the Agency will inform such facts in
              writing to the company forthwith within one week of the delivery
              of the said goods. No claim in this regard would be entertained
              thereafter under any circumstances. <br />
              d. To accept and store returned goods from the customers in the
              company’s account and dispatch the same to the company after
              making the necessary adjustment in the accounts.
            </p>
            <p>
              8(a) For the goods received by the Agency for Delivery/dispatch,
              the Agency will be fully responsible for the safe custody of our
              products. Any shortage/damages would be to the Agency’s account in
              terms of Clause 7 above. <br />
              The Agency undertakes that the company’s products shall be always
              stored in a proper manner, which may be verified by the Company’s
              authorized representatives. <br />
              b. The Agency shall release the company’s products only on receipt
              of a written order from the company. Expeditious dispatch of
              stocked materials against all orders received by the Agency shall
              be the essence of the contract.
            </p>
            <p>
              9(a) The Agency will deliver the goods of the company’s customers
              within the state of <EditableSpan initialText="------------" />{" "}
              &amp; shall see that the dispatch to the company’s customers is
              made accurately and that the stocks pertaining to respective
              customers (as indicated in the invoice) are delivered dispatched
              accordingly in view of the express order placed by the company to
              the Agency. <br />
              b. The agency will back the consignments meant for the company’s
              up-country customers according to the company’s express
              order/advice through stipulated carriers and obtain the
              Consignment note for the same. <br />
              In connection with the above two deliveries, the Agency may incur
              following incidental expenses wherever necessary in their own
              account. <br />
              I. Packing as and when required. <br />
              II. Telegraphic/telephonic expenses. <br />
              III. Local courier, postage, etc. <br />
              IV. Loading and unloading expenses. <br />
              V. Legal charge. <br />
              VI. Fax &amp; Xerox charge. <br />
              VII. Outward Freight &amp; Local (cartage) shall be debited to the
              company’s account with supporting documents. <br />
              VIII. The agency shall strictly adhere to the company’s
              delivery/supply instructions. <br />
              All the business of the respective state will be executed only
              through the agency. The Agency/Second Party shall charge at the
              rate of 10% on the company’s rate as their service charge and
              should prepare the bills in the name of distributors, ensuring
              that all paperwork adheres to the highest standards of
              professionalism and clarity. <br />
              All the distributors will be appointed with mutual consents of the
              company and the Agency. However, the payment responsibility lies
              solely with the agency. <br />
              There is no target set in the first phase of the plan but the same
              will be done at a later date as soon as the market establishes.{" "}
              <br />
              All the materials as per the indent placed by the agency will be
              dispatched through transport and the bill along with the
              consignment note shall be forwarded to the agency directly. No
              credit shall be allowed and all the goods supplied to the Agency
              shall be after the payment of the bills against the ordered goods.{" "}
              <br />
              The company will spend on local advertising (Magazines etc.) and
              P.O.P.S.
            </p>
            <p>
              10. In consideration for the services performed by the Agency as
              stated hereinabove, the Company shall pay to the Agency service
              charges in the following manner: <br />
              The party of the second part, that is the Agency, undertakes to
              provide a deposit of Rs.{" "}
              <EditableSpan initialText="------------" /> only to the party of
              the First Party by issuing a Cheque. In favour of the Party on the
              First Part and shall be returned/refunded to the party of the
              second party on expiry/termination of this agreement.
            </p>
            <p>
              11.a. Submit detailed stock ledger to the company at its head
              office on the 15th of every month.
            </p>
            <p>
              b. Provide the company’s head office in time with the necessary
              statements and reports.
            </p>
            <p>
              c. Not to provide access to any unauthorized person in the
              company’s warehouse where the goods are stored or in the office
              where information on stocks and prices are available.
            </p>
            <p>
              d. Help the company in filing Sales Tax returns and any other
              relevant acts by providing accurate sales data to HO. The company
              shall not take responsibility for payment of Sales Tax/Excise
              (both State and Central) dues and any other statutory dues from C
              & A premises, and the C & A (Agency) will be held responsible for
              any non-payment of such dues to the Government.
            </p>
            <p>
              12. Should there be any dispute between the company and the Agency
              regarding, related to, or arising out of this Agreement, the
              parties shall try to resolve the dispute in mutual trust and
              goodwill and if not resolved, the dispute shall be referred to
              arbitration as per the provisions of the Arbitration and
              Conciliation Act, 1996.
            </p>{" "}
          </div>
          <div className="text-center d-flex justify-content-center mt-2 gap-2">
            <CustomSingleButton
              _ButtonText="Accept"
              onPress={() => setShowExportButton(true)}
              backgroundColor="primary"
              width={80}
              height={40}
            />
            <CustomSingleButton
              _ButtonText="Reject"
              onPress={() => setShowExportButton(true)}
              backgroundColor="gray"
              width={80}
              height={40}
            />
          </div>
          {showExportButton && (
            <div className="text-center justify-content-center d-flex mt-2">
              <CustomSingleButton
                _ButtonText="Export as PDF"
                onPress={generatePDF}
                backgroundColor="darkgreen"
                width={170}
                height={40}
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AgreementText;
