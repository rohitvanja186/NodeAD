const { renderRegisterForm, registerUser, renderLoginForm, loginUser, logOut, forgotPassword, checkForgotPassword, renderOtpForm, handleOTP } = require("../controller/auth/authController")

const router = require("express").Router()

router.route("/register").get(renderRegisterForm).post(registerUser) 

router.route("/login").get(renderLoginForm).post(loginUser)

router.route("/logout").get(logOut)

router.route("/forgotPassword").get(forgotPassword).post(checkForgotPassword)

router.route("/otp").get(renderOtpForm)

router.route("/otp/:id").post(handleOTP)

module.exports = router;