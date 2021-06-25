<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: 'App',
    titleTemplate: '%s | Backend',
    meta: []
  },
  computed: {
    layout() {
      return this.$route.meta.layout || 'simple-layout';
    }
  }
};
</script>

<style lang="scss">
@import '../src/assets/css/custom.css';

#app {
  // prettier-ignore
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding-top: 4.5rem;
}
</style>
