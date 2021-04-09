var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var compression = require('compression')
var helmet = require('helmet')
var appConfig = require('./config/config')
var app = express();
app.use(compression())
app.use(bodyParser.json());
app.use(helmet())
app.use(logger('dev'));
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect("mongodb://localhost:27017/" + appConfig.getConfig('database'), { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.connection.once('open', function () {
}).on('error', function (error) {
    console.log('Error in Connection With Mongodb:', error);
});
app.use(function (err, req, res, next) {
    new error({ type: 'catchedError', errorMessage: err }).save();
    res.status(400).send({ status: false, message: 'Not a valid JSON request' });
})
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,PATCH');
        return res.status(200).json({});
    }
    next();
});
process.on('uncaughtException', function (err) {
    console.log(err);
}).on('unhandledRejection', (err, p) => {
    console.log(err);
}).on('warning', (err) => {
    console.log(err);
});
app.listen(appConfig.getConfig('port'), function (req, res) {
    console.log('Express server listening on port ' + appConfig.getConfig('port'));
});
module.exports = app;
