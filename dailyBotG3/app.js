const mysql = require('mysql');


Object.prototype.parseSqlResult = function () {
    return JSON.parse(JSON.stringify(this[0]))
}

const { Client, Intents, MessageEmbed } = require('./node_modules/discord.js');


//require('./slashCmd.js');

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})


//connection à la base de données
const { host, user, password, database } = require('./config.json');

const con = mysql.createConnection(
    {
        host,
        user,
        password,
        database
    }
);

console.log(new Date().toLocaleString() + " : Connecting to database...");


bot.on('message', interaction => {

    //insertion dans la table daily
    if (interaction.content.startsWith("!commands")) {

        const ListDailyEmbed = new MessageEmbed()
            .setColor('#559944')
            .setTitle('commandes')
            .setDescription('Voici les commandes disponibles:')
            .setThumbnail('https://s1.qwant.com/thumbr/0x380/9/e/4ff77020d6b88ff4a61a3c0b54b4849c270eb414646306adf16d838b5760cd/639081-icone-de-signe-de-point-d-39-interrogation-gratuit-vectoriel.jpg?u=https%3A%2F%2Fstatic.vecteezy.com%2Fti%2Fvecteur-libre%2Fp2%2F639081-icone-de-signe-de-point-d-39-interrogation-gratuit-vectoriel.jpg&q=0&b=1&p=0&a=0')
            .addFields(

                { name: '!dailyAdd <daily> :', value: 'Ajoute un daily' },
                { name: '!dailyList :', value: 'Affiche les dailys' },
                { name: '!dailyDelete <daily> :', value: 'Supprime un daily' }

            )
            .setTimestamp()
            .setFooter({ text: 'commandes' });

        interaction.channel.send({ embeds: [ListDailyEmbed] });
    }
});

bot.on('message', interaction => {
    //insertion dans la table daily
    if (interaction.content.startsWith("!dailyAdd")) {

        let tab = interaction.content
        console.log(tab);
        let daily = tab.replace('!dailyAdd ', '');
        console.log(tab);

        interaction.channel.send("Votre daily est:\n" + daily);
        let date_upload = new Date().toLocaleDateString();
        console.log(date_upload);

        con.query("INSERT INTO `dailydiscord`( `daily_text`, `date_upload`) VALUES ('" + daily.toString() + "','" + date_upload + "');", function (err, result) {
            if (err) throw err;
            console.log(result);
        });

    }

});



bot.on('message', interaction => {

    if (interaction.content.startsWith("!dailyList")) {
        //affichage de la liste des dailys

        con.query("SELECT * FROM dailydiscord;", function (err, results) {
            if (err) throw err;
            console.log(results);

            const listdaily = [];

            for (let i = 0; i < results.length; i++) {
                listdaily.push(results[i].ID + "-    " + results[i].daily_text + "\n" + results[i].date_upload);

            }

            // inside a command, event listener, etc.
            const ListDailyEmbed = new MessageEmbed()
                .setColor('#559944')
                .setTitle('Liste des daily')
                .setDescription('Voici la liste des dailys')
                .setThumbnail('https://s2.qwant.com/thumbr/0x380/f/0/704918664351ef1c339de920426f07cc75e8b54dd8e578014f6a5153e8c1f0/674-.jpg?u=https%3A%2F%2Fcmkt-image-prd.global.ssl.fastly.net%2F0.1.0%2Fps%2F1151587%2F4167%2F4167%2Fm1%2Ffpnw%2Fwm0%2F674-.jpg%3F1459864047%26s%3D0f9e6c0b3364f2956a05e70c83280b16&q=0&b=1&p=0&a=0')
                .addFields(

                    { name: 'Liste des dailys', value: listdaily.join('\n') }

                )
                .setTimestamp()
                .setFooter({ text: 'Liste dailys' });

            interaction.channel.send({ embeds: [ListDailyEmbed] });
        });


    }

});

bot.on('message', interaction => {
    //insertion dans la table daily
    if (interaction.content.startsWith("!dailyDel")) {

        let tab = interaction.content;
        let daily = tab.replace('!dailyDel ', '');


        con.query("DELETE FROM `dailydiscord` WHERE `ID` = '" + daily + "';", function (err, result) {
            if (err) throw err;


            console.log(result);
            console.log("\n" + daily);

            if (result.affectedRows == 0) {
                interaction.channel.send("Daily non trouvé");
            }
            else {
                interaction.channel.send("Daily " + daily.toString() + " supprimé");
            }
        });


    }

});

bot.on('ready', function (message) {
    //envoi un message dans le channel tout les 24 heures

    setInterval(() => message.channels.cache.get('943095705621397530').send('n\'oubliez pas de partager votre daily avec la commande !daily <votre daily>'), 1000 * 60 * 60 * 24);

});


bot.config = require("./config.json");

bot.login(bot.config.token);