'use strict';

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CONFIG = require('../../config/db');

exports.register = async (req, res) => {
  let { fullname, email, password } = req.body;
  try {
    let newUser = new User({
      fullname,
      email,
      password,
      uniqueId: Math.random()
      .toString(36)
      .substring(7),
      avatar_url: 'https://res.cloudinary.com/dcx5aeaaz/image/upload/v1590746247/profile/mmscience_default_profile_sw55hn.png',
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
      return res.status(500).send('There was an error while login. Please try again');
    }
    if (!user) {
      return res.status(404).send('User does not exist');
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
  const { id } = req.params;
  const user = await User.findById(id);
  if(!user) res.status(404).send(false);
  return res.status(200).send({ success: true, data: user });
}
