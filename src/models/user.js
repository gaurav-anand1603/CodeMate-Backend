const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email not valid " + value);
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      // Custom validation for validate gender
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid.");
        }
      },
    },
    about: {
      type: String,
      default: "This is default about section",
    },
    skills: {
      type: [String],
    },
    photoUrl: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user.id }, "Gaurav@1234");

  return token;
};
userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isValidPassword = await bcrypt.compare(password, user.password);
  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
