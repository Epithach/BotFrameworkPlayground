// Cette ligne permet de charger les variables d'environnement présentes dans le fichier .env
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Initialisation du serveur Restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Création d'un connecteur et mise en écoute des messages entrants
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Désolé je ne comprends pas votre demande : \'%s\.', session.message.text);
});

var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('Aide', function (session) {
    console.log("test");
    session.endConversation("Bonjour ! Essayez quelque chose comme: \"Donne moi la liste des acteurs !\"");
}).triggerAction({
    matches: "Aide"
});