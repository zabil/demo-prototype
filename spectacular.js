#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

if (process.argv.length !== 3) {
    console.log("Specify the specification(s) folder e.g.");
    console.log("./spectacular.js specs");
    process.exit(1);
}


var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var unique = require('array-unique');
var spawn = require('child_process');
var os = require('os');

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('public'));
app.use(express.static('bin'));

var specifications_folder = path.resolve(process.argv.pop());

var gaugeDaemon = spawn('guage', ['--daemonize', '--api-port', '9999'], { "cwd": specifications_folder });

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
    fs.readFile(path.join(__dirname + '/specs/' + req.params.file), 'utf8', function (err, data) {
        res.setHeader('Content-Type', 'text/markdown');
        res.send(data);
    });
});

var grep = require('simple-grep');

app.post('/steps', function (req, res) {
    var lines = [];
    grep(req.body.filter, specifications_folder, function (matches) {
        matches.forEach(function (match) {
            match.results.forEach(function (result) {
                if (result.line.startsWith('* ')) {
                    lines.push(result.line.replace(/\* /g, ''));
                }
            });
        });
        res.send(unique(lines));
    });
});

app.listen(3000);
console.log("Goto http://localhost:3000");