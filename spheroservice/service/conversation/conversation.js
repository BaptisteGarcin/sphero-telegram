
// Conversation with a user, last as long as conversationId != null
let conversationId = null; // Conversation Id
let globalContext = {}; // Conversation context
let botResponseToUser = null; // response to send to user
let tmpNumber = null; // Store degree value waiting for the direction to turn
let tmpDirection = null; // Store direction waiting for the degree to turn

module.exports.conversationId = conversationId;
module.exports.globalContext = globalContext;
module.exports.botResponseToUser = botResponseToUser;
module.exports.tmpNumber = tmpNumber;
module.exports.tmpDirection = tmpDirection;