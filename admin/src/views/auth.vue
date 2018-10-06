<template>
  <div class="auth">
    <h1>Login</h1>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth';
  export default {
    name: "auth",
    data() {
      return {
        whitelist: {}
      }
    },
    mounted() {

      firebase.database().ref('/whitelistUIDs').once('value').then(snapshot => {
        this.whitelist = snapshot.val()
      })
      if (firebase.auth().currentUser) {
        if (!this.whitelist[firebase.auth().currentUser.uid]) {
          window.location = 'https://hyphen-hacks.com'
        }
      }
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    }
  }
</script>
