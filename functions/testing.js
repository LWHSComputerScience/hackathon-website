const fetch = require('node-fetch');
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
    to: 'ExponentPushToken[jlhUBnMFCG_jwlKvnX_dzA]',
    title: 'Testing',
    body: 'Let Ronan know if you get this please!'
  })
})
.then((response) => {
  //do something awesome that makes the world a better place
  console.log(response, 'pushed')
}).catch(e => {
  console.log(e)
})