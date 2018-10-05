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
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user)
        if (firebase.auth().currentUser.uid in this.whitelist) {
          this.$router.push('/a')
        } else {
          window.location = 'https://hyphen-hacks.com'
        }


        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    }
  }
</script>
