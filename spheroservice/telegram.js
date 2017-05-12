const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '336706943:AAFEH1YGJ97Grqu_FiFhPt3dMHBqCdczBEg';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);

});

// Listen for any kind of message. There are different kinds of
// messages.

bot.on('message', (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;

    let option = {
        "parse_mode": "Markdown",
        "reply_markup": {  "keyboard": [["Yes"],["No"]]  }
    };
    if(msg.text){
        bot.sendMessage(msg.chat.id, "text message received", option);
    }
    if(msg.voice){
        let file = bot.getFile(msg.voice.file_id);
        bot.sendMessage(msg.chat.id, "audio message received", option);
        console.log(file);
    }

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, 'Received your message');
});