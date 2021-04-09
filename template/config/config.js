var appConfig = {
    privateKey:'privatekey',
    emailProvider:'gmail',
    emailUserName:'a@a.com',
    emailPassword:'1234',
    database:'databseName',
    port:4000
}
var testConfig = {
    privateKey:'privatekey',
    emailProvider:'gmail',
    emailUserName:'a@a.com',
    emailPassword:'1234',
    database:'databseName',
    port:4000
}
var production=true;
exports.getConfig = function (field) {
    if(production==true) {
        return appConfig[field];
    } else {
        return testConfig[field];
    }
}