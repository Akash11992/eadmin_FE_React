const formatDate = (date) => {
    if (!date) return "";
  
    const d = new Date(date);
  
    // Check if the date is valid
    if (isNaN(d.getTime())) {
      console.error("Invalid date provided:", date);
      return "";
    }
  
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  
  export default formatDate;