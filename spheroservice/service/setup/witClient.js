const {Wit, log} = require('node-wit');
const WIT_TOKEN = '5TVDVUPPWIF7HFKHRVX52BXQJBBAJODA';
const commands = require('../functions/commands.js');
const d = require('domain').create();
const util = require('../functions/util.js');
const setup = require('./connectOrb.js');
const conv = require('../conversation/conversation.js');



// Used to catch asynchronous error on sphero connection
d.on('error', function (err) {
    util.printlog('Error while connecting Sphero: ' + err);
});

// Sphero object creation and connection
let orb = null;
orb = setup.connectOrb(d, orb, commands);
let lastColor = 'magenta';
let distanceAtSpeed80 = 1.55;

const actions = {};

// Update the context state for a turn command
actions.processTurn = function ({sessionId, context, text, entities}) {
    const direction = entities.direction;
    const number = entities.number;
    // Turn back
    if (entities.tourner && entities.tourner[0].value === 'demi_tour') {
        context.degree = 180;
    }
    // Turn to a specific direction
    else {
        // Missing direction
        if (!direction && !conv.tmpDirection) {
            context.missingDirection = true;
            // Doesn't look at conv.tmpNumber to update with most recent degree number given by user
            if (number) {
                conv.tmpNumber = number[0].value;
                delete context.missingDegree;
            }
            // Missing degree number
            else if (!conv.tmpNumber && !number) {
                context.missingDegree = true;
            }
        }
        else {
            // All infos given
            if (number || conv.tmpNumber) {
                context.degree = util.normalizeDegreeFromDirection(conv.tmpNumber || number[0].value, conv.tmpDirection || direction[0].value);
                conv.tmpNumber = null;
                conv.tmpDirection = null;
                delete context.missingDegree;
                delete context.missingDirection;
            }
            // Direction but no degree number
            else {
                // Both infos were missing and direction came first
                if (context.missingDegree && direction) {
                    conv.tmpDirection = direction[0].value;
                    delete context.missingDirection;
                }
                // Direction only command
                else if (!context.missingDegree && (direction || conv.tmpDirection)) {
                    context.degree = util.normalizeDegreeFromDirection(90, direction[0].value);
                    conv.tmpNumber = null;
                    conv.tmpDirection = null;
                    delete context.missingDegree;
                    delete context.missingDirection;
                }
            }
        }
    }
    return Promise.resolve(context);
};

// Update the context state for a color change command
actions.processChangeColor = function ({sessionId, context, text, entities}) {
    const color = entities.couleur;
    if (color) {
        context.color = color[0].metadata;
        delete context.missingColor;
    }
    else {
        context.missingColor = true;
    }
    return Promise.resolve(context);
};

// Roll action
actions.roll = function ({sessionId, context, text, entities}) {
    const movement = entities.bouger;
    const direction = entities.direction;
    const distanceMeter = entities.number;
    let heading = commands.direction(movement, direction);
    commands.rollOrb(orb, distanceAtSpeed80, distanceMeter ? distanceMeter[0].value : distanceAtSpeed80, heading);
    conv.conversationId = null; // End of this conversation
    return Promise.resolve(context);
};

// Action used when response from the bot
actions.send = function (request, response) {
    return new Promise(function (resolve, reject) {
        let context = request.context;
        conv.botResponseToUser = response.text;
        util.printlog('bot message : ' + response.text);
        resolve();
    });
};

// Turn action
actions.turn = function ({sessionId, context, text, entities}) {
    console.log(context);
    commands.turnOrb(orb, context.degree);
    conv.conversationId = null; // End of this conversation
    return Promise.resolve(context);
};


// Unknown command action
actions.processUnknownCommand = function ({sessionId, context, text, entities}) {
    commands.orbUnknownCommand(orb, lastColor);
    conv.conversationId = null;
    return Promise.resolve(context);
};

// Color change action
actions.changeColor = function ({sessionId, context, text, entities}) {
    lastColor = commands.changeOrbColor(orb, context.color);
    conv.conversationId = null;  // End of this conversation
    return Promise.resolve(context);
};

const client = new Wit({
    accessToken: WIT_TOKEN,
    actions: actions
});

module.exports = client;
module.exports.orb = orb;
module.exports.lastColor = lastColor;
module.exports.d = d;
