//
//  Build a summary of OmniFocus tasks completed today.
//
//  This is intended to be run as a TextExpander macro,
//  but will work anywhere you can invoke a JS script.
//  with "osascript -l JavaScript"
//

var NoProjectMarker = "Other tasks (no project)";
var app = Application.currentApplication()
var doc = Application('OmniFocus').defaultDocument;
app.includeStandardAdditions = true

// Validation function to check if a date is valid
Date.prototype.valid = function() {
	return isFinite(this);
}

// Function for getting dates
Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}

function getDates() {
	try {
		// Ask for a date
		var dateString = app.displayDialog('Fetch tasks for which date? (defaults to today if empty)', { defaultAnswer: "" });
		
		if (dateString.textReturned === "") {
			var startDate = new Date()
		} else {
			var startDate = new Date(Date.parse(dateString.textReturned))
		}

		startDate.setHours(0, 0, 0, 0)
	
		if (!startDate.valid()){
			app.displayNotification('Did you try (YYYY-MM-DD)', { withTitle: "Invalid date" }); throw "Invalid date provided";
		}
	
		var endDate = new Date(new Date().setDate(startDate.getDate() + 1))
		endDate.setHours(0, 0, 0, 0)
	
		return {
			startDate: startDate,
			endDate: endDate,
		}
	} catch (err) {
		console.log(err)
	}
}

function getCompletedTasksForDates(startDate, endDate) {
	
	var tasks = doc.flattenedTasks.whose({_and: [
		{completionDate: {'>=': startDate}},
		{completionDate: {'<=': endDate}}
	]})();

	if (tasks.length === 0) {
		app.displayNotification('From ' + startDate.toIsoString() + ' to ' +  endDate.toIsoString(), { withTitle: "No tasks found.."});
	} else {
		return groupArrayByKey(tasks, function(v) {
			var proj = v.containingProject();
			if (proj) {
				return proj.id();
			}
			return NoProjectMarker;
		});
	}
}

function getProjectsForTasks(tasks) {
	var allProjects = doc.flattenedProjects();
	var progressedProjects = allProjects.filter(function(p) {
		return p.id() in tasks;
	});
	return progressedProjects
}

function getSummaryPerProject(progressedProjects){
	var summary = progressedProjects.reduce(function(s,project){
		return s + summaryForProject(project);
	}, "");

	var tasksWithNoProject = completedTasks[NoProjectMarker];
	if (tasksWithNoProject) {
		summary += summaryForTasksWithTitle(tasksWithNoProject, "No Project\n");
	}

	// This needs to be in this scope because it captures groupedTasks
	function summaryForProject(p) {
		var projectID = p.id();
		var tasks = completedTasks[projectID].filter(function(t) {
			return projectID != t.id(); // Don't include the project itself
		});
		return summaryForTasksWithTitle(tasks, p.name() + "\n");
	}
	function summaryForTasksWithTitle(tasks, title) {
		return title + tasks.reduce(summaryForTasks,"") + "\n";
	}

	return summary
}

function lineForTask(task) {
	return " - [x] " + task.name() + "\n";
}
function summaryForTasks(s,t) {
	return s + lineForTask(t);
}

// Group an array of items by the key returned by this function
function groupArrayByKey(array,keyForValue) {
	var dict = {};
	for (var i = 0; i < array.length; i++) {
		var value = array[i];
		var key = keyForValue(value);
		if (!(key in dict)) {
			dict[key] = [];
		}
		dict[key].push(value);
	}
	return dict;
}

var dates = getDates();
var completedTasks = getCompletedTasksForDates(dates.startDate, dates.endDate);
var progressedProjects = getProjectsForTasks(completedTasks);
var summary = getSummaryPerProject(progressedProjects);

console.log(summary)