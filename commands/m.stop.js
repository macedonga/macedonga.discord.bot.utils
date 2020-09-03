const { createSuccess } = require('../utils/functions');
const { music } = require('../data/variables');

module.exports = {
    name: 'm.stop',
    description: 'Stops music.',
    guildOnly: true,
    execute(message, args) {
        message.delete();
        if (message.member.voice.channel && music[message.guild.id]) {
            var server = music[message.guild.id];
            if (server.dispatcher)
                server.dispatcher.end();
            message.guild.voice.connection.disconnect();
            music[message.guild.id] = undefined;
            return message.channel.send(createSuccess("Disconnected from voice channel", ""));
        }
    },
};