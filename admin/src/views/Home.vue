<template>
  <div class="home page">
    <div v-for="person in $parent.sortedList" :key="person.id" v-if="person.name != 'Name'">
      <div v-if="person.role == 'attendee'" @click="open(person.id)" class="person">
        <h1 class="person__name">{{person.name}}</h1>
        <p class="person__email">{{person.email}}</p>
        <p class="person__gender">{{person.gender}}</p>
        <div @click="preventOpen" class="checkboxRow waiver">
          <input disabled :id="person.id + 'waiver'" v-model="person.waiverComplete" class="checkboxRow__checkbox"
                 type="checkbox">
          <label @click="update(person,'waiverComplete')" :for="person.id + 'waiver'" class="checkboxRow__label">waiver
            completed</label>
        </div>
        <div @click="preventOpen" class="checkboxRow">
          <input disabled :id="person.id + 'checkedIn'" v-model="person.checkedIn" class="checkboxRow__checkbox"
                 type="checkbox">
          <label @click="update(person,'checkedIn')" :for="person.id + 'checkedIn'" class="checkboxRow__label">checked
            in</label>
        </div>
        <div @click="preventOpen" class="checkboxRow">
          <input disabled :id="person.id + 'onCampus'" v-model="person.onCampus" class="checkboxRow__checkbox"
                 type="checkbox">
          <label @click="update(person,'onCampus')" :for="person.id + 'onCampus'" class="checkboxRow__label">on
            campus</label>
        </div>

      </div>
      <div v-if="person.role == 'volunteer'" @click="open(person.id)" class="person">
        <h1 class="person__name" v-if="person.first">{{person.first}} {{person.last}}</h1>
        <h1 class="person__name" v-if="!person.first">{{person.name}}</h1>
        <p class="person__email">{{person.email}}</p>
        <p class="person__gender">volunteer</p>
        <div @click="preventOpen" class="checkboxRow waiver">
          <input disabled :id="person.id + 'waiver'" v-model="person.waiverComplete" class="checkboxRow__checkbox"
                 type="checkbox">
          <label @click="update(person,'waiverComplete')" :for="person.id + 'waiver'" class="checkboxRow__label">waiver
            completed</label>
        </div>
        <div @click="preventOpen" class="checkboxRow">
          <input disabled :id="person.id + 'checkedIn'" v-model="person.checkedIn" class="checkboxRow__checkbox"
                 type="checkbox">
          <label @click="update(person,'checkedIn')" :for="person.id + 'checkedIn'" class="checkboxRow__label">checked
            in</label>
        </div>
        <div @click="preventOpen" class="checkboxRow">
          <input disabled :id="person.id + 'onCampus'" v-model="person.onCampus" class="checkboxRow__checkbox"
                 type="checkbox">
          <label @click="update(person,'onCampus')" :for="person.id + 'onCampus'" class="checkboxRow__label">on
            campus</label>
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
  import swal from 'sweetalert';

  export default {
    name: 'home',
    data() {
      return {
        openTime: false
      }
    },
    methods: {
      update(person, record) {
        if (record === 'waiverComplete') {
          if (person[record]) {
            swal({
              title: "Are you sure?",
              text: "You are unchecking the waiver box",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
            .then((willDelete) => {
              if (willDelete) {
                person[record] = false
                person.authorizer = '';
                firebase.database().ref('attendeeDB/people/' + person.id).set(person)
              }
            });

          } else {
            this.$parent.catchText = false
            swal("Please write your initials:", {
              content: "input",
            })
            .then((value) => {
              if (value && value != ' ') {
                person[record] = true;
                person.authorizer = value;

                firebase.database().ref('attendeeDB/people/' + person.id).set(person)
              } else {
                swal("Please enter initials", "Initials are required to authorize a waiver", "error")
              }

              this.$parent.catchText = true
            });

          }

        } else {
          person[record] = !person[record];

          firebase.database().ref('attendeeDB/people/' + person.id).set(person)
        }

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
