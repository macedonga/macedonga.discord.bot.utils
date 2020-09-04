const Discord = require('discord.js');
var QRCode = require('qrcode');
const { createError, isHexColor } = require('../utils/functions');

module.exports = {
    name: 'generate.qr',
    cooldown: 10,
    description: 'Generates a QR code.',
    execute(message, args) {
        var options = { color: { dark: "#000000ff", light: "#ffffffff" }, width: 500 }
        var split = 0;

        if (args[0] === "!dark") {
            if (isHexColor(args[1])) {
                options["color"].dark = args[1];
                split += 2;
            }
        } else if (args[2] === "!dark") {
            if (isHexColor(args[3])) {
                options["color"].dark = args[3];
                split += 2;
            }
        }

        if (args[0] === "!light") {
            if (isHexColor(args[1])) {
                options["color"].light = args[1];
                split += 2;
            }
        } else if (args[2] === "!light") {
            if (isHexColor(args[3])) {
                options["color"].light = args[3];
                split += 2;
            }
        }

        var text = args.splice(split).join(" ");
        if (!text)
            return message.channel.send(createError("You need to give me data to put in a QR code!"));

        QRCode.toDataURL(text, options, function(err, url) {
            let buff = new Buffer.from(url.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
            const attachment = new Discord.MessageAttachment(buff, "qr.png");
            message.channel.send({ embed: { title: "Here's your QR code", image: { url: "attachment://qr.png" } }, files: [attachment] });
            message.delete();
        });
    },
};