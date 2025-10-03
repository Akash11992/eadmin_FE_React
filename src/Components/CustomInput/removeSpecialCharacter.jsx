const removeSpecialCharacter = (value) => {
    return value?.replace(/[^a-zA-Z0-9\s]/g, ""); // Allows only letters, numbers, and spaces
  };
  
  export default removeSpecialCharacter;