<template>
  <div class="home page">
    <div class="person" v-for="person in $parent.filterdList">
      <h1 class="person__name">{{person[3]}}</h1>
      <p class="person__email">{{person[2]}}</p>
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
