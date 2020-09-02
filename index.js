const Discord = require('discord.js');
const https = require('https');
const ytdl = require('ytdl-core');
const getYoutubeTitle = require('get-youtube-title')
require('dotenv').config()
const { createError, createWarning, createSuccess, checkYT, getYTID } = require('./utils/functions');
const neuralnetwork = require('./utils/neural.network');
var request = require('request');
var socket = require('socket.io-client')('https://api.macedon.ga');

const client = new Discord.Client();
var servers = {};
var settings = {};
var isReady = false;

client.on('ready', () => {
    client.guilds.cache.forEach(guild => {
        var jData = { sid: guild.id, uid: guild.owner.user.id, key: process.env.KEY }

        request.post('https://api.macedon.ga/mdbu/server/check', { json: { sid: guild.id } }, function(error, response, body) {
            if (!error && response.statusCode == 200)
                if (!body.connected)
                    request.post('https://api.macedon.ga/mdbu/server/add', { json: jData }, function(error, response, body) {});
                else {
                    request.post('https://api.macedon.ga/mdbu/settings/get', { json: { sid: guild.id } }, function(error, response, body) {
                        if (body[0].sid) {
                            settings[guild.id] = [];
                            settings[guild.id].push(body[0]);
                        }
                    });
                }
        });
    });
    isReady = true;
    client.user.setPresence({
        activity: {
            name: `over ${client.users.cache.size} users`,
            type: 3
        }
    });
    console.log("Ready!");
});

