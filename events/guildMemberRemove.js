const Discord = require('discord.js');
const { settings } = require('../data/variables');
const { randomRange } = require('../utils/functions');

module.exports = (client, member) => {
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
        try {
            return welcome.send(embed);
        } catch {}
    }
};