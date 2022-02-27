<template>
  <div class="page-todo">
    <b-container fluid>
      <h1 class="page-title">Todo App</h1>
      <div class="todo-add-wrapper">
        <todo-add-box :loading="loading" @add="onAdd" />
      </div>
      <div class="todo-wrapper">
        <b-card-group deck>
          <todo-box
            card-header="Pending"
            state="pending"
            :todo-list="pendingTodoList"
            :loading="loading"
            @change="onChange"
            @remove="onRemove"
          />
          <todo-box
            card-header="Ongoing"
            state="ongoing"
            :todo-list="ongoingTodoList"
            :loading="loading"
            @change="onChange"
            @remove="onRemove"
          />
          <todo-box
            card-header="Completed"
            state="completed"
            :todo-list="completedTodoList"
            :loading="loading"
            @change="onChange"
            @remove="onRemove"
          />
        </b-card-group>
      </div>
    </b-container>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions, mapState } from 'vuex';
import TodoBox from '@/components/TodoBox.vue';
import TodoAddBox from '@/components/TodoAddBox.vue';

export default {
  name: 'Todo',
  components: { TodoBox, TodoAddBox },
  metaInfo() {
    return {
      title: this.title,
      meta: [
        {
          name: 'description',
          content: `This is dynamic ${this.title.toLowerCase()}.`
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
    ...mapActions('todo', ['list', 'addOne', 'updateBulk', 'deleteOne']),
    onAdd({ todo }) {
      // Form submit logic
      this.addOne({
        todo,
        router: this.$router
      }).then(() => this.list({}));
    },
    onChange({ state, todoList }) {
      const newTodoList = _.map(todoList, todo => _.pick(todo, ['id', 'name', 'note']));

      this.updateBulk({ state, todoList: newTodoList, router: this.$router }).then(() => this.list({}));
    },
    onRemove({ state, todo }) {
      this.deleteOne({ state, todoId: todo.id, router: this.$router }).then(() => this.list({}));
    }
  },
  mounted() {
    this.list({});
  }
};
</script>
