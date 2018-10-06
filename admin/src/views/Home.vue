<template>
  <div class="home page">
    <div v-if="person[3] != 'Name'" class="person" v-for="person in $parent.filterdList">
      <h1 class="person__name">{{person[3]}}</h1>
      <p class="person__email">{{person[2]}}</p>
      <p class="person__gender">{{person[9]}}</p>
      <div class="checkboxRow waiver">
        <input :id="person[3]" v-model="person[20]"  class="checkboxRow__checkbox" type="checkbox">
        <label :for="person[3]"  class="checkboxRow__label">waiver completed</label>
      </div>
      <div class="checkboxRow">
        <input :id="person[2]" v-model="person[21]"  class="checkboxRow__checkbox" type="checkbox">
        <label :for="person[2]"  class="checkboxRow__label">checked in</label>
      </div>
      <div class="checkboxRow">
        <input :id="person[0]" v-model="person[22]"  class="checkboxRow__checkbox" type="checkbox">
        <label :for="person[0]"  class="checkboxRow__label">on campus</label>
      </div>

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
