import React, { useState } from "react";

export const UseLocalStorage_hook = () => {
  const [storedData, setStoredData] = useState(null);

  const setValueLocalStorage = () => {
    const data = {
      firstName: "Rupesh",
      lastName: "sen",
      age: 24,
      country: "India",
      profession: "Developer",
    };

    localStorage.setItem("userData", JSON.stringify(data));

    const Data = JSON.parse(localStorage.getItem("userData"));
    setStoredData(Data);

    console.log("Data saved to localStorage:", Data);
  };

  return (
    <div>
      <button onClick={setValueLocalStorage}>Click Me</button>
    </div>
  );
};
