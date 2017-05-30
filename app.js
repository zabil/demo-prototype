var express = require('express')
var app = express()
var path = require('path');
var fs = require('fs');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/specs', function (req, res) {
    fs.readdir(path.join(__dirname + '/specs'), function (err, files) {
        console.log(files);
        res.setHeader('Content-Type', 'application/json');
        res.send(files);
    });
});

app.listen(3000);
console.log("Listening at http://localhost:3000");
