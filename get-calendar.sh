#!/bin/sh
/usr/local/bin/icalBuddy -npn -ec Contacts -eep notes -b "* " eventsFrom:"${KMVAR_d} 00:00:00" to:"${KMVAR_d} 23:59:59"