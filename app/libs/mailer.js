const nodemailer = require('nodemailer'),
  config = require('../../config/db');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.gmailAuth.user,
    pass: config.gmailAuth.pass,
  },
});

module.exports = function(msgObj) {
  console.log('aaaaa');
  console.log('msg', msgObj);
  msgObj.from = config.gmailAuth.name + ' ' + config.gmailAuth.user;
  console.log("Mail Object ",msgObj);
  transporter.sendMail(msgObj, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Sent');
    }
  });
};
