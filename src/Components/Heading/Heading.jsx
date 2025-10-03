import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({ text }) => {
  return (
    <h2 className="mb-4 pageTitle text-center">{text}</h2>
  );
};

Heading.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Heading;
