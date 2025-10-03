import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import useDownloader from "react-use-downloader";

const UploadDocument = ({ reply, id,AttachmentDetails }) => {
  const { download } = useDownloader();
  return (
    <>
      <Row className="mt-4">
        <Col md={6}>
          <h5>Replies</h5>
          {reply?.length === 0 ? (
            <p className="text-muted"> All Replies here..</p>
          ) : (
            <ul className="reply-list">
              {reply?.map((item) => {
                const formattedDate = new Date(
                  item.created_date
                ).toLocaleString(); // Format date once
                return (
                  <li key={item.id} className="" data-id={item.id}>
                    <div
                      className="reply-content"
                      dangerouslySetInnerHTML={{ __html: item.Reply }} // Ensure item.Reply is safe
                    />

                    <small className="text-muted">
                      Reply by {item.name} On {formattedDate}
                    </small>
                    <hr />
                  </li>
                );
              })}
            </ul>
          )}
        </Col>
        <Col md={6} className="">
          <h5>Attachments</h5>
          {AttachmentDetails?.length === 0 ? (
            <p className="text-muted"> All Attachments here..</p>
          ) : (
            <ul>
              {AttachmentDetails?.map((attach) => (
                <li key={attach.id} data-id={attach.id}>
                  <Button
                    className="text-primary btn-light no-hover"
                    onClick={() =>
                      download(attach.attachment_path, attach.attachment)
                    }
                  >
                    {attach.attachment}
                  </Button>
                  <p className="small text-muted">
                    Uploaded By {attach.name} On {attach.date}
                  </p>
                  <hr />
                </li>
              ))}
            </ul>
          )}
        </Col>
      </Row>
    </>
  );
};

export default UploadDocument;
