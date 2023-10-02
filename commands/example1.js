const config = require('../config/default.json')
const { parentPort, workerData } = require('worker_threads');
const { d1, d2 } = workerData; //Declare all used variables here (if you only pass 1 variable to this command you only really need d1 in here, but it doesnt matter)
var var1 = d1; // Declaring d1 as var1, just for consistancy with the last file but again, this may not be necessary in all cases.
var val2 = d2; // Further variables declared like so, fairly simple
const timer = ms => new Promise(res => setTimeout(res, ms))

warningMsg = ''+config.colours.brackets+'['+config.colours.warning+'WARNING'+config.colours.brackets+']'
errorMsg = ''+config.colours.brackets+'['+config.colours.error+'ERROR'+config.colours.brackets+']'

// We use consoleLog instead of console.log() as it allows togglable logging through the config file. 
// If you have things you definitely do not want to be togglable then you can continue using console.log()
function consoleLog(log) {
    if (config.misc.logging === "true") {
        console.log(log)
    } else {
        return;
    }
}

// the errorMessage function is just a nice-to-have if you want to use error codes internally to just push set messages to console/IRC
// You can also just sendUpstream('ERROR_MESSAGE_HERE') to handle errors as well if wanted, 
function errorMessage(error, code, extra) {
    consoleLog('[example1.errorMessage] '+error.code)
    if (code == "BAD") {
        var error = errorMsg+" SHITS_FUCKED_MAN: " + extra + " not found"
    } else {
        var error = errorMsg+" Unknown error"
    }
    parentPort.postMessage(error);
    process.exit()
}

// All code must end with either a sendUpstream or errorMessage call, otherwise this subprocess will remain running indefinitely.
// sendUpstream takes the content provided to it and sends it in whatever channel the original command prompt came from.
async function sendUpstream(content) {
    parentPort.postMessage(content);
    process.exit()
}

// ######################################################################################
// Put your commands code here, remember to always end with sendUpstream or errorMessage.
// ######################################################################################