const { createWarning, createSuccess } = require('../utils/functions');
const { music } = require('../data/variables');

module.exports = {
    name: 'm.skip',
    description: 'Skips music.',
    guildOnly: true,
    execute(message, args) {
        message.delete();
        if (music[message.guild.id]) {
            var server = music[message.guild.id];
            if (server.dispatcher && message.member.voice.channel)
                server.dispatcher.end();
        } else if (message.member.voice.channel) {
            var server = music[message.guild.id];
            if (server.dispatcher)
                server.dispatcher.end();
            message.guild.voice.connection.disconnect();
            music[message.guild.id] = undefined;
            return message.channel.send(createSuccess("Disconnected from voice channel", ""));
        }
    },
};