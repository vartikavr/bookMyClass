const User = require("../schemas/user");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.registerUser = async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    vaccineStatus: req.body.vaccineStatus,
  });

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
    return res.status(403).send({ error: "invalid" });
  }
};

module.exports.logoutUser = async (req, res) => {
  console.log(currentUser);
  if (currentUser) {
    currentUser = null;
    console.log("logging out ...", req.user);
    res.status(200).send({ success: "Logged out!" });
  }
};
