const { createError } = require('../utils/functions');
const https = require('https');
const Discord = require('discord.js');

module.exports = {
    name: 'kitty',
    description: 'Sends a kitty image.',
    execute(message, args) {
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
    },
};