"use strict";

const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CONFIG = require("../../config/db");
const mailer = require("../libs/mailer");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("-_id -__v");
  if (!user)
    return res
      .status(404)
      .json({ success: false, data: "User does not exist" });
  if (user) {
    bcrypt.compare(password, user.password, async (err, result) => {
      if (!result) {
        return res
          .status(401)
          .json({ success: false, data: "Email or Password is incorrect" });
      }
      if (result) {
        var token = jwt.sign(
          { credentials: `${user._id}.${CONFIG.jwtSecret}.${user.email}` },
          CONFIG.jwtSecret,
          {}
        );

        const credentials = {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user._role,
          token: token,
        };
        return res.status(200).json({ success: true, data: credentials });
      }
    });
  } else {
    return res
      .status(401)
      .json({ success: false, data: "Email or Password is incorrect" });
  }
};

exports.register = async (req, res) => {
  let { fullname, email, password } = req.body;
  try {
    let newUser = new User({
      fullname,
      email,
      password,
    });
    const result = await newUser.save();

    if (result) {
      var token = jwt.sign(
        { credentials: `${result._id}.${CONFIG.jwtSecret}.${result.email}` },
        CONFIG.jwtSecret,
        {}
      );

      const credentials = {
        id: result._id,
        fullname: result.fullname,
        email: result.email,
        token: token,
      };

      mailer(accountVerifyTmpl(credentials));

      return res.status(200).json({ success: true, data: credentials });
    }
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      return res
        .status(500)
        .json({ success: false, data: "User already exist!" });
    }
    return res.status(500).json({ success: false, data: err.message });
  }
};

const newUserEmailTmpl = ({ fullname, email }) => {
  let emailBody = `Dear Sir/Madam, ${fullname}<br><br>Your account has been created on MM Science server.<br> Here is your credentials,<br> Email - ${email}`;
  return emailBody;
};

const accountVerifyTmpl = ({ fullname, id, email }) => {
  let mailBody = `
    Your account need to be verify.Please click following link<br/>
    <a href="http://mmscience.netlify.app/user/${id}/account/confirmation">verify account</a>
  `;
  return mailBody;
};
