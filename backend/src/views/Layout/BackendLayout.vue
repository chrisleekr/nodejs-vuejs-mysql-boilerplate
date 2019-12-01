<template>
  <div class="app-layout app-layout-backend">
    <nav-bar />
    <b-container fluid>
      <slot />
      <footer-bar />
    </b-container>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import FooterBar from '@/components/FooterBar.vue';

export default {
  name: 'BackendLayout',
  components: {
    NavBar,
    FooterBar
  }
};
</script>
