<template>
  <div class="page-class page-setting-list">
    <h1 class="page-title">{{ title }}</h1>
    <table-box
      :columns="columns"
      :rows="settings"
      :pagination="pagination"
      :baseUrl="baseUrl"
      :loading="loading"
      emptyText="No setting found. Please add new setting."
      :showAdd="true"
      addText="Create new setting"
      @add="onAdd"
      @edit="onEdit"
      @delete="onDelete"
    >
      <template v-slot:settingNameFormatted="slotProps">
        {{ slotProps.row.metaName }} <span class="span-help-text">({{ slotProps.row.metaKey }})</span>
        <br />
        <span class="span-help-text">
          {{ slotProps.row.metaDesc }}
        </span>
      </template>
    </table-box>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import TableBox from '@/components/TableBox.vue';

export default {
  name: 'SettingList',
  components: {
    TableBox
  },
  metaInfo() {
    return {
      title: 'Settings',
      meta: [
        {
          name: 'description',
          content: 'Manage settings'
        }
      ]
    };
  },
  mounted() {
    this.list({ query: this.$route.query, router: this.$router });
  },
  data() {
    return {
      title: 'Settings',
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
          headerText: 'Setting Name',
          slotKey: 'settingNameFormatted',
          width: '57%'
        },
        {
          type: 'string',
          headerText: 'Value',
          textKey: 'metaValue',
          class: { 'text-center': true },
          width: '20%'
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
    ...mapState('setting', ['loading', 'baseUrl', 'settings', 'pagination'])
  },
  methods: {
    ...mapActions('setting', ['list', 'deleteOne']),
    onAdd() {
      this.$router.push('/setting/new');
    },
    onEdit({ row }) {
      this.$router.push(`/setting/${row.id}`);
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
            settingId: row.id,
            router: this.$router
          });
        }
      });
    }
  }
};
</script>
