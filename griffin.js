#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

if (process.argv.length !== 3) {
    console.log("Specify the specification(s) folder e.g.");
    console.log("./griffin.js specs");
    process.exit(1);
}

var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var gauge = require("./api/gauge.js")

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('public'));
app.use(express.static('bin'));

var specifications_folder = path.resolve(process.argv[2]);
var project = gauge.Project(process.argv[2])

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/specifications', function (req, res) {
    fs.readdir(specifications_folder, function (err, files) {
        res.setHeader('Content-Type', 'application/json');
        res.send(files);
    });
});

app.get('/specification/:file', function (req, res) {
    fs.readFile(path.join(specifications_folder, req.params.file), 'utf8', function (err, data) {
        res.setHeader('Content-Type', 'text/markdown');
        if(err){
            console.log("err:" + err);
        }
        res.send(data);
    });
});

app.get('/steps', function (req, res) {
    project
        .get_steps()
        .then((data) => res.send(data))
        .catch(console.log);
});

app.listen(3000);
console.log("Goto http://localhost:3000");