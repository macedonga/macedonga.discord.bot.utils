const Discord = require('discord.js');

require('dotenv').config()
const { settings } = require('./data/variables');
const { createError, createWarning } = require('./utils/functions');
const neuralnetwork = require('./utils/neural.network');

var request = require('request');
var socket = require('socket.io-client')('https://api.macedon.ga');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

var isReady = false;

client.on('ready', () => {
    client.guilds.cache.forEach(guild => {
        var jData = { sid: guild.id, uid: guild.owner.user.id, key: process.env.KEY }
        request.post('https://api.macedon.ga/mdbu/server/check', { json: { sid: guild.id } }, function(error, response, body) {
            if (!error && response.statusCode == 200)
                if (!body.connected)
                    request.post('https://api.macedon.ga/mdbu/server/add', { json: jData }, function(error, response, body) {});
                else
                    request.post('https://api.macedon.ga/mdbu/settings/get', { json: { sid: guild.id } }, function(error, response, body) {
                        if (body[0].sid) {
                            settings[guild.id] = [];
                            settings[guild.id].push(body[0]);
                        }
                    });
        });
    });
    isReady = true;
    client.user.setPresence({ activity: { name: "for mb.help", type: 2 } });
    console.log("Ready!");
});

client.on('message', message => {
    if (message.author.bot) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    var com;
    if (isReady)
        com = args.shift().toLowerCase();
    else
        command = undefined;

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
});

client.on('guildMemberRemove', member => {
    if (settings[member.guild.id][0].listing != null) {
        const categoryChannels = member.guild.channels.cache.filter(channel => channel.type === "category");
        categoryChannels.forEach(channel => {
            if (channel.id === settings[member.guild.id][0].listing.id) {
                const advertisingChannels = channel.children;
                advertisingChannels.forEach(ch => {
                    ch.messages.fetch().then(messages => {
                        let arr = messages.array();

                        arr.forEach(message => {
                            if (message.author.id === member.user.id)
                                message.delete();
                        });
                    });
                });
            }
        });
    } else if (settings[member.guild.id][0].wm != null) {
        const welcome = member.guild.channels.cache.get(settings[member.guild.id][0].wm.id);
        var ran = randomRange(0, 4);
        var message;
        switch (ran) {
            case 0:
                message = "Bye bye, <@!" + member.user + ">.";
                break;
            case 1:
                message = "F in the chat. <@!" + member.user + "> left.";
                break;
            case 2:
                message = "So long ||gay|| bowser!\nUser <@!" + member.user + "> left.";
                break;
            case 3:
                message = "Oof,  <@!" + member.user + "> left.";
                break;
            case 4:
                message = "I feel bad for <@!" + member.user + ">, he doesn't know what's he's missing!";
                break;
        }
        const embed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle("Noo, an user left! 👋")
            .setDescription(message)
            .setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        return welcome.send(embed);
    }
});

client.on('guildMemberAdd', member => {
    if (settings[member.guild.id][0].wm != null) {
        const welcome = member.guild.channels.cache.get(settings[member.guild.id][0].wm.id);

        var ran = randomRange(0, 4);
        var greeting;
        switch (ran) {
            case 0:
                greeting = "Brace yourselves, <@!" + member.user + "> just joined the server!\nBe sure to read the rules!";
                break;
            case 1:
                greeting = "Challenger approaching - <@!" + member.user + "> has appeared!\nBe sure to read the rules!";
                break;
            case 2:
                greeting = "Welcome <@!" + member.user + ">. Leave your weapon by the door.\nBe sure to read the rules!";
                break;
            case 3:
                greeting = "I hope you got lots of memes <@!" + member.user + ">!\nBe sure to read the rules!";
                break;
            case 4:
                greeting = "A wild <@!" + member.user + "> appeared!\nBe sure to read the rules!";
                break;
        }
        const embed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle("Hey! 👋 - A new user arrived!")
            .setDescription(greeting)
            .setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        return welcome.send(embed);
    }
});

client.on('guildCreate', guild => {
    request.post('https://api.macedon.ga/mdbu/server/check', { json: { sid: guild.id } }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (!body.connected)
                request.post('https://api.macedon.ga/mdbu/server/add', { json: { sid: guild.id, uid: guild.owner.user.id, key: process.env.KEY } });
        }
    });
});

socket.on('settings update', function(data) {
    request.post('https://api.macedon.ga/mdbu/settings/get', { json: { sid: data } }, function(error, response, body) {
        if (body[0].sid) {
            settings[data] = [];
            settings[data].push(body[0]);
        }
    });
});

socket.on('get channels', function(data) {
    try {
        var guild = client.guilds.cache.get(data);
        var ch = {};
        guild.channels.cache.forEach(channel => {
            if (channel.type === "text")
                ch[channel.id] = {
                    name: channel.name
                };
        });
        socket.emit('return channels', ch);
    } catch {
        socket.emit('error');
    }
});

socket.on('get categories', function(data) {
    try {
        var guild = client.guilds.cache.get(data);
        var ch = {};

        guild.channels.cache.forEach(channel => {
            if (channel.type === "category")
                ch[channel.id] = {
                    name: channel.name
                };
        });
        socket.emit('return categories', ch);
    } catch {
        socket.emit('error');
    }
});

neuralnetwork.init();
client.login(process.env.TOKEN);