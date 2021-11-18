const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const { isLoggedIn, isVerified } = require("../middleware");

router.post("/register", users.registerUser);

router.post("/login", users.loginUser);

router.get("/confirmation/:token", isLoggedIn, users.confirmEmail);

router.get("/logout", users.logoutUser);

module.exports = router;
