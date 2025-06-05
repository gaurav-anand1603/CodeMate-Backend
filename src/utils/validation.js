const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Please enter valid name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter valid password");
  }
};

const validateEditProfileData = (req) => {
  const fields = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "emailId",
    "photoUrl",
    "gender",
    "age",
  ];
  return Object.keys(req.body).every((val) => fields.includes(val));
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
