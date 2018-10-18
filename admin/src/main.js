import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import firebase from 'firebase/app'
import 'firebase/auth'
import * as Sentry from '@sentry/browser'

const version = require('../package.json').version
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://3567e1a0fe884fae9005fc944c6609fc@sentry.io/1301364',
    integrations: [new Sentry.Integrations.Vue({Vue})],
    release: `Hyphen-Hacks-Dashboard@${version}`
  })
}


const config = {
  apiKey: "AIzaSyC7rd-5Ra6ae0BQiFfVe2G0H3WFdNZw1bo",
  authDomain: "hyphenhacks-dc851.firebaseapp.com",
  databaseURL: "https://hyphenhacks-dc851.firebaseio.com",
  projectId: "hyphenhacks-dc851",
  storageBucket: "hyphenhacks-dc851.appspot.com",
  messagingSenderId: "1007828831500"
};
firebase.initializeApp(config);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')



