import React from "react";

const ClosedTicketTemplate = (props) => {
  const { name, ticketNo, Action, status } = props;
  return (
    <>
      <h3>Dear {name}</h3>
      {status == 2 ? (
        <>
          <p className="mt-3">
            We would like to inform you that, Your reported Request{" "}
            <b className="me-2"> Ticket ID-{ticketNo}</b>has been closed.
          </p>
          <p>
            Also, please note that <b> Ticket ID-{ticketNo}</b> ticket will not
            be reopened. Kindly log a new fresh ticket, if you face the same issue
            after closing this ticket.
          </p>
        </>
      ) : status == 3 ? (
        <>
          <p className="mt-3">
            We would like to inform you that, Your reported Request{" "}
            <b className="me-2"> Ticket ID-{ticketNo}</b> is currently in
            progress.
          </p>
        </>
      ) : null}
      <p className="mb-2">Action taken :</p>
      <div
        dangerouslySetInnerHTML={{ __html: Action }} // Ensure item.Reply is safe
      />
      <p>Thanks,</p>
      <p>Ambit-Admin</p>
    </>
  );
};

export default ClosedTicketTemplate;
