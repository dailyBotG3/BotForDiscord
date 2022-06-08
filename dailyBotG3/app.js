const mysql = require('mysql');
const config = require('./config.json');


Object.prototype.parseSqlResult = function () {
    return JSON.parse(JSON.stringify(this[0]))
}

const { Client, Intents, MessageEmbed } = require('discord.js');


const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

//connection à la base de données

const con = mysql.createConnection(
    {
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_DATABASE
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
                { name: '!dailyList :', value: 'Affiche les daily' },
                { name: '!dailyDelete <daily> :', value: 'Supprime un daily' }

            )
            .setTimestamp()
            .setFooter({ text: 'commandes' });

        interaction.channel.send({ embeds: [ListDailyEmbed] });
    }
});

bot.on('message', interaction => {
    //insertion dans la table daily
    if (interaction.content.startsWith("!dailyadd")) {

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

    if (interaction.content.startsWith("!dailylist")) {
        //affichage de la liste des daily

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
                .setDescription('Voici la liste des daily')
                .setThumbnail('https://s2.qwant.com/thumbr/0x380/f/0/704918664351ef1c339de920426f07cc75e8b54dd8e578014f6a5153e8c1f0/674-.jpg?u=https%3A%2F%2Fcmkt-image-prd.global.ssl.fastly.net%2F0.1.0%2Fps%2F1151587%2F4167%2F4167%2Fm1%2Ffpnw%2Fwm0%2F674-.jpg%3F1459864047%26s%3D0f9e6c0b3364f2956a05e70c83280b16&q=0&b=1&p=0&a=0')
                .addFields(

                    { name: 'Liste des daily', value: listdaily.join('\n') }

                )
                .setTimestamp()
                .setFooter({ text: 'Liste daily' });

            interaction.channel.send({ embeds: [ListDailyEmbed] });
        });


    }

});

bot.on('message', interaction => {
    //insertion dans la table daily
    if (interaction.content.startsWith("!dailydel")) {

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
    //envoi un rappel dans le channel tout les 24 heures

    setInterval(() => message.channels.cache.get('943095705621397530').send('n\'oubliez pas de partager votre daily avec la commande !daily <votre daily>'), 1000 * 60 * 60 * 24);

});

bot.on('message', interaction => {
    //insertion dans la table daily
    if (interaction.content.startsWith("!quizz")) {

        const https = require('https');
        const decode = require('./node_modules/decode-html/index.js');


        var options = {
            'method': 'GET',
            'hostname': 'opentdb.com',
            'path': '/api.php?amount=1',
            'headers': {
                'Cookie': 'PHPSESSID=56d9c232faf370d3003a22ef0971ff8f'
            },
            'maxRedirects': 20
        };
        let req = https.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {


                const data = JSON.parse(Buffer.concat(chunks));


                let question = data.results[0].question;

                let Vreponse = data.results[0].correct_answer;

                let reponses = [Vreponse];

                data.results[0].incorrect_answers.forEach(element => {

                    reponses.push(element);

                });

                let listResponse = [];

                for (let i = 0; i < reponses.length; i++) {
                    listResponse.push("-    " + reponses[i] + "\n");

                }

                // Embed du Quizz
                const QuizzEmbed = new MessageEmbed()
                    .setColor('#559944')
                    .setTitle(decode(question))
                    .setThumbnail('https://s1.qwant.com/thumbr/0x380/b/0/30cb1a29e554de34a2602f3696d2f4cca3ea41dd5dc45677e343a80be76170/logo-quiz-symbole-icone-questionnaire-sondage_101884-1076.jpg?u=https%3A%2F%2Fimage.freepik.com%2Fvecteurs-libre%2Flogo-quiz-symbole-icone-questionnaire-sondage_101884-1076.jpg&q=0&b=1&p=0&a=0')
                    .addFields(

                        { name: 'Voici les réponses', value: listResponse.join('\n') }

                    )
                    .setTimestamp()
                    .setFooter({ text: 'Quizz' });

                interaction.channel.send({ embeds: [QuizzEmbed] });


            });

            res.on("error", function (error) {
                console.error(error);
            });
        });
        req.end();

    }
});


bot.login(config.TOKEN).catch((err) => {
    bot.logger.error(err);
});
