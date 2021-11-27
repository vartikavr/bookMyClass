const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const { isNotLoggedIn, isLoggedIn } = require("../middleware");

router.post("/register", isNotLoggedIn, users.registerUser);

router.post("/login", isNotLoggedIn, users.loginUser);

router.post("/confirmation/:token", isLoggedIn, users.confirmEmail);

router.post("/reset", users.resetPassword);

router.post("/reset/:token", users.confirmResetPassword);

router.get("/profile", isLoggedIn, users.getMyProfile);

router.post("/edit", isLoggedIn, users.editDetails);

router.post("/edit/email", isLoggedIn, users.changeEmail);

router.delete("/delete", isLoggedIn, users.deleteProfile);

router.get("/logout", isLoggedIn, users.logoutUser);

module.exports = router;
