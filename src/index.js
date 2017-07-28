'use strict';
var https = require('https');
var Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.  
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = undefined;

var SKILL_NAME = "Cheat River Float Trip";
var GET_FACT_MESSAGE = "Here's the river level in CFS: ";
var HELP_MESSAGE = "You can say what's the current river level, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//
// USGS Water Information System REST API details
//
var options = {
            host: 'waterservices.usgs.gov',
            port: 443,
            path: '/nwis/iv/?site=03069500&format=json',
            method: 'GET'
        };

//=========================================================================================================================================
//Editing anything below this line might break your skill.  
//=========================================================================================================================================
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetDischargeIntent');
    },
    'GetDischargeIntent': function () {
        var dischargeCFS = 512;
        var speechOutput = GET_FACT_MESSAGE + dischargeCFS;
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, dischargeCFS);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};

function httpsGet(myData, callback) {
   
    //      
    // USGS Water Information System REST API details
    //
    var options = {
            host: 'waterservices.usgs.gov',
            port: 443,
            path: '/nwis/iv/?site=03069500&format=json',
            method: 'GET'
        };

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            // we have now received the raw return data in the returnData variable.
            // We can see it in the log output via:
            // console.log(JSON.stringify(returnData))
            // we may need to parse through it to extract the needed data

            callback(returnData);  // this will execute whatever function the caller defined, with one argument

        });

    });
    req.end();

}
