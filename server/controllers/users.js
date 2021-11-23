const User = require("../schemas/user");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.registerUser = async (req, res) => {
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

module.exports.logoutUser = async (req, res) => {
  console.log(currentUser);
  if (currentUser) {
    currentUser = null;
    console.log("logging out ...", req.user);
    res.status(200).send({ success: "Logged out!" });
  } else {
    return res.status(403).send({ error: "not logged out" });
  }
};
