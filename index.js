const Discord = require('discord.js');

require('dotenv').config()
const neuralnetwork = require('./utils/neural.network');

var request = require('request');
var socket = require('socket.io-client')('https://api.macedon.ga');
const { settings } = require('./data/variables');

const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Command loaded: ${file}`);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(file.replace(".js", ""), event.bind(null, client));
    console.log(`Event loaded: ${file}`);
}

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

neuralnetwork.init();
client.login(process.env.TOKEN);