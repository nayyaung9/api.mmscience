const path = require('path'),
  rootPath = path.normalize(__dirname + '/..');
  require('dotenv').config();
  env = process.env.NODE_ENV || 'production';

const config = {
  test: {
    root: rootPath,
    app: {
      name: 'mmscience',
    },
    port: 27017,
    db: 'mongodb://localhost:27017/mmscience',
    // jwtKey: 'WgiOquLvwQpL2S4.O.ZJCA',
    jwtSecret: process.env.jwtSecret,
    cloudinary: {
      name: process.env.cloudName,
      api_key: process.env.cloudinaryKey,
      api_secret: process.env.cloudinarySecret,
    },
    gmailAuth: {
      user: 'nayyaung.developer@gmail.com',
      name: '"MM SCIENCE"',
      pass: 'nyll20112001',
    },
  },
  production: {
    root: rootPath,
    app: {
      name: 'mmscience',
    },
    port: 27017,
    db: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds229088.mlab.com:29088/mmscience`,
    jwtSecret: process.env.jwtSecret,
    cloudinary: {
      name: process.env.cloudName,
      api_key: process.env.cloudinaryKey,
      api_secret: process.env.cloudinarySecret,
    },
    gmailAuth: {
      user: 'nayyaung.developer@gmail.com',
      name: '"MM SCIENCE"',
      pass: 'nyll20112001',
    },
  },
}

module.exports = config[env];
