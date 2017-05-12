const util = require('../functions/util.js');
const conv = require('./conversation.js');
const client = require('../setup/witClient.js');

let witConversationHandler = function(conversationID, req, res){
    conv.globalContext = {};
    conv.botResponseToUser = null;
    conv.tmpNumber = null;
    conv.tmpDirection = null;
    util.printlog('');
    util.printlog('conversation id: ' + conversationID);
    util.printlog('processing message: ' + req.body.message);
    // Process the message on the bot part, waiting for an action on our side
    client.runActions(conversationID, req.body.message, conv.globalContext)
        .then((context) => {
            conv.globalContext = context;
            util.printlog('context: ' + JSON.stringify(conv.globalContext));
            const response = {};
            // The bot has something to ask or say to the user
            if (conv.botResponseToUser) {
                response.botResponseToUser = conv.botResponseToUser;
                // Reset response state for the next time
                conv.botResponseToUser = null;
            }
            res.json(response);
        })
        .catch(function (err) {
            console.log(err.name + ': ' + err.message);
        });

};

module.exports.witConversationHandler = witConversationHandler;