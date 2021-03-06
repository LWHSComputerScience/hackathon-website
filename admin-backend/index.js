const admin = require('firebase-admin');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const csv = require('fast-csv')
// PATHS TO CSVs TO UPLOAD HERE!!
// attendees
let students = fs.createReadStream("./private/attendees.csv");
let resgistrations = fs.createReadStream("./private/registrations");
// volunteers
let registrationData = {}
let teachers = fs.createReadStream("./private/volunteers.csv");
let studentData = {}
let teacherData = {}
const baseURL = 'attendeeDB/people/'
const serviceAccount = require("./private/auth.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hyphenhacks-dc851.firebaseio.com"
});
let db = admin.database();

let studentsStream = csv()
.on("data", function (row) {
  let id = uuidv1();
  let person = {
    Timestamp: row[0],
    email: row[2],
    name: row[3],
    phone: row[4],
    DOB: row[5],
    levelOfStudy: row[6],
    graduationYear: row[7],
    school: row[8],
    gender: row[9],
    shirtSize: row[10],
    race: row[11],
    interestedMajor: row[12],
    dietaryRestrictions: row[13],
    specialNeeds: row[14],
    compsciHistory: row[15],
    role: 'attendee',
    waiverComplete: false,
    checkedIn: false,
    onCampus: false,
    id: id
  }
  if (person.name !== "Name") {

    db.ref(baseURL + id).set(person)
    studentData[id] = person;
  }


})
.on("end", function () {
  console.log("done");
  fs.writeFile("./private/attendees.json", JSON.stringify(studentData), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});
let teacherStream = csv()
.on("data",  (row) => {
  console.log(row);
  let id = uuidv1();

  if (!row[5]) {
    row[5] = "NA"
  }
  console.log(id)
  let person = {
    name: row[1] + ' ' + row[0],
    first: row[1],
    last: row[0],
    relationship: row[2],
    email: row[3],
    phone: row[4],
    role: 'volunteer',
    waiverComplete: false,
    checkedIn: false,
    onCampus: false,
    id: id
  }
  if (person.phone == 'undefined') {
    person.phone = 'NA'
  }
  if (person.first !== "First Name") {
    //.log(admin.database().ref('attendeeDB/test').set(person))
    admin.database().ref(baseURL + id).set(person)
    teacherData[id] = person
  }



})
.on("end", function () {
  console.log("done");
  fs.writeFile("./private/volunteers.json", JSON.stringify(teacherData), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");


  });
});
let registrationStream = csv()
.on("data", function (row) {
  let id = uuidv1();

  let person = {
    Timestamp: row[3],
    email: row[2],
    name: row[1],
    phone: row[4],
    DOB: row[5],
    levelOfStudy: row[6],
    graduationYear: Number(row[7]),
    school: row[9],
    gender: row[20],
    shirtSize: row[10],
    race: row[11],
    interestedMajor: row[12],
    dietaryRestrictions: row[13],
    specialNeeds: row[14],
    compsciHistory: row[15],
    aplicationStatus: row[18],
    sponsor: row[19],
    referral: row[21],
    role: 'attendee',
    waiverComplete: false,
    checkedIn: false,
    onCampus: false,
    id: id
  }
  if (person.name !== "Name") {

    db.ref(baseURL + id).set(person)
    registrationData[id] = person;
  }


})
.on("end", function () {
  console.log("done");
  fs.writeFile("./private/registrations.json", JSON.stringify(registrationData), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});
//students.pipe(studentsStream);
//teachers.pipe(teacherStream);
resgistrations.pipe(registrationStream)