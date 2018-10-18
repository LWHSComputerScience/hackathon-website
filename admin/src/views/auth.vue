<template>
  <div class="auth">
    <h1>loading</h1>
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
      console.log('app init')
      firebase.database().ref('/whitelistUIDs').once('value').then(snapshot => {
        this.whitelist = snapshot.val()
      })
      firebase.auth().onAuthStateChanged( (user) => {
        console.log('firebase init')
        if (firebase.auth().currentUser) {
          if (!this.whitelist[firebase.auth().currentUser.uid]) {
            window.location = 'https://hyphen-hacks.com'
          }
        } else {
          // No user is signed in.
          let provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithRedirect(provider);
        }
      });


    }
  }
</script>
