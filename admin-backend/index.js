
const fs = require('fs');
const csv = require('fast-csv')
var stream = fs.createReadStream("./private/data.csv");
let data = []
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