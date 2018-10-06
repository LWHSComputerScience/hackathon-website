<template>
  <div class="home page">
    <div :key="person.id" v-if="person.name != 'Name'" class="person" v-for="person in $parent.filterdList">
      <h1 class="person__name">{{person.name}}</h1>
      <p class="person__email">{{person.email}}</p>
      <p class="person__gender">{{person.name}}</p>
      <div class="checkboxRow waiver">
        <input :id="person.id + 'waiver'" v-model="person[20]"  class="checkboxRow__checkbox" type="checkbox">
        <label :for="person.id + 'waiver'"  class="checkboxRow__label">waiver completed</label>
      </div>
      <div class="checkboxRow">
        <input :id="person.id + 'checkedIn'" v-model="person[21]"  class="checkboxRow__checkbox" type="checkbox">
        <label :for="person.id + 'checkedIn'"  class="checkboxRow__label">checked in</label>
      </div>
      <div class="checkboxRow">
        <input :id="person.id + 'onCampus'" v-model="person[22]"  class="checkboxRow__checkbox" type="checkbox">
        <label :for="person.id + 'onCampus'"  class="checkboxRow__label">on campus</label>
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
