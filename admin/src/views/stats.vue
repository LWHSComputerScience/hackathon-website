<template>
  <div class="stats page">
    <router-link class="backBtn" to="/a/">back</router-link>
    <h1 class="stats__heading">Analytics</h1>

    <div class="stat__block">
      <div class="stat">
        <b><span>{{percentCheckedIn}}</span>%</b>
        <p>of registrants checked in</p>
      </div>
      <div class="stat">
        <b><span>{{percentWaivers}}</span>%</b>
        <p>of waivers completed</p>
      </div>
      <div class="stat">
        <b><span>{{percentOnCampus}}</span>%</b>
        <p>of checked in attendees on campus</p>
      </div>

    </div>

    <div class="chart__container">

      <canvas class="chart" id="checkins"></canvas>
      <small>This chart is not updated in real time, reload to get latest data.</small>
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
        attendees: [],
        voulunteers: [],
        lowestTimeStamp: false,
        maxTimeStamp: false,
        lineTension: 0
      }
    },
    computed: {
      percentCheckedIn() {
        let currentAnalytics = this.$parent.analytics
        return Math.round((currentAnalytics.checkedIn / currentAnalytics.attendees) * 100)
      },
      percentWaivers() {
        let currentAnalytics = this.$parent.analytics
        return Math.round((currentAnalytics.waiverComplete / currentAnalytics.attendees) * 100)
      },
      percentOnCampus() {
        let currentAnalytics = this.$parent.analytics
        return Math.round((currentAnalytics.onCampus / currentAnalytics.attendees) * 100)
      },
    },
    mounted() {
      this.$parent.loading = true
      //this.$parent.loading = true
      fetch('https://us-central1-hyphenhacks-dc851.cloudfunctions.net/updateAnalytics').then(res => {
       // console.log('requested new analytics', res)
        let checkins = document.getElementById('checkins').getContext('2d');

        let chart = new Chart(checkins, {
          // The type of chart we want to create
          type: 'line',

          // The data for our dataset
          data: {
            datasets: [{
              label: "Check-ins",
              borderColor: '#e74c3c',
              backgroundColor: '#e74c3c',
              data: [],
              lineTension: [],
              fill: false,
              stepped: true
            },
              {
                label: "People On Campus",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: '#3498db',
                data: [],
                lineTension: this.lineTension,
              },
              {
                label: "Waivers Completed",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: '#2ecc71',
                data: [],
                lineTension: this.lineTension,
              },
              {
                label: "Attendees (different scale)",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: '#9b59b6',
                data: [],
                lineTension: this.lineTension,
                yAxisID: 'y2'
              },
              {
                label: "Volunteers",
                backgroundColor: 'rgb(255, 99, 132, 0)',
                borderColor: '#e67e22',
                data: [],
                lineTension: this.lineTension,
              }]
          },

          // Configuration options go here
          options: {
            maintainAspectRatio: true,
            animation: 0,
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  unit: 'minute'
                }
              }
              ],
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              },
                {
                  id: 'y2',
                  display: false,
                  ticks: {
                    beginAtZero: true

                  }
                }]
            }
          }
        });

        firebase.database().ref('attendeeDB/analyticsLog').once('value').then((snapshot) => {
          this.$parent.loading = true
          console.log('stats loaded')
          this.log = snapshot.val();

          //console.log(snapshot.val())
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
              y: log.data.volunteers,
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
          // console.log(chart.data.datasets)
          chart.data.datasets[0].data = this.checkinsOverTime;
          chart.data.datasets[1].data = this.peopleOnCampus;
          chart.data.datasets[2].data = this.waiversCompleted;
          chart.data.datasets[3].data = this.attendees;
          chart.data.datasets[4].data = this.voulunteers;

          // console.log(chart.data.datasets)
          chart.update()
          this.$parent.loading = false
          //  this.$parent.loading = false
        })

      })


    }


  }
</script>
