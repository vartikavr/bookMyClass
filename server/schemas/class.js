const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  //total number of in-person seats available for a class
  availableSeats: {
    type: Number,
    default: 25,
  },
  //the classroom id for a class
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
  },
});

module.exports = mongoose.model("Class", classSchema);
