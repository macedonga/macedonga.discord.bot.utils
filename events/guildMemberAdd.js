const Discord = require('discord.js');
const { settings } = require('../data/variables');
const { randomRange } = require('../utils/functions');

module.exports = (client, member) => {
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
        try {
            return welcome.send(embed);
        } catch {}
    }
};