<template>
  <div class="home page">
    <div  v-for="person in $parent.sortedList"  :key="person.id" v-if="person.name != 'Name'">
      <div v-if="person.role == 'attendee'" @click="open(person.id)"  class="person" >
        <h1 class="person__name">{{person.name}}</h1>
        <p class="person__email">{{person.email}}</p>
        <p class="person__gender">{{person.gender}}</p>
        <div @click="preventOpen" class="checkboxRow waiver">
          <input disabled :id="person.id + 'waiver'" v-model="person.waiverComplete" class="checkboxRow__checkbox" type="checkbox">
          <label @click="update(person,'waiverComplete')" :for="person.id + 'waiver'" class="checkboxRow__label">waiver completed</label>
        </div>
        <div @click="preventOpen" class="checkboxRow">
          <input disabled :id="person.id + 'checkedIn'" v-model="person.checkedIn" class="checkboxRow__checkbox" type="checkbox">
          <label @click="update(person,'checkedIn')" :for="person.id + 'checkedIn'" class="checkboxRow__label">checked in</label>
        </div>
        <div @click="preventOpen" class="checkboxRow">
          <input disabled :id="person.id + 'onCampus'" v-model="person.onCampus" class="checkboxRow__checkbox" type="checkbox">
          <label @click="update(person,'onCampus')" :for="person.id + 'onCampus'" class="checkboxRow__label">on campus</label>
        </div>

      </div>
      <div v-if="person.role == 'volunteer'" @click="open(person.id)"  class="person" >
        <h1 class="person__name">{{person.first}} {{person.last}}</h1>
        <p class="person__email">{{person.email}}</p>
        <p class="person__gender">volunteer</p>
        <div @click="preventOpen" class="checkboxRow waiver">
          <input disabled :id="person.id + 'waiver'" v-model="person.waiverComplete" class="checkboxRow__checkbox" type="checkbox">
          <label @click="update(person,'waiverComplete')" :for="person.id + 'waiver'" class="checkboxRow__label">waiver completed</label>
        </div>
        <div @click="preventOpen" class="checkboxRow">
          <input disabled :id="person.id + 'checkedIn'" v-model="person.checkedIn" class="checkboxRow__checkbox" type="checkbox">
          <label @click="update(person,'checkedIn')" :for="person.id + 'checkedIn'" class="checkboxRow__label">checked in</label>
        </div>
        <div @click="preventOpen" class="checkboxRow">
          <input disabled :id="person.id + 'onCampus'" v-model="person.onCampus" class="checkboxRow__checkbox" type="checkbox">
          <label @click="update(person,'onCampus')" :for="person.id + 'onCampus'" class="checkboxRow__label">on campus</label>
        </div>

      </div>
    </div>

    <p v-if="!$parent.filterdList[0]">no results</p>
  </div>
</template>

<script>
  // @ is an alias to /src
  import '@/assets/home.scss'
  import firebase from 'firebase/app'
  import 'firebase/database'

  export default {
    name: 'home',
    data() {
      return {
        openTime: false
      }
    },
    methods: {
      update(person, record) {
        if (person[record]) {
          person[record] = false
        } else {
          person[record] = true
        }

        firebase.database().ref('attendeeDB/people/' + person.id).set(person)

      },
      preventOpen() {
        this.openTime = true;
        setTimeout(() => {
          this.openTime = false
        }, '500')
      },
      open(id) {
        if (!this.openTime) {
          this.$router.push('/p/' + id)
        }
      }

    }

  }
</script>
