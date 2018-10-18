<template>
  <div class="stats page">
    <router-link class="backBtn" to="/a/">back</router-link>

    <div class="chart__container">
      <h1 class="stats__heading">Analytics</h1>
      <canvas class="chart" id="checkins"></canvas>
    </div>

  </div>
</template>

<script>
  // @ is an alias to /src
  import '@/assets/stats.scss'
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/database'
  import Chart from 'chart.js'


  export default {
    name: 'stats',
    data() {
      return {
        log: {},
        checkinsOverTime: [],
        peopleOnCampus: [],
        waiversCompleted: [],
        attendees:[],
        voulunteers: [],
        lowestTimeStamp: false,
        maxTimeStamp: false
      }
    },
    mounted() {
      //this.$parent.loading = true
      firebase.database().ref('attendeeDB/analyticsLog').on('value', (snapshot) => {
        console.log('stats loaded')
        this.log = snapshot.val();

        console.log(snapshot.val())
        for (let key in this.log) {
          let log = this.log[key]

          this.checkinsOverTime.push({
            y: log.data.checkedIn,
            t: log.time
          })
          this.peopleOnCampus.push({
            y: log.data.onCampus,
            t: log.time
          })
          this.waiversCompleted.push({
            y: log.data.waiverComplete,
            t: log.time
          })
          this.attendees.push({
            y: log.data.attendees,
            t: log.time
          })
          this.voulunteers.push({
            y: log.data.voulunteers,
            t: log.time
          })
          if (this.lowestTimeStamp) {
            if (this.lowestTimeStamp > log.time) {
              this.lowestTimeStamp = log.time
            }
          } else {
            this.lowestTimeStamp = log.time
          }
          if (this.maxTimeStamp) {
            if (this.maxTimeStamp < log.time) {
              this.maxTimeStamp = log.time
            }
          } else {
            this.maxTimeStamp = log.time
          }

        }
        console.log(this.log)
        let checkins = document.getElementById('checkins').getContext('2d');
        let chart = new Chart(checkins, {
          // The type of chart we want to create
          type: 'line',

          // The data for our dataset
          data: {

            datasets: [{
              label: "Check-ins",
              backgroundColor: 'rgb(255, 99, 132, 0)',
              borderColor: '#e74c3c',
              data: this.checkinsOverTime,
              lineTension: 0,
            },
              {
                label: "People On Campus",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: '#3498db',
                data: this.peopleOnCampus,
                lineTension: 0,
              },
              {
                label: "Waivers Completed",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: '#2ecc71',
                data: this.waiversCompleted,
                lineTension: 0,
              },
              {
                label: "Attendees",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: '#9b59b6',
                data: this.attendees,
                lineTension: 0,
              },
              {
                label: "Volunteers",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: '#e67e22',
                data: this.voulunteers,
                lineTension: 0,
              }]
          },

          // Configuration options go here
          options: {
            maintainAspectRatio: true,
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  unit: 'minute'
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      //  this.$parent.loading = false
      })


    }


  }
</script>
