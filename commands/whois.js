const { createError } = require('../utils/functions');
const https = require('https');
const Discord = require('discord.js');

module.exports = {
    name: 'whois',
    cooldown: 5,
    description: 'Returns whois data.',
    execute(message, args) {
        if (args[0] != undefined) {
            var domain = args[0];
            https.get('https://api.ip2whois.com/v1?key=free&domain=' + domain, (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    var res = JSON.parse(data);
                    if (res.error_code != "")
                        return message.channel.send(createError("The API returned an error!\n`" + res.error_message + "`"));
                    else {
                        const embed = new Discord.MessageEmbed()
                            .setTitle("WHOIS info for " + domain)
                            .setDescription('By https://ip2whois.com/ • *`NA` means "Not Available"*')
                            .addField('Domain ID', res.domain_id || "NA")
                            .addField('Status', res.status || "NA")
                            .addField('\u200b', '\u200b')
                            .addField('Created', res.create_date || "NA", true)
                            .addField('Update date', res.update_date || "NA", true)
                            .addField('Expiring date', res.expire_date || "NA", true)
                            .addField('Domain age', res.domain_age || "NA", true)
                            .addField('\u200b', '\u200b')
                            .addField('Nameservers', res.nameservers || "NA", true);
                        if (res.registrant != undefined) {
                            embed.addField('\u200b', '\u200b')
                                .addField('Registrant\'s name', res.registrant.name || "NA", true)
                                .addField('Registrant\'s organization', res.registrant.organization || "NA", true)
                                .addField('Registrant\'s street address', res.registrant.street_address || "NA", true)
                                .addField('Registrant\'s city', res.registrant.city || "NA", true)
                                .addField('Registrant\'s region', res.registrant.region || "NA", true)
                                .addField('Registrant\'s zip code', res.registrant.zip_code || "NA", true)
                                .addField('Registrant\'s country', res.registrant.country || "NA", true)
                                .addField('Registrant\'s phone', res.registrant.phone || "NA", true)
                                .addField('Registrant\'s fax', res.registrant.fax || "NA", true)
                                .addField('Registrant\'s email', res.registrant.email || "NA", true)
                        }
                        if (res.registrar != undefined) {
                            embed.addField('\u200b', '\u200b')
                                .addField('Registrar\'s IANA ID', res.registrar.iana_id || "NA", true)
                                .addField('Registrar\'s Name', res.registrar.name || "NA", true)
                                .addField('Registrar\'s URL', res.registrar.url || "NA", true)
                        }
                        embed.setTimestamp()
                            .setFooter('Made by macedonga#5526', 'https://cdn.macedon.ga/p.n.g.r.png');
                        message.channel.send(embed);
                    }
                    if (args[1] == "dbg.true")
                        message.channel.send(data);
                });

            }).on("error", (err) => {
                message.channel.send(createError("Error!\n" + err.message));
            });
        } else {
            return message.channel.send(createError("No URL given!"));
        }
    },
};