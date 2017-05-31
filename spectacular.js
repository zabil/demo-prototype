#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

if (process.argv.length != 3) {
    console.log("Specify the specification(s) folder e.g.");
    console.log("./spectacular.js specs");
    process.exit(1);
}

var express = require('express')
var app = express()
var path = require('path');
var fs = require('fs');

var specifications_folder = process.argv.pop();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/specifications', function (req, res) {
    fs.readdir(path.join(__dirname + '/' + specifications_folder), function (err, files) {
        console.log(files);
        res.setHeader('Content-Type', 'application/json');
        res.send(files);
    });
})

app.get('/specification/:file', function (req, res) {
    fs.readFile(path.join(__dirname + '/specs/' + req.params.file), 'utf8', function (err, data) {
        res.setHeader('Content-Type', 'text/markdown');
        console.log(data);
        res.send(data);
    })
});
app.listen(3000);
console.log("Listening at http://localhost:3000");