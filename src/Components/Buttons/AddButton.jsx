import React from "react";
import { NavLink } from "react-router-dom";
const AddButton = ({path}) => {
  return <NavLink to={path} className="btn btn-dark ms-lg-auto">Add New</NavLink>;
};

export default AddButton;
