const { createError } = require('../utils/functions');
const https = require('https');

module.exports = {
    name: 'insult',
    description: 'Insult a user.',
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(createWarning("You didn't tell me who to insult!"));
        } else {
            https.get('https://insult.mattbas.org/api/insult', (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    const taggedUser = message.mentions.users.first();
                    message.channel.send(taggedUser.username + " " + data.toLowerCase() + ".");
                });
            }).on("error", (err) => {
                message.channel.send(createError("Error!\n" + err.message));
            });
        }
    },
};