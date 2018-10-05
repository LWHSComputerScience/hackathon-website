const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('fast-csv')
// PATHS TO CSVs TO UPLOAD HERE!!
// attendees
let students = fs.createReadStream("./private/attendees.csv");
// volunteers
//let teachers = fs.createReadStream("./private/volunteers.csv");
let studentData = []
let teacherData = []
const serviceAccount = require("./private/auth.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hyphenhacks-dc851.firebaseio.com"
});
let db = admin.database();
let atendeesDB = db.ref("/attendeeDB/attendees");
let studentsStream = csv()
.on("data", function(row){
  console.log(row);
  row.push('student')
  studentData.push(row)
  atendeesDB.push().set(row)

})
.on("end", function(){
  console.log("done");
  fs.writeFile("./private/attendees.json", JSON.stringify(studentData), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});
let teacherStream = csv()
.on("data", function(row){
  console.log(row);
  row.push('student')
  teacherData.push(row)

})
.on("end", function(){
  console.log("done");
  fs.writeFile("./private/volunteers.json", JSON.stringify(teacherData), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
    console.log('DB Cleared');
    process.exit(0);
  });
});

students.pipe(studentsStream);
//teachers.pipe(teacherStream);