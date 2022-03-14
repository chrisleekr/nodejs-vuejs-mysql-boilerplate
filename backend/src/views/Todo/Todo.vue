<template>
  <div class="page-class page-todo">
    <h1 class="page-title">Todo App</h1>
    <div class="todo-wrapper">
      <b-card-group deck>
        <todo-box card-header="Pending" state="pending" :todo-list="pendingTodoList" :loading="loading" />
        <todo-box card-header="Ongoing" state="ongoing" :todo-list="ongoingTodoList" :loading="loading" />
        <todo-box card-header="Completed" state="completed" :todo-list="completedTodoList" :loading="loading" />
      </b-card-group>
    </div>
    <p> * Note that this page is just listing todo. The feature to manage todo is not developed. </p>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import TodoBox from '@/components/TodoBox.vue';

export default {
  name: 'Todo',
  components: { TodoBox },
  metaInfo() {
    return {
      title: this.title,
      meta: [
        {
          name: 'description',
          content: `This is a Todo app.`
        }
      ]
    };
  },
  data() {
    return {
      title: 'Todo Page'
    };
  },
  computed: {
    ...mapState('todo', ['loading']),
    ...mapGetters('todo', ['pendingTodoList', 'ongoingTodoList', 'completedTodoList'])
  },
  methods: {
    ...mapActions('todo', ['list'])
  },
  mounted() {
    this.list({ router: this.$router });
  }
};
</script>
