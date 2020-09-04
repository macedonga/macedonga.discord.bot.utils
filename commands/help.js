const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Returns a help message.',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setTitle("Help")
            .setDescription("*The arguments inside `<>` are not required.*")
            .addField('**`mb.ban @user <DAYS> <REASON>`**', 'Bans a member.\n`<DAYS>`: Must be a value from 1 to 7. Default is 7.\n*You need the `BAN_MEMBERS` permission.*')
            .addField('**`mb.kick @user <REASON>`**', 'Kicks a member.\n*You need the `KICK_MEMBERS` permission.*')
            .addField('**`mb.purge 1-99`**', 'Purges messages in the channel.\n*You need the `MANAGE_MESSAGES` permission.*')
            .addField('**`mb.meme`**', 'Returns a meme from `r/memes`, `r/dankmemes`, `r/meme` or `r/meirl`')
            .addField('**`mb.insult @user`**', 'Insults the specified user.')
            .addField('**`mb.shorten https://link.com <SLUG>`**', 'Shortens the given URL.\n`<SLUG>`: the id of the shortened URL.')
            .addField('**`mb.whois https://link.com <dbg.true>`**', 'Returns WHOIS info about the domain.\n`<dbg.true>`: returns the json response from the API. Debugging purposes only!')
            .addField('**`mb.poll <everyone> <here> POLL`**', 'Creates a poll and pings **here** or **everyone** if specified.\n*You need the `MENTION_EVERYONE` permission to be able to ping **here** or **everyone**.*')
            .addField('**`mb.m.play https://youtube.com/YT-V-ID`**', 'Plays the audio from the given YouTube video or adds the video to the queue.', true)
            .addField('**`mb.m.skip`**', 'Skips to the next video on the queue.', true)
            .addField('**`mb.m.stop`**', 'Disconnects the bot from the VC.', true)
            .addField('**`mb.settings`**', 'Returns link to the bot dashboard. **(early beta)**\n*You need the server owner to configure the dashboard*', true)
            .addField('**`mb.settings.get`**', 'Returns bot settings for this server.', true)
            .addField('**`mb.kitty`**', 'Returns a cat image.')
            .addField('**`mb.dog`**', 'Returns a dog image.')
            .addField('**`mb.quote https://discordapp.com/000/000/000 <DATE>`**', 'Creates an image with the specified message.\n`<DATE>`: adds message year after the username.')
            .addField('**`mb.review NUM_FROM_1_TO_5 REVIEW`**', 'Creates a review of the server. (if enabled)')
            .addField('**`mb.generate.qr <!dark HEX_COLOR> <!light HEX_COLOR> DATA`**', 'Creates a QR code with the given data.\n`<!dark HEX_COLOR>`: sets dark color to the given hex color (if valid)\n`<!light HEX_COLOR>`: sets light color to the given hex color (if valid)')
            .addField('**`mb.decode.qr`**', 'Decodes the QR code image in the attachments.')
            .setTimestamp()
            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
        message.channel.send(embed);
    },
};