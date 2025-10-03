import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ element }) => {
  const savedUserData = JSON.parse(localStorage.getItem("userData"));

  const token = savedUserData ? savedUserData.token : null;
  if (!token) {
    return <Navigate to="/"/>;
  }
  return element;
};

export default ProtectedRoutes;
