const { createWarning, createSuccess, checkYT, getYTID } = require('../utils/functions');
const { music } = require('../data/variables');
const ytdl = require('ytdl-core');
const getYoutubeTitle = require('get-youtube-title')

module.exports = {
    name: 'm.play',
    description: 'Plays music.',
    guildOnly: true,
    execute(message, args) {
        function play(connection, message) {
            var server = music[message.guild.id];
            if (!server)
                return connection.disconnect();
            getYoutubeTitle(getYTID(server.queue[0]), function(err, title) {
                message.channel.send(createSuccess("Now playing " + title, ""));
            });
            server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" }));
            server.queue.shift();
            server.dispatcher.on("finish", function() {
                if (server.queue[0])
                    play(connection, message);
                else
                    connection.disconnect();
            });
        }
        message.delete();
        if (!args[0])
            return message.channel.send(createWarning("No YouTube link given!"));

        if (!checkYT(args[0]))
            return message.channel.send(createWarning("Not a valid YouTube link!"));

        if (!message.member.voice.channel)
            return message.channel.send(createWarning("You are not in a voice channel!"));

        if (!music[message.guild.id]) {
            music[message.guild.id] = {
                queue: []
            };

            var server = music[message.guild.id];
            server.queue.push(args[0]);
            message.member.voice.channel.join().then(function(connection) {
                play(connection, message);
            });
        } else {
            var server = music[message.guild.id];
            server.queue.push(args[0]);
            return message.channel.send(createSuccess("Added video to queue", ""));
        }
    },
};