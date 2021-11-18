const express = require("express");
const router = express.Router();
const classrooms = require("../controllers/classrooms");
const { isLoggedIn, isVerified } = require("../middleware");

router.get("/", isLoggedIn, isVerified, classrooms.getMyClassrooms);

router.post("/create", isLoggedIn, isVerified, classrooms.createClassroom);

router.post("/join", isLoggedIn, isVerified, classrooms.joinClassroom);

router.get("/:id", isLoggedIn, isVerified, classrooms.specificClassroom);

module.exports = router;
