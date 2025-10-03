import React from "react";
import "../../Assets/css/PPMManagement/PPMManagement.css"

const TableHeader = ({coloumn}) => {
  return (
    <thead>
      <tr>
        {coloumn?.map((col) => (
          <th className="text-white fw-normal p-2 bg-danger" key={col.value} value={col.value}>{col.label}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
