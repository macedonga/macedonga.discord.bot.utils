const Discord = require('discord.js');

var music = {};
var settings = {};
const cooldowns = new Discord.Collection();

module.exports = { settings, music, cooldowns };