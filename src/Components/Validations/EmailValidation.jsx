
const EmailValidation = () => {
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };
  return { validateEmail };
};

export default EmailValidation;
