/* globals gauge*/

"use strict";
var api = require('../api/gauge');

var project;

gauge.step("Start gauge for project at <path>", function(path) {
	project = api.Project(path);
});

gauge.step('List all steps', function() {
	var steps = project.steps();
});