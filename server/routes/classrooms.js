const express = require("express");
const router = express.Router();
const classrooms = require("../controllers/classrooms");
const { isLoggedIn, isVerified } = require("../middleware");

router.get("/", isLoggedIn, isVerified, classrooms.getMyClassrooms);

router.post("/create", isLoggedIn, isVerified, classrooms.createClassroom);

router.post("/join", isLoggedIn, isVerified, classrooms.joinClassroom);

router.get("/:id", isLoggedIn, isVerified, classrooms.specificClassroom);

router.post("/:id/invite", isLoggedIn, isVerified, classrooms.sendInvite);

router.delete(
  "/:id/delete",
  isLoggedIn,
  isVerified,
  classrooms.deleteClassroom
);

router.post("/:id/new", isLoggedIn, isVerified, classrooms.addNewClass);

module.exports = router;
