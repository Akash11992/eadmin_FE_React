import React from "react";
import { Button, Image } from "react-bootstrap";

const CustomSingleButton = (props) => {
  return (
    <Button
      onClick={props?.onPress}
      style={{
        backgroundColor: props?.backgroundColor,
        borderColor: props?.borderColor,
        margin: props?.margin,
        height: props?.height,
        width: props?.width ? props.width : "100%",
        color: props.Text_Color,
        fontSize: props.text_Size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      disabled={props?.disabled}
      variant="primary"
    >
      {props.isLeftImage && (
        <Image
          src={props.leftImage}
          style={{
            width: "20px",
            height: "20px",
          }}
          alt="icon"
        />
      )}
      <span>{props._ButtonText}</span>
    </Button>
  );
};

CustomSingleButton.defaultProps = {
  isLeftImage: false,
  backgroundColor: "#000000",
  Text_Color: "#fff",
  borderColor: "#F5F5F5",
  margin: "0px",
  height: "58px",
};

export default CustomSingleButton;
