var appConfig = require('../config/config');
var emailProvider = appConfig.getConfig('emailProvider');
var emailUserName = appConfig.getConfig('emailUserName');
var emailPassword = appConfig.getConfig('emailPassword');
var jwt = require('jsonwebtoken');

module.exports.sendMail = function sendMail(mailOptions) {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: emailProvider,
        auth: {
            user: emailUserName,
            pass: emailPassword
        }
    });
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else {
            console.log(info);
        }
    });
}

module.exports.authenticate = async function authenticate(req, res, next) {
    let userDetails = jwt.decode(req.headers.authorization);
    req.var={};
    if (!userDetails) {
        // res.status(401).json({ status: false, message: 'Not Authorized' });
        // return;
        next();
    } else {
        next();
    }
}