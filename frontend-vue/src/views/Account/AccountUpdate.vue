<template>
  <div class="page page-account">
    <b-container>
      <h1 class="page-title">Update my account</h1>
      <b-card-group deck>
        <b-card>
          <template v-slot:header>
            <strong>Your information</strong>
          </template>

          <div v-if="loading">
            <span class="spinner"></span>
          </div>
          <div v-if="!loading && formLoaded">
            <b-form @submit.stop.prevent="onSubmit">
              <b-form-group id="group-username" label="Username" label-for="input-username" description>
                <b-form-group :description="user.username"></b-form-group>
              </b-form-group>

              <b-form-group id="group-first-name" label="Firstname" label-for="input-first-name" description>
                <b-form-input
                  id="input-first-name"
                  v-model="form.firstName"
                  type="text"
                  required
                  placeholder="Enter first name"
                  :state="$v.form.firstName.$dirty ? !$v.form.firstName.$error : null"
                  :class="{ 'border-danger': errorMessages }"
                ></b-form-input>

                <b-form-invalid-feedback id="input-first-name-invalid"
                  >Please enter your first name.</b-form-invalid-feedback
                >
              </b-form-group>

              <b-form-group id="group-last-name" label="Lastname" label-for="input-last-name" description>
                <b-form-input
                  id="input-last-name"
                  v-model="form.lastName"
                  type="text"
                  required
                  placeholder="Enter last name"
                  :state="$v.form.lastName.$dirty ? !$v.form.lastName.$error : null"
                  :class="{ 'border-danger': errorMessages }"
                ></b-form-input>

                <b-form-invalid-feedback id="input-last-name-invalid"
                  >Please enter your last name.</b-form-invalid-feedback
                >
              </b-form-group>

              <b-form-group id="group-email" label="Email" label-for="input-email" description>
                <b-form-input
                  id="input-email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter email"
                  :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
                  :class="{ 'border-danger': errorMessages }"
                ></b-form-input>

                <b-form-invalid-feedback id="input-email-invalid">Please enter your last name.</b-form-invalid-feedback>
              </b-form-group>

              <b-form-group id="group-password" label="Password" label-for="input-password" description>
                <b-form-input
                  id="input-password"
                  v-model="form.password"
                  type="password"
                  placeholder="Enter password"
                  :state="$v.form.password.$dirty ? !$v.form.password.$error : null"
                  :class="{ 'border-danger': errorMessages }"
                ></b-form-input>

                <b-form-invalid-feedback id="input-password-invalid"
                  >Please enter valid password.</b-form-invalid-feedback
                >
              </b-form-group>

              <template v-if="successMessages || errorMessages">
                <b-row class="mb-2">
                  <b-col v-if="successMessages" class="text-primary message-col">
                    {{ successMessages }}
                  </b-col>
                  <b-col v-if="errorMessages" class="text-danger message-col">{{ errorMessages }}</b-col>
                </b-row>
              </template>

              <b-row>
                <b-col>
                  <b-button type="submit" variant="primary" :disabled="$v.form.$invalid || loading">
                    <span class="spinner spinner-white" v-if="loading"></span>
                    Update
                  </b-button>
                </b-col>
                <b-col class="text-right">
                  <b-link :to="{ path: '/account' }">Back</b-link>
                </b-col>
              </b-row>
            </b-form>
          </div>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { email, required, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'AccountUpdate',
  metaInfo() {
    return {
      title: 'Update my account',
      meta: []
    };
  },
  mounted() {
    this.me({ router: this.$router }).then(() => {});
  },
  data() {
    return {
      formLoaded: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
    };
  },
  validations: {
    form: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      email: {
        required,
        email
      },
      password: {
        minLength: minLength(6)
      }
    }
  },
  computed: {
    ...mapGetters('alert', ['errorMessages', 'successMessages']),
    ...mapState('user', ['loading', 'user'])
  },
  methods: {
    ...mapActions('user', ['me', 'updateMe']),
    onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }

      // Form submit logic
      this.updateMe({
        user: {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          password: this.form.password
        },
        router: this.$router
      });
    }
  },
  watch: {
    user(_newValue, _oldValue) {
      this.form.firstName = this.user.first_name;
      this.form.lastName = this.user.last_name;
      this.form.email = this.user.email;
      this.formLoaded = true;
    }
  }
};
</script>
