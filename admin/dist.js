const currentVersion = require('./package').version;
let package = require('./package')
const Enquirer = require('enquirer');
const fs = require('fs')
var enquirer = new Enquirer();
var ncp = require('ncp').ncp;
const rmdir = require('rimraf');
const admin = require('firebase-admin');
const serviceAccount = require("../admin-backend/private/auth.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hyphenhacks-dc851.firebaseio.com"
});
let db = admin.database();

ncp.limit = 16;
enquirer.question('newVersion', `new version? current ${currentVersion}`);
enquirer.prompt(['newVersion'])
.then(function (answers) {
  if (!answers.newVersion) {
    answers.newVersion = currentVersion
  }


  package.version = answers.newVersion
  fs.writeFile("./package.json", JSON.stringify(package), (e) => {
      if (e) {
        return console.log(e)
      }
      console.log("package updated with version", answers.newVersion)
      console.log('building...')
      const {exec} = require('child_process');
      exec('npm run build', (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        rmdir('../public/admin/', function (error) {
          if (error) {
            return console.log(error)
          }
          console.log('removed old files')
          ncp('./dist', '../public/admin', function (err) {
            if (err) {
              return console.error(err);
            }
            console.log('done copying');
            db.ref('adminVersion').set(answers.newVersion).then((e) => {
              console.log('upadated global version')
              console.log('deploying...')
              exec('firebase deploy', (err, stdout, stderr) => {
                if (err) {
                  // node couldn't execute the command
                 process.exit(1)
                }

                // the *entire* stdout and stderr (buffered)
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                process.exit(0)
              })
            })
          });
        });


      });
    }
  )
});