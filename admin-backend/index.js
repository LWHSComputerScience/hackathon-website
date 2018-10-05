const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('fast-csv')
let students = fs.createReadStream("./private/students.csv");
//let teachers = fs.createReadStream("./private/teachers.csv");
let studentData = []
let teacherData = []
const serviceAccount = require("./private/hyphenhacks-dc851-firebase-adminsdk-au5a6-3d9ad5cb50.json");

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
  fs.writeFile("./private/students.json", JSON.stringify(studentData), function(err) {
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
  fs.writeFile("./private/students.json", JSON.stringify(teacherData), function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});

students.pipe(studentsStream);
//teachers.pipe(teacherStream);