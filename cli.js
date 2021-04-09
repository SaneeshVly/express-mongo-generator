#!/usr/bin/env node
'use strict';
const meow = require('meow');
const prompts = require('prompts');
var form = [], tablename, i;
let availableFieldTypes = [{ name: 'string', dataType: 'String' }, { name: 'email', dataType: 'String' }, { name: 'mobile', dataType: 'Number' }, { name: 'pincode', dataType: 'Number' }, { name: 'number', dataType: 'Number' }, { name: 'objectId', dataType: 'mongoose.Schema.Types.ObjectId' }, { name: 'customerType', dataType: 'String' }, { name: 'adminType', dataType: 'String' }, { name: 'shopOwnerType', dataType: 'String' }, { name: 'userType', dataType: 'String' }];

// Meow configuration
const cli = meow(`
	Usage
	  $ s4s <options>
	Options
	  --project, -p  Create new Express Project
	  --collection, -c  Create new colection and APIs(insert,list,update,delete).
	Examples
	  $ s4s -p
	  $ s4s -c
`, {
    flags: {
        project: {
            type: 'boolean',
            alias: '-p'
        },
        collection: {
            type: 'boolean',
            alias: '-c'
        }
    }
});

if (cli.flags.project) {
    (async () => {
        const questions = [
            {
                type: 'text',
                name: 'project',
                message: 'Enter project name?'
            },
        ];
        const projectDetails = await prompts(questions);
        if(projectDetails.project==undefined)
        process.exit(0);
        const path = require('path');
        var source = path.resolve(__dirname, 'template')
        var destination = process.cwd();
        var fs = require('fs');
        var dir = destination + '/' + projectDetails.project;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        var fs_extra = require("fs-extra");
        // copy source folder to destination
        fs_extra.copy(source, dir, function (err) {
            if (err) {
                console.log('An error occured while copying the folder.');
                return console.error(err)
            }
            console.log('Project '+projectDetails.project+' Created!...\n');
        });
    })();
} else
if (cli.flags.collection) {
    var fs = require('fs');
    var destination = process.cwd();   
    var app_js = destination + '/app.js';
    if (!fs.existsSync(app_js)) {
        console.log('You are not inside the project folder or missing app.js file');
        process.exit(0);
      
    }
    (async () => {
        const questions2 = [
            {
                type: 'text',
                name: 'collection',
                message: 'Enter collection name?'
            }
        ];
        tablename = await prompts(questions2);
        tablename = tablename.collection;
        addFields();
    })();
} else {
    console.log('\n  Usage\n'+
	  '     $ s4s <options>\n'+
	'  Options\n'+
	  '     --project, -p  Create new Project\n'+
	  '     --collection, -c  Create new table/colection and APIs(insert,list,update,delete).\n'+
	'  Examples\n'+
	  '     $ s4s -p\n'+
      '     $ s4s -c\n');
      process.exit(0);
}
async function addFields() {
    const questions2 = [
        {
            type: 'text',
            name: 'name',
            message: 'Enter field name?'
        },

        {
            type: 'select',
            name: 'type',
            message: 'Select field Type:',
            choices: [
                { title: 'string', value: 'string' },
                { title: 'mobile', value: 'mobile' },
                { title: 'email', value: 'email' },
                { title: 'number', value: 'number' },
                { title: 'pincode', value: 'pincode' },
                { title: 'objectId', value: 'objectId' }
            ],
            initial: 0
        },
        {
            type: 'select',
            name: 'required',
            message: 'Is Mandatory:',
            choices: [
                { title: 'true', value: true },
                { title: 'false', value: false }
            ],
            initial: 0
        },
        {
            type: 'text',
            name: 'default',
            message: 'Enter default value?'
        },
        {
            type: 'text',
            name: 'ref',
            message: 'Enter ref table?'
        }
        // {
        // 	type: 'select',
        // 	name: 'ref',
        // 	message: 'Choose ref collection:',
        // 	choices: [
        // 		{ title: 'customer', value: 'customer' },
        // 		{ title: 'user', value: 'user' }
        // 	],
        // 	initial: 1
        // },
    ];
    const addAnother = [
        {
            type: 'select',
            name: 'continuee',
            message: 'Add another field:',
            choices: [
                { title: 'Yes', value: 'y' },
                { title: 'no', value: 'no' }
            ],
            initial: 0
        },
    ];
    const response = await prompts(questions2);
    form.push(response);
    const response5 = await prompts(addAnother);
    if (response5.continuee == 'y') {
        addFields();
    } else {
        console.log('Creating collection');
        createModel();
    }
}

