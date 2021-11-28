const User = require("../schemas/user");
const Classroom = require("../schemas/classroom");
const Class = require("../schemas/class");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer"); //for sending emails by admin's email id and password
//for scheduling the task of sending mails to a particular date and time
const schedule = require("node-schedule");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.getMyClassrooms = async (req, res) => {
  try {
    //getting current user's id from the session
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const requestedUser = await User.findById(currentUser.u_id);
    const classroomIds = requestedUser.classrooms;
    //getting all the created and joined classrooms of the current user
    var classrooms = [];
    for (const index in classroomIds) {
      const item = await Classroom.findById(classroomIds[index]);
      classrooms.push(item);
    }
    return res.status(200).send({ classrooms });
  } catch (e) {
    return res.status(400).send({ error: "error in getting classrooms" });
  }
};

module.exports.createClassroom = async (req, res) => {
  const newClassroom = new Classroom({
    classname: req.body.classname,
    subject: req.body.subject,
    section: req.body.section,
  });
  //getting current user's id from the session
  const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
  //assigning current user as the classroom teacher
  newClassroom.teacher = currentUser.u_id;
  try {
    await newClassroom.save();
    //generating classroom code
    newClassroom.code = bcrypt.hashSync(newClassroom._id.toString(), 10);
    await newClassroom.save();
    //pushing classroom's id in the user's record
    const creator = await User.findById(currentUser.u_id);
    creator.classrooms.push(newClassroom._id);
    await creator.save();
    return res.status(200).send({ success: "created classroom!" });
  } catch (e) {
    return res.status(400).send({ error: "error in creating classroom" });
  }
};

module.exports.joinClassroom = async (req, res) => {
  const joiningCode = req.body.code;
  try {
    const currentClassroom = await Classroom.findOne({ code: joiningCode });
    //getting current user's id from the session
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const joiningUser = await User.findById(currentUser.u_id);
    //adding current user to the list of students of the classroom
    currentClassroom.students.push(joiningUser._id);
    await currentClassroom.save();
    //adding classroom to the record of current user
    joiningUser.classrooms.push(currentClassroom._id);
    await joiningUser.save();
    return res.status(200).send({ success: "joined classroom!" });
  } catch (e) {
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
    //getting current user's id from the session
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const user = await User.findById(currentUser.u_id);
    const teacher = await User.findById(currentClassroom.teacher);
    return res.status(200).send({ currentClassroom, user, teacher });
  } catch (e) {
    return res.status(400).send({ error: "error in showing classroom" });
  }
};

module.exports.sendInvite = async (req, res) => {
  try {
    const email = req.body.email;
    const classroom = await Classroom.findById(req.params.id);
    //getting current user's id from the session
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    //checking if current user is the teacher of this classroom as only teachers can send invites
    if (classroom.teacher.toString() == currentUser.u_id.toString()) {
      const teacher = await User.findById(classroom.teacher);
      //sending email to invite in the classroom
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
          return res.status(403).send({ error: "error in sending mail" });
        } else {
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
    return res
      .status(400)
      .send({ error: "error in sending invite to student" });
  }
};

module.exports.editClassroom = async (req, res) => {
  try {
    const classroomId = req.params.id;
    const classroom = await Classroom.findById(classroomId);
    //getting current user's id from the session
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    //checking if the current user is the teacher of the classroom as only the teacher can edit classroom details
    if (classroom.teacher.toString() == currentUser.u_id.toString()) {
      const updatedClassroom = await Classroom.findByIdAndUpdate(classroomId, {
        classname: req.body.classname,
        section: req.body.section,
        subject: req.body.subject,
      });
      await updatedClassroom.save();
      return res
        .status(200)
        .send({ success: "Classroom Edited successfully!" });
    } else {
      return res
        .status(400)
        .send({ error: "Error! Only teacher can edit their classroom" });
    }
  } catch (e) {
    return res.status(400).send({ error: "error in editing classroom!" });
  }
};

module.exports.deleteClassroom = async (req, res) => {
  try {
    const classroomId = req.params.id;
    const classroom = await Classroom.findById(classroomId);
    //getting current user's id from the session
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    //checking if the current user is the classroom's teacher as only a teacher can delete their classroom
    if (classroom.teacher.toString() == currentUser.u_id.toString()) {
      //delete classroom's id from user's records
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
        //cancel reminder email schedule for all the classes for teacher of this classroom
        const jobIdTeacher =
          classroom.teacher.toString() +
          deletedClasses[classIndex]._id.toString();
        schedule.cancelJob(jobIdTeacher);
        for (const index in users) {
          await User.findByIdAndUpdate(users[index]._id, {
            $pull: { classes: deletedClasses[classIndex]._id },
          });
          //cancel reminder email schedule for students who booked this class
          const jobId =
            users[index]._id.toString() +
            deletedClasses[classIndex]._id.toString();
          schedule.cancelJob(jobId);
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
    return res.status(400).send({ error: "error in deleting classroom" });
  }
};

module.exports.addNewClass = async (req, res) => {
  try {
    const classroomId = req.params.id;
    const currentClassroom = await Classroom.findById(classroomId);
    //getting current user's id from the session
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    //check if the current user is the classroom's teacher as only the teacher can add a new class into the classroom
    if (currentClassroom.teacher.toString() == currentUser.u_id.toString()) {
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
      //add new class to the classroom's record
      currentClassroom.classes.push(newClass._id);
      await currentClassroom.save();
      //set reminder email for this class (for the teacher)
      const stringDate =
        newClass.date.toISOString().split("T")[0] +
        " " +
        newClass.startTime +
        ":00";
      //stringDate format = yyyy-mm-dd hh:mm:ss
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
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_PWD,
        },
      });
      const teacher = await User.findById(currentClassroom.teacher);
      const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: teacher.email,
        subject: "[Reminder] Book My Class - Your class starts in 1 hour!",
        html: `<h4>Greetings from Book My Class!</h4>
        <p>This is to remind you, that your class, <b>${
          newClass.title
        }</b>, scheduled on <b>${String(newClass.date).substring(
          0,
          3
        )}, ${String(newClass.date).substring(
          4,
          15
        )}</b>, starts in 1 hour! The details of this class are listed below.</p>
        <p><b>Course: </b>${currentClassroom.classname} - Section ${
          currentClassroom.section
        }</p>
        <p><b>Subject: </b>${currentClassroom.subject}</p>
        <p><b>Timings: </b>${newClass.startTime} to ${
          newClass.endTime
        } (IST)</p>
        <h4>Happy learning!</h4> 
        `,
      };
      //job name => teacher id+class id
      const jobId = teacher._id.toString() + newClass._id.toString();
      //scheduling to send an email one hour before the start time of the class
      const job = schedule.scheduleJob(jobId, reminderDate, function () {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(403).send({ error: "error in sending mail" });
          } else {
            return res.status(200).send({ success: "Email sent" });
          }
        });
      });
      return res
        .status(200)
        .send({ success: "successfully created a new class!" });
    } else {
      return res.status(400).send({ isClassroomTeacher: false });
    }
  } catch (e) {
    return res.status(400).send({ error: "error in creating class" });
  }
};
