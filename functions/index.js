const functions = require('firebase-functions');
const SlackBot = require('slackbots');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
exports.sendMessage = functions.database.ref('/notificationLog/{messageId}/')
.onCreate((snapshot, context) => {

  const original = snapshot.val();
  console.log('received message', context.params.messageId, original);
  let bot = new SlackBot({
    token: 'xoxb-449331460291-451824055221-1sp5BeSxnYlndFzCgEUTHAQy', // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'hyphen-hacks-team'
  });
  bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
      icon_emoji: ':cat:'
    };



    // define existing username instead of 'user_name'
    bot.postMessageToUser('Ronan', `${original.title}. ${original.message}`, params);

  });
  return snapshot.val()
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
