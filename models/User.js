const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please enter username"],
    trim: true,
    lowercase: true,
    unique: [true, "Username already exists"],
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
  password: {
    type: String,
    required: [true, "Please enter password"],
    maxlength: [20, "Password must be less than 20 characters"],
    minlength: [5, "Password must be more than 8 characters"],
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
