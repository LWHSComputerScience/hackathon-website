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
const db = admin.database()
const params = {
  as_user: true,
  icon_url: 'https://hyphen-hacks.com/img/logos/hyphhack.png'
}
/*
exports.addToWhitelist = functions.auth.user().onCreate((user) => {
  console.log(user)
  const email = user.email
  const uid = user.uid
  db.ref('whitelistEmails/').once('value').then((snap) => {
    if (Object.keys(snap.val()).includes(email.replace(/[@]/gi, ''))) {
      db.ref('whitelistUIDs/' + uid).set(uid)
      console.log('whitlisted')
    } else {
      console.log('not whitlisted')
    }
  })

});
*/

exports.analytics = functions.database.ref('/attendeeDB/people/').onWrite((snap, context) => {


  db.ref('/attendeeDB/people/').once('value').then(dataSnap => {
    const data = dataSnap.val()
    let analytics = {
      checkedIn: 0,
      people: 0,
      attendees: 0,
      volunteers: 0,
      onCampus: 0,
      waiverComplete: 0
    }
    if (data) {
      for (var key in data) {
        let person = data[key]
        analytics.people++
        if (person.checkedIn) {
          analytics.checkedIn++
        }
        if (person.role === 'volunteer') {
          analytics.volunteers++
        } else if (person.role === 'attendee') {
          analytics.attendees++
        }
        if (person.onCampus) {
          analytics.onCampus++
        }
        if (person.waiverComplete) {
          analytics.waiverComplete++
        }

      }
    }

    db.ref('attendeeDB/analytics').set(analytics)
    db.ref('attendeeDB/analyticsLog').push().set({
      time: Date.now(),
      data: analytics
    })
    console.log('updated analytics', analytics)
  })

  return snap.after.val()


})

exports.sendMessage = functions.database.ref('/notificationLog/{messageId}/')
.onCreate((snapshot, context) => {

  const original = snapshot.val();
  console.log('received message', context.params.messageId, original);
  if (original.mobile) {
    db.ref('tokens/').once('value').then((snap) => {
      for (let key in snap.val()) {
        if (snap.val().hasOwnProperty(key)) {
          let token = snap.val()[key].token
          fetch("https://exp.host/--/api/v2/push/send", {
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
              to: token,
              title: original.title,
              body: original.message
            })
          })
          .then((response) => {
            //do something awesome that makes the world a better place
            console.log(response, 'pushed', token)
          });
        }
      }

    })
  }

  /*
    fetch("https://exp.host/--/api/v2/push/send", {
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
        to:
        tittle: original.title,
        body: original.message
      })
    })
    .then( (response) => {
      //do something awesome that makes the world a better place
      console.log(response, 'pushed')
    });
  */
  if (original.slack) {

    /*
    bot.getChannels().then(data => {
      console.log(data)
    })
    bot.getGroups().then(data => {
      console.log(data)
    })
*/
    bot.postTo('announcements', `<!channel> *${original.title}* ${original.message}`, params, (data) => {
      console.log(data)
    });
  }


  return snapshot.val()
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
