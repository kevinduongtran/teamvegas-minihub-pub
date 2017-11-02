var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require("async");
var config = require("./config.js");



var app = module.exports = express();
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

/**
 * Development Settings
 */


if (app.get('env') === 'development') {
    // This will change in production since we'll be using the dist folder
    // app.use(express.static(path.join(__dirname, 'tmp')));
    // app.set('FIREBASE_ENDPOINT', 'https://mary-janes-dev.firebaseio.com')
    // app.set('API_ENDPOINT', '//localhost:9090/')
    app.set('NODE_ENDPOINT', '//localhost:3000')

    // Error Handling
    // app.use(function(err, req, res, next) {
    //     res.status(err.status || 500);
    //     res.json({
    //         message: err.message,
    //         error: err
    //     });
    // });
    // app.use(function(req, res, next) {

    //     // Website you wish to allow to connect
    //     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9090');

    //     // Request methods you wish to allow
    //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    //     // Request headers you wish to allow
    //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    //     // Set to true if you need the website to include cookies in the requests sent
    //     // to the API (e.g. in case you use sessions)
    //     res.setHeader('Access-Control-Allow-Credentials', true);

    //     // Pass to next layer of middleware
    //     next();
    // });



}
/**
 * Production Settings
 */



if (app.get('env') === 'production') {
    // app.set('FIREBASE_ENDPOINT', 'https://teamvegas-d6ee9.firebaseapp.com')
    // app.set('API_ENDPOINT', '//teamvegas-app.herokuapp.com')
    // app.set('NODE_ENDPOINT', '//teamvegas-app.herokuapp.com')
    app.enable('trust proxy');

    // Add a handler to inspect the req.secure flag (see 
    // http://expressjs.com/api#req.secure). This allows us 
    // to know whether the request was via http or https.
    app.use(function(req, res, next) {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
        }
    });

    // changes it to use the optimized version for production
    // app.use(express.static(path.join(__dirname, 'distkevin')));

    // // production error handler
    // // no stacktraces leaked to user
    // app.use(function(err, req, res, next) {
    //     res.status(err.status || 500);
    //     res.sendFile('distkevin/404.html', {
    //         root: __dirname
    //     });
    // });
    // app.all('/', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });
    // });
    // app.all('/login', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });

    // });
    // app.all('/dashboard', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });

    // });
    // app.all('/thankyou', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });

    // });
    // app.all('/profile', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });

    // });
    // app.all('/admin', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });

    // });
    // app.all('/hempfest', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });

    // });
    // app.all('/api/verify', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });

    // });
    // app.all('/verify', function(req, res, next) {
    //     // Just send the index.html for other files to support HTML5Mode
    //     res.sendFile('distkevin/index.html', {
    //         root: __dirname
    //     });

    // });

}

require('./services/HeatPumpManager.js')();

    
console.log("\n");
console.log("Team Vegas Mini-Hub");
console.log("Port:", app.get('port'));
console.log("Enviornment:", app.get('env'));
// console.log("Server Firebase Endpoint:", app.get('FIREBASE_ENDPOINT'));
// console.log("Server API Endpoint:", app.get('API_ENDPOINT'));
console.log("Server Node Endpoint:", app.get('NODE_ENDPOINT'));
console.log("\n");



module.exports = app;