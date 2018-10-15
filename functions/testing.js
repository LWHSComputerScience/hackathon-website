const fetch = require('node-fetch');
const functions = require('firebase-functions');
const SlackBot = require('slackbots');
let bot = new SlackBot({
  token: 'xoxb-449331460291-451824055221-1sp5BeSxnYlndFzCgEUTHAQy', // Add a bot https://my.slack.com/services/new/bot and put the token
  name: 'Hyphen-Hacks-Team'
});
let params = {
  as_user: true,
  icon_url: 'https://hyphen-hacks.com/img/logos/hyphhack.png'
}
/*
bot.getChannels().then(data => {
  console.log(data)
})
bot.getGroups().then(data => {
  console.log(data)
})
*/
bot.postTo('announcements', `test test`, params, (data) => {
  console.log(data)
});