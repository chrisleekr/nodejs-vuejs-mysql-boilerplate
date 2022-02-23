<template>
  <div class="page-class page-staff-form">
    <h1 class="page-title">{{ title }}</h1>
    <user-form-box
      list-url="/staff"
      user-type="staff"
      :form-type="formType"
      :user-id="userId"
      :permissions="permissions"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import UserFormBox from '@/components/UserFormBox.vue';

export default {
  name: 'StaffForm',
  components: {
    UserFormBox
  },
  async mounted() {
    this.permissionList({ router: this.$router });

    if (this.$route.name === 'staff-new') {
      this.formType = 'new';
      this.userId = null;
    } else {
      this.formType = 'update';
      this.userId = parseInt(this.$route.params.id, 10);
      await this.getOne({
        type: 'staff',
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
      return this.formType === 'new' ? 'Add new staff' : 'Update staff';
    },
    ...mapState('user', ['loading']),
    ...mapState('permission', ['permissions'])
  },
  methods: {
    ...mapActions('user', ['getOne', 'postOne', 'patchOne']),
    ...mapActions('permission', {
      permissionList: 'list'
    }),
    onAdd({ user }) {
      this.postOne({
        type: 'staff',
        user,
        router: this.$router,
        redirectUrl: '/staff'
      });
    },
    onEdit({ user }) {
      this.patchOne({
        type: 'staff',
        userId: this.userId,
        user,
        router: this.$router,
        redirectUrl: '/staff'
      });
    }
  }
};
</script>
