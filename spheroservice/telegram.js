const TelegramBot = require('node-telegram-bot-api');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const sphero = require("sphero");
const d = require('domain').create();
const witai_speech = require('witai-speech');
const ACCESS_TOKEN = "5TVDVUPPWIF7HFKHRVX52BXQJBBAJODA";
// replace the value below with the Telegram token you receive from @BotFather
const token = '336706943:AAFEH1YGJ97Grqu_FiFhPt3dMHBqCdczBEg';

// Used to catch asynchronous error on sphero connection
d.on('error', function (err) {
    console.log('Error while connecting Sphero: ' + err);
});

// Sphero object creation and connection
let orb = null;
let lastColor = 'magenta';
let distanceAtSpeed80 = 1.55;

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
        console.log('Sphero connected');
        orb.ping();
        orb.setTempOptionFlags(0x08); // Back light always on
        orb.setBackLed(255); // Full intensity
    });
});

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.

bot.on('message', (msg) => {
    console.log(msg);
    const chatId = msg.chat.id;

    let option = {
        "parse_mode": "Markdown",
        "reply_markup": {  "keyboard": [["jaune"],["bleu"],["vert"]]  }
    };

    if(msg.text){
        bot.sendMessage(msg.chat.id, "text message received");
        if(msg.text === 'vert'){
            orb.color('green');
        }else if(msg.text === 'jaune'){
            orb.color('yellow');
        }else if(msg.text === 'bleu'){
            orb.color('blue');
        }
    }
    if(msg.voice){
        bot.downloadFile(msg.voice.file_id, '.').then(function (path){

            let p1 = new Promise(function(resolve, reject) {
                ffmpeg(path)
                    .toFormat('wav')
                    .on('error', function (err) {
                        console.log('An error occurred: ' + err.message);
                    })
                    .save('./output.wav');//path where you want to save your file


                setTimeout(
                    function() {
                        resolve();
                    }, 300);
            });

            p1.then(function () {
                witai_speech.ASR({
                    file: './output.wav',
                    developer_key: ACCESS_TOKEN
                }, function (err, res) {
                    console.log(err, res);

                    if(res['_text'].includes('couleur')){
                        bot.sendMessage(msg.chat.id, "quelle couleur ?", option);
                    }
                    bot.sendMessage(msg.chat.id, res._text);
                    fs.unlink(path);
                });
            })

        });


        bot.sendMessage(msg.chat.id, "voice message received");
    }
});