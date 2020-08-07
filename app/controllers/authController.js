"use strict";

const User = require("../models/User");
const Point = require("../models/Point");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CONFIG = require("../../config/db");
const mailer = require("../libs/mailer");

exports.login = async (req, res, next) => {
  const { email, name, password, id, avatar_url } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    bcrypt.compare(password, user.password, async function(err, result) {
      if (err) {
        return res.status(401).send("Email or Password is incorrect");
      }
      if (!result)
        return res
          .status(500)
          .json({ success: false, data: "Something went wrong" });
      if (result) {
        return res.json({ success: true, data: user });
      }
    });
  } else {
    user = new User({
      fullname: name,
      email,
      password,
      uniqueId: id,
      avatar_url
    });
    await user.save();

    return res.json({ success: true, data: user });
  }
};

const newUserEmailTmpl = ({ fullname, email, password }) => {
  let emailBody = `Dear Sir/Madam, ${fullname}<br><br>Your account has been created on MM Science server.<br> Here is your credentials,<br> Email - ${email}<br> Password - ${password}`;
  return emailBody;
};

const accountVerifyTmpl = ({ fullname, uniId, email }) => {
  let mailBody = `
    Your account need to be verify.Please click following link<br/>
    <a href="http://mmscience.netlify.app/user/${uniId}/account/confirmation">verify account</a>
  `;
  return mailBody;
};
