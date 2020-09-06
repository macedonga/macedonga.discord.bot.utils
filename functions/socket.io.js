var request = require('request');
var socket = require('socket.io-client')('https://api.macedon.ga');
const { settings } = require('../data/variables');

function SetSocket() {
    socket.on('settings update', function(data) {
        request.post('https://api.macedon.ga/mdbu/settings/get', { json: { sid: data } }, function(error, response, body) {
            if (body[0].sid) {
                settings[data] = [];
                settings[data].push(body[0]);
            }
        });
    });

    socket.on('get channels', function(data) {
        try {
            var guild = client.guilds.cache.get(data);
            var ch = {};
            guild.channels.cache.forEach(channel => {
                if (channel.type === "text")
                    ch[channel.id] = {
                        name: channel.name
                    };
            });
            socket.emit('return channels', ch);
        } catch {
            socket.emit('error');
        }
    });

    socket.on('get categories', function(data) {
        try {
            var guild = client.guilds.cache.get(data);
            var ch = {};

            guild.channels.cache.forEach(channel => {
                if (channel.type === "category")
                    ch[channel.id] = {
                        name: channel.name
                    };
            });
            socket.emit('return categories', ch);
        } catch {
            socket.emit('error');
        }
    });
}

module.exports = { SetSocket };