const { createError, createWarning, createSuccess } = require('../utils/functions');

module.exports = {
    name: 'kick',
    description: 'Kicks a user',
    guildOnly: true,
    execute(message, args) {
        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (!message.mentions.users.size) {
                return message.channel.send(createWarning('You didn\'t tell me who to kick!'));
            } else {
                const taggedUser = message.mentions.users.first();
                const targetMember = message.guild.members.cache.get(taggedUser.id);
                var kick_reason = "";
                if (args[2]) {
                    kick_reason = args.splice(3).join(" ");
                } else {
                    kick_reason = "Not specified.";
                }
                targetMember.kick({ reason: kick_reason });
                setTimeout(function() {
                    if (message.guild.member(taggedUser.id)) {
                        return message.channel.send(createError('An error occured while kicking ' + taggedUser.username));
                    } else {
                        return message.channel.send(createSuccess('Succesfully kicked ' + taggedUser.username + '!', 'Reason: `' + kick_reason + '`'));
                    }
                }, 500);
            }
        } else {
            message.channel.send(createWarning("You need to have the `KICK_MEMBERS` permission!"));
        }
    },
};