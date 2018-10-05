import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import auth from './views/auth.vue'
import firebase from 'firebase/app'
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
router.beforeEach((to, from, next) => {
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
export default router;