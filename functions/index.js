const fetch = require('node-fetch');
const functions = require('firebase-functions');
const SlackBot = require('slackbots');
let bot = new SlackBot({
  token: 'xoxb-449331460291-451824055221-1sp5BeSxnYlndFzCgEUTHAQy', // Add a bot https://my.slack.com/services/new/bot and put the token
  name: 'Hyphen-Hacks-Team'
});

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
exports.sendMessage = functions.database.ref('/notificationLog/{messageId}/')
.onCreate((snapshot, context) => {

  const original = snapshot.val();
  console.log('received message', context.params.messageId, original);

  fetch("http://example.com/api/endpoint/", {
    method: "post",
    "headers": {
      "Accept": "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
      "cache-control": "no-cache",
      "Postman-Token": "7e7dd0fa-b234-446f-acfb-b841533fcbcc"
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({
      tittle: original.title,
      body: original.message
    })
  })
  .then( (response) => {
    //do something awesome that makes the world a better place
    console.log(response, 'pushed')
  });

  let params = {

  }
  bot.getChannels().then(data => {
    console.log(data)
  })
  bot.getGroups().then(data => {
    console.log(data)
  })

  bot.postTo('announcements', `*${original.title}* ${original.message}`, params, (data) => {
    console.log(data)
  });


  return snapshot.val()
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
