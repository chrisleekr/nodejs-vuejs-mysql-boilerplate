<template>
  <b-card class="mb-3">
    <template v-slot:header>
      <h6 class="mb-0">
        {{ cardHeader }}
        <span class="spinner" v-if="loading"></span>
      </h6>
    </template>

    <b-list-group>
      <span v-if="todoList.length === 0 && isDragging === false && loading === false" class="no-list-item"
        >You don't have things to do.</span
      >
      <draggable
        class="todo-list-group"
        :list="todoList"
        group="todoGroup"
        @change="change"
        @start="onDragging(true)"
        @end="onDragging(false)"
      >
        <b-list-group-item
          v-for="(todo, index) in todoList"
          v-bind:key="todo.id"
          class="todo-list-item d-flex justify-content-between align-items-center"
          :class="{
            'todo-pending-list': todo.state === 'pending',
            'todo-ongoing-list': todo.state === 'ongoing',
            'todo-completed-list': todo.state === 'completed'
          }"
          :data-name="`todo-${todo.state}-list-${index}`"
        >
          <div class="todo-name" :data-name="`todo-${todo.state}-name-${index}`">
            <span
              class="ml-2"
              :class="{
                'todo-pending-span': todo.state === 'pending',
                'todo-ongoing-span': todo.state === 'ongoing',
                'todo-completed-span': todo.state === 'completed'
              }"
              >{{ todo.name }}</span
            >
          </div>
          <b-button size="sm" variant="link">
            <font-awesome-icon icon="trash" class="text-danger" @click="removeTodo(todo)" />
          </b-button>
        </b-list-group-item>
      </draggable>
    </b-list-group>
  </b-card>
</template>

<script>
import draggable from 'vuedraggable';
import { mapState } from 'vuex';

export default {
  name: 'TodoBox',
  components: {
    draggable
  },
  props: {
    loading: Boolean,
    cardHeader: String,
    state: String,
    todoList: Array
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('todo', ['isDragging'])
  },
  methods: {
    onDragging(isDragging) {
      this.$store.commit('todo/setIsDragging', { isDragging }, { root: true });
    },
    change(_event) {
      this.$emit('change', { state: this.state, todoList: this.todoList });
    },
    removeTodo(todo) {
      this.$emit('remove', { state: this.state, todo });
    }
  }
};
</script>
<style scoped>
.list-group-item {
  cursor: pointer;
}
</style>
