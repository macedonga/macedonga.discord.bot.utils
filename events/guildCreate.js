const Discord = require('discord.js');

module.exports = (client, member) => {
    request.post('https://api.macedon.ga/mdbu/server/check', { json: { sid: guild.id } }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (!body.connected)
                request.post('https://api.macedon.ga/mdbu/server/add', { json: { sid: guild.id, uid: guild.owner.user.id, key: process.env.KEY } });
        }
    });
};