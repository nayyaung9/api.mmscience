const express = require('express'),
  router = express.Router(),
  path = require('path'),
  glob = require('glob'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  cors = require('cors'),
  rootDir = `${__dirname}/../`;

module.exports = function(app, config) {
    app.disable('x-powered-by');
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(
      cors({
        allowedHeaders: [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'x-access-token',
        ],
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
      }),
    );
    // example socket testing index.html
    app.get('/', function(req, res) {
      res.sendfile('public/index.html');
    });

    app.use('/public/featured_image/:imageName', (req, res) => {
      var options = {
        root: path.join(__dirname, '../public/featured_image/'),
      }
      var fileName = req.params.imageName;
      res.sendFile(fileName, options, function (err) {
        if (err) {
          console.log(err);
        } 
      });
    });

    app.get('/public/profile/:imageName', (req, res) => {
      var options = {
        root: path.join(__dirname, '../public/profile/'),
      }
      var fileName = req.params.imageName;
      res.sendFile(fileName, options, function (err) {
        if (err) {
          // next(err)
        } else {
          console.log('Sent:', fileName)
        }
      });
    });

    const routes = glob.sync(config.root + '/app/routes/*.js');
    routes.forEach(function(route) {
      require(route)(app);
    });
}
