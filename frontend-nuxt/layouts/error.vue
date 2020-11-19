<template>
  <div class="container">
    <div class="error">
      <div class="title">{{ message }}</div>
      <p v-if="statusCode === 404" class="description">Page not found</p>
      <p v-else class="description">An error occurred</p>

      <NuxtLink class="error-link" to="/"> Back to home</NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NuxtError',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0'
        }
      ]
    }
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      return this.error.message || '<%= messages.client_error %>'
    }
  }
}
</script>
