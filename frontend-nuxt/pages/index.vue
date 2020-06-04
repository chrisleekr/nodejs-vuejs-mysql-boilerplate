<template>
  <b-container class="page-home text-center my-5">
    <img alt="Nuxt.js logo" src="~/static/icon.png" width="150" />
    <h1>Starter template</h1>
    <p class="lead">
      Use this document as a way to quickly start any new project.<br />All you
      get is this text and a mostly barebones HTML document.
    </p>
  </b-container>
</template>

<script>
export default {
  name: 'Index',
  head() {
    return {
      title: 'Homepage',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Home page description'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
