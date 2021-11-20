const Class = require("../schemas/class");
const Classroom = require("../schemas/classroom");
const User = require("../schemas/user");

module.exports.bookClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const targetClass = await Class.findById(classId);
    if (targetClass.availableSeats > 0) {
      targetClass.availableSeats = targetClass.availableSeats - 1;
      await targetClass.save();
      const user = await User.findById(currentUser);
      user.classes.push(classId);
      await user.save();
      return res.status(200).send({ success: "booking done!" });
    } else {
      return res.status(400).send({ error: "no seats left" });
    }
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in booking" });
  }
};

module.exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const classToBeDeleted = await Class.findById(classId);
    console.log(classToBeDeleted);
    const associatedClassroom = await Classroom.findById(
      classToBeDeleted.classroom
    );
    console.log(associatedClassroom.teacher, currentUser);
    if (associatedClassroom.teacher.toString() == currentUser.toString()) {
      //delete class from users
      const users = await User.find({ classes: { $in: classId } });
      for (const index in users) {
        await User.findByIdAndUpdate(users[index]._id, {
          $pull: { classes: classId },
        });
      }
      //delete class from its classroom
      await Classroom.findByIdAndUpdate(associatedClassroom._id, {
        $pull: { classes: classId },
      });
      //delete class
      await Class.findByIdAndDelete(classId);
      return res.status(200).send({ success: "deleted class!" });
    } else {
      return res.status(400).send({
        error: "Error! Only teacher can delete the class of their classroom",
      });
    }
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in deleting class" });
  }
};
