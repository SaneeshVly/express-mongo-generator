module.exports.validate = async function (req, res, next) {
    var validationStatus = true;
    for (let i = 0; i < req.var.parameterList.length; i++) {
        switch (req.var.parameterList[i].type) {
            case 'string':
                if (req.var.parameterList[i].isRequired== true) {
                    if (req.body[req.var.parameterList[i].name] == undefined || req.body[req.var.parameterList[i].name] == null || req.body[req.var.parameterList[i].name] == '') {
                        res.status(400).json({ status: "false", message: 'Missing field ' + req.var.parameterList[i].name });
                        validationStatus = false;
                        return;
                    }
                }
                break;
            case 'email':
                if (req.var.parameterList[i].isRequired == true) {
                    if (req.body[req.var.parameterList[i].name] == undefined || req.body[req.var.parameterList[i].name] == null || req.body[req.var.parameterList[i].name] == '') {
                        res.status(400).json({ status: "false", message: 'Missing field ' + req.var.parameterList[i].name + " (email address)" });
                        validationStatus = false;
                        return;
                    } else if (!(/^[\-0-9a-z\.\+_]+@[\-0-9a-z\.\+_]+\.[a-z]{2,}$/).test(String(req.body[req.var.parameterList[i].name]))) {
                        res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name });
                        validationStatus = false;
                        return;
                    }
                } else {
                    if (req.body[req.var.parameterList[i].name] != undefined && req.body[req.var.parameterList[i].name] != null && req.body[req.var.parameterList[i].name] != '') {
                        if (!(/^[\-0-9a-z\.\+_]+@[\-0-9a-z\.\+_]+\.[a-z]{2,}$/).test(String(req.body[req.var.parameterList[i].name]))) {
                            res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name });
                            validationStatus = false;
                            return;
                        }
                    }
                }
                break;
            case 'mobile':
                if (req.var.parameterList[i].isRequired == true) {
                    if (req.body[req.var.parameterList[i].name] == undefined || req.body[req.var.parameterList[i].name] == null || req.body[req.var.parameterList[i].name] == '') {
                        res.status(400).json({ status: "false", message: 'Missing field ' + req.var.parameterList[i].name });
                        validationStatus = false;
                    } else if (!(/^\d{10}$/).test(String(req.body[req.var.parameterList[i].name]))) {
                        res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name + " (10 numbers)" });
                        validationStatus = false;
                        return;
                    }
                } else {
                    if (req.body[req.var.parameterList[i].name] != undefined && req.body[req.var.parameterList[i].name] != null && req.body[req.var.parameterList[i].name] != '') {
                        if (!(/^\d{10}$/).test(String(req.body[req.var.parameterList[i].name]))) {
                            res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name + " (10 numbers)" });
                            validationStatus = false;
                            return;
                        }
                    }
                }
                break;
            case 'pincode':
                if (req.var.parameterList[i].isRequired == true) {
                    if (req.body[req.var.parameterList[i].name] == undefined || req.body[req.var.parameterList[i].name] == null || req.body[req.var.parameterList[i].name] == '') {
                        res.status(400).json({ status: "false", message: 'Missing field ' + req.var.parameterList[i].name });
                        validationStatus = false;
                        return;
                    } else if (!(/^\d{6}$/).test(String(req.body[req.var.parameterList[i].name]))) {
                        res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name + " (6 numbers)" });
                        validationStatus = false;
                        return;
                    }
                } else {
                    if (req.body[req.var.parameterList[i].name] != undefined && req.body[req.var.parameterList[i].name] != null && req.body[req.var.parameterList[i].name] != '') {
                        if (!(/^\d{6}$/).test(String(req.body[req.var.parameterList[i].name]))) {
                            res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name + " (6 numbers)" });
                            validationStatus = false;
                            return;
                        }
                    }
                }
                break;
            case 'number':
                if (req.var.parameterList[i].isRequired == true) {
                    if (req.body[req.var.parameterList[i].name] == undefined || req.body[req.var.parameterList[i].name] == null || req.body[req.var.parameterList[i].name] == '') {
                        res.status(400).json({ status: "false", message: 'Missing field ' + req.var.parameterList[i].name });
                        validationStatus = false;
                        return;
                    } else if (!(/^[0-9]+$/).test(String(req.body[req.var.parameterList[i].name]))) {
                        res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name + " (only numbers)" });
                        validationStatus = false;
                        return;
                    }
                } else {
                    if (req.body[req.var.parameterList[i].name] != undefined && req.body[req.var.parameterList[i].name] != null && req.body[req.var.parameterList[i].name] != '') {
                        if (!(/^[0-9]+$/).test(String(req.body[req.var.parameterList[i].name]))) {
                            res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name + " (only numbers)" });
                            validationStatus = false;
                            return;
                        }
                    }
                }
                break;
            case 'objectId':
                if (req.var.parameterList[i].isRequired == true) {
                    if (req.body[req.var.parameterList[i].name] == undefined || req.body[req.var.parameterList[i].name] == null || req.body[req.var.parameterList[i].name] == '') {
                        res.status(400).json({ status: "false", message: 'Missing field ' + req.var.parameterList[i].name });
                        validationStatus = false;
                        return;
                    } else if (!(/^[a-f\d]{24}$/i).test(String(req.body[req.var.parameterList[i].name]))) {
                        res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name + " (Object Id)" });
                        validationStatus = false;
                        return;
                    }
                } else {
                    if (req.body[req.var.parameterList[i].name] != undefined && req.body[req.var.parameterList[i].name] != null && req.body[req.var.parameterList[i].name] != '') {
                        if (!(/^[a-f\d]{24}$/i).test(String(req.body[req.var.parameterList[i].name]))) {
                            res.status(400).json({ status: "false", message: 'Enter valid ' + req.var.parameterList[i].name + " (Object Id)" });
                            validationStatus = false;
                            return;
                        }
                    }
                }
                break;
        }
        if (i == (req.var.parameterList.length - 1) && validationStatus == true) {
            next();
        }
    }
}