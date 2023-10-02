//  Bones node.js IRC bot framework - git.supernets.org/hgw/bones
//       __                         
//      / /_  ____  ____  ___  _____
//     / __ \/ __ \/ __ \/ _ \/ ___/
//    / /_/ / /_/ / / / /  __(__  ) 
//   /_.___/\____/_/ /_/\___/____/  
//                            
var config = require('./config/default.json');
var irc = require("irc");
var fs = require("fs");
const { Worker } = require('worker_threads');

warningMsg = ''+config.colours.brackets+'['+config.colours.warning+'WARNING'+config.colours.brackets+']'
errorMsg = ''+config.colours.brackets+'['+config.colours.error+'ERROR'+config.colours.brackets+']'
const msgTimeout = new Set();
const msgTimeoutMsg = new Set();
const timer = ms => new Promise(res => setTimeout(res, ms))
var hostmask = null

var bot = new irc.Client(config.irc.server, config.irc.nickname, {
    channels: config.irc.channels,
    secure: config.irc.ssl,
    port: config.irc.port,
    autoRejoin: config.irc.autorejoin,
    userName: config.irc.username,
    realName: config.irc.realname,
    floodProtection: config.floodprotect.flood_protection,
    floodProtectionDelay: config.floodprotect.flood_protection_delay
});

// We use consoleLog instead of console.log() as it allows togglable logging through the config file. 
// If you have things you definitely do not want to be togglable then you can continue using console.log()
function consoleLog(log) {
    if (config.misc.logging === "true") {
        console.log(log)
    } else {
        return;
    }
}

function openPostWorker(chan, command, d1, d2, d3, d4, d5, d6) {
    consoleLog(`[bot.openPostWorker] Opening ${command} worker`)
    const worker = new Worker(`./commands/${command}.js`, { 
        workerData: {
        d1, d2, d3, d4, d5, d6 //d1-d6 equate to variables you can pass in to a worker, see  the example1 block below for an example (var1 there is d1 here). Further defined in individual command files.
        }
    });
    worker.once('message', (string) => {
        consoleLog(`[bot.openPostWorker.finalising] Got output from ${command}, sending to `+chan);
        bot.say(chan, string);
    });
}

// Example command function.
// In this example "channel" is the channel the prompt came from and "var1" is the contents of 
// that message after the !example1 part, as called in the listener further down
async function example1(channel, var1) {
    if (sub != undefined ) {
        var sub = var1.toLowerCase() //transform variables to lowercase, this is not a requirement of course if you have case-sensitive inputs
    }
    openPostWorker(channel, 'example1', var1) //Opens commands/example1.js as a seperate process, much faster than just running the command in the one file
}

// ###################################
// Put your bot command functions here
// ###################################

bot.addListener('message', function(nick, to, text, from) {
    // nick = Nickname of the message sender
    // to = Channel the message came from
    // text = Contents of the message received by the bot
    if (text.startsWith(config.irc.prefix)) {
        if (msgTimeout.has(to)) {
            if (msgTimeoutMsg.has("yes")) {
                return;
            } else {
                bot.say(to, errorMsg+" You are sending commands too quickly")
                msgTimeoutMsg.add("yes");
                setTimeout(() => {
                    msgTimeoutMsg.delete("yes");
                }, config.floodprotect.command_listen_timeout)           
            }
        } else {
            var args = text.split(' ');
            var command = args[0].toLowerCase()
            if (command === config.irc.prefix+'example1') {
                example1(to, text)
            } else if (command === config.irc.prefix+'COMMAND2') {
                if (args[1] == undefined ) {
                    //If you have a help function you can call it here, otherwise catch a no input error
                } else {
                    //Call your command here
            }
            } else if (command === config.irc.prefix+'COMMAND2') {
                if (args[1] == undefined ) {
                    //If you have a help function you can call it here, otherwise catch a no input error
                } else {
                    //Call your command here
            }
            }
            msgTimeout.add(to);
            setTimeout(() => {
                msgTimeout.delete(to);
            }, config.floodprotect.command_listen_timeout)
        }
    }
});

bot.addListener('error', function(message) {
    consoleLog('[ERROR]' +message) //Dump errors to console
});

process.on('uncaughtException', function (err) {
    console.error(err);
    if (config.errorhandling.log_errors_to_irc == 'true') { //If logging errors to IRC is enabled then we send the error to that, otherwise we only consoleLog it
        bot.say(config.errorhandling.error_channel, errorMsg+" "+err.stack.split('\n',1).join(" "))
    }
}); 