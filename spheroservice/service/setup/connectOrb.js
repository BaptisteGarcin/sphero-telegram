const sphero = require("sphero");
const util = require('../functions/util.js');

const setup = {};

setup.connectOrb = function (d, orb, commands) {
    d.run(() => {
        if (!orb) {
            if(process.platform === 'darwin' && !process.argv[2]){
                orb = sphero("/dev/tty.Sphero-RGG-AMP-SPP");
            }else if(process.platform === 'linux' && !process.argv[2]){
                orb = sphero("/dev/rfcomm0");
            }else {
                orb = sphero(process.argv[2]);
            }
        }
        orb.connect(function() {
            util.printlog('Sphero connected');
            orb.ping();
            commands.setupOnConnect(orb);
        });
    });
    return orb;
};

module.exports = setup;