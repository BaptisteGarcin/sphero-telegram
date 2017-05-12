const util = require('./util.js');
const client = require('../setup/witClient.js');
const setup = require('../setup/connectOrb.js');
const conv = require('../conversation/conversation.js');

const commands = {};

commands.orbUnknownCommand = function (orb, lastColor) {
    if (orb) {
        orb.color('darkred');
        orb.roll(0, 70, 2);
        setTimeout(function() {
            orb.color('red')}, 150);
        setTimeout(function() {
            orb.color('darkred');
            orb.roll(0, 290, 2)}, 300);
        setTimeout(function() {
            orb.color('red')}, 450);
        setTimeout(function() {
            orb.color('darkred');
            orb.roll(0, 45, 2)}, 600);
        setTimeout(function() {
            orb.color('red')},750);
        setTimeout(function() {
            orb.color(lastColor);
            orb.roll(0, 0, 2)}, 900);
    }
};

commands.setBackLedSettings = function(orb) {
    orb.setTempOptionFlags(0x08); // Back light always on
    orb.setBackLed(255); // Full intensity
};

commands.sleepOrb = function (orb){
    if (orb) {
        orb.sleep(0,0,0, function() {
            util.printlog('Sphero sleeping');
            orb = null;
        });
    }
};

commands.disconnectOrb = function (orb){
    if (orb) {
        orb.disconnect(function() {
            util.printlog('Sphero disconnected');
        });
    }
};

commands.setCollision = function (orb) {
    if (orb) {
        orb.detectCollisions();
        orb.on("collision", function(data) {
            util.printlog('collision detected');
            orb.color('red');
            orb.stop();
            setTimeout(function() {
                orb.color('magenta');
            }, 1000);
        });
    }
};

commands.resetHeadingOrb = function(orb) {
    if (orb) {
        orb.setHeading(0);
    }
};

commands.setupOnConnect = function(orb){
    if (orb) {
        orb.color("magenta");
        commands.setBackLedSettings(orb);
        orb.on("error", function(err, data) {
            if (err) { console.log(err); }
        });
        //commands.setCollision(orb);
    }
};

commands.startCalibration = function(orb) {
    if (orb) {
        orb.startCalibration();
    }
};

commands.stopCalibration = function(orb, lastColor) {
    if (orb) {
        orb.finishCalibration();
        commands.setBackLedSettings(orb);
        orb.color(lastColor);
    }
};

commands.specialMessage = function (msg) {
    if (msg === 'déconnexion' || msg === 'dodo' || msg === 'reset session' ||
        msg === 'connexion' || msg === 'calibration distance' || msg === 'démarrer calibration' || msg === 'fin calibration') {
        return true;
    }
    return false;
};

commands.rollOrb = function (orb, distanceAtSpeed80, distanceMeter, heading) {
    if (orb) {
        commands.resetHeadingOrb(orb);
        orb.roll(80*distanceMeter/distanceAtSpeed80, heading);
    }
};

commands.rollOrbForCalibrationDistance = function (orb){
    if (orb) {
        commands.resetHeadingOrb(orb);
        orb.roll(80,0);
    }
};

commands.turnOrb = function (orb, heading) {
    if (orb) {
        commands.resetHeadingOrb(orb);
        // third param: 2 = not using vector direction -> turn in place
        orb.roll(1, heading, 2, function() {
            // Timeout to return to a normal balanced position
            setTimeout(function() {
                orb.setHeading(0, function() {
                    orb.roll(0,0,1);
                });
            }, 300);
        });
    }
};

commands.changeOrbColor = function (orb, color) {
    if (orb) {
        orb.color(color);
        return color;
    }
};

commands.direction = function (movement, direction){
    let heading = 0;
    switch (movement[0].value) {
        case 'avancer': {
            heading = 0;
            if (direction) {
                switch (direction[0].value) {
                    case 'gauche': {
                        heading = 270;
                        break;
                    }
                    case 'droite': {
                        heading = 90;
                        break;
                    }
                }
            }
            break;
        }
        case 'reculer': {
            heading = 180;
            if (direction) {
                switch (direction[0].value) {
                    case 'gauche': {
                        heading = 270;
                        break;
                    }
                    case 'droite': {
                        heading = 90;
                        break;
                    }
                }
            }
            break;
        }
    }
    return heading;
};

commands.processSpecialMessage = function (orb, msg) {
    switch (msg) {
        case 'connexion': {
            setup.connectOrb(client.d, orb);
            break;
        }
        case 'déconnexion': {
            commands.disconnectOrb(orb);
            break;
        }
        case 'dodo': {
            commands.sleepOrb(orb);
            break;
        }
        case 'reset session': {
            conv.conversationId = null;
            break;
        }
        case 'calibration distance': {
            commands.rollOrbForCalibrationDistance(orb);
            break;
        }
        case 'démarrer calibration': {
            commands.startCalibration(orb);
            break;
        }
        case 'fin calibration': {
            commands.stopCalibration(orb, client.lastColor);
            break;
        }
    }
};

module.exports = commands;