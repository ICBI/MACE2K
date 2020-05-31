<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <SearchPanel msg="Welcome to MACE2K Viz App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import SearchPanel from '@/components/SearchPanel.vue'

export default {
  name: 'Home',
  components: {
    SearchPanel
  }
}
</script>
