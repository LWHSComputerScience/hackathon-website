<template>
  <div @keydown="focusSearch" id="app">
    <div v-if="loading" id="loading">
      <div class="hollowLoader">
        <div class="largeBox"></div>
        <div class="smallBox"></div>
      </div>
      <h1>{{loadingText}}</h1>
    </div>
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
      <router-link class="btn nav__add" to="/add">Add a person</router-link>
      <router-link class="btn nav__add" to="/stats">View analytics</router-link>
      <div class="alert" v-if="version < newestVersion">
        <h1 class="alert__heading">New Version Available!! {{newestVersion}}</h1>
        <p class="alert__text">Please empty your application cache and reload to get the latest version of the
          dashboard.</p>
        <p class="alert__version">Current Version: {{version}}</p>
        <p class="alert__version new">Newest Version: {{newestVersion}}</p>
      </div>
      <div v-if="version >= newestVersion" class="nav__analytics">
        <div class="analytics__row">
          <b>{{analyticsFilter.checkedIn}}</b>
          <p>Checked In</p>
        </div>
        <div class="analytics__row">
          <b>{{analyticsFilter.onCampus}}</b>
          <p>On Campus</p>
        </div>
        <div class="analytics__row">
          <b>{{analyticsFilter.waiverComplete}}</b>
          <p>Waivers Complete</p>
        </div>
        <div class="analytics__row">
          <b>{{analytics.attendees}}</b>
          <p>Attendees</p>

        </div>
        <div class="analytics__row">
          <b>{{analytics.volunteers}}</b>
          <p>Volunteers</p>
        </div>

      </div>
      <a class="stomprocketBranding" href="https://stomprocket.io" target="_blank">
        <p>developed by:</p>
        <img src="@/assets/wordmarksmall.png" alt="">
      </a>
    </nav>
    <router-view/>
    <footer v-if="$route.path != '/'" class="app__footer">
      <p @click="refreshJoke" class="footer__quote" v-html="quote"></p>

      <small class="legal">v{{version}} Dashboard created by <a href="https://brainstormincstudio.com" target="_blank">Ronan
        Furuta</a> @ <a href="https://stomprocket.io" target="_blank">Stomp Rocket</a></small>
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
        loading: true,
        totalList: {},
        quote: '',
        search: '',
        includeAttendees: true,
        includeVoulenteers: true,
        sortOption: 'name',
        invert: false,
        catchText: true,
        version: require('../package.json').version,
        newestVersion: null,
        analytics: {}
      }
    },
    computed: {
      analyticsFilter() {

        if (this.includeVoulenteers && this.includeAttendees) {
          console.log('Showing everything')
          return this.analytics
        } else if (this.includeAttendees === true) {
          let analytics = {
            checkedIn: 0,
            people: 0,
            attendees: 0,
            volunteers: 0,
            onCampus: 0,
            waiverComplete: 0
          }
          console.log('Showing attendees')
          let data = this.totalList
          for (let key in data) {
            let person = data[key]
            if (person.role === 'attendee') {
              if (person.checkedIn) {
                analytics.checkedIn++
              }
              if (person.onCampus) {
                analytics.onCampus++
              }
              if (person.waiverComplete) {
                analytics.waiverComplete++
              }
            }
          }
          return analytics
        } else {
          console.log('Showing voulunteers')
          let analytics = {
            checkedIn: 0,
            people: 0,
            attendees: 0,
            volunteers: 0,
            onCampus: 0,
            waiverComplete: 0
          }

          let data = this.totalList
          for (let key in data) {
            let person = data[key]
            if (person.role === 'volunteer') {
              if (person.checkedIn) {
                analytics.checkedIn++
              }
              if (person.onCampus) {
                analytics.onCampus++
              }
              if (person.waiverComplete) {
                analytics.waiverComplete++
              }
            }
          }
          return analytics
        }
      },
      loadingText() {
        if (this.$route.path == '/stats') {
          return 'crunching the numbers'
        } else {
          return 'loading'
        }
      },
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

      firebase.database().ref('/attendeeDB/people/').on('value', (data) => {
        //console.log(data.val())
        console.log(' db load')
        this.totalList = {}

        this.totalList = data.val()
        let analytics = {
          checkedIn: 0,
          people: 0,
          attendees: 0,
          volunteers: 0,
          onCampus: 0,
          waiverComplete: 0
        }
        if (data.val()) {
          for (let key in data.val()) {
            let person = data.val()[key]
            analytics.people++
            if (person.checkedIn) {
              analytics.checkedIn++
            }
            if (person.role === 'volunteer') {
              analytics.volunteers++
            } else if (person.role === 'attendee') {
              analytics.attendees++
            }
            if (person.onCampus) {
              analytics.onCampus++
            }
            if (person.waiverComplete) {
              analytics.waiverComplete++
            }
          }
        }
        this.analytics = analytics;
        if (this.$route.path != '/stats') {
          this.loading = false;
        }


      })

      firebase.database().ref('adminVersion').on('value', (data) => {
        //console.log(data.val())
        console.log('newest version', data.val())
        if (data.val() > this.version) {
          console.log('outdated')

        }
        this.newestVersion = data.val()
      });
      this.refreshJoke()
      window.onkeypress = (e) => {
        if (this.catchText || document.activeElement == document.getElementById('search') || document.activeElement == document.body) {
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