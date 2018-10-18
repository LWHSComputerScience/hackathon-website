<template>
  <div class="page person add">
    <router-link class="backBtn" to="/a/">back</router-link>
    <div class="notifications__container">
      <h1 class="notificationTitle">Add A Person</h1>
      <form @submit.prevent="addPerson" class="notification__form">
        <input required type="text" class="notification__form__title input" placeholder="Name" v-model="name">
        <input required type="email" class="notification__form__title input" placeholder="Email" v-model="email">
        <input type="text" class="notification__form__title input" placeholder="Phone Number" v-model="phone">
        <input type="text" class="notification__form__title input" placeholder="Date Of Birth" v-model="DOB">
        <input type="text" class="notification__form__title input" placeholder="Gender" v-model="gender">
        <input type="text" class="notification__form__title input" placeholder="Special Needs" v-model="specialNeeds">
        <input type="text" class="notification__form__title input" placeholder="Dietary Restrictions"
               v-model="dietaryRestrictions">
        <input type="text" class="notification__form__title input" placeholder="Shirt Size" v-model="shirtSize">
        <select required v-model="role" class="select">
          <option value="deafault" disabled>Choose role (Attendee or Volunteer)</option>
          <option value="attendee">Attendee</option>
          <option value="volunteer">Volunteer</option>
        </select>
        <input v-if="role == 'attendee'" type="text" class="notification__form__title input" placeholder="School"
               v-model="school">
        <input v-if="role == 'attendee'" type="number" class="notification__form__title input"
               placeholder="Graduation Year" v-model="graduationDate">
        <div class="checkboxRow">
          <p>Waiver Complete</p>
          <div class="checkbox">
            <input id="waiver" v-model="waiverComplete" class="checkboxRow__checkbox" type="checkbox">
            <label for="waiver" class="checkboxRow__label"></label>
          </div>
        </div>
        <div class="checkboxRow">
          <p>Checked In</p>
          <div class="checkbox">
            <input id="checkedIn" v-model="checkedIn" class="checkboxRow__checkbox" type="checkbox">
            <label for="checkedIn" class="checkboxRow__label"></label>
          </div>
        </div>
        <div class="checkboxRow">
          <p>On Campus</p>
          <div class="checkbox">
            <input id="onCampus" v-model="onCampus" class="checkboxRow__checkbox" type="checkbox">
            <label for="onCampus" class="checkboxRow__label"></label>
          </div>
        </div>
        <button type="submit" class="btn personSubmit">Upload</button>
      </form>
    </div>
  </div>
</template>

<script>
  import '@/assets/person.scss'
  import firebase from 'firebase/app'
  import 'firebase/database'
  import uuidv1 from 'uuid/v1'

  export default {
    name: "add",
    data() {
      return {
        name: '',
        role: 'attendee',
        school: '',
        graduationDate: '',
        email: '',
        phone: '',
        DOB: '',
        gender: '',
        specialNeeds: '',
        dietaryRestrictions: '',
        shirtSize: '',
        levelOfStudy: '',
        waiverComplete: false,
        checkedIn: false,
        onCampus: false
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
      addPerson() {
        let id = uuidv1();

        let person = {
          Timestamp: Date.now(),
          email: this.email,
          name: this.name,
          phone: this.phone,
          DOB: this.DOB,
          levelOfStudy: this.levelOfStudy,
          graduationYear: Number(this.graduationDate),
          school: this.school,
          gender: this.gender,
          shirtSize: this.shirtSize,
          dietaryRestrictions: this.dietaryRestrictions,
          specialNeeds: this.specialNeeds,
          role: this.role,
          waiverComplete: this.waiverComplete,
          checkedIn: this.checkedIn,
          onCampus: this.onCampus,
          id: id
        }
        console.log(person)
        firebase.database().ref('attendeeDB/people/' + id).set(person)
        this.name = '';
        this.school = '';
        this.email = '';
        this.phone = '';
        this.DOB = '';
        this.levelOfStudy = '';
        this.graduationDate = "";
        this.gender = '';
        this.shirtSize = "";
        this.dietaryRestrictions = "";
        this.specialNeeds = '';
        this.waiverComplete = false;
        this.checkedIn = false;
        this.onCampus = false;

      }
    }
  }
</script>
