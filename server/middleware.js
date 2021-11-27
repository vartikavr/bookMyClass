const User = require("./schemas/user");
const jwt = require("jsonwebtoken");

module.exports.isNotLoggedIn = (req, res, next) => {
  if (req.session.userid) {
    return res.status(403).send({ isAlreadyLoggedIn: true });
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userid) {
    return res.status(403).send({ isLoggedIn: false });
  }
  next();
};

module.exports.isVerified = async (req, res, next) => {
  const userInfo = jwt.verify(req.session.userid, process.env.JWT_SECRET);
  const user = await User.findById(userInfo.u_id);
  if (!user.isVerified) {
    return res.status(403).send({ isVerified: false });
  }
  next();
};

module.exports.isQualifiedForBooking = async (req, res, next) => {
  const userInfo = jwt.verify(req.session.userid, process.env.JWT_SECRET);
  const user = await User.findById(userInfo.u_id);
  if (user.vaccineStatus == "First Dose" || user.vaccineStatus == "NOTA") {
    return res.status(403).send({ isQualifiedForBooking: false });
  }
  next();
};
