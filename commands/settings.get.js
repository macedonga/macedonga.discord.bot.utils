const Discord = require('discord.js');
const { settings } = require('../data/variables');

module.exports = {
    name: 'settings.get',
    description: 'Returns guild settings.',
    guildOnly: true,
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setTitle('The settings for this server are:');
        if (settings[message.guild.id][0].lmgtfy === "true")
            embed.addField('Is LMGTFY activated?', "`YES`");
        else {
            embed.addField('\u200B', '\u200B')
                .addField('Is LMGTFY activated?', "`NO`");
        }
        if (settings[message.guild.id][0].wm != null)
            embed.addField('\u200B', '\u200B')
            .addField('Are goodbye/welcome messages activated?', "`YES`", true)
            .addField('In which channel?', `\`${settings[message.guild.id][0].wm.name}\``, true)
        else {
            embed.addField('\u200B', '\u200B')
                .addField('Are goodbye/welcome messages activated?', "`NO`");
        }
        if (settings[message.guild.id][0].listing != null)
            embed.addField('\u200B', '\u200B')
            .addField('Is "Listing" enabled for this server?', "`YES`", true)
            .addField('In which category?', `\`${settings[message.guild.id][0].listing.name}\``, true)
        else {
            embed.addField('\u200B', '\u200B')
                .addField('Is "Listing" enabled for this server?', "`NO`");
        }
        if (settings[message.guild.id][0].review != null)
            embed.addField('\u200B', '\u200B')
            .addField('Are reviews enabled for this server?', "`YES`", true)
            .addField('In which channel?', `\`${settings[message.guild.id][0].review.name}\``, true)
        else {
            embed.addField('\u200B', '\u200B')
                .addField('Are reviews enabled for this server?', "`NO`");
        }
        embed.setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        message.channel.send(embed);
    },
};