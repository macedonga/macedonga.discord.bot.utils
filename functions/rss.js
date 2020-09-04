const Discord = require('discord.js');
const { settings } = require('../data/variables');
let Parser = require('rss-parser');
let parser = new Parser({ maxRedirects: 100 });
var TurndownService = require('turndown')

var turndownService = new TurndownService()
var rss = [];

function UpdateRSS(guild) {
    try {
        if (settings[guild.id][0].rss != null) {
            parser.parseURL(settings[guild.id][0].rss.link, function(err, feed) {
                const rssch = guild.channels.cache.get("751036271924740146");
                if (rss[guild.id].feed != feed) {
                    var size = 10;
                    var newFeed = feed.items.slice(0, size);
                    var oldFeed = rss[guild.id].feed.items.slice(0, size);
                    var ind = 0;
                    newFeed.forEach((entry, index) => {
                        if (oldFeed[index + ind] != undefined)
                            if (entry.link != oldFeed[index + ind].link) {
                                var content = turndownService.turndown(entry.content);
                                var title = turndownService.turndown(entry.title);
                                const embed = new Discord.MessageEmbed()
                                    .setColor('#0000ff')
                                    .setAuthor("by " + entry.author)
                                    .setTitle(title)
                                    .setURL(entry.link)
                                    .addField('\u200B', content)
                                    .setTimestamp()
                                    .setFooter(feed.title);
                                rssch.send(embed);
                                ind = ind - 1;
                            }
                    });
                    rss[guild.id] = { feed: feed };
                }
            });
        }
    } catch {}
}

function GetRSS(guilds) {
    setTimeout(function() {
        guilds.forEach(guild => {
            if (settings[guild.id][0].rss != null)
                parser.parseURL(settings[guild.id][0].rss.link, function(err, feed) {
                    rss[guild.id] = { feed: feed };
                    setInterval(function() {
                        UpdateRSS(guild)
                    }, 300000)
                });
        });
    }, 2000);
}

function AddRSS(guild) {
    if (settings[guild.id][0].rss != null)
        parser.parseURL(settings[guild.id][0].rss.link, function(err, feed) {
            rss[guild.id] = { feed: feed };
            setInterval(function() {
                UpdateRSS(guild)
            }, 300000)
        });
}
module.exports = { GetRSS, UpdateRSS, AddRSS };