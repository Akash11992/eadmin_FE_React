import React from "react";
import useFetch from "react-fetch-hook";

export const UseFetch_hook = () => {
  const { isLoading, data, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (isLoading) {
    return <div>Loading.....</div>;
  } else {
    return (
      <div>
        {data.map((item) => (
          <li key={item.id}>
            {item.name},{item.email},{item.username}
          </li>
        ))}
      </div>
    );
  }
};
export default UseFetch_hook;
