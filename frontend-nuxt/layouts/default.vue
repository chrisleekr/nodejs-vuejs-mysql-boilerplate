<template>
  <div id="app">
    <nav-bar />
    <b-container fluid>
      <nuxt />
      <footer-bar />
    </b-container>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'

export default {
  name: 'Default',
  components: {
    NavBar,
    FooterBar
  }
}
</script>
