const asyncHandler = require("express-async-handler");
const { User, validateResetUserPassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
/**
 * @desc  Get Forgot password View
 * @route  /password/forgot-password
 * @method GET
 * @access public
 */
module.exports.getForgotPasswordView = asyncHandler((req, res) => {
  res.render("forgot-password");
});

/**
 * @desc  Get Forgot password Link
 * @route  /password/forgot-password
 * @method POST
 * @access public
 */
module.exports.getForgotPasswordLink = asyncHandler(async (req, res) => {
  console.log(req.body.email);
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json("User Not Found");
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "5m",
  });

  const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px; margin: 0;">
        <div style="max-width: 600px; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin: auto; text-align: center;">
          
          <h2 style="color: #333333; margin-bottom: 20px;">Reset Your Password</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
            We received a request to reset the password for your account. Click the button below to set a new password. This link is valid for only <strong>5 minutes</strong>.
          </p>
          
          <a href="${link}" target="_blank" style="background-color: #4F46E5; color: #ffffff; text-decoration: none; padding: 12px 30px; font-size: 16px; border-radius: 5px; display: inline-block; font-weight: bold; margin-bottom: 30px;">
            Reset Password
          </a>
          
          <p style="color: #999999; font-size: 14px; line-height: 1.4; margin-top: 20px;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
          <p style="color: #aaaaaa; font-size: 12px;">
            &copy; 2026 Book Store App. All rights reserved.
          </p>
        </div>
      </div>`,
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Mail Sent : " + success.response);
      res.render("link-sent");
    }
  });
});

/**
 * @desc  Get Reset password View
 * @route  /password/reset-password/:userId/:token
 * @method GET
 * @access public
 */

module.exports.getResetPasswordView = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json("User Not Found");
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error);
    res.json({ message: "Expired Link" });
  }
});

/**
 * @desc    Reset The password
 * @route  /password/reset-password/:userId/:token
 * @method POST
 * @access public
 */
module.exports.getResetPasswordLink = asyncHandler(async (req, res) => {
  const { error } = validateResetUserPassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json("User Not Found");
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("success-password");
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
  }
});
