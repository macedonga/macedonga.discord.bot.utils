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
                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('Error!')
                    .setDescription('You didn\'t told me who to kick!')
                    .setTimestamp()
                return message.channel.send(embed);
            } else {
                const taggedUser = message.mentions.users.first();
                try {
                    const targetMember = message.guild.members.cache.get(taggedUser.id);
                    targetMember.kick();
                } catch (error) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle('Error!')
                        .setDescription('I cannot kick ' + taggedUser.username)
                        .addFields({ name: 'Error', value: error })
                        .setTimestamp()
                    return message.channel.send(embed);
                }
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error!')
                .setDescription('You cannot kick ' + taggedUser.username)
                .setTimestamp()
            return message.channel.send(embed);
        }
    } else if (command === 'ban') {
        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (!message.mentions.users.size) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('Error!')
                    .setDescription('You didn\'t told me who to ban!')
                    .setTimestamp()
                return message.channel.send(embed);
            } else {
                const taggedUser = message.mentions.users.first();
                try {
                    const targetMember = message.guild.members.cache.get(taggedUser.id);
                    var days = args[1] || 7;
                    targetMember.ban({ days: days });
                } catch (error) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle('Error!')
                        .setDescription('I cannot ban ' + taggedUser.username)
                        .addFields({ name: 'Error', value: error })
                        .setTimestamp()
                    return message.channel.send(embed);
                }
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error!')
                .setDescription('You cannot ban ' + taggedUser.username)
                .setTimestamp()
            return message.channel.send(embed);
        }
    } else if (command === 'meme') {
        https.get('https://api1-funtext.herokuapp.com/rndmemes', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                var res = JSON.parse(data);
                const embed = new Discord.MessageEmbed()
                    .setTitle(res.title)
                    .setURL(res.postLink)
                    .setImage(res.url);

                message.channel.send(embed);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } else if (command === 'insult') {
        if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error!')
                .setDescription('You didn\'t told me who to insult!')
                .setTimestamp()
            return message.channel.send(embed);
        } else {
            https.get('https://insult.mattbas.org/api/insult', (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    const taggedUser = message.mentions.users.first();
                    message.channel.send(taggedUser.username + " " + data.toLowerCase() + ".");
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        }
    }
});

client.on('guildMemberRemove', member => {
    if (member.guild.id === 736591510413508619) {

    }
});

client.login(process.env.TOKEN);