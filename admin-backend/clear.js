const admin = require('firebase-admin');
const serviceAccount = require("./private/auth.json");
const baseURL = 'attendeeDB/people/';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hyphenhacks-dc851.firebaseio.com"
});
let db = admin.database();
let atendeesDB = db.ref(baseURL);
atendeesDB.set(null).then(() => {
  console.log('DB Cleared')
  process.exit(0)
})