<template>
  <div class="person page">
    <h1>{{person.name}}</h1>
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
        person: {},
        id: this.$route.params.id
      }
    },
    mounted() {
      if (!this.id) {
        this.$router.push('/a/')
      }
      //console.log('attendeeDB/people/' + this.id)
      firebase.database().ref('attendeeDB/people/' + this.id).on('value', data => {
        if (!data.val()) {
          this.$router.push('/a/')
        }
        //console.log(data.val() + 'person data')
        this.person = data.val()
      })
    }

  }
</script>
