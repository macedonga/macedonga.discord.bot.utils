const Discord = require('discord.js');
const { settings } = require('../data/variables');
const { createError, createWarning, createSuccess } = require('../utils/functions');

module.exports = {
    name: 'review',
    description: 'Reviews server.',
    cooldown: 60,
    guildOnly: true,
    execute(message, args) {
        if (settings[message.guild.id][0].review != null) {
            const stars = parseInt(args[0]);
            if (isNaN(stars) || stars > 5)
                return message.channel.send(createError("Not a valid number!\nMake sure it's a number from 0 to 5"));
            var review = args.splice(1).join(" ");
            if (review === "")
                return message.channel.send(createError("No review written"));
            let starRating = "Star rating: "
            for (var i = 0; i < stars; i++)
                starRating += "⭐";

            if (stars === 0)
                starRating += "0 stars";

            const embed = new Discord.MessageEmbed()
                .setColor('#0000ff')
                .setAuthor(message.member.user.username, message.member.user.avatarURL())
                .setTitle("New review")
                .addField(review, '\u200B')
                .setTimestamp()
                .setFooter(starRating, "https://cdn.macedon.ga/p.n.g.r.png");

            const reviews = message.member.guild.channels.cache.get(settings[message.member.guild.id][0].review.id);

            reviews.send(embed);
            return message.channel.send(createSuccess("Success!", "Review sent!"));
        } else
            return message.channel.send(createWarning("The owner didn't configured reviews for this server."));
    },
};