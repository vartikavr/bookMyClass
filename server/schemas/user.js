const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  vaccineStatus: {
    type: String,
    required: true,
    enum: ["Below 18", "First Dose", "Second Dose", "NOTA"],
  },
  isVerified: {
    type: Boolean,
  },
  classrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
  ],
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 12);
  this.isVerified = false;
  return next();
});

//instance methods
userSchema.methods.comparePassword = function (text) {
  return bcrypt.compareSync(text, this.password);
};

module.exports = mongoose.model("User", userSchema);
