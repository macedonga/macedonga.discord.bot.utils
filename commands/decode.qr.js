const Discord = require('discord.js');
var Jimp = require("jimp");
var QrCode = require('qrcode-reader');
const { createError, createSuccess } = require('../utils/functions');
var request = require('request');

module.exports = {
    name: 'decode.qr',
    cooldown: 10,
    description: 'Decodes a QR code.',
    execute(message, args) {
        var attachment = (message.attachments)
        if (!attachment.array()[0]) {
            return message.channel.send(createError("You need to send me a QR code image!"));
        }
        var options = {
            url: attachment.array()[0].url,
            method: "get",
            encoding: null
        };

        request(options, function(error, response, body) {
            Jimp.read(body, function(err, image) {
                if (err)
                    return message.channel.send(createError("Unknown error!\Complete error:`" + err + "`"));
                var qr = new QrCode();
                qr.callback = function(err, value) {
                    if (err)
                        if (err.includes("Couldn't find enough finder patterns"))
                            return message.channel.send(createError("Image too small!"));
                        else
                            return message.channel.send(createError("Unknown error!\Complete error:`" + err + "`"));
                    return message.channel.send(createSuccess("Succesfully decoded QR code!", "Value: `" + value.result + "`"));
                };
                qr.decode(image.bitmap);
            });
        });
    },
};