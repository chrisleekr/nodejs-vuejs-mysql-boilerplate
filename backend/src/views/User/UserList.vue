<template>
  <div class="page-class page-user-list">
    <h1 class="page-title">{{ title }}</h1>
    <table-box
      :columns="columns"
      :rows="users"
      :pagination="pagination"
      :baseUrl="baseUrl"
      :loading="loading"
      emptyText="No user found. Please add new user."
      :showAdd="true"
      addText="Create new user"
      @add="onAdd"
      @edit="onEdit"
      @delete="onDelete"
    >
      <template v-slot:emailAddressFormatted="slotProps">
        <span class="span-text span-block">
          {{ slotProps.row.email }}
        </span>
        <template v-if="slotProps.row.confirmedAtFormatted">
          <span class="text-success span-help-text" :title="slotProps.row.confirmedAt">
            {{ slotProps.row.confirmedAtFormatted }}
          </span>
        </template>
        <template v-if="slotProps.row.confirmedAtFormatted === null">
          <span class="text-warning span-help-text"> (Not confirmed) </span>
        </template>
      </template>
      <template v-slot:lastLoginAtFormatted="slotProps">
        <template v-if="slotProps.row.lastLoginAtFormatted">
          <span class="text-success">{{ slotProps.row.lastLoginAtFormatted }}</span>
        </template>
        <template v-if="slotProps.row.lastLoginAtFormatted == null">
          <span class="text-warning">Never logged in</span>
        </template>
      </template>
      <template v-slot:blockedAtFormatted="slotProps">
        <template v-if="slotProps.row.blockedAtFormatted">
          <span class="text-success">{{ slotProps.row.blockedAtFormatted }}</span>
        </template>
        <template v-if="slotProps.row.blockedAtFormatted == null">
          <span class="text-warning">Never logged in</span>
        </template>
      </template>
    </table-box>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import TableBox from '@/components/TableBox.vue';

export default {
  name: 'UserList',
  components: {
    TableBox
  },
  metaInfo() {
    return {
      title: 'Users',
      meta: [
        {
          name: 'description',
          content: `Manage user list`
        }
      ]
    };
  },
  mounted() {
    this.list({ type: 'user', query: this.$route.query, router: this.$router });
  },
  data() {
    return {
      title: 'Users',
      columns: [
        {
          type: 'row_num',
          headerText: '#',
          class: { 'text-center': true },
          textKey: 'rowNum',
          width: '5%'
        },
        {
          type: 'string',
          headerText: 'Name',
          textKey: 'fullName',
          width: '20%'
        },
        {
          type: 'string',
          headerText: 'Email address',
          slotKey: 'emailAddressFormatted',
          width: '20%'
        },
        {
          type: 'datetime',
          headerText: 'Last login',
          slotKey: 'lastLoginAtFormatted',
          width: '15%'
        },
        {
          type: 'datetime',
          headerText: 'Blocked',
          slotKey: 'blockedAtFormatted',
          width: '15%'
        },
        {
          type: 'string',
          headerText: 'Status',
          class: { 'text-center': true },
          textKey: 'enabledName',
          width: '7%'
        },
        {
          type: 'functions',
          headerText: 'Functions',
          class: { 'text-center': true },
          width: '18%',
          functions: {
            edit: true,
            delete: true
          }
        }
      ]
    };
  },
  computed: {
    ...mapState('user', ['loading', 'baseUrl', 'users', 'pagination'])
  },
  methods: {
    ...mapActions('user', ['list', 'deleteOne']),
    onAdd() {
      this.$router.push('/user/new');
    },
    onEdit({ row }) {
      this.$router.push(`/user/${row.id}`);
    },
    onDelete({ row }) {
      Vue.swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this.",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',

        preConfirm: () => {
          this.deleteOne({
            type: 'user',
            userId: row.id,
            router: this.$router
          });
        }
      });
    }
  }
};
</script>
