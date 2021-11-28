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
  //has confirmed their email id or not
  isVerified: {
    type: Boolean,
  },
  //array of classroom ids of created and joined classrooms
  classrooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
    },
  ],
  //array of class ids of booked (in-person) classes
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

//Hashes password before saving it to the database
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 12);
  return next();
});

//instance methods
userSchema.methods.comparePassword = function (text) {
  return bcrypt.compareSync(text, this.password);
};

module.exports = mongoose.model("User", userSchema);
