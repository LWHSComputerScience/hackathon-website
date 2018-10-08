<template>
  <div @keydown="focusSearch" id="app">
    <nav v-if="$route.path != '/'" class="app__nav">
      <h1 @click="searchHome" class="nav__header">Hyphen-Hacks Dashboard</h1>
      <input autocomplete="off" id="search" @keypress="searchHome" @keypress.enter="enter" v-model="search"
             class="nav__search" type="text" placeholder="search">
      <div class="checkboxRow">
        <input v-model="includeAttendees" id="student" class="checkboxRow__checkbox" type="checkbox">
        <label for="student" class="checkboxRow__label">Attendees</label>
      </div>
      <div class="checkboxRow">
        <input v-model="includeVoulenteers" id="voulenteers" class="checkboxRow__checkbox" type="checkbox">
        <label for="voulenteers" class="checkboxRow__label">Volunteers</label>
      </div>
      <select v-model="sortOption" class="select sortSelect">
        <option value="name">Sort by name</option>
        <option value="waiver">Sort by waiver status</option>
        <option value="onCampus">Sort by on campus</option>
        <option value="checkedIn">Sort by checked in</option>
      </select>
      <div class="checkboxRow">
        <input v-model="invert" id="invert" class="checkboxRow__checkbox" type="checkbox">
        <label for="invert" class="checkboxRow__label">Invert sort</label>
      </div>

      <router-link class="btn nav__notification" to="/n">Send a notification</router-link>
      <a class="stomprocketBranding" href="https://stomprocket.io" target="_blank">
        <p>developed by:</p>
        <img src="@/assets/wordmarksmall.png" alt="">
      </a>
    </nav>
    <router-view/>
    <footer v-if="$route.path != '/'" class="app__footer">
      <p @click="refreshJoke" class="footer__quote" v-html="quote"></p>
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
        includeVoulenteers: true,
        sortOption: 'name',
        invert: false,
        catchText: true
      }
    },
    computed: {
      sortedList() {
        if (!this.invert) {
          if (this.sortOption == 'name') {
            return this.filterdList.sort((a, b) => {
              if (a.name < b.name) return -1;
              if (a.name > b.name) return 1;
              return 0;
            })
          } else if (this.sortOption == 'waiver') {
            return this.filterdList.sort((a, b) => {
              if (a.waiverComplete < b.waiverComplete) return -1;
              if (a.waiverComplete > b.waiverComplete) return 1;
              return 0;
            })
          } else if (this.sortOption == 'onCampus') {
            return this.filterdList.sort((a, b) => {
              if (a.onCampus < b.onCampus) return -1;
              if (a.onCampus > b.onCampus) return 1;
              return 0;
            })
          } else if (this.sortOption == 'checkedIn') {
            return this.filterdList.sort((a, b) => {
              if (a.checkedIn < b.checkedIn) return -1;
              if (a.checkedIn > b.checkedIn) return 1;
              return 0;
            })
          }
        } else {
          if (this.sortOption == 'name') {
            return this.filterdList.sort((a, b) => {
              if (a.name > b.name) return -1;
              if (a.name < b.name) return 1;
              return 0;
            })
          } else if (this.sortOption == 'waiver') {
            return this.filterdList.sort((a, b) => {
              if (a.waiverComplete > b.waiverComplete) return -1;
              if (a.waiverComplete < b.waiverComplete) return 1;
              return 0;
            })
          } else if (this.sortOption == 'onCampus') {
            return this.filterdList.sort((a, b) => {
              if (a.onCampus > b.onCampus) return -1;
              if (a.onCampus < b.onCampus) return 1;
              return 0;
            })
          } else if (this.sortOption == 'checkedIn') {
            return this.filterdList.sort((a, b) => {
              if (a.checkedIn > b.checkedIn) return -1;
              if (a.checkedIn < b.checkedIn) return 1;
              return 0;
            })
          }
        }


      },
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

      firebase.database().ref('/attendeeDB/people/').orderByChild('name').on('value', (data) => {
        //console.log(data.val())
        console.log(' db load')
        this.totalList = {}

        this.totalList = data.val()

      })
      this.refreshJoke()
      window.onkeypress = (e) => {
        if (this.catchText || document.activeElement == document.getElementById('search')) {
          if (e.key == 'Enter' && this.$route.path != '/a/') {

            this.$router.push('/a/')
          }
          this.focusSearch();
        }

      }
    },
    methods: {
      refreshJoke() {
        fetch('https://api.icndb.com/jokes/random?escapse=javascript')
        .then((resp) => resp.json()) // Transform the data into json
        .then((data) => {
          //console.log(data)
          this.quote = data.value.joke;
          // Create and append the li's to the ul
        })
      },
      focusSearch() {
        // console.log('focusSearch');
        if (this.catchText) {
          document.getElementById("search").focus()
        }

      },
      searchHome() {
        if (this.catchText) {
          if (this.$route.path !== '/a/') {
            //console.log('re')
            this.$router.push('/a/')
          }
        }


      },
      enter() {
        if (this.catchText) {
          if (this.$route.path === '/a/' && Object.keys(this.filterdList)[0]) {
            let id = this.filterdList[Object.keys(this.filterdList)[0]].id;
            this.$router.push('/p/' + id)
            this.search = '';
            document.getElementById("search").blur()
          }
        }
      }

    }

  }
</script>