import React from "react";

const AissgnedTicket = (props) => {
  const { ticketNo, Action } = props;
  return (
    <>
      <h3>Dear Sir/Ma'am</h3>
      <p className="mt-3">
        We would like to inform you that,ticket has been assigned to you.
      </p>
      <p className="mt-3">Description:</p>
      <div
        dangerouslySetInnerHTML={{ __html: Action }} // Ensure item.Reply is safe
      />
      <p className="mt-2">Thanks,</p>
      <p>Ambit-Admin</p>
    </>
  );
};

export default AissgnedTicket;
