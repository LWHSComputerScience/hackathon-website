<template>
  <div class="home page">
    <div class="person" v-for="person in $parent.filterdList">
      <p>{{person[3]}}</p>
    </div>
  </div>
</template>

<script>
  // @ is an alias to /src
  import '@/assets/home.scss'

  export default {
    name: 'home',

  }
</script>
