const jwt = require('jsonwebtoken');
const CONFIG = require('../../config/db');

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, CONFIG.jwtSecret, function(err, decoded) {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' });
    }
    // if everything good, save to request for use in other routes
    let credentials = decodedCredentials(decoded);
    req['credentials'] = credentials;

    next();
  });
}

function decodedCredentials(decoded) {
  let credentials = decoded.credentials.split(`.${CONFIG.jwtKey}.`);
  return {
    userId: credentials[0],
    email: credentials[1],
  };
}

module.exports = verifyToken;
