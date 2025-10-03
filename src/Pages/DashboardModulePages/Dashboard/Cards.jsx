import React from "react";
import { Card, Col, ListGroup, NavLink } from "react-bootstrap";

const Cards = ({ title, icon: Icon, items, maxItemsToShow, viewAllLink }) => {
  
  return (
    <Col md={4} id="responsive-margin">
    <Card className="bg-body-tertiary rounded-4 shadow" id="card">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span className="text-danger">{title}</span>
          <Icon />
        </Card.Title>
        <ListGroup as="ul" className="flex-grow-1">
          {items.slice(0, maxItemsToShow).map((item, index) => (
            <ListGroup.Item as="li" key={index} id="list-style">
              {item}
            </ListGroup.Item>
          ))}
        </ListGroup>
        {items.length > maxItemsToShow && (
          <NavLink
            className="text-center mt-auto"
            id="viewLink"
            href={viewAllLink}
          >
            View All
          </NavLink>
        )}
      </Card.Body>
    </Card>
  </Col>
  );
};

export default Cards;
