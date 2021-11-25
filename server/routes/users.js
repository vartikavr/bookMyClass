const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const { isLoggedIn } = require("../middleware");

router.post("/register", users.registerUser);

router.post("/login", users.loginUser);

router.get("/confirmation/:token", isLoggedIn, users.confirmEmail);

router.post("/reset", users.resetPassword);

router.post("/reset/:token", users.confirmResetPassword);

router.get("/profile", isLoggedIn, users.getMyProfile);

router.post("/edit", isLoggedIn, users.editDetails);

router.post("/edit/email", isLoggedIn, users.changeEmail);

router.delete("/delete", isLoggedIn, users.deleteProfile);

router.get("/logout", users.logoutUser);

module.exports = router;
