const express = require("express");
const router = express.Router();
const classes = require("../controllers/classes");
const {
  isLoggedIn,
  isVerified,
  isQualifiedForBooking,
} = require("../middleware");

router.post("/", isLoggedIn, isVerified, classes.viewMyClasses);

router.get(
  "/:id/book",
  isLoggedIn,
  isVerified,
  isQualifiedForBooking,
  classes.bookClass
);

router.get("/:id/cancel", isLoggedIn, isVerified, classes.cancelBooking);

router.get("/:id/seats", isLoggedIn, isVerified, classes.viewSeats);

router.delete("/:id/delete", isLoggedIn, isVerified, classes.deleteClass);

module.exports = router;
