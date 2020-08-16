# Obsidian scripts

This repository is a collection of small scripts that I use with [Obsidian](https://obsidian.md). For now it's Mac OS X only and requires [icalbuddy](https://hasseg.org/icalBuddy/) & [Keyboard Meastro](https://www.keyboardmaestro.com/main/).

## Completed Omnifocus tasks to Obsidian

The `get-completed-tasks.js` get called within Obsidian with the help of Keyboard Meastro. This should pop-up a dialog asking you for a date to get the completed tasks

## Timing summary to Obsidian

The `get-timing.js` get called within Obsidian with the help of Keyboard Meastro. This should pop-up a dialog asking you for a date and get a summary of the [Timing App](https://timingapp.com/) on my productivity. (_note: you will need a premium version of Timing with scripting support_)

## Get calendar appointments

The `get-calendar-dates.js` get called within Obsidian with the help of Keyboard Meastro. This should pop-up a dialog asking you for a date that is then put into the `get-calendar.sh` script that uses icalbuddy to fetch the calendar appointments for that date, excluding some calendars.

## Extract annotations

This script is a work in progress and extracts the highlights from a PDF to create a markdown file which can be used with Obsidian (including a backlink to the file itself)