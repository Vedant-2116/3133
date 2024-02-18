const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter first name"],
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    alias: "surname",
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already exists"],
    trim: true,
    lowercase: true,
    validate: function (value) {
      if (!value.match(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/)) {
        throw new Error("Invalid email format");
      }
    },
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
    trim: true,
    lowercase: true,
  },
  salary: {
    type: Number,
    default: 0.0,
    validate(validate) {
      if (validate < 0) {
        throw new Error("Salary must be greater than 0");
      }
    },
  },
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
