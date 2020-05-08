'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CONFIG = require('../../config/db');

exports.register = async (req, res) => {
  let { email, password } = req.body;
  const newUser = new User(req.body);
  try {
    const result = await newUser.save();

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send('User already exist!');
    }
    return res.status(500).send(err.message);
  }
}

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if(err) {
      return res.status(500).send('Error on the server' + err);
    }
    if (!user) {
      return res.status(404).send('No user found');
    }

    user.isCorrectPassword(password, function (err, same) {
      if (err) {
        return res.status(401).send('Unauthorized');
      }
      if(user) {
        var token = jwt.sign(
          { credentials: `${user._id}.${CONFIG.jwtSecret}.${user.email}` },
          CONFIG.jwtSecret,
          { expiresIn: '1h' },
        );
        const credentials = {
          id: user._id,
          fullname: user.fullname,
          avatar_url: user.avatar_url,
          email: user.email,
          token: token,
        };
        return res.status(200).json({ success: true, data: credentials });
      }
    });
  });
}
