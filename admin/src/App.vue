<template>
  <div id="app">
    <nav v-if="$route.path != '/'" class="app__nav">
      <h1 class="nav__header">Hyphen-Hacks Dashboard</h1>
      <input v-model="search" class="nav__search" type="text" placeholder="search">
      <div class="checkboxRow">
        <input v-model="includeAttendees" id="student" class="checkboxRow__checkbox" type="checkbox">
        <label for="student" class="checkboxRow__label">Attendees</label>
      </div>
      <div class="checkboxRow">
        <input v-model="includeVoulenteers" id="voulenteers" class="checkboxRow__checkbox" type="checkbox">
        <label for="voulenteers" class="checkboxRow__label">Voulenteers</label>
      </div>
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
        totalList: {},
        quote: '',
        search: '',
        includeAttendees: true,
        includeVoulenteers: true
      }
    },
    computed: {
      filterdList() {
        let list = this.totalList;
        if (this.search != '') {
          // console.log('searching')

          // console.log(list)
          let sorted = [];

          let element = null;
          for (let key in list) {
            element = list[key];
            if (element.name.toLowerCase().includes(this.search.toLowerCase()) || element.email.toLowerCase().includes(this.search.toLowerCase())) {
              if (element.role == 'attendee' && this.includeAttendees || element.role == 'volunteer' && this.includeVoulenteers) {
                sorted.push(element)
              }

            }
            // Do something with element i.
          }

          return sorted
        } else {

          // console.log(list)
          let sorted = [];

          let element = null;
          for (let key in list) {
            element = list[key];

            if (element.role == 'attendee' && this.includeAttendees || element.role == 'volunteer' && this.includeVoulenteers) {
              sorted.push(element)
            }


            // Do something with element i.
          }

          return sorted
        }

      }


    },
    mounted() {
      firebase.database().ref('/attendeeDB/people/').on('value', (data) => {
        console.log(data.val())
        this.totalList = {}
        this.totalList = data.val()

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