client.on('message', message => {
    if (message.author.bot) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    var command = null;
    if (isReady)
        command = args.shift().toLowerCase();
    if (command === 'kick') {
        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (!message.mentions.users.size) {
                return message.channel.send(createWarning('You didn\'t tell me who to kick!'));
            } else {
                const taggedUser = message.mentions.users.first();
                const targetMember = message.guild.members.cache.get(taggedUser.id);
                var kick_reason = "";
                if (args[2]) {
                    kick_reason = args.splice(3).join(" ");
                } else {
                    kick_reason = "Not specified.";
                }
                targetMember.kick({ reason: kick_reason });
                setTimeout(function() {
                    if (message.guild.member(taggedUser.id)) {
                        return message.channel.send(createError('An error occured while kicking ' + taggedUser.username));
                    } else {
                        return message.channel.send(createSuccess('Succesfully kicked ' + taggedUser.username + '!', 'Reason: `' + kick_reason + '`'));
                    }
                }, 500);
            }
        } else {
            message.channel.send(createWarning("You need to have the `KICK_MEMBERS` permission!"));
        }
    } else if (command === 'ban') {
        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (!message.mentions.users.size) {
                return message.channel.send(createWarning('You didn\'t tell me who to ban!'));
            } else {
                const taggedUser = message.mentions.users.first();
                const targetMember = message.guild.members.cache.get(taggedUser.id);
                var days = parseInt(args[1]);
                if (isNaN(days)) {
                    days = 7;
                }
                var ban_reason = "";
                if (args[2]) {
                    ban_reason = args.splice(3).join(" ");
                } else {
                    ban_reason = "Not specified.";
                }
                targetMember.ban({ days: days, reason: ban_reason });
                setTimeout(function() {
                    if (message.guild.member(taggedUser.id)) {
                        return message.channel.send(createError('An error occured while banning ' + taggedUser.username));
                    } else {
                        return message.channel.send(createSuccess('Succesfully banned ' + taggedUser.username + '!', 'Reason: `' + ban_reason + '`\nDays of messages deleted: `' + days + '`'));
                    }
                }, 500);
            }
        } else {
            message.channel.send(createWarning("You need to have the `BAN_MEMBERS` permission!"));
        }
    } else if (command === 'meme') {
        https.get('https://api.macedon.ga/reddit/random/memes', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var res = JSON.parse(data);
                const embed = new Discord.MessageEmbed()
                    .setTitle(res.title)
                    .setURL(res.permalink)
                    .setImage(res.image)
                    .setTimestamp()
                    .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');

                message.channel.send(embed);
            });

        }).on("error", (err) => {
            message.channel.send(createError("Error!\n" + err.message));
        });
    } else if (command === 'insult') {
        if (!message.mentions.users.size) {
            return message.channel.send(createWarning("You didn't tell me who to insult!"));
        } else {
            https.get('https://insult.mattbas.org/api/insult', (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    const taggedUser = message.mentions.users.first();
                    message.channel.send(taggedUser.username + " " + data.toLowerCase() + ".");
                });
            }).on("error", (err) => {
                message.channel.send(createError("Error!\n" + err.message));
            });
        }
    } else if (command === 'meme') {
        https.get('https://api.macedon.ga/reddit/random/memes', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var res = JSON.parse(data);
                const embed = new Discord.MessageEmbed()
                    .setTitle(res.title)
                    .setURL(res.permalink)
                    .setImage(res.image)
                    .setTimestamp()
                    .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');

                message.channel.send(embed);
            });

        }).on("error", (err) => {
            message.channel.send(createError("Error!\n" + err.message));
        });
    } else if (command === 'kitty') {
        https.get('https://api.thecatapi.com/v1/images/search', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var res = JSON.parse(data);
                const embed = new Discord.MessageEmbed()
                    .setTitle("Here's a kitty!")
                    .setImage(res[0].url)
                    .setTimestamp()
                    .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
                message.channel.send(embed);
            });
        }).on("error", (err) => {
            message.channel.send(createError("Error!\n" + err.message));
        });
    } else if (command === 'dog') {
        https.get('https://api.thedogapi.com/v1/images/search', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var res = JSON.parse(data);
                const embed = new Discord.MessageEmbed()
                    .setTitle("Here's a dog!")
                    .setImage(res[0].url)
                    .setTimestamp()
                    .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
                message.channel.send(embed);
            });
        }).on("error", (err) => {
            message.channel.send(createError("Error!\n" + err.message));
        });
    } else if (command === 'shorten') {
        var url = args[0];
        var slug = args[1];

        if (url == undefined)
            return message.channel.send(createError("No URL given!"));
        var json;
        if (slug != undefined)
            json = { url: url, slug: slug }
        else
            json = { url: url }

        const data = JSON.stringify(json);

        const options = {
            hostname: 's.mcdn.ga',
            path: '/url',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                var res = JSON.parse(data);
                if (data.includes("num")) {
                    if (res.num === "001")
                        return message.channel.send(createError("The slug you given is already in use!"));
                    else if (res.num === "002")
                        return message.channel.send(createError("No."));
                    else
                        return message.channel.send(createError("Invalid slug/URL!"));
                } else
                    return message.channel.send(createSuccess("Succesfully shortened the URL " + res.url, "https://s.mcdn.ga/" + res.slug));
            });
        }).on("error", (err) => {
            message.channel.send(createError("Error!\n" + err.message));
        });
        req.write(data);
        req.end();
    } else if (command === 'purge') {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            const amount = parseInt(args[0]) + 1;
            if (isNaN(amount)) {
                message.channel.send(createError('That doesn\'t seem to be a valid number!'));
            } else if (amount <= 1 || amount > 100) {
                message.channel.send(createError('You need to input a number between 1 and 99!'));
            } else {
                message.channel.bulkDelete(amount, true).catch(err => {
                    message.channel.send(createError("Error:\n" + err));
                });
            }
        } else {
            message.channel.send(createWarning("You need to have the `MANAGE_MESSAGES` permission!"));
        }
    } else if (command === 'help') {
        const embed = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setTitle("Help")
            .setDescription("*The arguments inside `<>` are not required.*")
            .addField('**`mb.ban @user <DAYS> <REASON>`**', 'Bans a member.\n`<DAYS>`: Must be a value from 1 to 7. Default is 7.\n*You need the `BAN_MEMBERS` permission.*')
            .addField('**`mb.kick @user <REASON>`**', 'Kicks a member.\n*You need the `KICK_MEMBERS` permission.*')
            .addField('**`mb.purge 1-99`**', 'Purges messages in the channel.\n*You need the `MANAGE_MESSAGES` permission.*')
            .addField('**`mb.meme`**', 'Returns a meme from `r/memes`, `r/dankmemes`, `r/meme` or `r/meirl`')
            .addField('**`mb.insult @user`**', 'Insults the specified user.')
            .addField('**`mb.shorten https://link.com <SLUG>`**', 'Shortens the given URL.\n`<SLUG>`: the id of the shortened URL.')
            .addField('**`mb.whois https://link.com <dbg.true>`**', 'Returns WHOIS info about the domain.\n`<dbg.true>`: returns the json response from the API. Debugging purposes only!')
            .addField('**`mb.poll <everyone> <here> POLL`**', 'Creates a poll and pings **here** or **everyone** if specified.\n*You need the `MENTION_EVERYONE` permission to be able to ping **here** or **everyone**.*')
            .addField('**`mb.m.play <YT-LINK>`**', 'Plays the audio from the given YouTube video or adds the video to the queue.', true)
            .addField('**`mb.m.skip`**', 'Skips to the next video on the queue.', true)
            .addField('**`mb.m.stop`**', 'Disconnects the bot from the VC.', true)
            .addField('**`mb.settings`**', 'Returns link to the bot dashboard. **(early beta)**\n*You need the server owner to configure the dashboard*', true)
            .addField('**`mb.settings.get`**', 'Returns bot settings for this server.', true)
            .addField('**`mb.kitty`**', 'Returns a cat image.')
            .addField('**`mb.dog`**', 'Returns a dog image.')
            .setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        message.channel.send(embed);
    } else if (command === 'whois') {
        if (args[0] != undefined) {
            var domain = args[0];
            https.get('https://api.ip2whois.com/v1?key=free&domain=' + domain, (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    var res = JSON.parse(data);
                    if (res.error_code != "")
                        return message.channel.send(createError("The API returned an error!\n`" + res.error_message + "`"));
                    else {
                        const embed = new Discord.MessageEmbed()
                            .setTitle("WHOIS info for " + domain)
                            .setDescription('By https://ip2whois.com/ • *`NA` means "Not Available"*')
                            .addField('Domain ID', res.domain_id || "NA")
                            .addField('Status', res.status || "NA")
                            .addField('\u200b', '\u200b')
                            .addField('Created', res.create_date || "NA", true)
                            .addField('Update date', res.update_date || "NA", true)
                            .addField('Expiring date', res.expire_date || "NA", true)
                            .addField('Domain age', res.domain_age || "NA", true)
                            .addField('\u200b', '\u200b')
                            .addField('Nameservers', res.nameservers || "NA", true);
                        if (res.registrant != undefined) {
                            embed.addField('\u200b', '\u200b')
                                .addField('Registrant\'s name', res.registrant.name || "NA", true)
                                .addField('Registrant\'s organization', res.registrant.organization || "NA", true)
                                .addField('Registrant\'s street address', res.registrant.street_address || "NA", true)
                                .addField('Registrant\'s city', res.registrant.city || "NA", true)
                                .addField('Registrant\'s region', res.registrant.region || "NA", true)
                                .addField('Registrant\'s zip code', res.registrant.zip_code || "NA", true)
                                .addField('Registrant\'s country', res.registrant.country || "NA", true)
                                .addField('Registrant\'s phone', res.registrant.phone || "NA", true)
                                .addField('Registrant\'s fax', res.registrant.fax || "NA", true)
                                .addField('Registrant\'s email', res.registrant.email || "NA", true)
                        }
                        if (res.registrar != undefined) {
                            embed.addField('\u200b', '\u200b')
                                .addField('Registrar\'s IANA ID', res.registrar.iana_id || "NA", true)
                                .addField('Registrar\'s Name', res.registrar.name || "NA", true)
                                .addField('Registrar\'s URL', res.registrar.url || "NA", true)
                        }
                        embed.setTimestamp()
                            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
                        message.channel.send(embed);
                    }
                    if (args[1] == "dbg.true")
                        message.channel.send(data);
                });

            }).on("error", (err) => {
                message.channel.send(createError("Error!\n" + err.message));
            });
        } else {
            return message.channel.send(createError("No URL given!"));
        }
    } else if (command === 'm.play') {
        function play(connection, message) {
            var server = servers[message.guild.id];
            if (!server) {
                connection.disconnect();
                return message.channel.send(createWarning("No link in queue.\nDisconnecting."));
            }
            getYoutubeTitle(getYTID(server.queue[0]), function(err, title) {
                message.channel.send(createSuccess("Now playing " + title, ""));
            });
            server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));
            server.queue.shift();
            server.dispatcher.on("finish", function() {
                if (server.queue[0])
                    play(connection, message);
                else
                    connection.disconnect();
            });
        }
        message.delete();
        if (!args[0])
            return message.channel.send(createWarning("No YouTube link given!"));

        if (!checkYT(args[0]))
            return message.channel.send(createWarning("Not a valid YouTube link!"));

        if (!message.member.voice.channel)
            return message.channel.send(createWarning("You are not in a voice channel!"));

        if (!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];
            server.queue.push(args[0]);
            message.member.voice.channel.join().then(function(connection) {
                play(connection, message);
            });
        } else {
            var server = servers[message.guild.id];
            server.queue.push(args[0]);
            return message.channel.send(createSuccess("Added video to queue", ""));
        }
    } else if (command === 'm.skip') {
        message.delete();
        if (servers[message.guild.id]) {
            var server = servers[message.guild.id];
            if (server.dispatcher && message.member.voice.channel)
                server.dispatcher.end();
        } else if (message.member.voice.channel) {
            var server = servers[message.guild.id];
            if (server.dispatcher)
                server.dispatcher.end();
            message.guild.voice.connection.disconnect();
            servers[message.guild.id] = undefined;
            return message.channel.send(createSuccess("Disconnected from voice channel", ""));
        }
    } else if (command === 'm.stop') {
        message.delete();
        if (message.member.voice.channel && servers[message.guild.id]) {
            var server = servers[message.guild.id];
            if (server.dispatcher)
                server.dispatcher.end();
            message.guild.voice.connection.disconnect();
            servers[message.guild.id] = undefined;
            return message.channel.send(createSuccess("Disconnected from voice channel", ""));
        }
    } else if (command === 'poll') {
        if (!args) {
            return;
        }
        var ping = "";
        if (args[0] === "everyone" || args[0] === "here") {
            var poll = args.splice(1).join(" ");
            ping = args[0];
        } else
            var poll = args.join(" ");
        const embed = new Discord.MessageEmbed()
            .setColor('#00ff00')
            .setTitle("📓 - Poll!")
            .setDescription(poll)
            .setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        if (ping && message.member.hasPermission("MENTION_EVERYONE"))
            message.channel.send("@" + ping).then(mes => mes.delete());
        message.channel.send(embed).then(mes => {
            mes.react("👍");
            mes.react("👎");
            message.delete();
        });
    } else if (command === 'settings') {
        const embed = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setTitle('Bot settings')
            .setDescription("**Remember! If you want to modify the bot's settings for this server you'll need to be the owner!**")
            .addField('Link to the dashboard:', 'https://dash.macedon.ga/')
            .setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        message.channel.send(embed);
    } else if (command === 'settings.get') {
        const embed = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setTitle('The settings for this server are:');
        if (settings[message.guild.id][0].lmgtfy === "true")
            embed.addField('Is LMGTFY activated?', "`YES`");
        else
            embed.addField('Is LMGTFY activated?', "`NO`");
        if (settings[message.guild.id][0].wm != null)
            embed.addField('Are goodbye/welcome messages activated?', "`YES`", true)
            .addField('In which channel?', `\`${settings[message.guild.id][0].wm.name}\``, true)
        else
            embed.addField('Are goodbye/welcome messages activated?', "`NO`");
        if (settings[message.guild.id][0].listing != null)
            embed.addField('Is "Listing" enabled for this server?', "`YES`", true)
            .addField('In which category?', `\`${settings[message.guild.id][0].listing.name}\``, true)
        else
            embed.addField('Is "Listing" enabled for this server?', "`NO`");
        embed.setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        message.channel.send(embed);
    } else if (settings[message.guild.id][0].lmgtfy === "true") {
        if (neuralnetwork.isQuestion(message.content)) {
            const lmgtfy = new URL("https://lmgtfy.com/");
            lmgtfy.searchParams.append("q", message.content);
            lmgtfy.searchParams.append("s", "d");
            message.channel.send(lmgtfy.href);
        }
    }
});

client.on('guildMemberRemove', member => {
    client.user.setPresence({
        activity: {
            name: `over ${client.users.cache.size} users`,
            type: 3
        }
    });
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
    client.user.setPresence({
        activity: {
            name: `over ${client.users.cache.size} users`,
            type: 3
        }
    });
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

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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