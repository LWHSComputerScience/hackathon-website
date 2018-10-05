const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('fast-csv')
let stream = fs.createReadStream("./private/data.csv");
let data = []
const serviceAccount = require("./private/hyphenhacks-dc851-firebase-adminsdk-au5a6-3d9ad5cb50.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hyphenhacks-dc851.firebaseio.com"
});
var csvStream = csv()
.on("data", function(row){
  console.log(row);
  data.push(row)

})
.on("end", function(){
  console.log("done");
  fs.writeFile("./private/data.json", JSON.stringify(data), function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });
});

stream.pipe(csvStream);