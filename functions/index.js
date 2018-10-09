const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
exports.sendMessage = functions.database.ref('/notificationLog/{messageId}/')
.onCreate((snapshot, context) => {

  const original = snapshot.val();
  console.log('received message', context.params.messageId, original);

  return snapshot.val()
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
