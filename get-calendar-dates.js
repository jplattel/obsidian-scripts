//
//  Build a summary of Calendar events
//
//  This is intended to be run as a TextExpander macro,
//  but will work anywhere you can invoke a JS script.
//  with "osascript -l JavaScript"
//
//  v 1.0.2 (full release history at bottom)

var app = Application.currentApplication()
var calendars = Application("Calendar").calendars
app.includeStandardAdditions = true

Date.prototype.valid = function() {
	return isFinite(this);
}

Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate())
}

var dates = getDates();

function getDates() {
	try {
		// Ask for a date
		var dateString = app.displayDialog('Fetch tasks for which date? (defaults to today if empty)', { defaultAnswer: "" });
		
		if (dateString.textReturned === "") {
			var startDate = new Date()
		} else {
			var startDate = new Date(Date.parse(dateString.textReturned))
		}

        startDate.setHours(0, 0, 0, 0);
        
		if (!startDate.valid()){
			app.displayNotification('Did you try (YYYY-MM-DD)', { withTitle: "Invalid date" }); throw "Invalid date provided";
		}
	
		var endDate = new Date(new Date().setDate(startDate.getDate()))
		endDate.setHours(23, 59, 59, 0)
	
		return {
			startDate: startDate.toIsoString(),
			endDate: endDate.toIsoString(),
		}
	} catch (err) {
		console.log(err)
	}
}

`${dates.startDate}`