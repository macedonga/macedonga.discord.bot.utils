const Discord = require('discord.js');
const textToImage = require('text-to-image');
const { createError } = require('../utils/functions');

module.exports = {
    name: 'quote',
    description: 'Creates a quote.',
    execute(message, args) {
        if (!args[0])
            return message.channel.send(createError("No message link given."))
        else if (!args[0].includes("https://discordapp.com/"))
            return message.channel.send(createError("No valid message link given."))
        var messageLink = args[0].split("/")
        if (!messageLink[5])
            return message.channel.send(createError("No valid message link given."))
        message.channel.messages.fetch(messageLink[6])
            .then(message => {
                if (args[1] === "date")
                    var data = message.content + "\n- " + message.member.user.username + ", " + message.createdAt.getFullYear();
                else
                    var data = message.content + "\n- " + message.member.user.username;
                textToImage.generate(data, {
                    fontSize: 20,
                    lineHeight: 30,
                    margin: 5,
                    fontFamily: "Sans",
                    bgColor: "#202020",
                    textColor: "#ffffff",
                    textAlign: "center"
                }).then(function(dataUri) {
                    let buff = new Buffer.from(dataUri.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
                    const attachment = new Discord.MessageAttachment(buff, "quote.png");
                    message.channel.send({ embed: { title: "Here's your quote", image: { url: "attachment://quote.png" } }, files: [attachment] });
                });
            });
    },
};