function createRouteFromTemplate() {
    let insertForm = [];
    let listForm = [];
    let updateForm = [];
    let deleteForm = [];
    let newIndex=0;
    for (let index = 0; index < form.length; index++) {
        if(form[index].name!='' && form[index]['name']!=null && form[index]['name']!=undefined) {
            if (form[index].required == "true") {
            form[index].required = true;
        }
        insertForm.push({});
        insertForm[newIndex]['name'] = form[index].name;
        insertForm[newIndex]['type'] = form[index].type;
        insertForm[newIndex]['isMandatory'] = form[index].required;

        listForm.push({});
        listForm[newIndex]['name'] = form[index].name;
        listForm[newIndex]['type'] = form[index].type;
        listForm[newIndex]['isMandatory'] = false;

        updateForm.push({});
        updateForm[newIndex]['name'] = form[index].name;
        updateForm[newIndex]['type'] = form[index].type;
        updateForm[newIndex]['isMandatory'] = false;
        newIndex=newIndex+1;
    }
    }
    listForm.push({ name: '_id', type: 'objectId', isMandatory: false });
    updateForm.push({ name: '_id', type: 'objectId', isMandatory: true });
    deleteForm.push({ name: '_id', type: 'objectId', isMandatory: true });

    var routeTemplate =

        //start
        'var express = require(\'express\');\n' +
        'var router = express.Router();\n' +
        'var bodyValidator = require(\'../common/bodyValidator\');\n' +
        'var common = require(\'../common/common\');\n' +
        'const ' + tablename + 'Table = require(\'../models/' + tablename + 'Table\');\n' +

        'router.post(\'/insert\',  function (req, res, next) {\n' +
        '    req.var = {}; \n' +
        '    req.var.parameterList = \n' + JSON.stringify(insertForm) +
        '     \n' +
        '    next();\n' +
        '}, bodyValidator.validate, async function (req, res, next) {\n' +
        '    try {\n' +
        '        let doc = await new ' + tablename + 'Table(req.body).save();\n' +
        '        res.status(200).json({ status: true, doc: doc });\n' +
        '    } catch (err) {\n' +
        '        res.status(500).json({ status: false, doc: err });\n' +
        '    }\n' +
        '});\n' +
        'router.post(\'/list\',  function (req, res, next) {\n' +
        '    req.var = {}; \n' +
        '    req.var.parameterList = \n' + JSON.stringify(listForm) +
        '    \n' +
        '    next();\n' +
        '}, bodyValidator.validate, async function (req, res, next) {\n' +
        '    try {\n' +
        '        let doc = await ' + tablename + 'Table.find(req.body);\n' +
        '        res.status(200).json({ status: true, doc: doc });\n' +
        '    } catch (err) {\n' +
        '        res.status(500).json({ status: false, doc: err });\n' +
        '    }\n' +
        '});\n' +
        'router.post(\'/update\',  function (req, res, next) {\n' +
        '    req.var = {}; \n' +
        '    req.var.parameterList = \n' + JSON.stringify(updateForm) +
        '    \n' +
        '    next();\n' +
        '}, bodyValidator.validate, async function (req, res, next) {\n' +
        '    try {\n' +
        '        let doc = await ' + tablename + 'Table.updateOne({ _id: req.body._id }, { $set: req.body });\n' +
        '        if (doc.n > 0) {\n' +
        '            res.status(200).json({ status: true, doc: await ' + tablename + 'Table.findOne({ _id: req.body._id }) });\n' +
        '        } else {\n' +
        '            res.status(200).json({ status: false, doc: {}, message: \'_id not exists\' });\n' +
        '        }\n' +
        '    } catch (err) {\n' +
        '        res.status(500).json({ status: false, doc: err });\n' +
        '    }\n' +
        '});\n' +
        'router.post(\'/delete\',  function (req, res, next) {\n' +
        '    req.var = {}; \n' +
        '    req.var.parameterList = \n' +
        JSON.stringify(deleteForm) +
        '    \n' +
        '    next();\n' +
        '}, bodyValidator.validate, async function (req, res, next) {\n' +
        '    try {\n' +
        '        let doc = await ' + tablename + 'Table.deleteOne({ _id: req.body._id });\n' +
        '        if (doc.deletedCount > 0) {\n' +
        '            res.status(200).json({ status: true, doc: [] });\n' +
        '        } else {\n' +
        '            res.status(200).json({ status: false, doc: {}, message: \'_id not exists\' });\n' +
        '        }\n' +
        '    } catch (err) {\n' +
        '        res.status(500).json({ status: false, doc: err });\n' +
        '   }\n' +
        '});\n' +
        'module.exports = router;\n';

    //end;
    return routeTemplate;
}
function createModelFromTemplate() {
    let temp = '';
    for (let index = 0; index < form.length; index++) {
        if(form[index]['name']!=''&&form[index]['name']!=null&&form[index]['name']!=undefined) {
        temp = temp + form[index]['name'] + ':{type:' +
            availableFieldTypes.filter((elem) => {
                return elem.name == form[index]['type'];
            })[0].dataType;
        ;
        if (form[index]['required'] != undefined && form[index]['required'] != ''&& form[index]['required'] != null) {
            temp = temp + ',required:' + form[index]['required'];
        }
        if (form[index]['default'] != undefined && form[index]['default'] != '' && form[index]['default'] != null) {
            temp = temp + ',default:\'' + form[index]['default']+'\'';
        }
        if (form[index]['ref'] != undefined && form[index]['ref'] != ''&& form[index]['ref'] != null) {
            temp = temp + ',ref:\'' + form[index]['ref'] + 'Table\'';
        }
        temp = temp + '},\n';
    }
    }
    var modelTemplate = 'const mongoose = require(\'mongoose\');\nconst ' + tablename + 'TableSchema = mongoose.Schema({\n' +
        '_id:{type: mongoose.Schema.Types.ObjectId,required:true,default:function () { return new mongoose.Types.ObjectId()} },\n' +
        temp +
        'createdAt:{type:Number,required:true,default:function () {return new Date().getTime()}},\n' +
        'lastUpdatedAt:{type:String,required:true,default:function () {return new Date().getTime()}},\n' +
        'createdBy:{type: mongoose.Schema.Types.ObjectId, ref: \'customerTable\',required:false},\n' +
        'lastUpdatedBy:{type: mongoose.Schema.Types.ObjectId,required:false},\n' +
        'status:{type:Number,required:true,default:1},\n' +
        '});\n' +
        'module.exports = mongoose.model(\'' + tablename + 'Table\',' + tablename + 'TableSchema);\n';
    return modelTemplate;
}
const createModel = async () => {
    var fs = require('fs');
    var destination = process.cwd();   
    var dir = destination + '/models';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFile('./models/' + tablename + 'Table.js', await createModelFromTemplate(), async function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Model created.');
            await createRoute();
            console.log('APIs created.\n1./'+tablename+'Table/insert\n2./'+tablename+'Table/list\n3./'+tablename+'Table/update\n4./'+tablename+'Table/delete');
        }
    });
}
const createRoute = async () => {
    var fs = require('fs');
    var fs = require('fs');
    var destination = process.cwd();
    var dir = destination + '/routes';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fs.writeFile('./routes/' + tablename + 'TableRoutes.js', await createRouteFromTemplate(), async function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.appendFileSync('./app.js', '\nvar ' + tablename + 'TableRoutes = require(\'./routes/' + tablename + 'TableRoutes\');\napp.use(\'/' + tablename + 'Table\',' + tablename + 'TableRoutes);\n');
            console.log('app.js updated');
            console.log('Done.');
            process.exit(0);
        }
    });
}