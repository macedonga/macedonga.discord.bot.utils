const { createError } = require('../utils/functions');
const https = require('https');
const Discord = require('discord.js');

module.exports = {
    name: 'meme',
    description: 'Sends a meme.',
    execute(message, args) {
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
    },
};