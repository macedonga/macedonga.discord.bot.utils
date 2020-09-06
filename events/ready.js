const { settings } = require('../data/variables');
var request = require('request');

module.exports = (client, message) => {
    client.guilds.cache.forEach(guild => {
        var jData = { sid: guild.id, uid: guild.owner.user.id, key: process.env.KEY }
        request.post('https://api.macedon.ga/mdbu/server/check', { json: { sid: guild.id } }, function(error, response, body) {
            if (!error && response.statusCode == 200)
                if (!body.connected)
                    request.post('https://api.macedon.ga/mdbu/server/add', { json: jData }, function(error, response, body) {});
                else
                    request.post('https://api.macedon.ga/mdbu/settings/get', { json: { sid: guild.id } }, function(error, response, body) {
                        if (body[0].sid) {
                            settings[guild.id] = [];
                            settings[guild.id].push(body[0]);
                        }
                    });
        });
    });
    client.user.setPresence({ activity: { name: "for " + process.env.PREFIX + "help", type: 2 } });
    console.log("Ready!");
};