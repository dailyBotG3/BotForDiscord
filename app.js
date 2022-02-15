const {Client, Intents, MessageEmbed,MessageActionRow} = require('./node_modules/discord.js');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
})


/////////!random

bot.on('message', function async (message) {
    if (message.content.startsWith("!daily")){
        
        result = message.channel.send("swfsdfws")
    }
})
////////////////


bot.config = require("./config.json");

bot.login(bot.config.token);