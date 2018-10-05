<template>
  <div id="app">
    <nav v-if="$route.path != '/'" class="app__nav">
      <h1 class="nav__header">Hyphen-Hacks Dashboard</h1>
      <input class="nav__search" type="search" placeholder="search">
    </nav>
    <router-view/>
    <footer v-if="$route.path != '/'" class="app__footer">
      <p class="footer__quote">{{quote}}</p>
    </footer>
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
        totalList: [],
        quote: ''
      }
    },
    computed: {
      filterdList() {
        return this.totalList[0]
      }


    },
    mounted() {
      firebase.database().ref('/attendeeDB/attendees/').on('value', (data) => {
        console.log(data.val())
        this.totalList = []
        this.totalList.push( data.val())

      })
      fetch('https://api.icndb.com/jokes/random?escapse=javascript')
      .then((resp) => resp.json()) // Transform the data into json
      .then((data) => {
        console.log(data)
        this.quote = data.value.joke;
        // Create and append the li's to the ul
      })
    }

  }
</script>