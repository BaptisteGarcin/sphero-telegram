const client = require('../setup/witClient.js');
const commands = require('../functions/commands.js');
const witConv = require('./witConversationHandler.js');

exports.processMessage = function (req, res) {
    const msg = req.body.message.toLowerCase();
    if (commands.specialMessage(msg)) {
        commands.processSpecialMessage(client.orb, msg);
        res.json({});
    }
    else {
        let remoteAddress = req.connection.remoteAddress.substring(7);
        witConv.witConversationHandler(remoteAddress, req, res);
    }
};
