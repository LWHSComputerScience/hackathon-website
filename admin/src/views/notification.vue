<template>
  <div class="person page">
    <router-link class="backBtn" to="/a/">back</router-link>
    <div class="notifications__container">
      <h1 class="notificationTitle">Send A Notification</h1>
      <form @submit.prevent="send" class="notification__form">
        <input required type="text" class="notification__form__title input" placeholder="message title" v-model="title">
        <input required type="text" class="notification__form__message input" placeholder="message content"
               v-model="message">
        <input required type="text" class="notification__form__senderName input"
               placeholder="your initials (for authentication)"
               v-model="initials">
        <button type="submit" class="btn">Send</button>
      </form>
    </div>

  </div>
</template>

<script>
  // @ is an alias to /src
  import '@/assets/person.scss'
  import firebase from 'firebase/app'
  import 'firebase/auth'


  export default {
    name: 'person',
    data() {
      return {
        title: '',
        message: '',
        initials: ''
      }
    },
    beforeRouteLeave(to, from, next) {
      this.$parent.catchText = true
      next()

    },
    mounted() {
      this.$parent.catchText = false

    },
    methods: {
      send() {
        let data = JSON.stringify({
          "to": "ExponentPushToken[jlhUBnMFCG_jwlKvnX_dzA]",
          "title": this.title,
          "body": this.message
        });
        let initials = this.initials
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange",  (e) => {
          if (e.readyState === 4) {
            console.log(e.responseText);
            this.initials = ''
            this.message = ''
            this.title = ''
            firebase.database.ref('/notificationLog/').push().set({
              initials: initials,
              data: data
            })
          }
        });

        xhr.open("POST", "https://exp.host/--/api/v2/push/send");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Accept-Encoding", "gzip, deflate");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "db389565-7ee0-42ea-bb21-d621803aae84");

        xhr.send(data);

      }

    }


  }
</script>
