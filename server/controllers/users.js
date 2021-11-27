const User = require("../schemas/user");
const Class = require("../schemas/class");
const Classroom = require("../schemas/classroom");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const schedule = require("node-schedule");

module.exports.registerUser = async (req, res) => {
  const findEmailUser = await User.findOne({ email: req.body.email });
  if (findEmailUser) {
    return res.status(400).send({ isEmailExisting: true });
  }
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    vaccineStatus: req.body.vaccineStatus,
  });
  newUser.isVerified = false;
  try {
    await newUser.save();
    const token = jwt.sign(
      {
        u_id: newUser._id.toString(),
      },
      process.env.JWT_SECRET
    );
    req.session.userid = token;
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
            return res.status(400).send({ error: "Email not sent!" });
          } else {
            return res.status(200).send({ sucess: "registered!" });
          }
        });
      }
    );
  } catch (e) {
    return res.status(403).send({ error: "Invalid entry!" });
  }
};

module.exports.confirmEmail = async (req, res) => {
  try {
    const resultInfo = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    await User.findByIdAndUpdate(resultInfo.userId, { isVerified: true });
    return res.status(200).send({ success: "confirmed email" });
  } catch (e) {
    return res.status(400).send({ error: "not confirmed." });
  }
};

module.exports.loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    const isMatch = await checkUser.comparePassword(password);
    if (!isMatch) {
      return res.status(403).send({ error: "invalid password" });
    }
    const token = jwt.sign(
      {
        u_id: checkUser._id.toString(),
      },
      process.env.JWT_SECRET
    );
    req.session.userid = token;
    return res.status(200).send({ sucess: "logged in!" });
  } else {
    return res.status(403).send({ error: "login unsuccessful" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const passwordChangeUser = await User.findOne({ email: email });
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
            return res.status(400).send({ error: "Email not sent!" });
          } else {
            return res.status(200).send({ sucess: "reset password worked!" });
          }
        });
      }
    );
  } catch (e) {
    return res.status(403).send({ error: "error in reset password" });
  }
};

module.exports.confirmResetPassword = async (req, res) => {
  try {
    const resultInfo = jwt.verify(req.params.token, process.env.RESET_SECRET);
    const user = await User.findById(resultInfo.userId);
    const newPassword = req.body.newPassword;
    const isOldPassword = await user.comparePassword(newPassword);
    if (!isOldPassword) {
      const confirmPassword = req.body.confirmPassword;
      if (confirmPassword == newPassword) {
        const passwordHash = bcrypt.hashSync(newPassword, 12);
        await User.findByIdAndUpdate(resultInfo.userId, {
          password: passwordHash,
        });
        return res.status(200).send({ success: "password reset successful" });
      } else {
        return res.status(400).send({ isMatch: false });
      }
    } else {
      return res.status(400).send({ isOldPassword });
    }
  } catch (e) {
    return res.status(400).send({ error: "change in password failed" });
  }
};

module.exports.getMyProfile = async (req, res) => {
  try {
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const user = await User.findById(currentUser.u_id);
    return res.status(200).send({ user });
  } catch (e) {
    return res.status(400).send({ error: "error in getting user profile!" });
  }
};

module.exports.editDetails = async (req, res) => {
  try {
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(currentUser.u_id, {
      name: req.body.name,
      vaccineStatus: req.body.vaccineStatus,
    });
    return res.status(200).send({ success: "user details updated!" });
  } catch (e) {
    return res.status(400).send({ error: "error in updating user details!" });
  }
};

module.exports.changeEmail = async (req, res) => {
  try {
    const newEmail = req.body.changedEmail;
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const user = await User.findById(currentUser.u_id);
    if (newEmail == user.email) {
      return res.status(400).send({ isOldEmail: true });
    }
    const findEmailUser = await User.findOne({ email: req.body.changedEmail });
    if (findEmailUser) {
      return res.status(400).send({ isEmailExisting: true });
    }
    await User.findByIdAndUpdate(currentUser.u_id, {
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
            return res.status(400).send({ error: "Email not sent!" });
          } else {
            return res.status(200).send({ success: "Email id updated!" });
          }
        });
      }
    );
  } catch (e) {
    return res.status(400).send({ error: "error in updating email!" });
  }
};

module.exports.deleteProfile = async (req, res) => {
  try {
    const currentUser = jwt.verify(req.session.userid, process.env.JWT_SECRET);
    const userToBeDeleted = await User.findById(currentUser.u_id);
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
    const classrooms = await Classroom.find({ teacher: currentUser.u_id });
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
        //cancel reminder email schedule (for current user as it's teacher) for all these classes
        const jobIdTeacher =
          userToBeDeleted._id.toString() +
          deletedClasses[classIndex]._id.toString();
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
          schedule.cancelJob(jobId);
        }
        await Class.findByIdAndDelete(deletedClasses[classIndex]._id);
      }
      await Classroom.findByIdAndDelete(classrooms[classroomIndex]._id);
    }
    //delete User
    await User.findByIdAndDelete(userToBeDeleted._id);
    //logout User
    req.session.destroy();
    res.clearCookie("sid");
    return res.status(200).send({ success: "Profile deleted!" });
  } catch (e) {
    return res.status(400).send({ error: "error in deleting profile!" });
  }
};

module.exports.logoutUser = async (req, res) => {
  if (req.session.userid) {
    req.session.destroy();
    res.clearCookie("sid");
    res.status(200).send({ success: "Logged out!" });
  } else {
    return res.status(403).send({ error: "not logged out" });
  }
};
