const express = require("express");
const {
  getForgotPasswordView,
  getForgotPasswordLink,
  getResetPasswordLink,
  getResetPasswordView,
} = require("../controllers/paswordController");
const router = express.Router();

router
  .route("/forgot-password")
  .get(getForgotPasswordView)
  .post(getForgotPasswordLink);
router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordView)
  .post(getResetPasswordLink);

module.exports = router;
