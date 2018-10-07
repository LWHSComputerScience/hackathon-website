<template>
  <div class="person page">
    <router-link class="backBtn" to="/a/">back</router-link>
    <h1 v-if="person.role == 'attendee'" class="person__name">{{person.name}} <span>({{person.role}})</span></h1>
    <h1 v-if="person.role == 'volunteer'" class="person__name">{{person.first}} {{person.last}} <span>({{person.role}})</span></h1>
    <h2 class="person__school">{{person.school}} {{person.graduationYear}}</h2>
    <div class="info">
      <p>Email: <b>{{person.email}}</b></p>
      <p>Phone: <b>{{person.phone}}</b></p>
      <p v-if="person.role == 'attendee'" >Date Of Birth: <b>{{person.DOB}}</b></p>
      <p v-if="person.role == 'attendee'">Gender: <b>{{person.gender}}</b></p>
      <p v-if="person.role == 'attendee'">Race/Ethnicity: <b>{{person.race}}</b></p>
      <p v-if="person.role == 'attendee'">Dietary Restrictions: <b>{{person.dietaryRestrictions}}</b></p>
      <p v-if="person.role == 'attendee'">Special Needs: <b>{{person.specialNeeds}}</b></p>
      <p v-if="person.role == 'attendee'">Level Of Study: <b>{{person.levelOfStudy}}</b></p>
      <p v-if="person.role == 'attendee'">Shirt Size: <b>{{person.shirtSize}}</b></p>
      <p v-if="person.role == 'attendee'">Interested Major: <b>{{person.interestedMajor}}</b></p>
      <p v-if="person.role == 'attendee'">Computer Science History: <b>{{person.compsciHistory}}</b></p>
      <div class="checkboxRow">
        <p>Waiver Complete</p>
        <div class="checkbox">
          <input :id="person.id + 'waiver'" v-model="person.waiverComplete" class="checkboxRow__checkbox"
                 type="checkbox">
          <label @click="update(person,'waiverComplete')" :for="person.id + 'waiver'"
                 class="checkboxRow__label"></label>
        </div>
      </div>
      <div class="checkboxRow">
        <p>Checked In</p>
        <div class="checkbox">
          <input :id="person.id + 'checkedIn'" v-model="person.checkedIn" class="checkboxRow__checkbox" type="checkbox">
          <label @click="update(person,'checkedIn')" :for="person.id + 'checkedIn'" class="checkboxRow__label"></label>
        </div>
      </div>
      <div class="checkboxRow">
        <p>On Campus</p>
        <div class="checkbox">
          <input :id="person.id + 'onCampus'" v-model="person.onCampus" class="checkboxRow__checkbox" type="checkbox">
          <label @click="update(person,'onCampus')" :for="person.id + 'onCampus'" class="checkboxRow__label"></label>
        </div>
      </div>

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
    },
    methods: {
      update(person, record) {
        if (person[record]) {
          person[record] = false
        } else {
          person[record] = true
        }

        firebase.database().ref('attendeeDB/people/' + person.id).set(person)

      }

    }

  }
</script>
