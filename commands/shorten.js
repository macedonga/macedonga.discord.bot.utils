const { createError, createSuccess } = require('../utils/functions');
const https = require('https');
const Discord = require('discord.js');

module.exports = {
    name: 'shorten',
    cooldown: 15,
    description: 'Shortens an URL.',
    execute(message, args) {
        var url = args[0];
        var slug = args[1];

        if (url == undefined)
            return message.channel.send(createError("No URL given!"));
        var json;
        if (slug != undefined)
            json = { url: url, slug: slug }
        else
            json = { url: url }

        const data = JSON.stringify(json);

        const options = {
            hostname: 's.mcdn.ga',
            path: '/url',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                var res = JSON.parse(data);
                if (data.includes("num")) {
                    if (res.num === "001")
                        return message.channel.send(createError("The slug you given is already in use!"));
                    else if (res.num === "002")
                        return message.channel.send(createError("No."));
                    else
                        return message.channel.send(createError("Invalid slug/URL!"));
                } else
                    return message.channel.send(createSuccess("Succesfully shortened the URL " + res.url, "https://s.mcdn.ga/" + res.slug));
            });
        }).on("error", (err) => {
            message.channel.send(createError("Error!\n" + err.message));
        });
        req.write(data);
        req.end();
    },
};