const Discord = require('discord.js');

require('dotenv').config()
const neuralnetwork = require('./utils/neural.network');
const sockets = require('./functions/socket.io');

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

sockets.SetSocket();
neuralnetwork.init();
client.login(process.env.TOKEN);