<template>
  <div id="app">
    <nav class="app__nav"></nav>
    <router-view/>
    <footer class="app__footer"></footer>
  </div>
</template>
<script>
  import 'minireset.css'
  import './assets/global.scss'
  export default {
    name: 'appContainer'
  }
</script>