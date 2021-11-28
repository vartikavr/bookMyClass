const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const { isNotLoggedIn, isLoggedIn } = require("../middleware");

router.post("/register", isNotLoggedIn, users.registerUser);

router.post("/login", isNotLoggedIn, users.loginUser);

//for confirmation of user's email id
router.get("/confirmation/:token", isLoggedIn, users.confirmEmail);

//for reseting user's password
router.post("/reset", users.resetPassword);
router.post("/reset/:token", users.confirmResetPassword);

//for viewing current user's profile
router.get("/profile", isLoggedIn, users.getMyProfile);

//for editing current user's profile details
router.post("/edit", isLoggedIn, users.editDetails);

//for changing current user's email id
router.post("/edit/email", isLoggedIn, users.changeEmail);

//for deleting current user's profile
router.delete("/delete", isLoggedIn, users.deleteProfile);

router.get("/logout", isLoggedIn, users.logoutUser);

module.exports = router;
