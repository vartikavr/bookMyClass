const express = require("express");
const router = express.Router();
const classes = require("../controllers/classes");
const {
  isLoggedIn,
  isVerified,
  isQualifiedForBooking,
} = require("../middleware");

//for viewing all the bookings of classes of the current user
router.post("/", isLoggedIn, isVerified, classes.viewMyClasses);

//for booking a particular class
router.get(
  "/:id/book",
  isLoggedIn,
  isVerified,
  isQualifiedForBooking,
  classes.bookClass
);

//for cancelling booking for a particular class
router.get("/:id/cancel", isLoggedIn, isVerified, classes.cancelBooking);

//for viewing the seats in a particular class
router.get("/:id/seats", isLoggedIn, isVerified, classes.viewSeats);

//for deleting a particular class by the teacher
router.delete("/:id/delete", isLoggedIn, isVerified, classes.deleteClass);

module.exports = router;
