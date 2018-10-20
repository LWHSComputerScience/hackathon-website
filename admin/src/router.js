import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import auth from './views/auth.vue'
import Person from './views/person.vue'
import Add from './views/add.vue'
import Stats from './views/stats.vue'
import notification from './views/notification.vue'
import firebase from 'firebase/app'
import VueAnalytics from 'vue-ua'
import 'firebase/auth'
import 'firebase/database'
let whitelist = {};



Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/a',
      name: 'app',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/add',
      name: 'add',
      component: Add,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/n',
      name: 'notification',
      component: notification,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/p/:id',
      name: 'person',
      component: Person,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'auth',
      component: auth
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
router.beforeEach((to, from, next) =>{
  //console.log(to)
  firebase.database().ref('/whitelistUIDs').once('value').then(snapshot => {
    whitelist = snapshot.val()
    let currentUser = false
    if (firebase.auth().currentUser) {
      currentUser = firebase.auth().currentUser.uid in whitelist;
    }

    let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !currentUser) next ('/')
    else if (!requiresAuth && currentUser) next('/a')
    else next()
  });

});
if (process.env.NODE_ENV === 'production') {
  console.log('setting up analytics')
  Vue.use(VueAnalytics, {
    // [Required] The name of your app as specified in Google Analytics.
    appName: 'Hyphen-Hacks Dashboard',
    // [Required] The version of your app.
    appVersion: require('../package.json').version,
    // [Required] Your Google Analytics tracking ID.
    trackingId: 'UA-127808947-1',
    // If you're using vue-router, pass the router instance here.
    vueRouter: router,
    trackPage: true
  })
}

export default router;