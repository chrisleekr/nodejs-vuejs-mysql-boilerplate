<template>
  <div>
    <b-form @submit.stop.prevent="onSubmit">
      <!-- Using components -->
      <b-input-group class="my-3">
        <b-form-input
          id="input-name"
          v-model="form.name"
          type="text"
          required
          placeholder="What do you need to do?"
          :disabled="loading"
          :class="{ 'border-danger': errorMessages }"
        ></b-form-input>

        <b-input-group-append>
          <b-button type="submit" variant="primary" :disabled="$v.form.$invalid || loading">
            <span class="spinner spinner-white" v-if="loading"></span>
            Add
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'TodoAddBox',
  props: {
    loading: Boolean
  },
  data() {
    return {
      form: {
        name: '',
        note: '',
        state: 'pending'
      }
    };
  },
  validations: {
    form: {
      name: {
        required
      }
    }
  },
  computed: {
    ...mapGetters('alert', ['errorMessages'])
  },
  methods: {
    ...mapActions('todo', ['addOne']),
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      this.$emit('add', {
        state: this.state,
        todo: {
          name: this.form.name,
          note: this.form.note,
          state: this.form.state
        }
      });
    }
  }
};
</script>
