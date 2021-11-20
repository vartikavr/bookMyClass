const User = require("../schemas/user");
const Classroom = require("../schemas/classroom");
const Class = require("../schemas/class");
const bcrypt = require("bcrypt");

module.exports.getMyClassrooms = async (req, res) => {
  try {
    const requestedUser = await User.findById(currentUser);
    const classroomIds = requestedUser.classrooms;
    var classrooms = [];
    for (const index in classroomIds) {
      const item = await Classroom.findById(classroomIds[index]);
      classrooms.push(item);
    }
    return res.status(200).send({ classrooms });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in getting classrooms" });
  }
};

module.exports.createClassroom = async (req, res) => {
  const newClassroom = new Classroom({
    classname: req.body.classname,
    subject: req.body.subject,
    section: req.body.section,
  });
  newClassroom.teacher = currentUser;
  try {
    await newClassroom.save();
    newClassroom.code = bcrypt.hashSync(newClassroom._id.toString(), 10);
    await newClassroom.save();
    console.log(newClassroom);
    const creator = await User.findById(currentUser);
    creator.classrooms.push(newClassroom._id);
    await creator.save();
    return res.status(200).send({ success: "created classroom!" });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in creating classroom" });
  }
};

module.exports.joinClassroom = async (req, res) => {
  const joiningCode = req.body.code;
  console.log("join classroom");
  try {
    const currentClassroom = await Classroom.findOne({ code: joiningCode });
    const joiningUser = await User.findById(currentUser);
    currentClassroom.students.push(joiningUser._id);
    await currentClassroom.save();
    joiningUser.classrooms.push(currentClassroom._id);
    await joiningUser.save();
    return res.status(200).send({ success: "joined classroom!" });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in joining classroom" });
  }
};

module.exports.specificClassroom = async (req, res) => {
  try {
    const classroomId = req.params.id;
    const currentClassroom = await Classroom.findById(classroomId).populate(
      "classes"
    );
    console.log(currentClassroom);
    const user = await User.findById(currentUser);
    return res.status(200).send({ currentClassroom, user });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in showing classroom" });
  }
};

module.exports.deleteClassroom = async (req, res) => {
  try {
    const classroomId = req.params.id;
    const classroom = await Classroom.findById(classroomId);
    console.log(classroom.teacher, currentUser);
    if (classroom.teacher.toString() == currentUser.toString()) {
      //delete classrooms from user
      const users = await User.find({ classrooms: { $in: classroomId } });
      for (const index in users) {
        await User.findByIdAndUpdate(users[index]._id, {
          $pull: { classrooms: classroomId },
        });
      }
      //delete classes of the classroom from user
      const deletedClasses = await Class.find({ classroom: classroomId });
      for (const classIndex in deletedClasses) {
        const users = await User.find({
          classes: { $in: deletedClasses[classIndex]._id },
        });
        for (const index in users) {
          await User.findByIdAndUpdate(users[index]._id, {
            $pull: { classes: deletedClasses[classIndex]._id },
          });
        }
      }
      //delete related classes
      await Class.deleteMany({ classroom: classroomId });
      //delete classroom
      await Classroom.findByIdAndDelete(classroomId);
      return res.status(200).send({ success: "successful deletion" });
    } else {
      return res
        .status(400)
        .send({ error: "Error! Only teacher can delete their classroom" });
    }
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in showing classroom" });
  }
};

module.exports.addNewClass = async (req, res) => {
  try {
    const classroomId = req.params.id;
    const currentClassroom = await Classroom.findById(classroomId);
    console.log(currentClassroom);
    const newClass = new Class({
      title: req.body.title,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });
    newClass.classroom = currentClassroom._id;
    if (req.body.seats != "") {
      newClass.availableSeats = req.body.seats;
    }
    await newClass.save();
    currentClassroom.classes.push(newClass._id);
    await currentClassroom.save();
    return res.status(200).send({ currentClassroom, currentUser });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in showing classroom" });
  }
};
