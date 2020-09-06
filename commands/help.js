const Discord = require('discord.js');
let help = require('../data/help.json');

module.exports = {
    name: 'help',
    description: 'Returns a help message.',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('#5050ff')
            .setTitle("Help")
            .setDescription("*The arguments inside `<>` are not required.*")
            .addField('`Fun`', '😂', true)
            .addField('`Utilities`', '🧰', true)
            .addField('`Server`', '💻', true)
            .addField('`Moderation`', '🔨', true)
            .addField('`Music`', '🎵', true)
            .setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        message.channel.send(embed).then((msg) => {
            msg.react('🏠').then(() => msg.react('😂').then(() => msg.react('🧰')).then(() => msg.react('💻')).then(() => msg.react('🔨')).then(() => msg.react('🎵')).then(() => {
                const filter = (reaction, user) => {
                    return ['🏠', '😂', '🧰', '💻', '🔨', '🎵'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                const collector = msg.createReactionCollector(filter, { time: 30000 });
                collector.on('collect', (reaction, user) => {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#5050ff')
                        .setTitle("Help")
                        .setDescription("*The arguments inside `<>` are not required.*")
                        .setTimestamp()
                        .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
                    if (reaction.emoji.name === '🏠')
                        embed.addField('`Fun`', '😂', true)
                        .addField('`Utilities`', '🧰', true)
                        .addField('`Server`', '💻', true)
                        .addField('`Moderation`', '🔨', true)
                        .addField('`Music`', '🎵', true)
                    else if (reaction.emoji.name === '😂')
                        help["fun"].forEach(cmd => {
                            embed.addField(cmd.name, cmd.description)
                        });
                    else if (reaction.emoji.name === '🧰')
                        help["utilities"].forEach(cmd => {
                            embed.addField(cmd.name, cmd.description)
                        });
                    else if (reaction.emoji.name === '💻')
                        help["server"].forEach(cmd => {
                            embed.addField(cmd.name, cmd.description)
                        });
                    else if (reaction.emoji.name === '🔨')
                        help["moderation"].forEach(cmd => {
                            embed.addField(cmd.name, cmd.description)
                        });
                    else if (reaction.emoji.name === '🎵')
                        help["music"].forEach(cmd => {
                            embed.addField(cmd.name, cmd.description)
                        });
                    msg.edit(embed);
                    try { reaction.users.remove(message.author.id); } catch {}
                });
                collector.on('end', collected => {
                    try {
                        msg.delete();
                        message.delete();
                    } catch {}
                });
            }));
        });


    },
};