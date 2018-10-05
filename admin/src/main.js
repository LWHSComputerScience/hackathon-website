import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import firebase from 'firebase/app'
import 'firebase/auth'
let app;
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
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')

  }
})
