const admin = require('firebase-admin');
const serviceAccount = require("./private/auth.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hyphenhacks-dc851.firebaseio.com"
});
let db = admin.database();
let atendeesDB = db.ref("/attendeeDB/attendees");
atendeesDB.set(null).then(() => {
  console.log('DB Cleared')
  process.exit(0)
})