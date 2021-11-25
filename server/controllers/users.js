const User = require("../schemas/user");
const Class = require("../schemas/class");
const Classroom = require("../schemas/classroom");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const schedule = require("node-schedule");

module.exports.registerUser = async (req, res) => {
  if (currentUser) {
    return res.status(400).send({ isAlreadyLoggedIn: true });
  }
  const findEmailUser = await User.findOne({ email: req.body.email });
  console.log(findEmailUser);
  if (findEmailUser) {
    return res.status(400).send({ isEmailExisting: true });
  }
  console.log(req.body);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    vaccineStatus: req.body.vaccineStatus,
  });
  newUser.isVerified = false;
  try {
    await newUser.save();
    console.log(newUser);
    currentUser = newUser._id;
    jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "1d",
      },
      (err, emailToken) => {
        const url = `${process.env.SERVER_URI}/confirmation/${emailToken}`;
        console.log(emailToken);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PWD,
          },
        });
        const mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: newUser.email,
          subject: "Confirm Email for Book My Class",
          html: `<h4>Hey ${newUser.name}! Please click the following link to confirm your email:</h4> 
                    <a href="${url}">${url}</a> 
                    `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error in sending mail..", error);
          } else {
            console.log("Email sent: ", info.response);
          }
        });
      }
    );
    return res.status(200).send({ sucess: "registered!" });
  } catch (e) {
    console.log(e);
    return res.status(403).send({ error: "Invalid entry!" });
  }
};

module.exports.confirmEmail = async (req, res) => {
  try {
    console.log(req.params);
    const result = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    console.log("result...", result);
    await User.findByIdAndUpdate(result.userId, { isVerified: true });
    return res.status(200).send({ success: "confirmed email" });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "not confirmed." });
  }
};

module.exports.loginUser = async (req, res) => {
  if (currentUser) {
    return res.status(400).send({ isAlreadyLoggedIn: true });
  }
  const email = req.body.email;
  const password = req.body.password;
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    const isMatch = await checkUser.comparePassword(password);
    if (!isMatch) {
      console.log("not pwd valid");
      return res.status(403).send({ error: "invalid pwd" });
    }
    currentUser = checkUser._id;
    return res.status(200).send({ sucess: "logged in!" });
  } else {
    console.log("email not found");
    return res.status(403).send({ error: "login unsuccessful" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    console.log(req.body);
    const email = req.body.email;
    const passwordChangeUser = await User.findOne({ email: email });
    console.log(passwordChangeUser);
    jwt.sign(
      {
        userId: passwordChangeUser._id,
      },
      process.env.RESET_SECRET,
      {
        expiresIn: "1d",
      },
      (err, resetToken) => {
        const url = `${process.env.SERVER_URI}/reset/${resetToken}`;
        console.log(resetToken);
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
          subject: "[Book My Class] - Password Reset Email",
          html: `<p>You're receiving this e-mail because you or someone else has requested a password reset for your account at Book My Class.</p> 
          <p>Click the link below to reset your password:</p>        
          <a href="${url}">${url}</a> 
          <h4>If you did not request a password reset you can safely ignore this email.</h4>
          `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error in sending mail..", error);
          } else {
            console.log("Email sent: ", info.response);
          }
        });
      }
    );
    return res.status(200).send({ sucess: "reset password worked!" });
  } catch (e) {
    console.log("reset password email not sent");
    return res.status(403).send({ error: "error in reset password" });
  }
};

module.exports.confirmResetPassword = async (req, res) => {
  try {
    const result = jwt.verify(req.params.token, process.env.RESET_SECRET);
    console.log("result = ", result);
    const user = await User.findById(result.userId);
    const newPassword = req.body.newPassword;
    const isOldPassword = await user.comparePassword(newPassword);
    if (!isOldPassword) {
      const confirmPassword = req.body.confirmPassword;
      if (confirmPassword == newPassword) {
        const passwordHash = bcrypt.hashSync(newPassword, 12);
        await User.findByIdAndUpdate(result.userId, { password: passwordHash });
        return res.status(200).send({ success: "password reset successful" });
      } else {
        return res.status(400).send({ isMatch: false });
      }
    } else {
      return res.status(400).send({ isOldPassword });
    }
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "change in password failed" });
  }
};

module.exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(currentUser);
    return res.status(200).send({ user });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in getting user profile!" });
  }
};

module.exports.editDetails = async (req, res) => {
  try {
    await User.findByIdAndUpdate(currentUser, {
      name: req.body.name,
      vaccineStatus: req.body.vaccineStatus,
    });
    return res.status(200).send({ success: "user details updated!" });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in updating user details!" });
  }
};

