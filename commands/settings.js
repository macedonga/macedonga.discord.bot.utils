const Discord = require('discord.js');

module.exports = {
    name: 'settings',
    description: 'Returns dash link.',
    guildOnly: true,
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setTitle('Bot settings')
            .setDescription("**Remember! If you want to modify the bot's settings for this server you'll need to be the owner!**")
            .addField('Link to the dashboard:', 'https://dash.macedon.ga/')
            .setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        message.channel.send(embed);
    },
};