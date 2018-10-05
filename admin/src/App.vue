<template>
  <div id="app">
    <nav v-if="$route.path != '/'" class="app__nav">
      <h1 class="nav__header">Hyphen-Hacks Dashboard</h1>
      <input class="nav__search" type="search" placeholder="search">
    </nav>
    <router-view/>
    <footer v-if="$route.path != '/'" class="app__footer"></footer>
  </div>
</template>
<script>
  import 'minireset.css'
  import './assets/global.scss'
  import firebase from 'firebase/app';
  import 'firebase/database'
  export default {
    name: 'appContainer',
    data() {
      return {
        totalList: {}
      }
    },
    computed: {
      filterdList() {
        return this.totalList
      }

    },
    mounted() {
      firebase.database().ref('/attendeeDB/attendees/').on('value', (data) => {
        console.log(data.val())
        this.totalList = data.val()
      })
    }

  }
</script>