import React from 'react';

const UnderlinedClickableText = ({ text, onClick, style }) => {
  const defaultStyle = {
    textDecoration: 'underline',
    color: 'blue',
    cursor: 'pointer',
  };

  return (
    <span onClick={onClick} style={{ ...defaultStyle, ...style }}>
      {text}
    </span>
  );
};

export default UnderlinedClickableText;
