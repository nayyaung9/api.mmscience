'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONFIG = require('../../config/db');

exports.register = async (req, res) => {
  let { email, password } = req.body;
  try {
    let newUser = new User({
      email,
      password,
      uniqueId: Math.random()
      .toString(36)
      .substring(7),
    });
    const result = await newUser.save();
    if(result) {
      var token = jwt.sign(
        { credentials: `${result._id}.${CONFIG.jwtSecret}.${result.email}` },
        CONFIG.jwtSecret,
        { expiresIn: '1h' },
      );
      const credentials = {
        id: result._id,
        fullname: result.fullname,
        avatar_url: result.avatar_url,
        email: result.email,
        uniqueId: result.uniqueId,
        token: token,
      };
      console.log(credentials);
      return res.status(200).json({ success: true, data: credentials });
    }
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
      return res.status(404).send('User not found');
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (err) {
        return res.status(401).send('Email or Password is incorrect');
      }
      if(result) {
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
          uniqueId: user.uniqueId,
          token: token,
        };
        return res.status(200).json({ success: true, data: credentials });
      } else {
        return res.status(401).send('Email or Password is incorrect');
      }
    });
  });
}

exports.verify = async (req, res) => {
  const { email } = req.credentials;
  const user = await User.findOne({ email });
  if(!user) res.status(404).send(false);
  return res.status(200).send(true);
}