//
//  Build a summary of OmniFocus tasks completed today.
//
//  This is intended to be run as a TextExpander macro,
//  but will work anywhere you can invoke a JS script.
//  with "osascript -l JavaScript"
//

var NoProjectMarker = "Other tasks (no project)";
var app = Application.currentApplication()
var timing = Application("TimingHelper")
app.includeStandardAdditions = true

// Validation function to check if a date is valid
Date.prototype.valid = function() {
	return isFinite(this);
}

// Function for getting dates
function getDates() {
	try {
		// Ask for a date
		var dateString = app.displayDialog('Fetch tasks for which date? (defaults to today if empty)', { defaultAnswer: "" });
		
		if (dateString.textReturned === "") {
			var startDate = new Date()
		} else {
			var startDate = new Date(Date.parse(dateString.textReturned))
		}

		startDate.setHours(0, 0, 1, 0)
	
		if (!startDate.valid()){
			app.displayNotification('Did you try (YYYY-MM-DD)', { withTitle: "Invalid date" }); throw "Invalid date provided";
		}
	
		var endDate = new Date(new Date().setDate(startDate.getDate()))
		endDate.setHours(23, 59, 59, 0)
	
		return {
			startDate: startDate,
			endDate: endDate,
		}
	} catch (err) {
		console.log(err)
	}
}

function createSummary(hours, percentage, perProject) {
	var projectSummaries = ''
	for (let [projectName, projectSeconds] of Object.entries(perProject)) {
		var projectHours = (projectSeconds / 3600).toFixed(2)
		projectSummaries = projectSummaries + `${projectName}: ${projectHours}h\n`
	}
	return `Total time: ${hours}h (${percentage}% productive)\n\n` + projectSummaries
}

// Get the dates to fetch data for
var dates = getDates();
var dailySummary = timing.getTimeSummary({between: dates.startDate, and: dates.endDate});
var perProject = dailySummary.timesPerProject();
var hours = (dailySummary.overallTotal() / 3600).toFixed(2);
var percentage = (dailySummary.productivityScore() * 100).toFixed(2);

createSummary(hours, percentage, perProject);
