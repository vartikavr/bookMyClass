const User = require("./schemas/user");

module.exports.isLoggedIn = (req, res, next) => {
  if (!currentUser) {
    console.log("not logged in");
    return res.status(403).send({ isLoggedIn: false });
  }
  next();
};

module.exports.isVerified = async (req, res, next) => {
  const user = await User.findById(currentUser);
  if (!user.isVerified) {
    console.log("not confirmed email");
    return res.status(403).send({ isVerified: false });
  }
  next();
};

module.exports.isQualifiedForBooking = async (req, res, next) => {
  const user = await User.findById(currentUser);
  if (
    user.vaccinationStatus == "First Dose" ||
    user.vaccinationStatus == "NOTA"
  ) {
    console.log("not qualified for class booking");
    return res.status(403).send({ isQualifiedForBooking: false });
  }
  next();
};
