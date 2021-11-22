const User = require("../schemas/user");
const Classroom = require("../schemas/classroom");
const Class = require("../schemas/class");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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

//used for displaying a specific classroom and its people
module.exports.specificClassroom = async (req, res) => {
  try {
    const classroomId = req.params.id;
    const currentClassroom = await Classroom.findById(classroomId)
      .populate("classes")
      .populate("students");
    console.log(currentClassroom);
    const user = await User.findById(currentUser);
    const teacher = await User.findById(currentClassroom.teacher);
    return res.status(200).send({ currentClassroom, user, teacher });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in showing classroom" });
  }
};

module.exports.sendInvite = async (req, res) => {
  try {
    const email = req.body.email;
    const classroom = await Classroom.findById(req.params.id);
    if (classroom.teacher.toString() == currentUser.toString()) {
      const teacher = await User.findById(classroom.teacher);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_PWD,
        },
      });
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "Book My Class - Invite to join a classroom",
        html: `<h4>Greetings from Book My Class!</h4>
        <p>You've been invited by your teacher - <b>${teacher.name}</b>, to join a classroom, details of which are given below.</p>
        <p><b>Class: </b>${classroom.classname} - Section ${classroom.section}</p>
        <p><b>Subject: </b>${classroom.subject}</p>
        <p><b>Use the below given code to join this classroom. </b>
        <br><b>Classroom code: </b>${classroom.code}
        <h4>Happy learning!</h4> 
        `,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error in sending mail..", error);
          return res.status(403).send({ error: "error in sending mail" });
        } else {
          console.log("Email sent: ", info.response);
          return res.status(200).send({ success: "Email sent" });
        }
      });
    } else {
      return res.status(400).send({
        error: "Error! Only the classroom's teacher can send invites",
      });
    }
    return res.status(200).send({ sucess: "Invite sent successfully!" });
  } catch (e) {
    console.log("error", e);
    return res
      .status(400)
      .send({ error: "error in sending invite to student" });
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
    return res
      .status(200)
      .send({ success: "successfully created a new class!" });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in showing classroom" });
  }
};