module.exports.changeEmail = async (req, res) => {
  try {
    const newEmail = req.body.changedEmail;
    const user = await User.findById(currentUser);
    if (newEmail == user.email) {
      return res.status(400).send({ isOldEmail: true });
    }
    const findEmailUser = await User.findOne({ email: req.body.changedEmail });
    console.log(findEmailUser);
    if (findEmailUser) {
      return res.status(400).send({ isEmailExisting: true });
    }
    await User.findByIdAndUpdate(currentUser, {
      email: newEmail,
      isVerified: false,
    });
    jwt.sign(
      {
        userId: user._id,
      },
      process.env.EMAIL_SECRET,
      {
        expiresIn: "1d",
      },
      (err, emailToken) => {
        const url = `${process.env.SERVER_URI}/confirmation/${emailToken}`;
        console.log(emailToken);
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PWD,
          },
        });
        const mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: newEmail,
          subject: "Confirm Email for Book My Class",
          html: `<h4>Hey ${user.name}! Please click the following link to confirm your email:</h4> 
                      <a href="${url}">${url}</a> 
                      `,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error in sending mail..", error);
          } else {
            console.log("Email sent: ", info.response);
          }
        });
      }
    );
    return res.status(200).send({ success: "Email id updated!" });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in updating email!" });
  }
};

module.exports.deleteProfile = async (req, res) => {
  try {
    const userToBeDeleted = await User.findById(currentUser);
    //cancel schedules for booked classes by the user
    const bookedClasses = userToBeDeleted.classes;
    for (const bookedClassIndex in bookedClasses) {
      const classRemove = await Class.findById(
        bookedClasses[bookedClassIndex]._id
      );
      classRemove.availableSeats = classRemove.availableSeats + 1;
      await classRemove.save();
      const jobId =
        userToBeDeleted._id.toString() +
        bookedClasses[bookedClassIndex]._id.toString();
      console.log("scheduled job=", schedule.scheduledJobs[jobId]);
      schedule.cancelJob(jobId);
    }
    //remove this user from their joined classrooms
    const joinedClassrooms = await Classroom.find({
      students: { $in: userToBeDeleted._id },
    });
    for (const joinedClassroomIndex in joinedClassrooms) {
      await Classroom.findByIdAndUpdate(
        joinedClassrooms[joinedClassroomIndex]._id,
        { $pull: { students: userToBeDeleted._id } }
      );
    }
    //delete classrooms made by user
    const classrooms = await Classroom.find({ teacher: currentUser });
    for (const classroomIndex in classrooms) {
      //delete classrooms from all the users who have joined it
      const joinedUsers = await User.find({
        classrooms: { $in: classrooms[classroomIndex]._id },
      });
      for (const usersIndex in joinedUsers) {
        await User.findByIdAndUpdate(joinedUsers[usersIndex]._id, {
          $pull: { classrooms: classrooms[classroomIndex]._id },
        });
      }
      //delete classes of these classrooms
      const deletedClasses = classrooms[classroomIndex].classes;
      for (const classIndex in deletedClasses) {
        //cancel reminder email schedule (for currentUser as it's teacher) for all these classes
        const jobIdTeacher =
          userToBeDeleted._id.toString() +
          deletedClasses[classIndex]._id.toString();
        console.log("scheduled job=", schedule.scheduledJobs[jobIdTeacher]);
        schedule.cancelJob(jobIdTeacher);
        //cancel reminder email schedule for students who booked these classes
        const users = await User.find({
          classes: { $in: deletedClasses[classIndex]._id },
        });
        for (const index in users) {
          await User.findByIdAndUpdate(users[index]._id, {
            $pull: { classes: deletedClasses[classIndex]._id },
          });
          const jobId =
            users[index]._id.toString() +
            deletedClasses[classIndex]._id.toString();
          console.log("scheduled job=", schedule.scheduledJobs[jobId]);
          schedule.cancelJob(jobId);
        }
        await Class.findByIdAndDelete(deletedClasses[classIndex]._id);
      }
      await Classroom.findByIdAndDelete(classrooms[classroomIndex]._id);
    }
    console.log("all schedules=", schedule.scheduledJobs);
    //delete User
    await User.findByIdAndDelete(userToBeDeleted._id);
    //logout User
    console.log("current user=", currentUser);
    currentUser = null;
    console.log("logging out..", currentUser);
    return res.status(200).send({ success: "Profile deleted!" });
  } catch (e) {
    console.log("error", e);
    return res.status(400).send({ error: "error in deleting profile!" });
  }
};

module.exports.logoutUser = async (req, res) => {
  console.log(currentUser);
  if (currentUser) {
    currentUser = null;
    console.log("logging out ...", currentUser);
    res.status(200).send({ success: "Logged out!" });
  } else {
    return res.status(403).send({ error: "not logged out" });
  }
};
