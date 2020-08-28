const Discord = require('discord.js');

function createError(error) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle('Error!')
        .setDescription(error)
        .setTimestamp()
        .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
    return embed;
}

function createWarning(warning) {
    const embed = new Discord.MessageEmbed()
        .setColor('#ffff00')
        .setTitle('Warning!')
        .setDescription(warning)
        .setTimestamp()
        .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
    return embed;
}

function createSuccess(title, success) {
    const embed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setTitle(title)
        .setDescription(success)
        .setTimestamp()
        .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
    return embed;
}

function checkYT(link) {
    if (link.includes("youtube.com/watch?v=") || link.includes("www.youtube.com/watch?v="))
        return true;
    return false;
}

function getYTID(link) {
    return link.split('v=')[1];
}

module.exports = { createError, createWarning, createSuccess, checkYT, getYTID };