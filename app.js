var express = require('express')
  , http = require('http')
  , path = require('path')
  , mail = require("nodemailer").mail;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ 
    keepExtensions: true, 
    uploadDir: __dirname + '/tmp',
    limit: '999mb' // up the limit...
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
  res.render('index');
});

// we need a route that lets us download the stuff
// but we'll do this after we send mail

app.post('/', function(req, res) {
  mailFile(req.files.myFile.path);
  deleteAfterUpload(req.files.myFile.path);
  res.end();
});

// Start the app

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// Private functions

var fs = require('fs');

var deleteAfterUpload = function(path) {
  setTimeout( function(){
    fs.unlink(path, function(err) {
      if (err) console.log(err);
      console.log('file successfully deleted');
    });
  }, 60 * 1000 * 10 ); // it deletes after 10 MINUTEs
};

var mailFile = function(path) {
  mail({
    from: "Fred Foo * <foo@blurdybloop.com>", // sender address
    to: [
      "forddavis@gmail.com",
      "keyvanfatehi@gmail.com" // will remove once its working ;)
    ],
    subject: "Face Detected (test)", // Subject line
    text: "Face detected, see attachments", // plaintext body
    html: "<b>Hello world *</b>", // html body
    attachments: [{
      fileName: "face.jpeg",
      filePath: path
    }]
  });
};
