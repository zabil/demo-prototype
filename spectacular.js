#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

if (process.argv.length != 3) {
    console.log("Specify the specification(s) folder e.g.");
    console.log("./spectacular.js specs");
    process.exit(1);
}

var express = require('express')

var app = express()

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

var path = require('path');
var fs = require('fs');
var unique = require('array-unique');

var specifications_folder = path.join(__dirname + '/' + process.argv.pop());

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/specifications', function (req, res) {
    fs.readdir(specifications_folder, function (err, files) {
        res.setHeader('Content-Type', 'application/json');
        res.send(files);
    });
})

app.get('/specification/:file', function (req, res) {
    fs.readFile(path.join(__dirname + '/specs/' + req.params.file), 'utf8', function (err, data) {
        res.setHeader('Content-Type', 'text/markdown');
        res.send(data);
    })
});

var grep = require('simple-grep');

app.post('/steps', function (req, res) {
    var lines = [];
    grep(req.body.filter, specifications_folder, function (matches) {
        matches.forEach(function (match) {
            match.results.forEach(function (result) {
                lines.push(result.line);
            })
        })
        res.send(unique(lines));
    });
});

app.listen(3000);
console.log("Goto http://localhost:3000");