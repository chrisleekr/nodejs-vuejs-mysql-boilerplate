<template>
  <b-card class="mb-3">
    <template v-slot:header>
      <h6 class="mb-0">
        {{ cardHeader }}
        <span class="spinner" v-if="loading"></span>
      </h6>
    </template>

    <b-list-group>
      <span v-if="todoList.length === 0 && loading === false" class="no-list-item">No todo added.</span>
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
          >
            {{ todo.name }}
          </span>
        </div>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
export default {
  name: 'TodoBox',
  components: {},
  props: {
    loading: Boolean,
    cardHeader: String,
    state: String,
    todoList: Array
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
