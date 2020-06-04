<template>
  <div class="page-page text-center my-5">
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
  metaInfo() {
    return {
      title: this.pageTitle,
      meta: [
        {
          name: 'description',
          content: `This is dynamic ${this.pageTitle.toLowerCase()}.`
        }
      ]
    };
  },
  data() {
    return {};
  },
  computed: {
    pageTitle() {
      const { pageName } = this.$route.meta;
      const pageId = this.$route.params.pageId || '';

      if (!pageName) {
        return '';
      }
      return pageName.charAt(0).toUpperCase() + pageName.slice(1) + (pageId ? ` ${pageId}` : '');
    }
  }
};
</script>
