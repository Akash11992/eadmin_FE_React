const validateFile = (file) => {
    if (!file) return { isValid: false, message: "No file selected" };
  
    const allowedExtensions = ["pdf", "jpeg", "png", "jpg"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
  
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        isValid: false,
        message: `Invalid file type. Only ${allowedExtensions.join(", ")} are allowed.`,
      };
    }
  
    return { isValid: true, message: "File is valid" };
  };
  
  export default validateFile;