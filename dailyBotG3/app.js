const mysql = require('mysql');
const { inspect } = require('util');

const con = mysql.createConnection({
    
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'daily'
});

Object.prototype.parseSqlResult = function () {
    return JSON.parse(JSON.stringify(this[0]))
}

const {Client, Intents, MessageEmbed,MessageActionRow, Interaction, Message} = require('./node_modules/discord.js');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
})


bot.on('message', interaction => {
    
    if (interaction.content.startsWith("!daily")) {
    
        let tab = interaction.content;
        let daily = tab.replace('!daily ', ' ');
        interaction.channel.send("Votre daily est:\n" + daily);
        let date_upload = new Date();
        con.connect();
        let sql = "INSERT INTO `dailydiscord`( `daily_text`, `date_upload`) VALUES ('"+ daily.toString() +"','" + date_upload.toString() +"');";
        con.query(sql, function (err, result) {
        if (err) throw err;
        
            console.log(result);
        });
        
        con.end();

    }
    
    });

    bot.on('message', interaction => {
    
        if (interaction.content.startsWith("!listdaily")) {
        
           
            sql = `SELECT * FROM dailydiscord WHERE ID=1`  ; 

            con.query(sql, (error, results) => {
                if (error) {
                return console.error(error.message);
                }
                
                results = JSON.parse(results);

                console.log(results.RowDataPacket[0].daily_text);
                
                   }
                
                //interaction.channel.send(require('util').inspect(results));
            );
            con.end(); 
            
        }
        
        });
  
    bot.on('ready', function(message) {
        
        setInterval(() => message.channels.cache.get('943095705621397530').send('n\'oubliez pas de partager votre daily avec la commande !daily <votre daily>'), 1000*60*60*24);
        
    });


    
    
    
        
    
    
    





                    

                    
        
    


        
    
    bot.config = require("./config.json");

    bot.login(bot.config.token);