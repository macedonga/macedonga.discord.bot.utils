const { createError, createWarning, createSuccess } = require('../utils/functions');

module.exports = {
    name: 'ban',
    description: 'Ban a user.',
    guildOnly: true,
    execute(message, args) {
        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (!message.mentions.users.size) {
                return message.channel.send(createWarning('You didn\'t tell me who to ban!'));
            } else {
                const taggedUser = message.mentions.users.first();
                const targetMember = message.guild.members.cache.get(taggedUser.id);
                var days = parseInt(args[1]);
                if (isNaN(days)) {
                    days = 7;
                }
                var ban_reason = "";
                if (args[2]) {
                    ban_reason = args.splice(3).join(" ");
                } else {
                    ban_reason = "Not specified.";
                }
                targetMember.ban({ days: days, reason: ban_reason });
                setTimeout(function() {
                    if (message.guild.member(taggedUser.id)) {
                        return message.channel.send(createError('An error occured while banning ' + taggedUser.username));
                    } else {
                        return message.channel.send(createSuccess('Succesfully banned ' + taggedUser.username + '!', 'Reason: `' + ban_reason + '`\nDays of messages deleted: `' + days + '`'));
                    }
                }, 500);
            }
        } else {
            message.channel.send(createWarning("You need to have the `BAN_MEMBERS` permission!"));
        }
    },
};