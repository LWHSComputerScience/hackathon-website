<template>
  <div id="app">
    <nav v-if="$route.path != '/'" class="app__nav">
      <h1 class="nav__header">Hyphen-Hacks Dashboard</h1>
      <input v-model="search" class="nav__search" type="text" placeholder="search">
      <a class="stomprocketBranding" href="https://stomprocket.io" target="_blank">
        <p>developed by:</p>
        <img src="@/assets/wordmarksmall.png" alt="">
      </a>
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
        quote: '',
        search: ''
      }
    },
    computed: {
      filterdList() {
        if (this.search != '') {
          // console.log('searching')
          let list = this.totalList[0];
          // console.log(list)
          let sorted = [];

          let element = null;
          for (let key in list) {
            element = list[key];
            if (element[3].toLowerCase().includes(this.search.toLowerCase()) || element[2].toLowerCase().includes(this.search.toLowerCase())) {
              sorted.push(element)
            }
            // Do something with element i.
          }

          return sorted
        } else {
          return this.totalList[0]
        }

      }


    },
    mounted() {
      firebase.database().ref('/attendeeDB/attendees/').on('value', (data) => {
        console.log(data.val())
        this.totalList = []
        this.totalList.push(data.val())

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