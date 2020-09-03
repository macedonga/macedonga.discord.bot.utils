const Discord = require('discord.js');

module.exports = {
    name: 'poll',
    description: 'Creates a poll.',
    guildOnly: true,
    execute(message, args) {
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
    },
};