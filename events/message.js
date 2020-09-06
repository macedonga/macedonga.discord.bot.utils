const Discord = require('discord.js');
const { settings, cooldowns } = require('../data/variables');
const { createError, createWarning } = require('../utils/functions');
const neuralnetwork = require('../utils/neural.network');

module.exports = (client, message) => {
    if (message.author.bot) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const com = args.shift().toLowerCase();
    const command = client.commands.get(com);

    if (!client.commands.has(com)) {
        if (settings[message.guild.id][0].lmgtfy === "true") {
            if (neuralnetwork.isQuestion(message.content)) {
                const lmgtfy = new URL("https://lmgtfy.com/");
                lmgtfy.searchParams.append("q", message.content);
                lmgtfy.searchParams.append("s", "d");
                return message.channel.send(lmgtfy.href);
            }
        } else return;
    };

    if (!cooldowns.has(command.name))
        cooldowns.set(command.name, new Discord.Collection());

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(createWarning(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`));
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        if (command.guildOnly && message.channel.type === 'dm')
            return message.channel.send(createError('I can\'t execute that command inside DMs!'));
        command.execute(message, args);
    } catch (error) {
        message.channel.send(createError("An error occured while executing that command.\nError: " + error))
    }
};