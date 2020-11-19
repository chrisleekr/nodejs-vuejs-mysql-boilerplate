<template>
  <div class="container">
    <h1>{{ pageTitle }}</h1>
    <p class="lead">
      Use this document as a way to quickly start any new project.
      <br />All you get is this text and a mostly barebones HTML document.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Page',
  head() {
    return {
      title: this.pageTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Page description'
        }
      ]
    }
  },
  computed: {
    pageTitle() {
      const { pageName } = this.$route.meta
      const pageId = this.$route.params.pageId || ''

      let pageTitle = 'Default Page'
      if (pageName) {
        pageTitle =
          pageName.charAt(0).toUpperCase() +
          pageName.slice(1) +
          (pageId ? ` ${pageId}` : '')
      }
      return pageTitle
    }
  }
}
</script>
