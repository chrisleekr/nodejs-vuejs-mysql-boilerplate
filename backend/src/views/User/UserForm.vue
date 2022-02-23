<template>
  <div class="page-class page-user-form">
    <h1 class="page-title">{{ title }}</h1>
    <user-form-box
      list-url="/user"
      user-type="user"
      :form-type="formType"
      :user-id="userId"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UserFormBox from '@/components/UserFormBox.vue';

export default {
  name: 'UserForm',
  components: {
    UserFormBox
  },
  async mounted() {
    if (this.$route.name === 'user-new') {
      this.formType = 'new';
      this.userId = null;
    } else {
      this.formType = 'update';
      this.userId = parseInt(this.$route.params.id, 10);
      await this.getOne({
        type: 'user',
        userId: this.userId,
        router: this.$router
      });
    }
  },
  data() {
    return {
      formType: '',
      userId: null
    };
  },
  computed: {
    title() {
      return this.formType === 'new' ? 'Add new user' : 'Update user';
    },
    ...mapState('user', ['loading'])
  },
  methods: {
    ...mapActions('user', ['getOne', 'postOne', 'patchOne']),
    onAdd({ user }) {
      this.postOne({
        type: 'user',
        user,
        router: this.$router,
        redirectUrl: '/user'
      });
    },
    onEdit({ user }) {
      this.patchOne({
        type: 'user',
        userId: this.userId,
        user,
        router: this.$router,
        redirectUrl: '/user'
      });
    }
  }
};
</script>
