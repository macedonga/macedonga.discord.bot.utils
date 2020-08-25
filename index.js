const Discord = require('discord.js');
const https = require('https');
require('dotenv').config()

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'kick') {
        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (!message.mentions.users.size) {
                return message.channel.send(createWarning('You didn\'t told me who to kick!'));
            } else {
                const taggedUser = message.mentions.users.first();
                const targetMember = message.guild.members.cache.get(taggedUser.id);
                targetMember.kick();
                setTimeout(function() {
                    if (message.guild.member(taggedUser.id)) {
                        return message.channel.send(createError('An error occured while kicking ' + taggedUser.username));
                    } else {
                        return message.channel.send(createSuccess('Succesfully kicked ' + taggedUser.username + '!', ''));
                    }
                }, 500);
            }
        } else {
            return message.channel.send(createWarning('You cannot kick!'));
        }
    } else if (command === 'ban') {
        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (!message.mentions.users.size) {
                return message.channel.send(createWarning('You didn\'t told me who to ban!'));
            } else {
                const taggedUser = message.mentions.users.first();
                const targetMember = message.guild.members.cache.get(taggedUser.id);
                var days = parseInt(args[0]);
                if (isNaN(days)) {
                    days = 7;
                }
                targetMember.ban({ days: days });
                setTimeout(function() {
                    if (message.guild.member(taggedUser.id)) {
                        return message.channel.send(createError('An error occured while banning ' + taggedUser.username));
                    } else {
                        return message.channel.send(createSuccess('Succesfully banned ' + taggedUser.username + '!', ''));
                    }
                }, 500);
            }
        } else {
            return message.channel.send(createWarning('You cannot ban!'));
        }
    } else if (command === 'meme') {
        https.get('https://api1-funtext.herokuapp.com/rndmemes', (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var res = JSON.parse(data);
                const embed = new Discord.MessageEmbed()
                    .setTitle(res.title)
                    .setURL(res.postLink)
                    .setImage(res.url);

                message.channel.send(embed);
            });

        }).on("error", (err) => {
            message.channel.send(createError("Error!\n" + err.message));
        });
    } else if (command === 'insult') {
        if (!message.mentions.users.size) {
            return message.channel.send(createWarning("You didn't told me who to insult!"));
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
    }
});

function createError(error) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error!')
        .setDescription(error)
        .setTimestamp()
    return embed;
}

function createWarning(warning) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ffff00')
        .setTitle('Warning!')
        .setDescription(warning)
        .setTimestamp()
    return embed;
}

function createSuccess(title, success) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle(title)
        .setDescription(success)
        .setTimestamp()
    return embed;
}

client.on('guildMemberRemove', member => {
    if (member.guild.id === 736591510413508619) {

    }
});

client.login(process.env.TOKEN);