const express = require("express");
const router = express.Router();
const classes = require("../controllers/classes");
const {
  isLoggedIn,
  isVerified,
  isQualifiedForBooking,
} = require("../middleware");

router.get(
  "/:id/book",
  isLoggedIn,
  isVerified,
  isQualifiedForBooking,
  classes.bookClass
);

router.delete("/:id/delete", isLoggedIn, isVerified, classes.deleteClass);

module.exports = router;
