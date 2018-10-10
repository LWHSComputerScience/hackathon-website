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

        let pushkey = firebase.database().ref('notificationLog/').push()
        pushkey.set({
          initials: this.initials,
          title: this.title,
          message: this.message
        })
        console.log(pushkey.key)
        this.initials = ''
        this.message = ''
        this.title = ''



      }

    }


  }
</script>
