const express = require("express");
const router = express.Router();
const classrooms = require("../controllers/classrooms");
const { isLoggedIn, isVerified } = require("../middleware");

//for viewing all the created and joined classrooms
router.get("/", isLoggedIn, isVerified, classrooms.getMyClassrooms);

//for creating a new classroom, as it's teacher
router.post("/create", isLoggedIn, isVerified, classrooms.createClassroom);

//for joining a classroom through classroom code, as a student
router.post("/join", isLoggedIn, isVerified, classrooms.joinClassroom);

//for viewing a particular classroom
router.get("/:id", isLoggedIn, isVerified, classrooms.specificClassroom);

//for sending email invites to student to join a classroom
router.post("/:id/invite", isLoggedIn, isVerified, classrooms.sendInvite);

//for editing classroom's details by it's teacher
router.post("/:id/edit", isLoggedIn, isVerified, classrooms.editClassroom);

//for deleting a particular classroom by it's teacher
router.delete(
  "/:id/delete",
  isLoggedIn,
  isVerified,
  classrooms.deleteClassroom
);

//for adding a new class in a classroom
router.post("/:id/new", isLoggedIn, isVerified, classrooms.addNewClass);

module.exports = router;
