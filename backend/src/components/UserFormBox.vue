<template>
  <div>
    <div v-if="loading || !formLoaded">
      <span class="spinner"></span>
    </div>
    <div v-if="!loading && formLoaded">
      <b-form @submit.stop.prevent="onSubmit">
        <b-form-group id="group-email" label-for="input-email">
          <template v-slot:label>
            Email address
            <span class="text-danger">*</span>
          </template>
          <b-form-input
            id="input-email"
            v-model="form.email"
            type="email"
            placeholder="Enter email address"
            :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
          ></b-form-input>

          <b-form-text id="input-email-help">Email must be valid email address. i.e. sample@username.com.</b-form-text>

          <b-form-invalid-feedback id="input-email-invalid">Please enter valid email address.</b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="group-username" label-for="input-username">
          <template v-slot:label>
            Username
            <span class="text-danger">*</span>
          </template>

          <b-form-input
            id="input-username"
            v-model="form.username"
            type="text"
            placeholder="Enter username"
            :state="$v.form.username.$dirty ? !$v.form.username.$error : null"
          ></b-form-input>

          <b-form-text id="input-username-help"
            >Username only allows alphanumeric, underscore and dashboard between 3 and 15 characters. i.e.
            sampleusername</b-form-text
          >

          <b-form-invalid-feedback id="input-username-invalid">Please enter valid username.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="group-password" label-for="input-password">
          <template v-slot:label>
            Password
            <span class="text-danger" v-if="formType === 'new'">*</span>
          </template>

          <b-form-input
            id="input-password"
            type="password"
            v-model="form.password"
            :state="$v.form.password.$dirty ? !$v.form.password.$error : null"
            placeholder="Enter password"
          ></b-form-input>

          <b-form-text id="input-password-help">Password must be more than 6 characters.</b-form-text>

          <b-form-invalid-feedback id="input-password-invalid">Please enter valid password.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="group-first-name" label-for="input-first-name">
          <template v-slot:label>
            First name
            <span class="text-danger">*</span>
          </template>

          <b-form-input
            id="input-first-name"
            type="text"
            v-model="form.firstName"
            :state="$v.form.firstName.$dirty ? !$v.form.firstName.$error : null"
            placeholder="Enter first name"
          ></b-form-input>

          <b-form-invalid-feedback id="input-first-name-invalid">Please enter your first name.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="group-last-name" label-for="input-last-name">
          <template v-slot:label>
            Last name
            <span class="text-danger">*</span>
          </template>

          <b-form-input
            id="input-last-name"
            type="text"
            v-model="form.lastName"
            :state="$v.form.lastName.$dirty ? !$v.form.lastName.$error : null"
            placeholder="Enter last name"
          ></b-form-input>

          <b-form-invalid-feedback id="input-last-name-invalid">Please enter your last name.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="group-confirmed-at" label-for="input-confirmed-at">
          <template v-slot:label> Confirmed At (Y-M-D H:M) </template>

          <datetime
            type="datetime"
            v-model="form.confirmedAt"
            input-id="input-confirmed-at"
            :input-class="{
              'form-control': true,
              'is-invalid': $v.form.confirmedAt.$dirty ? $v.form.confirmedAt.$error : null,
              'is-valid': $v.form.confirmedAt.$dirty ? !$v.form.confirmedAt.$error : null
            }"
            class="input-group"
            placeholder="Select confirmed date/time"
            :format="dateTimeFormat"
            :phrases="{ ok: 'OK', cancel: 'Cancel' }"
            :hour-step="1"
            :minute-step="1"
            :week-start="7"
            :use12-hour="false"
            auto
          >
            <template slot="after">
              <div class="input-group-append">
                <b-button size="sm" variant="secondary" @click="form.confirmedAt = ''">Clear</b-button>
              </div>
            </template>
          </datetime>

          <b-form-text id="input-confirmed-at-help">
            Confirmed at field indicates the user has been confirmed. If empty, then user cannot log in to the system as
            the account is not confirmed. The value must be valid format - Y/M/D H:M. i.e. 2017-01-01 12:00
          </b-form-text>

          <div
            class="invalid-feedback"
            id="input-confirmed-at-invalid"
            v-if="$v.form.confirmedAt.$dirty ? $v.form.confirmedAt.$error : false"
            >Please select valid date/time.</div
          >
        </b-form-group>

        <b-form-group id="group-blocked-at" label-for="input-blocked-at">
          <template v-slot:label>Blocked At (Y-M-D H:M)</template>

          <datetime
            type="datetime"
            v-model="form.blockedAt"
            input-id="input-blocked-at"
            :input-class="{
              'form-control': true,
              'is-invalid': $v.form.blockedAt.$dirty ? $v.form.blockedAt.$error : null,
              'is-valid': $v.form.blockedAt.$dirty ? !$v.form.blockedAt.$error : null
            }"
            class="input-group"
            placeholder="Select blocked date/time"
            :format="dateTimeFormat"
            :phrases="{ ok: 'OK', cancel: 'Cancel' }"
            :hour-step="1"
            :minute-step="1"
            :week-start="7"
            :use12-hour="false"
            auto
          >
            <template slot="after">
              <div class="input-group-append">
                <b-button size="sm" variant="secondary" @click="form.blockedAt = ''">Clear</b-button>
              </div>
            </template>
          </datetime>

          <b-form-text id="input-blocked-at-help">
            Blocked at field indicates the user has been blocked. If not empty, then user cannot log in to the system as
            the account is blocked. The value must be valid format - Y/M/D H:M. i.e. 2017-01-01 12:00
          </b-form-text>

          <div
            class="invalid-feedback"
            id="input-blocked-at-invalid"
            v-if="$v.form.blockedAt.$dirty ? $v.form.blockedAt.$error : false"
            >Please select valid date/time.</div
          >
        </b-form-group>

        <b-form-group id="group-role" label-for="input-role" v-if="userType === 'staff'">
          <template v-slot:label>
            Role
            <span class="text-danger">*</span>
          </template>

          <b-form-select
            id="input-role"
            v-model="form.role"
            :options="staffRoles"
            :state="$v.form.role.$dirty ? !$v.form.role.$error : null"
          ></b-form-select>

          <b-form-text id="input-role-help"
            >Role field is configuring whether the user is administrator or staff.</b-form-text
          >

          <b-form-invalid-feedback id="input-role-invalid">Please select valid role.</b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="group-permission" label-for="select-permission" v-if="showPermissions">
          <template v-slot:label>
            Permissions
            <span class="text-danger">*</span>
          </template>

          <div>
            <b-form-checkbox
              :id="`checkbox-permission-${permission.id}`"
              :name="`checkbox-permission-${permission.id}`"
              v-for="(permission, index) in permissions"
              v-bind:key="permission.id"
              v-model="form.permissions[index]"
              value="true"
              >{{ permission.description }}</b-form-checkbox
            >
          </div>

          <b-form-text id="input-permission-help"
            >Permission field is configuring whether the user is selected permission.</b-form-text
          >

          <b-form-invalid-feedback id="input-permission-invalid"
            >Please select valid permission.</b-form-invalid-feedback
          >
        </b-form-group>

        <b-form-group id="group-enabled" label-for="input-enabled">
          <template v-slot:label>
            Status
            <span class="text-danger">*</span>
          </template>

          <b-form-select
            id="input-enabled"
            v-model="form.enabled"
            :options="userEnabled"
            :state="$v.form.enabled.$dirty ? !$v.form.enabled.$error : null"
          ></b-form-select>

          <b-form-text id="input-enabled-help"
            >Status field is configuring whether the user is active or deleted.</b-form-text
          >

          <b-form-invalid-feedback id="input-enabled-invalid">Please select valid status.</b-form-invalid-feedback>
        </b-form-group>

        <template v-if="errorMessages">
          <b-row class="mb-2">
            <b-col class="text-danger message-col">{{ errorMessages }}</b-col>
          </b-row>
        </template>

        <b-row>
          <b-col>
            <b-button type="submit" size="sm" variant="success" :disabled="loading">
              <span class="spinner spinner-white" v-if="loading"></span>
              <font-awesome-icon :icon="['fas', 'save']" class="mr-1" />Save
            </b-button>
          </b-col>
          <b-col class="text-right">
            <b-button size="sm" variant="warning" :to="{ path: `${listUrl}` }">
              <font-awesome-icon :icon="['fas', 'long-arrow-alt-left']" class="mr-1" />Back to list
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
import { email, required, minLength, maxLength } from 'vuelidate/lib/validators';
import { mapGetters, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import User from '@/model/user';
import utils from '@/helper/utils';
import configService from '@/services/configService';

export default {
  name: 'UserFormBox',
  props: {
    listUrl: String,
    userType: String,
    formType: String,
    userId: {
      type: Number,
      required: false
    },
    permissions: {
      type: Array,
      required: false
    }
  },
  metaInfo() {
    return {
      meta: [
        {
          name: 'description',
          content: this.metaDescription
        }
      ]
    };
  },
  data() {
    return {
      title: '',
      formLoaded: false,
      form: {
        username: null,
        email: null,
        firstName: null,
        lastName: null,
        password: null,
        confirmedAt: null,
        blockedAt: null,
        permissions: [],
        role: null,
        enabled: null
      },
      dateTimeFormat: configService.get('format').pickerDateTime,
      staffRoles: _.reduce(
        _.pick(User.userRole, ['administrator', 'staff']),
        (result, value, key) => {
          result.push({ value, text: _.capitalize(key) });
          return result;
        },
        []
      ),
      userEnabled: _.reduce(
        User.userEnabled,
        (result, value, key) => {
          result.push({ value, text: _.capitalize(key) });
          return result;
        },
        []
      )
    };
  },
  validations() {
    const formValidation = {
      email: {
        required,
        email
      },
      firstName: {
        required
      },
      lastName: {
        required
      },
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(15),
        validateUsername: username => {
          if (username === null) {
            return false;
          }
          return username.match(/^[0-9a-zA-Z_]+$/) !== null;
        }
      },
      password: {
        minLength: minLength(6)
      },
      confirmedAt: {
        validateDateTime: utils.validateDateTime
      },
      blockedAt: {
        validateDateTime: utils.validateDateTime
      },
      permissions: {},
      role: {
        validateRole: value => {
          if (this.userType === 'user') {
            return true;
          }
          return _.some(User.userRole, role => value === role);
        }
      },
      enabled: {
        validateStatus: value => _.some(User.userEnabled, enabled => value === enabled)
      }
    };

    if (this.formType === 'new') {
      formValidation.password.required = required;
    }

    return { form: formValidation };
  },
  mounted() {
    this.$nextTick(async () => {
      // Code that will run only after the entire view has been re-rendered
      if (this.formType === 'new') {
        if (this.userType === 'staff') {
          this.form.role = User.userRole.staff;
        }
        this.form.enabled = User.userEnabled.active;
        this.formLoaded = true;

        this.$v.$touch(); // Set initial validation
        this.$v.$reset(); // Reset $dirty
      }
    });
  },
  computed: {
    metaDescription() {
      return this.formType === 'new' ? 'Add new user' : 'Update user';
    },
    ...mapGetters('alert', ['errorMessages']),
    ...mapState('user', ['loading', 'user']),
    showPermissions() {
      return this.userType === 'staff' && this.form.role === User.userRole.staff;
    }
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return false;
      }

      const user = {
        username: this.form.username,
        email: this.form.email,
        first_name: this.form.firstName,
        last_name: this.form.lastName,
        password: this.form.password,
        confirmed_at: moment(this.form.confirmedAt).isValid()
          ? moment(this.form.confirmedAt).format(configService.get('format').dateTime)
          : null,
        blocked_at: moment(this.form.blockedAt).isValid()
          ? moment(this.form.blockedAt).format(configService.get('format').dateTime)
          : null,
        role: this.form.role ? this.form.role : User.userRole.user,
        permissions: _.reduce(
          this.form.permissions,
          (acc, permissionStatus, key) => {
            if (permissionStatus) {
              acc.push(this.permissions[key].id);
            }
            return acc;
          },
          []
        ),
        enabled: this.form.enabled
      };

      if (this.formType === 'new') {
        this.$emit('add', { user });
      } else {
        this.$emit('edit', { user });
      }

      return false;
    },
    setFormPermissions() {
      if (this.formLoaded) {
        if (this.formType === 'new') {
          _.forEach(this.permissions, (_permission, index) => {
            this.form.permissions[index] = true;
          });
        } else {
          _.forEach(this.permissions, (permission, index) => {
            this.form.permissions[index] =
              _.isEmpty(_.find(this.user.permissions, userPermission => userPermission.id === permission.id)) === false;
          });
        }
      }
    }
  },
  watch: {
    user(_newValue, _oldValue) {
      if (!this.user.id) {
        return;
      }
      // Loaded user, assign to form

      this.form.username = this.user.username;
      this.form.email = this.user.email;
      this.form.firstName = this.user.firstName;
      this.form.lastName = this.user.lastName;
      this.form.confirmedAt = moment(this.user.confirmedAt).isValid()
        ? moment(this.user.confirmedAt).toISOString()
        : null;
      this.form.blockedAt = moment(this.user.blockedAt).isValid() ? moment(this.user.blockedAt).toISOString() : null;
      this.form.role = this.user.role;
      this.form.enabled = this.user.enabled;

      this.formLoaded = true;
      this.setFormPermissions();

      this.$v.$touch(); // Set initial validation
      this.$v.$reset(); // Reset $dirty
    },
    permissions(_newValue, _oldValue) {
      this.setFormPermissions();
    }
  }
};
</script>
