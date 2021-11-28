const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  classname: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  //classroom code, used by students to join a classroom
  code: {
    type: String,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //array of ids of students who have joined this classroom
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  //array of class ids of all the scheduled classes in a classroom
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

module.exports = mongoose.model("Classroom", classroomSchema);
