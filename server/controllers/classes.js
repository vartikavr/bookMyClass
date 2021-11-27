const Class = require("../schemas/class");
const Classroom = require("../schemas/classroom");
const User = require("../schemas/user");
const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const jwt = require("jsonwebtoken");

module.exports.viewMyClasses = async (req, res) => {
  try {
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const user = await User.findById(currentUser.u_id).populate({
      path: "classes",
      populate: { path: "classroom" },
      options: { sort: { date: 1, startTime: 1 } },
    });
    var date = new Date();
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    var dateToday = date.getDate();
    if (dateToday < 10) {
      dateToday = "0" + dateToday;
    }
    const currentDate = date.getFullYear() + "-" + month + "-" + dateToday;
    var filteredClasses = [];
    if (req.body.selected == "expired") {
      for (const index in user.classes) {
        if (
          user.classes[index].date.toISOString().split("T")[0] < currentDate
        ) {
          filteredClasses.push(user.classes[index]);
        }
      }
      return res.status(200).send({ classes: filteredClasses });
    } else if (req.body.selected == "upcoming") {
      for (const index in user.classes) {
        if (
          user.classes[index].date.toISOString().split("T")[0] >= currentDate
        ) {
          filteredClasses.push(user.classes[index]);
        }
      }
      return res.status(200).send({ classes: filteredClasses });
    } else {
      return res.status(200).send({ classes: user.classes });
    }
  } catch (e) {
    return res.status(400).send({ error: "error in getting classes" });
  }
};

module.exports.bookClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const targetClass = await Class.findById(classId).populate("classroom");
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const user = await User.findById(currentUser.u_id);
    if (targetClass.classroom.students.includes(user._id)) {
      if (targetClass.availableSeats > 0) {
        targetClass.availableSeats = targetClass.availableSeats - 1;
        await targetClass.save();
        user.classes.push(classId);
        await user.save();
        //set reminder email for this class (for the student)
        const stringDate =
          targetClass.date.toISOString().split("T")[0] +
          " " +
          targetClass.startTime +
          ":00";
        const classDate = new Date(stringDate);
        var milliseconds = classDate.getTime();
        milliseconds = milliseconds - 60 * 60 * 1000; //60mins ago
        var reminderDate = new Date(milliseconds);
        const year = reminderDate.getFullYear();
        const month = reminderDate.getMonth();
        const newDate = reminderDate.getDate();
        const hours = reminderDate.getHours();
        const mins = reminderDate.getMinutes();
        reminderDate = new Date(year, month, newDate, hours, mins, 0);
        //mail options
        const currentClassroom = await Classroom.findById(
          targetClass.classroom
        );
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PWD,
          },
        });
        const mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: user.email,
          subject: "[Reminder] Book My Class - Your class starts in 1 hour!",
          html: `<h4>Greetings from Book My Class!</h4>
        <p>This is to remind you, that your class, <b>${
          targetClass.title
        }</b>, scheduled on <b>${String(targetClass.date).substring(
            0,
            3
          )}, ${String(targetClass.date).substring(
            4,
            15
          )}</b>, starts in 1 hour! The details of this class are listed below.</p>
        <p><b>Course: </b>${currentClassroom.classname} - Section ${
            currentClassroom.section
          }</p>
        <p><b>Subject: </b>${currentClassroom.subject}</p>
        <p><b>Timings: </b>${targetClass.startTime} to ${
            targetClass.endTime
          } (IST)</p>
        <h4>Happy learning!</h4> 
        `,
        };
        //job name => user id+class id
        const jobId = user._id.toString() + targetClass._id.toString();
        const job = schedule.scheduleJob(jobId, reminderDate, function () {
          //scheduling to send an email later
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(403).send({ error: "error in sending mail" });
            } else {
              return res.status(200).send({ success: "Email sent" });
            }
          });
        });
        return res.status(200).send({ success: "booking done!" });
      } else {
        return res.status(400).send({ isSeatLeft: false });
      }
    } else {
      return res.status(400).send({ isClassroomMember: false });
    }
  } catch (e) {
    return res.status(400).send({ error: "error in booking" });
  }
};

module.exports.cancelBooking = async (req, res) => {
  try {
    const classId = req.params.id;
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const user = await User.findByIdAndUpdate(currentUser.u_id, {
      $pull: { classes: classId },
    });
    const currentClass = await Class.findById(classId);
    currentClass.availableSeats = currentClass.availableSeats + 1;
    await currentClass.save();
    const jobId = user._id.toString() + currentClass._id.toString();
    schedule.cancelJob(jobId);
    return res.status(200).send({ success: "booking cancelled!" });
  } catch (e) {
    return res.status(400).send({ error: "error in cancelling booking" });
  }
};

module.exports.viewSeats = async (req, res) => {
  try {
    const classId = req.params.id;
    const currentClass = await Class.findById(classId);
    const classroom = await Classroom.findById(currentClass.classroom).populate(
      "students"
    );
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    if (classroom.teacher.toString() == currentUser.u_id.toString()) {
      return res.status(200).send({ classroom, currentClass });
    } else {
      return res.status(400).send({
        isClassroomTeacher: false,
      });
    }
  } catch (e) {
    return res.status(400).send({ error: "error in viewing seats" });
  }
};

module.exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const classToBeDeleted = await Class.findById(classId);
    const associatedClassroom = await Classroom.findById(
      classToBeDeleted.classroom
    );
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    if (associatedClassroom.teacher.toString() == currentUser.u_id.toString()) {
      //delete class from users
      const users = await User.find({ classes: { $in: classId } });
      for (const index in users) {
        await User.findByIdAndUpdate(users[index]._id, {
          $pull: { classes: classId },
        });
        //cancel reminder email schedule for students who booked this class
        const jobId =
          users[index]._id.toString() + classToBeDeleted._id.toString();
        schedule.cancelJob(jobId);
      }
      //delete class from its classroom
      await Classroom.findByIdAndUpdate(associatedClassroom._id, {
        $pull: { classes: classId },
      });
      //cancel reminder email schedule for teacher of this class
      const jobIdTeacher =
        associatedClassroom.teacher.toString() +
        classToBeDeleted._id.toString();
      schedule.cancelJob(jobIdTeacher);
      //delete class
      await Class.findByIdAndDelete(classId);
      return res.status(200).send({ success: "deleted class!" });
    } else {
      return res.status(400).send({
        error: "Error! Only teacher can delete the class of their classroom",
      });
    }
  } catch (e) {
    return res.status(400).send({ error: "error in deleting class" });
  }
};
