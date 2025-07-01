const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const loginAuth = require("../../../../validate/client/loginAuth.validate");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/profile", loginAuth.loginAuth, controller.profile);


module.exports = router;